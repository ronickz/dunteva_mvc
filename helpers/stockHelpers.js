// Modelos
import {
  Producto,
  Categoria,
  Marca,
  UnidadMedida,
  Proveedor,
} from "../models/index.js";

// Obtiene todos los productos y su relacion con las tablas de categoria, marca, unidad de medida y proveedor
const obtenerTodosProductos = async () => {
  return await Producto.findAll({
    include: [
      {
        model: Categoria,
        as: "categoria",
        attributes: ["nombre"],
      },
      {
        model: Marca,
        as: "marca",
        attributes: ["nombre"],
      },
      {
        model: UnidadMedida,
        as: "unidad",
        attributes: ["nombre"],
      },
      {
        model: Proveedor,
        as: "proveedor",
        attributes: ["nombre"],
      },
    ],
  });
};

const obtenerCombosBox = async () => {
  const [categorias, marcas, proveedores, unidades] = await Promise.all([
    Categoria.findAll({
      attributes: ["id", "nombre"],
    }),
    Marca.findAll({
      attributes: ["id", "nombre"],
    }),
    Proveedor.findAll({
      attributes: ["id", "nombre"],
    }),
    UnidadMedida.findAll({
      attributes: ["id", "nombre"],
    }),
  ]);

  return {
    categorias: categorias.map((categoria) => categoria.toJSON()),
    marcas: marcas.map((marca) => marca.toJSON()),
    proveedores: proveedores.map((proveedor) => proveedor.toJSON()),
    unidades: unidades.map((unidad) => unidad.toJSON()),
  };
};

const actualizarProducto = async (sku, cantidadVendida) => {
  const producto = await Producto.findOne({ where: { sku: sku } });

  if (producto) {
    producto.stock = producto.stock - cantidadVendida;
    await producto.save();
    return producto;
  }
};

const actualizarStockProductos = async (detalles) => {
  for (const detalle of detalles) {
    const { productoSku, cantidad } = detalle;

    // Llama a la función para actualizar el stock
    const productoActualizado = await actualizarProducto(productoSku, cantidad);

    if (productoActualizado) {
      console.log(`Stock actualizado para el producto SKU: ${productoSku}`);
    } else {
      console.log(`Producto con SKU: ${productoSku} no encontrado`);
    }
  }
};

export { obtenerTodosProductos, obtenerCombosBox, actualizarStockProductos };
