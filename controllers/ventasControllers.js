import endpoints from "../config/endpoints.js";
import { Op } from "sequelize";

import { Venta, DetalleVenta } from "../models/index.js";

import { actualizarStockProductos } from "../helpers/stockHelpers.js";

import { Producto } from "../models/index.js";

const listarVentas = async (req, res) => {
  res.render("ventas/ventas", {
    endpoints,
    IMG_URL: process.env.IMG_URL,
  });
};

const formularioVenta = (req, res) => {
  res.render("ventas/formulario_ventas", {
    endpoints,
    IMG_URL: process.env.IMG_URL,
  });
};

const detalleVenta = async (req, res) => {
  const { id } = req.params;
  try {
    const venta = await Venta.findOne({
      // Especificar que solo deseas el campo 'total'
      where: { id },
    });
    const detalleVentas = await DetalleVenta.findAll({
      where: { ventaId: id },
      include: [
        {
          model: Producto,
          as: "producto",
          attributes: ["nombre"], // Solo obtener sku y nombre
        },
      ],
    });
    const ventas = detalleVentas.map((venta) => ({
      sku: venta.productoSku,
      nombreProducto: venta.producto.nombre, // Extraer solo el campo 'nombre'
      cantidad: venta.cantidad, // Si tienes un campo cantidad en DetalleVenta
      precio_unitario: venta.precio_unitario, // Si tienes un campo precio en DetalleVenta
      subTotal: venta.subtotal,
    }));

    res.render("ventas/detalle_venta", {
      id,
      endpoints,
      IMG_URL: process.env.IMG_URL,
      ventas,
      fecha: new Date(venta.createdAt).toLocaleDateString("es-ES"),
      estado: venta.estado, // Pasar el estado a la vista
      total: venta.total, // Pasar el total a la vista
    });
  } catch (error) {
    console.error("Error al obtener los detalles de la venta:", error);
    res.status(500).send("Error al obtener los detalles de la venta");
  }
};

// API

const listar_ventas = async (req, res) => {
  try {
    const { draw, start, length, search, order, columns } = req.query;

    // Construir la cláusula where para la búsqueda
    const whereClause = search.value
      ? {
          [Op.or]: [
            {
              id: {
                [Op.eq]: isNaN(search.value) ? null : parseInt(search.value),
              },
            }, // Para ID numérico
            { total: { [Op.like]: `%${search.value}%` } }, // Para total
            { estado: { [Op.like]: `%${search.value}%` } }, // Para estado
            { metodo_pago: { [Op.like]: `%${search.value}%` } }, // Para método de pago
            {
              updatedAt: {
                [Op.gte]: !isNaN(Date.parse(search.value))
                  ? new Date(search.value)
                  : null, // Buscar desde esta fecha
              },
            },
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
      case "fecha": // Mapear 'fecha' al campo real 'updatedAt'
        listaRelaciones.push(["updatedAt", ordenColumna]);
        break;
      case "id":
      case "total":
      case "estado":
      case "metodo_pago":
        listaRelaciones.push([nombreColumna, ordenColumna]);
        break;
      default:
        listaRelaciones.push(["id", "ASC"]); // Orden por defecto
        break;
    }

    // Obtener el total de registros
    const totalRecords = await Venta.count();

    // Obtener el total de registros filtrados
    const filteredRecords = await Venta.count({
      where: whereClause,
    });

    // Obtener los registros paginados
    const ventas = await Venta.findAll({
      where: whereClause,
      order: listaRelaciones,
      offset: parseInt(start),
      limit: length === "-1" ? null : parseInt(length),
    });

    // Transformar los datos para la respuesta
    const ventasTransformadas = ventas.map((venta) => {
      return {
        id: venta.id,
        total: venta.total,
        estado: venta.estado,
        metodo_pago: venta.metodo_pago,
        fecha: new Date(venta.updatedAt).toLocaleString("es-ES", {
          timeZone: "UTC",
        }),
      };
    });

    return res.json({
      draw: parseInt(draw),
      recordsTotal: totalRecords,
      recordsFiltered: filteredRecords,
      data: ventasTransformadas,
    });
  } catch (error) {
    console.error("Error al listar ventas:", error);
    res.status(500).send("Error al listar ventas");
  }
};

const insertar_venta = async (req, res) => {
  try {
    const { total, estado, metodo_pago, detalles } = req.body;
    const nuevaVenta = await Venta.create({
      total,
      estado,
      metodo_pago,
    });

    if (detalles && detalles.length > 0) {
      const detallesConVentaId = detalles.map((detalle) => ({
        ...detalle,
        ventaId: nuevaVenta.id, // Asegúrate de que este ID sea válido
      }));

      console.log("Detalles a insertar:", detallesConVentaId); // Depuración

      await DetalleVenta.bulkCreate(detallesConVentaId);
      await actualizarStockProductos(detalles);
    }

    return res.status(200).json({
      success: true,
      message: "Venta Realizada con exito!",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Este SKU ya está registrado. No se puede agregar el producto.",
    });
  }
};

export {
  listarVentas,
  formularioVenta,
  listar_ventas,
  insertar_venta,
  detalleVenta,
};
