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
  const input = TextBlock.input;
  if (!code || !language) {
    res.status(400).json({
      data: TextBlock,
      error: "Code and language are required"
    });
    return;
  }
  try {
    await codeQueue.add("executeCode", {
      code,
      language,
      input
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
