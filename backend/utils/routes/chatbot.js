import express from "express";
import { retrieveRelevant } from "../../rag/retrieve.js";
import { generateAnswer } from "../../rag/generate.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    const context = await retrieveRelevant(message);

    const reply = await generateAnswer(message, context, history);

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error" });
  }
});

export default router;
