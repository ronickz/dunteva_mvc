import endpoints from "../config/endpoints.js";

import { Venta, DetalleVenta } from "../models/index.js";

import { actualizarStockProductos } from "../helpers/stockHelpers.js";

const formularioVenta = (req, res) => {
  res.render("ventas/formulario_ventas", {
    endpoints,
    IMG_URL: process.env.IMG_URL,
  });
};

// API

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
        message:
          "Venta Realizada con exito!",
      });
  } catch (error) {
    return res.status(400).json({
        success: false,
        message:
          "Este SKU ya está registrado. No se puede agregar el producto.",
      });
  }
};

export { formularioVenta, insertar_venta };
