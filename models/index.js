import Marca from "./Marca.js";
import Categoria from "./Categoria.js";
import UnidadMedida from "./UnidadMedida.js";
import Proveedor from "./Proveedor.js";
import Producto from "./Producto.js";

import Venta from "./Venta.js";
import DetalleVenta from "./DetalleVenta.js";

// Definir relaciones
Producto.belongsTo(Categoria, {
  foreignKey: {
    name: 'categoriaId',
    allowNull: false
  },
  as: 'categoria'
});

Producto.belongsTo(Marca, {
  foreignKey: {
    name: 'marcaId',
    allowNull: false
  },
  as: 'marca'
});

Producto.belongsTo(UnidadMedida, {
  foreignKey: {
    name: 'unidadId',
    allowNull: false
  },
  as: 'unidad'
});

Producto.belongsTo(Proveedor, {
  foreignKey: {
    name: 'proveedorId',
    allowNull: false
  },
  as: 'proveedor'
});

DetalleVenta.belongsTo(Producto, {
  foreignKey: {
    name: 'productoSku', // Nombre de la clave foránea en `detalle_ventas`
    allowNull: false,
  },
  targetKey: 'sku', // Campo en `productos` al que se relaciona
  as: 'producto',
});

DetalleVenta.belongsTo(Venta, {
  foreignKey: {
    name: 'ventaId',
    allowNull: false
  },
  as: 'venta'
});

// Exportar modelos
export { Marca, Categoria, UnidadMedida, Proveedor, Producto, Venta, DetalleVenta };