import { Router } from "express";
import { listarProductos, formularioProducto, insertarProducto} from "../controllers/stockControllers.js";

const router = Router();

router.get("/", listarProductos );
router.get("/nuevo", formularioProducto);
router.post("/nuevo", insertarProducto);

export default router;