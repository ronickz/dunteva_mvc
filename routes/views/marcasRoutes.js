import { Router } from 'express'
import {
  renderizarMarcas
} from '../../controllers/views/marcasControllers.js'

const router = Router()

router.get('/', renderizarMarcas)

export default router
