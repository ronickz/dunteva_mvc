import { Router } from "express";
import {
  formularioVenta,
  insertar_venta,
  listar_ventas,
  listarVentas,
  detalleVenta
} from "../controllers/ventasControllers.js";

const router = Router();

router.get("/", listarVentas);
router.get("/nuevaVenta", formularioVenta);
router.get("/detalleVenta/:id", detalleVenta);

router.get("/api/ventas", listar_ventas);
router.post("/api/nuevo", insertar_venta);

export default router;
