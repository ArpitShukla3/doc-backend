import { Worker } from "bullmq";
import { exec } from "child_process";
import { getFileName, writeFileCustom } from "../controller/codeRunner/helpers";
import { config } from "dotenv";
import { pub } from "../config/redis";
import { promisify } from "util";
const execAsync = promisify(exec);
config();
async function work(language: string, code: string, input?: string): Promise<{ output?: string; error?: string }> {
    const [fileNameStatus, fileName, command] = getFileName(language, !!input) as [boolean, string, string];
    if (!fileNameStatus) {
        return Promise.reject({
            error: "Unsupported language type"
        });
    }

    const fileWriteStatus = await writeFileCustom(fileName, code);
    const inputWriteStatus = input ? await writeFileCustom('codes/input.txt', input) : true;
    if (!fileWriteStatus || !inputWriteStatus) {
        return Promise.reject({
            error: "Failed to write code or input to file"
        });
    }
    try {
        const { stdout, stderr } = await execAsync(command);

        if (stderr) {
        return { error: stderr };
        }

        return { output: stdout };

    } catch (err: any) {
        return { error: err.stderr || err.message };
    }
}
const worker = new Worker("codeQueue", async job => {
    const { code, language, input, socketId,id } = job.data;
    const response = await work(language, code, input);
    await pub.publish("codeExecutionResponse", JSON.stringify({
        jobId: job.id,
        response: response,
        socketId: socketId,
        id:id
    }));
}, {
    connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
        maxRetriesPerRequest: 3,
        retryStrategy: (times): number | Error => {
            if (times >= 5) {
                return new Error("Retry limit reached");
            }
            return Math.min(times * 50, 2000);
        },
    },
});

worker.on("completed", job => {
    console.log(`Job with id ${job.id} has been completed`);
});

worker.on("failed", (job, err) => {
    console.error(`Job with id ${job.id} has failed with error: ${err.message}`);
});

export default worker;