// Modelos
import { Producto, Categoria, Marca, UnidadMedida, Proveedor} from "../models/index.js";

// Helpers
import {obtenerTodosProductos,obtenerCombosBox} from "../helpers/stockHelpers.js";


//Obtengo todos los productos y renderizo la vista
const listarProductos = async (req, res) => {
  try {
    const productos = await obtenerTodosProductos();    
    res.status(200).render("stock/listar_productos", {
      productos,
    });
  } catch (error) {
    console.error("Error al listar productos:", error);
    res.status(500).send("Error al listar productos");
  }
};


//Obtengo las categorias, marcas, proveedores y unidades de medida y renderizo la vista
const formularioProducto = async (req, res) => {
  try {

    //Obtengo las categorias, marcas, proveedores y unidades de medida
    const {categorias, marcas, proveedores, unidades} = await obtenerCombosBox();

    res.render("stock/insertar_producto",{
      data: {
        categorias,
        marcas,
        proveedores,
        unidades
      }
    });
    
  } catch (error) {
    console.error("Error al listar productos:", error);
    res.status(500).send("Error al listar productos");
  }
};

const insertarProducto = async (req, res) => {
  try {
    const { nombre, sku, precio, stock, capacidad,unidad_medida, marca,categoria, proveedor } = req.body;
    const imagen = req.files.imagen.name ? req.files.imagen.name : "";

    const producto = await Producto.create({
      nombre,
      sku,
      precio,
      stock,
      capacidad,
      categoriaId: categoria, // Cambiado a categoriaId
      marcaId: marca,         // Cambiado a marcaId
      proveedorId: proveedor, // Cambiado a proveedorId
      unidadId: unidad_medida, // Cambiado a unidadId
      img: imagen,
    });
    res.status(200).redirect("/stock");
  } catch (error) {
    console.error("Error al insertar producto:", error);
    res.status(500).send("Error al insertar producto");
  }
};

export { listarProductos, formularioProducto, insertarProducto };
