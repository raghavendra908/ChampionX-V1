import express from "express";
import { getAthletes } from "../controllers/athletes.js";

const router = express.Router();

router.get("/", getAthletes);

export default router;