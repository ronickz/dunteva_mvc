import tablaProductos from './stock/tablaProductos.js'
import modalEditar from './stock/editarProducto.js'
import modalInsertar from './stock/insertarProducto.js'
import eliminarProducto from './stock/eliminarProducto.js'

import modalMarca from './marcas/editarMarca.js'

import tablaVentas from './ventas/tablaVentas.js'
import buscarProducto from './ventas/buscarProducto.js'
import tablaMarcas from './marcas/tablaMarcas.js'

$(document).ready(function () {
  const instanciaTablaProductos = tablaProductos()

  modalEditar(instanciaTablaProductos)
  modalInsertar(instanciaTablaProductos)
  eliminarProducto(instanciaTablaProductos)
  buscarProducto()

  tablaVentas()
  tablaMarcas()

  modalMarca()
})
