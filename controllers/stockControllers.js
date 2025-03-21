// Modelos
import {
  Producto,
  Categoria,
  Marca,
  UnidadMedida,
  Proveedor,
} from "../models/index.js";
import { Op } from "sequelize";

// Helpers
import {
  obtenerCombosBox,
} from "../helpers/stockHelpers.js";

// Mis rutas

import endpoints from "../config/endpoints.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";


//Obtengo todos los productos y renderizo la vista
const listarProductos = async (req, res) => {
  try {
    res.status(200).render(`stock/productos`, {
      endpoints,
    });
  } catch (error) {
    console.error("Error al listar productos:", error);
    res.status(500).send("Error al listar productos");
  }
};




//API

// Productos

const listar_productos = async (req, res) => {
  try {
    const { draw, start, length, search, order, columns } = req.query;
    const modelos = [
      { model: Marca, as: "marca" },
      { model: Categoria, as: "categoria" },
      { model: Proveedor, as: "proveedor" },
      { model: UnidadMedida, as: "unidad" },
    ];
    // Construir la cláusula where para la búsqueda
    const whereClause = search.value
      ? {
        [Op.or]: [
          { nombre: { [Op.like]: `%${search.value}%` } },
          { sku: { [Op.like]: `%${search.value}%` } },
          { "$marca.nombre$": { [Op.like]: `%${search.value}%` } },
          { "$categoria.nombre$": { [Op.like]: `%${search.value}%` } },
          { "$proveedor.nombre$": { [Op.like]: `%${search.value}%` } },
          { "$unidad.nombre$": { [Op.like]: `%${search.value}%` } },
        ],
      }
      : {};

    // Construir la cláusula order para el ordenamiento
    let indiceColumna;
    let ordenColumna;

    if (typeof order == "undefined") {
      indiceColumna = 0;
      ordenColumna = "ASC";
    } else {
      indiceColumna = order[0].column;
      ordenColumna = order[0].dir;
    }


    const nombreColumna = columns[indiceColumna].data;
    const listaRelaciones = [];
    switch (nombreColumna) {
      case "marca":
        listaRelaciones.push([
          { model: Marca, as: "marca" },
          "nombre",
          ordenColumna,
        ]);
        break;
      case "categoria":
        listaRelaciones.push([
          { model: Categoria, as: "categoria" },
          "nombre",
          ordenColumna,
        ]);
        break;
      case "proveedor":
        listaRelaciones.push([
          { model: Proveedor, as: "proveedor" },
          "nombre",
          ordenColumna,
        ]);
        break;
      case "unidad":
        listaRelaciones.push([
          { model: UnidadMedida, as: "unidad" },
          "nombre",
          ordenColumna,
        ]);
        break;
      case "fecha":
        listaRelaciones.push(["updatedAt", ordenColumna]);
        break;
      default:
        listaRelaciones.push([nombreColumna, ordenColumna]);
        break;
    }

    const totalRecords = await Producto.count();
    const filteredRecords = await Producto.count({
       where: whereClause,
       include: modelos
     });

    const productos = await Producto.findAll({
      where: whereClause,
      include: modelos,
      order: listaRelaciones,
      offset: parseInt(start),
      limit: length==='-1'?null:parseInt(length),
    });

    const productosTransformados = productos.map((producto) => {
      return {
        img: producto.img ? producto.img : "",
        sku: producto.sku,
        nombre: producto.nombre,
        marca: producto.marca.nombre,
        categoria: producto.categoria.nombre,
        capacidad: producto.capacidad,
        unidad: producto.unidad.nombre,
        precio: producto.precio,
        stock: producto.stock,
        proveedor: producto.proveedor.nombre,
        fecha: new Date(producto.updatedAt).toLocaleDateString("es-ES", {
          timeZone: "UTC",
        }), // Asegúrate de que la fecha se muestra en el formato correcto
      };
    });

    console.log("filter,", filteredRecords);

    return res.json({
      draw: parseInt(draw),
      recordsTotal: totalRecords,
      recordsFiltered: totalRecords,
      data: productosTransformados,
    });
  } catch (error) {
    console.error("Error al listar productos:", error);
    res.status(500).send("Error al listar productos");
  }
};


const insertar_producto = async (req, res) => {
  /*  
  try {
    const { nombre, sku, precio, stock, capacidad, unidad_medida, marca, categoria, proveedor} = req.body;
    let errores = [];

    if(Producto.findOne({where: {sku}})){
      errores.push("El SKU ya existe");
      res.render(`${endpoints.vistaFormulario}`, {
        accion: endpoints.insertarProducto,
        endpoints,
        titulo: "Añadir",
        producto: {},
        errores,
        descripcion: "Añade un producto a tu tienda",
        data: {
          categorias,
          marcas,
          proveedores,
          unidades,
          errores
        },
      })
    }
    let imagenUrl = "";
    if (req.files && req.files.imagen) {
      const imagen = req.files.imagen;
      const uploadPath = imagen.tempFilePath;

      // Subir imagen a Cloudinary
      const result = await cloudinary.uploader.upload(uploadPath, {
        folder: "productos",
        transformation: [{ quality: "auto", fetch_format: "webp" }],
      });
      // Obtener la URL de la imagen subida
      imagenUrl = result.secure_url;

      // Eliminar el archivo temporal
      fs.unlink(uploadPath, (err) => {
        if (err) {
          console.error("Error al eliminar el archivo temporal:", err);
        } else {
          console.log("Archivo temporal eliminado");
        }
      });
    }

    await Producto.create({
      nombre,
      sku,
      precio,
      stock,
      capacidad,
      categoriaId: categoria, // Cambiado a categoriaId
      marcaId: marca, // Cambiado a marcaId
      proveedorId: proveedor, // Cambiado a proveedorId
      unidadId: unidad_medida, // Cambiado a unidadId
      img: imagenUrl,
    });
    res.status(200).redirect(`${endpoints.listarProductos}?confirmado=true`);
  } catch (error) {
    console.error("Error al insertar producto:", error);
    res.status(500).send("Error al insertar producto");
  }
    */

  console.log('hola entre');
  console.log(req.body);
  return res.status(200).json({
    success: true,
    message: "Producto guardado correctamente",
  });
};

const actualizar_producto = async (req, res) => {
  const { sku, nombre, precio } = req.body;  // Asegúrate de obtener los datos del formulario
  
  // Verificar si el producto ya existe
  const productoExistente = await Producto.findOne({ where: { sku: sku } });

  if (productoExistente) {
    // Si el producto ya existe, devolver un mensaje de error
    return res.json({
      success: false,
      message: 'Este SKU ya está registrado. No se puede agregar el producto.'
    });
  }
  
  // Si el producto no existe, proceder con la creación
  const nuevoProducto = await Producto.create({ sku, nombre, precio });
  
  return res.json({
    success: true,
    message: 'Producto creado exitosamente.'
  });
 };

const obtener_producto = async (req, res) => {
  try {
    const { sku } = req.params;
    const producto = await Producto.findOne({
      where: {
        sku,
      },
    });

    if (!producto) {
      res.status(404).send("Producto no encontrado");
      return;
    }

    res.json(producto);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).send("Error al obtener producto");
  }
}

// Marcas

const listar_marcas = async (req, res) => {
  try {
    const marcas = await Marca.findAll();
    res.json(marcas);
  } catch (error) {
    console.error("Error al listar marcas:", error);
}}

// Categorias

const listar_categorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    console.error("Error al listar categorias:", error);
  }
}

// Proveedores

const listar_proveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll();
    res.json(proveedores);
  } catch (error) {
    console.error("Error al listar proveedores:", error);
  }
}

// Unidades de medida

const listar_unidades = async (req, res) => {
  try {
    const unidades = await UnidadMedida.findAll();
    res.json(unidades);
  } catch (error) {
    console.error("Error al listar unidades de medida:", error);
  }
}

export {
  listarProductos,

  listar_productos,
  obtener_producto,
  insertar_producto,
  actualizar_producto,
  
  listar_marcas,
  listar_categorias,
  listar_proveedores,
  listar_unidades,
}
