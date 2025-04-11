import { Router } from 'express'
import {
  insertarVenta,
  listarVentas
} from '../../controllers/api/ventasApiControllers.js'

const router = Router()

router.get('/', listarVentas)
router.post('/', insertarVenta)

export default router
