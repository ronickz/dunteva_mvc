import { Router } from "express";
import { 
    listarProductos, 

    listar_productos,
    obtener_producto,

    insertar_producto,
    actualizar_producto,

    listar_marcas,
    listar_categorias,
    listar_proveedores,
    listar_unidades,
    eliminar_producto,
} from "../controllers/stockControllers.js";

const router = Router();

router.get("/", listarProductos );


router.get("/api/productos",listar_productos)
router.get("/api/productos/:sku",obtener_producto);

router.post("/api/nuevo", insertar_producto);
router.put("/api/editar/:sku", actualizar_producto);
router.delete("/api/eliminar/:sku", eliminar_producto);

router.get("/api/marcas", listar_marcas);
router.get("/api/categorias", listar_categorias);
router.get("/api/proveedores", listar_proveedores);
router.get("/api/unidades", listar_unidades);

export default router;