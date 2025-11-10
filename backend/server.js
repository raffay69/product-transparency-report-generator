import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import {
  QUESTIONS_SYSTEM_PROMPT,
  REPORT_GENERATION_SYSTEM_PROMPT,
} from "./prompt.js";
import z from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { authMiddleware } from "./middleware.js";
import {
  connectDb,
  questionAndAnswerModel,
  recentModel,
  reportModel,
} from "./models.js";
import { encode } from "@toon-format/toon";

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

app.use(express.json());
app.use(cors());

connectDb();

const PORT = process.env.PORT || 4000;

const outputSchema = z.object({
  qno: z.number(),
  lastQues: z.boolean(),
  quesType: z.enum(["text", "mcq"]),
  question: z.string(),
  options: z.array(z.string()).optional(),
});

const reportSchema = z.object({
  transparencyScore: z.number(),
  reportName: z.string(),
  reportSummary: z.array(z.string()),
  report: z.array(z.string()),
});

app.post("/dynamic-question", authMiddleware, async (req, res) => {
  try {
    const data = req.body;

    await questionAndAnswerModel.findOneAndUpdate(
      { userId: req.userId, chatId: data.chatId, qno: data.qno },
      {
        $set: {
          userId: req.userId,
          chatId: data.chatId,
          qno: data.qno,
          question: data.question,
          answer: data.answer,
        },
      },
      {
        upsert: true,
      }
    );

    const previousQuestions = await questionAndAnswerModel
      .find({
        userId: req.userId,
        chatId: data.chatId,
      })
      .lean();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Previous questions and answers:\n${encode(
        previousQuestions
      )}\n\nGenerate the next question.`,
      config: {
        systemInstruction: QUESTIONS_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseJsonSchema: zodToJsonSchema(outputSchema),
      },
    });

    let questionData = JSON.parse(response.text);

    if (typeof questionData === "string") {
      questionData = JSON.parse(questionData);
    }
    const question = outputSchema.parse(questionData);

    res.status(200).json(question);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: e.message });
  }
});

app.post("/generate-report", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const data = req.body;
    const chatId = data.chatId;

    await questionAndAnswerModel.findOneAndUpdate(
      { userId, chatId: data.chatId, qno: data.qno },
      {
        $set: {
          userId: userId,
          chatId: data.chatId,
          qno: data.qno,
          question: data.question,
          answer: data.answer,
        },
      },
      {
        upsert: true,
      }
    );

    const previousQuestions = await questionAndAnswerModel
      .find({
        userId,
        chatId,
      })
      .lean();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Previous questions and answers:\n${encode(
        previousQuestions
      )}\n\nGenerate the Report.`,
      config: {
        systemInstruction: REPORT_GENERATION_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseJsonSchema: zodToJsonSchema(reportSchema),
      },
    });

    let reportData = JSON.parse(response.text);

    if (typeof reportData === "string") {
      reportData = JSON.parse(reportData);
    }

    const report = reportSchema.parse(reportData);

    const processedReport = {
      ...report,
      reportSummary: report.reportSummary.join("\n"),
      report: report.report.join("\n"),
    };

    await reportModel.create({
      userId: userId,
      chatId: chatId,
      transparencyScore: processedReport.transparencyScore,
      reportSummary: processedReport.reportSummary,
      report: processedReport.report,
      reportName: processedReport.reportName,
    });

    await recentModel.create({
      userId: userId,
      chatId: chatId,
      reportName: processedReport.reportName,
    });

    res.status(200).json(processedReport);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: e.message });
  }
});

app.get("/recents", authMiddleware, async (req, res) => {
  try {
    const recents = await recentModel
      .find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.status(200).json(recents);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: e.message });
  }
});

app.get("/recent/:chatId", authMiddleware, async (req, res) => {
  try {
    const { chatId } = req.params;

    const report = await reportModel.findOne(
      { userId: req.userId, chatId },
      {
        _id: 0,
        reportName: 1,
        transparencyScore: 1,
        createdAt: 1,
        reportSummary: 1,
        report: 1,
      }
    );
    const qna = await questionAndAnswerModel.find(
      { userId: req.userId, chatId },
      { _id: 0, qno: 1, question: 1, answer: 1 }
    );

    res.status(200).json({
      reportName: report.reportName,
      transparencyScore: report.transparencyScore,
      reportSummary: report.reportSummary,
      report: report.report,
      quesAndAns: qna,
      createdAt: report.createdAt,
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: e.message });
  }
});

app.delete("/recent/:chatId", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { chatId } = req.params;
    await Promise.all([
      questionAndAnswerModel.deleteMany({ userId, chatId }),
      reportModel.deleteOne({ userId, chatId }),
      recentModel.deleteOne({ userId, chatId }),
    ]);
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: e.message });
  }
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});
