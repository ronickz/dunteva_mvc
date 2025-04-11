import { Router } from 'express'
import {
  renderizarProductos
} from '../../controllers/views/productosControllers.js'

const router = Router()

router.get('/', renderizarProductos)

export default router
