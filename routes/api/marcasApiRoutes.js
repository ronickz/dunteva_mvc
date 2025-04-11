import { Router } from 'express'
import {
  listarMarcas,
  listarMarcasDataTables,
  obtenerMarcaPorId
} from '../../controllers/api/marcasApiControllers.js'

const router = Router()

router.get('/', listarMarcas)
router.get('/datatables', listarMarcasDataTables)

router.get('/:id', obtenerMarcaPorId)

export default router
