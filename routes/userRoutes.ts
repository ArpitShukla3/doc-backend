import express from 'express';
const router = express.Router();
import { runCode } from '../controller/codeRunner/runCode';
router.post('/run', runCode);
export default router;