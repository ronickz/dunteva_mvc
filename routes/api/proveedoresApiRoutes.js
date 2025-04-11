import { Router } from 'express'
import {
  listarProveedores
} from '../../controllers/api/proveedoresApiControllers.js'

const router = Router()

router.get('/', listarProveedores)

export default router
