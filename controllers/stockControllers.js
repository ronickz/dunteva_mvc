import { Producto, Categoria, Marca, UnidadMedida, Proveedor } from "../models/index.js";

const listar_productos = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: [
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['nombre']
        },
        {
          model: Marca,
          as: 'marca',
          attributes: ['nombre']
        },
        {
          model: UnidadMedida,
          as: 'unidad',
          attributes: ['abreviatura']
        },
        {
          model: Proveedor,
          as: 'proveedor',
          attributes: ['nombre']
        }
      ]
    });
    productos.forEach(producto => {
      console.log(`ID: ${producto.id}`);
      console.log(`SKU: ${producto.sku}`);
      console.log(`Nombre: ${producto.nombre}`);
      console.log(`Descripción: ${producto.descripcion}`);
      console.log(`Precio: ${producto.precio}`);
      console.log(`Capacidad: ${producto.capacidad}`);
      console.log(`Concentración: ${producto.concentracion}`);
      console.log(`Categoría: ${producto.categoria ? producto.categoria.nombre : 'N/A'}`);
      console.log(`Marca: ${producto.marca ? producto.marca.nombre : 'N/A'}`);
      console.log(`Unidad: ${producto.unidad ? producto.unidad.abreviatura : 'N/A'}`);
      console.log(`Proveedor: ${producto.proveedor ? producto.proveedor.nombre : 'N/A'}`);
      console.log('-------------------------');
    });
    res.render("stock/listar_productos",{
      productos
    });
  } catch (error) {
    console.error("Error al listar productos:", error);
    res.status(500).send("Error al listar productos");
  }
};

export { listar_productos };