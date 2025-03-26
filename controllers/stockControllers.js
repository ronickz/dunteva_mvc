// Modelos
import {
  Producto,
  Categoria,
  Marca,
  UnidadMedida,
  Proveedor,
} from "../models/index.js";
import { Op } from "sequelize";

// Mis rutas

import endpoints from "../config/endpoints.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

//Obtengo todos los productos y renderizo la vista
const listarProductos = async (req, res) => {
  try {

    const productosBajoStock = await Producto.count({
      where: {
        stock: {
          [Op.lte]: 10, // Menor o igual a 10
        },
      },
    });

    // Contar productos con stock > 10
    const productosAltoStock = await Producto.count({
      where: {
        stock: {
          [Op.gt]: 10, // Mayor a 10
        },
      },
    });

    res.status(200).render(`stock/productos`, {
      endpoints,
      IMG_URL: process.env.IMG_URL,
      productosBajoStock,
      productosAltoStock,
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
      include: modelos,
    });

    const productos = await Producto.findAll({
      where: whereClause,
      include: modelos,
      order: listaRelaciones,
      offset: parseInt(start),
      limit: length === "-1" ? null : parseInt(length),
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
  try {
    const {
      sku,
      nombre,
      marca,
      categoria,
      capacidad,
      unidadMedida,
      precio,
      stock,
      proveedor,
    } = req.body;

    // Primero valido si el producto ya existe

    const productoExistente = await Producto.findOne({ where: { sku: sku } });

    if (productoExistente) {
      // Si el producto ya existe, devolver un mensaje de error
      return res.status(400).json({
        success: false,
        message:
          "Este SKU ya está registrado. No se puede agregar el producto.",
      });
    }

    //Validacion de imagenes
    let imagenUrl = process.env.IMG_URL;
    if (req.files && req.files.imagen) {
      const imagen = req.files.imagen;
      const uploadPath = imagen.tempFilePath;

      // Subir imagen a Cloudinary
      const result = await cloudinary.uploader.upload(uploadPath, {
        folder: "productos",
        public_id: sku,
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

    console.log("Imagen subida");

    // Insertar el producto en la base de datos
    await Producto.create({
      nombre,
      sku,
      precio,
      stock,
      capacidad,
      categoriaId: categoria, // Cambiado a categoriaId
      marcaId: marca, // Cambiado a marcaId
      proveedorId: proveedor, // Cambiado a proveedorId
      unidadId: unidadMedida, // Cambiado a unidadId
      img: imagenUrl,
    });

    //console.log('Producto a insertar: ', req.body);
    return res.status(200).json({
      success: true,
      message: "Producto guardado correctamente",
    });
  } catch (error) {
    console.log("Hubo un error al insertar un producto:", error);
    return res.status(500).json({
      success: false,
      message: "Hubo un error al guardar el producto, intente mas tarde",
    });
  }
};

const actualizar_producto = async (req, res) => {
  const { sku } = req.params;
  const {
    nombre,
    marca,
    categoria,
    capacidad,
    unidadMedida,
    precio,
    stock,
    proveedor,
  } = req.body; // Asegúrate de obtener los datos del formulario

  try {
    // Verificar si el producto ya existe
    const productoExistente = await Producto.findOne({ where: { sku: sku } });

    if (productoExistente) {

      let imagenDeProducto = productoExistente.img ? productoExistente.img : "";
      const imagenNueva = req.files && req.files.imagen ? req.files.imagen : "";
      

      // Valido que haya ingresado una imagen
      // Valido que sea diferente a mi imagen por defecto
      // Valido que sea diferente a la imagen que ya tengo
      if (imagenNueva != "" && imagenNueva !== process.env.IMG_URL && imagenNueva !== imagenDeProducto) {

        const imagen = req.files.imagen;
        const uploadPath = imagen.tempFilePath;

        console.log('\x1b[32m%s\x1b[0m', '******Hay foto nueva******');
        
        //Eliminar imagen cloudinary
        
        await cloudinary.uploader.destroy(imagenDeProducto);
        

        // Subir imagen a Cloudinary

        const result = await cloudinary.uploader.upload(uploadPath, {
          folder: "productos",
          public_id: sku,
          transformation: [{ quality: "auto", fetch_format: "webp" }],
        });

        // Obtener la URL de la imagen subida

        imagenDeProducto = result.secure_url;

        // Eliminar el archivo temporal

        fs.unlink(uploadPath, (err) => {
          if (err) {
            console.error("Error al eliminar el archivo temporal:", err);
          } else {
            console.log("Archivo temporal eliminado");
          }
        });
      }
      else{
        console.log('\x1b[31m%s\x1b[0m', '******NO HAY FOTO NUEVA******');
      }

      await Producto.update(
        {
          nombre,
          precio,
          stock,
          capacidad,
          categoriaId: categoria, // Cambiado a categoriaId
          marcaId: marca, // Cambiado a marcaId
          proveedorId: proveedor, // Cambiado a proveedorId
          unidadId: unidadMedida, // Cambiado a unidadId
          img: imagenDeProducto
        },
        {
          where: {
            sku,
          },
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Producto actualizado exitosamente.",
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json("Error al actualizar producto");
  }
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
};

const eliminar_producto = async (req, res) => {
  try {
    const { sku } = req.params;

    // Buscar el producto por SKU
    const producto = await Producto.findOne({
      where: {
        sku,
      },
    });

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    // Realizar la baja lógica
    await producto.destroy();

    return res.status(200).json({
      success: true,
      message: "Producto eliminado exitosamente (baja lógica).",
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar producto.",
    });
  }
};

// Marcas

const listar_marcas = async (req, res) => {
  try {
    const marcas = await Marca.findAll();
    res.json(marcas);
  } catch (error) {
    console.error("Error al listar marcas:", error);
  }
};

// Categorias

const listar_categorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    console.error("Error al listar categorias:", error);
  }
};

// Proveedores

const listar_proveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll();
    res.json(proveedores);
  } catch (error) {
    console.error("Error al listar proveedores:", error);
  }
};

// Unidades de medida

const listar_unidades = async (req, res) => {
  try {
    const unidades = await UnidadMedida.findAll();
    res.json(unidades);
  } catch (error) {
    console.error("Error al listar unidades de medida:", error);
  }
};

export {
  listarProductos,
  listar_productos,
  obtener_producto,
  insertar_producto,
  actualizar_producto,
  eliminar_producto,
  listar_marcas,
  listar_categorias,
  listar_proveedores,
  listar_unidades,
};
