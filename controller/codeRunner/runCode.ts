import { Request, Response } from "express";
import { TextBlockType } from "../../types/globalTypes";
import { codeQueue } from "../../queue/redisQueue";

async function runCode(
  req: Request,
  res: Response
): Promise<void> {

  const TextBlock:TextBlockType = req.body as TextBlockType;
  const code = TextBlock.text;
  const language = TextBlock.codeLanguage;
  const socketId = req.headers["socket-id"] as string;
  const input = TextBlock.input;
  const id = TextBlock.id;
  if (!code || !language || !socketId || !id) {
    res.status(400).json({
      data: TextBlock,
      error: "Code, language, socket-id, and id are required"
    });
    return;
  }
  try {
    await codeQueue.add("executeCode", {
      code,
      language,
      input,
      socketId,
      id
    });
    res.status(200).json({
      message: "Code execution job added to queue"
    });
    return;
  }
  catch (err) {
    console.error("Error adding job to queue:", err);
    res.status(500).json({
      error: "Failed to add code execution job to queue"
    });
    return;
  }
}

export { runCode };
