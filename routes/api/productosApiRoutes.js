import { Router } from 'express'
import {
  listarProductos,
  obtenerProducto,
  insertarProducto,
  actualizarProducto,
  eliminarProducto
} from '../../controllers/api/productosApiControllers.js'

const router = Router()

router.get('/', listarProductos)
router.get('/:sku', obtenerProducto)

router.post('/', insertarProducto)
router.put('/:sku', actualizarProducto)

router.delete('/:sku', eliminarProducto)

export default router
