import { Router } from "express";
import {formularioVenta} from "../controllers/ventasControllers.js";

const router = Router();

router.get("/", formularioVenta);

export default router;