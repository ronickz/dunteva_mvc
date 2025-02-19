// Modelos
import { Producto, Categoria, Marca, UnidadMedida, Proveedor} from "../models/index.js";

// Helpers
import {obtenerTodosProductos,obtenerCombosBox} from "../helpers/stockHelpers.js";


//Obtengo todos los productos y renderizo la vista
const listar_productos = async (req, res) => {
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
const add_producto = async (req, res) => {
  try {

    //Obtengo las categorias, marcas, proveedores y unidades de medida
    const {categorias, marcas, proveedores, unidades} = await obtenerCombosBox();

    res.render("stock/add_producto",{
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

export { listar_productos, add_producto };
