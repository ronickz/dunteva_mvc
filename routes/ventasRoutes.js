import { Router } from "express";
import {formularioVenta, insertar_venta} from "../controllers/ventasControllers.js";

const router = Router();


router.get("/", formularioVenta);


router.post("/api/nuevo",insertar_venta);

export default router;