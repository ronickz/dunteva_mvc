import { Router } from "express";
import { listar_estadisticas } from "../controllers/adminControllers.js";

const router = Router();

router.get("/", listar_estadisticas );

export default router;