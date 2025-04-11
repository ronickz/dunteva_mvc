import { Router } from 'express'
import {
  listarCategorias
} from '../../controllers/api/categoriasApiControllers.js'

const router = Router()

router.get('/', listarCategorias)
export default router
