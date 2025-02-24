// Modelos
import {
  Producto,
  Categoria,
  Marca,
  UnidadMedida,
  Proveedor,
} from "../models/index.js";
import { Op } from "sequelize";

import dataTable from "sequelize-datatables";

// Helpers
import {
  obtenerTodosProductos,
  obtenerCombosBox,
} from "../helpers/stockHelpers.js";

// Mis rutas

import endpoints from "../config/endpoints.js";

import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import { where } from "sequelize";

//Obtengo todos los productos y renderizo la vista
const listarProductos = async (req, res) => {
  try {
    const productos = await obtenerTodosProductos();
    res.status(200).render(`${endpoints.vistaListado}`, {
      productos,
      endpoints,
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
    const { categorias, marcas, proveedores, unidades } =
      await obtenerCombosBox();

    res.render(`${endpoints.vistaFormulario}`, {
      accion: endpoints.insertarProducto,
      endpoints,
      titulo: "Añadir",
      producto: {},
      descripcion: "Añade un producto a tu tienda",
      data: {
        categorias,
        marcas,
        proveedores,
        unidades,
      },
    });
  } catch (error) {
    console.error("Error al listar productos:", error);
    res.status(500).send("Error al listar productos");
  }
};

const edicionformularioProducto = async (req, res) => {
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

    const { categorias, marcas, proveedores, unidades } =
      await obtenerCombosBox();

    res.render(`${endpoints.vistaFormulario}`, {
      accion: endpoints.editarProducto,
      endpoints,
      titulo: "Editar",
      descripcion: "Edita el producto seleccionado",
      producto,
      data: {
        action: `${endpoints.editarProducto}/${sku}`,
        categorias,
        marcas,
        proveedores,
        unidades,
      },
    });
  } catch (error) {
    console.error("Error al listar productos:", error);
    res.status(500).send("Error al listar productos");
  }
};

const insertarProducto = async (req, res) => {
  try {
    const {
      nombre,
      sku,
      precio,
      stock,
      capacidad,
      unidad_medida,
      marca,
      categoria,
      proveedor,
    } = req.body;
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
};

const actualizarProducto = async (req, res) => { };

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
    let orderColumnIndex; // Índice de columna desde DataTables
    let orderDirection; // Dirección de orden ('asc' o 'desc')

    if (typeof order == "undefined") {
      orderColumnIndex = 0;
      orderDirection = "ASC";
    } else {
      orderColumnIndex = order[0].column;
      orderDirection = order[0].dir;
    }

    const orderColumn = columns[orderColumnIndex].data;
    const orderClause = [];
    switch (orderColumn) {
      case "marca":
        orderClause.push([
          { model: Marca, as: "marca" },
          "nombre",
          orderDirection,
        ]);
        break;
      case "categoria":
        orderClause.push([
          { model: Categoria, as: "categoria" },
          "nombre",
          orderDirection,
        ]);
        break;
      case "proveedor":
        orderClause.push([
          { model: Proveedor, as: "proveedor" },
          "nombre",
          orderDirection,
        ]);
        break;
      case "unidad":
        orderClause.push([
          { model: UnidadMedida, as: "unidad" },
          "nombre",
          orderDirection,
        ]);
        break;
      case "fecha":
        orderClause.push(["updatedAt", orderDirection]);
        break;
      default:
        orderClause.push([orderColumn, orderDirection]);
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
      order: orderClause,
      offset: parseInt(start),
      limit: parseInt(length),
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

    return res.json({
      draw: parseInt(draw),
      recordsTotal: totalRecords,
      recordsFiltered: filteredRecords,
      data: productosTransformados,
    });
  } catch (error) {
    console.error("Error al listar productos:", error);
    res.status(500).send("Error al listar productos");
  }
};

const test = async (req, res) => {
  res.render("stock/test");
};
export {
  listarProductos,
  formularioProducto,
  insertarProducto,
  edicionformularioProducto,
  actualizarProducto,
  listar_productos,
  test,
};
