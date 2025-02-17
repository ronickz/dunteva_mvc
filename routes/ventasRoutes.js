import { Router } from "express";
import {listar_ventas} from "../controllers/ventasControllers.js";

const router = Router();

router.get("/listar_ventas", listar_ventas);

export default router;