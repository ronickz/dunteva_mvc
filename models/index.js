import Marca from "./Marca.js";
import Categoria from "./Categoria.js";
import UnidadMedida from "./UnidadMedida.js";
import Proveedor from "./Proveedor.js";
import Producto from "./Producto.js";

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

// Exportar modelos
export { Marca, Categoria, UnidadMedida, Proveedor, Producto };