import tablaProductos from './stock/tablaProductos.js';
import modalEditar from './stock/editarProducto.js';
import modalInsertar from './stock/insertarProducto.js';
import eliminarProducto from './stock/eliminarProducto.js';

import buscarProducto from './ventas/buscarProducto.js';


let tablaInstancia = null;


$(document).ready(function () {
  
  tablaInstancia = tablaProductos();
  modalEditar(tablaInstancia);
  modalInsertar(tablaInstancia);
  eliminarProducto(tablaInstancia);

  buscarProducto();
});
