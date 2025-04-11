import { Router } from 'express'
import {
  listarUnidades
} from '../../controllers/api/unidadMedidaApiControllers.js'

const router = Router()
router.get('/', listarUnidades)

export default router
