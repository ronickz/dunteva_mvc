import endpoints from '../../config/endpoints.js'

import { Venta, DetalleVenta, Producto } from '../../models/index.js'

const renderizarVentas = async (req, res) => {
  res.render('ventas/ventas', {
    endpoints,
    IMG_URL: process.env.IMG_URL
  })
}

const renderizarFormularioVenta = (req, res) => {
  res.render('ventas/formulario_ventas', {
    endpoints,
    IMG_URL: process.env.IMG_URL
  })
}

const renderizarDetalleVenta = async (req, res) => {
  const { id } = req.params
  try {
    const venta = await Venta.findOne({
      // Especificar que solo deseas el campo 'total'
      where: { id }
    })
    const detalleVentas = await DetalleVenta.findAll({
      where: { ventaId: id },
      include: [
        {
          model: Producto,
          as: 'producto',
          attributes: ['nombre'] // Solo obtener sku y nombre
        }
      ]
    })
    const ventas = detalleVentas.map((venta) => ({
      sku: venta.productoSku,
      nombreProducto: venta.producto.nombre, // Extraer solo el campo 'nombre'
      cantidad: venta.cantidad, // Si tienes un campo cantidad en DetalleVenta
      precio_unitario: venta.precio_unitario, // Si tienes un campo precio en DetalleVenta
      subTotal: venta.subtotal
    }))

    res.render('ventas/detalle_venta', {
      id,
      endpoints,
      IMG_URL: process.env.IMG_URL,
      ventas,
      fecha: new Date(venta.createdAt).toLocaleDateString('es-ES'),
      estado: venta.estado, // Pasar el estado a la vista
      total: venta.total // Pasar el total a la vista
    })
  } catch (error) {
    console.error('Error al obtener los detalles de la venta:', error)
    res.status(500).send('Error al obtener los detalles de la venta')
  }
}

export {
  renderizarVentas,
  renderizarFormularioVenta,
  renderizarDetalleVenta
}
