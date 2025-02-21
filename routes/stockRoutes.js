import { Router } from "express";
import { listarProductos, formularioProducto, edicionformularioProducto,insertarProducto,actualizarProducto} from "../controllers/stockControllers.js";

const router = Router();

router.get("/", listarProductos );
router.get("/formularioProducto/", formularioProducto);
router.get("/formularioProducto/:sku", edicionformularioProducto);


router.post("/nuevo", insertarProducto);
router.post("/editar/:id", actualizarProducto);

export default router;