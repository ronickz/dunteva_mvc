import { Router } from "express";
import { 
    listarProductos, 
    formularioProducto, 
    edicionformularioProducto,
    insertarProducto,
    actualizarProducto,
    listar_productos,
    obtener_producto,
    listar_marcas,
    listar_categorias,
    listar_proveedores,
    listar_unidades,
} from "../controllers/stockControllers.js";

const router = Router();

router.get("/", listarProductos );
router.get("/formularioProducto/", formularioProducto);
router.get("/formularioProducto/:sku", edicionformularioProducto);


router.post("/nuevo", insertarProducto);
router.post("/editar/:id", actualizarProducto);

router.get("/api/productos",listar_productos)
router.get("/api/productos/:sku",obtener_producto);

router.get("/api/marcas", listar_marcas);
router.get("/api/categorias", listar_categorias);
router.get("/api/proveedores", listar_proveedores);
router.get("/api/unidades", listar_unidades);

export default router;