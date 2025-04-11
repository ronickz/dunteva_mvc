import endpoints from '../config/endpoints.js'
import productosRoutes from './views/productosRoutes.js'
import ventasRoutes from './views/ventasRoutes.js'
import marcasRoutes from './views/marcasRoutes.js'

import productosApiRoutes from './api/productosApiRoutes.js'
import ventasApiRoutes from './api/ventasApiRoutes.js'
import marcasApiRoutes from './api/marcasApiRoutes.js'
import categoriasApiRoutes from './api/categoriasApiRoutes.js'
import proveedoresApiRoutes from './api/proveedoresApiRoutes.js'
import unidadMedidaRoutes from './api/unidadMedidaApiRoutes.js'

export default (app) => {
  // Rutas de vistas
  app.use('/productos', productosRoutes)
  app.use('/ventas', ventasRoutes)
  app.use('/marcas', marcasRoutes)

  // Rutas de APIs
  app.use(endpoints.productosApi, productosApiRoutes)
  app.use(endpoints.ventasApi, ventasApiRoutes)
  app.use(endpoints.marcasApi, marcasApiRoutes)
  app.use(endpoints.categoriasApi, categoriasApiRoutes)
  app.use(endpoints.proveedoresApi, proveedoresApiRoutes)
  app.use(endpoints.unidadesMedidaApi, unidadMedidaRoutes)
}
