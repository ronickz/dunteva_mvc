import tablaProductos from './stock/tablaProductos.js';
import modalEditar from './stock/editarProducto.js';
import modalInsertar from './stock/insertarProducto.js';
import eliminarProducto from './stock/eliminarProducto.js';

import tablaVentas from './ventas/tablaVentas.js';
import buscarProducto from './ventas/buscarProducto.js';


let instanciaTablaProductos = null;
let instanciaTablaVentas = null;

$(document).ready(function () {
  
  instanciaTablaProductos = tablaProductos();
  instanciaTablaVentas = tablaVentas();

  modalEditar(instanciaTablaProductos);
  modalInsertar(instanciaTablaProductos);
  eliminarProducto(instanciaTablaProductos);

  buscarProducto();
});
