import { Router } from "express";
import { listar_productos, add_producto} from "../controllers/stockControllers.js";

const router = Router();

router.get("/listar_productos", listar_productos );
router.get("/add_producto", add_producto );

export default router;