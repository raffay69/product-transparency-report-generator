import mongoose, { Schema } from "mongoose";

export async function connectDb() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("connected to db");
    })
    .catch((e) => console.log(e.message));
}

const questionAndAnswerSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    chatId: {
      type: String,
      required: true,
    },
    qno: {
      type: Number,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const reportSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    chatId: {
      type: String,
      required: true,
    },
    transparencyScore: {
      type: Number,
      required: true,
    },
    reportSummary: {
      type: String,
      required: true,
    },
    report: {
      type: String,
      required: true,
    },
    reportName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const recentSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    chatId: {
      type: String,
      required: true,
    },
    reportName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const questionAndAnswerModel = mongoose.model(
  "QuestionAndAnswer",
  questionAndAnswerSchema
);

export const reportModel = mongoose.model("Report", reportSchema);

export const recentModel = mongoose.model("Recent", recentSchema);
