import { Router } from 'express'
import {
  renderizarVentas,
  renderizarFormularioVenta,
  renderizarDetalleVenta
} from '../../controllers/views/ventasControllers.js'

const router = Router()

router.get('/', renderizarVentas)
router.get('/nuevaVenta', renderizarFormularioVenta)
router.get('/detalleVenta/:id', renderizarDetalleVenta)

export default router
