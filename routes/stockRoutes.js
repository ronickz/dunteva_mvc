import { Router } from "express";
import { listar_productos} from "../controllers/stockControllers.js";

const router = Router();

router.get("/listar_productos", listar_productos );

export default router;