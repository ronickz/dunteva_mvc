import { Op } from 'sequelize'

import { Venta, DetalleVenta } from '../../models/index.js'

import { actualizarStockProductos } from '../../helpers/stockHelpers.js'

// API

const listarVentas = async (req, res) => {
  try {
    const { draw, start, length, search, order, columns } = req.query

    // Construir la cláusula where para la búsqueda
    const whereClause = search.value
      ? {
          [Op.or]: [
            {
              id: {
                [Op.eq]: isNaN(search.value) ? null : parseInt(search.value)
              }
            }, // Para ID numérico
            { total: { [Op.like]: `%${search.value}%` } }, // Para total
            { estado: { [Op.like]: `%${search.value}%` } }, // Para estado
            { metodo_pago: { [Op.like]: `%${search.value}%` } }, // Para método de pago
            {
              updatedAt: {
                [Op.gte]: !isNaN(Date.parse(search.value))
                  ? new Date(search.value)
                  : null // Buscar desde esta fecha
              }
            }
          ]
        }
      : {}

    // Construir la cláusula order para el ordenamiento
    let indiceColumna
    let ordenColumna

    if (typeof order === 'undefined') {
      indiceColumna = 0
      ordenColumna = 'ASC'
    } else {
      indiceColumna = order[0].column
      ordenColumna = order[0].dir
    }

    const nombreColumna = columns[indiceColumna].data
    const listaRelaciones = []
    switch (nombreColumna) {
      case 'fecha': // Mapear 'fecha' al campo real 'updatedAt'
        listaRelaciones.push(['updatedAt', ordenColumna])
        break
      case 'id':
      case 'total':
      case 'estado':
      case 'metodo_pago':
        listaRelaciones.push([nombreColumna, ordenColumna])
        break
      default:
        listaRelaciones.push(['id', 'ASC']) // Orden por defecto
        break
    }

    // Obtener el total de registros
    const totalRecords = await Venta.count()

    // Obtener el total de registros filtrados
    const filteredRecords = await Venta.count({
      where: whereClause
    })

    // Obtener los registros paginados
    const ventas = await Venta.findAll({
      where: whereClause,
      order: listaRelaciones,
      offset: parseInt(start),
      limit: length === '-1' ? null : parseInt(length)
    })

    // Transformar los datos para la respuesta
    const ventasTransformadas = ventas.map((venta) => {
      return {
        id: venta.id,
        total: venta.total,
        estado: venta.estado,
        metodo_pago: venta.metodo_pago,
        fecha: new Date(venta.updatedAt).toLocaleString('es-ES', {
          timeZone: 'UTC'
        })
      }
    })

    return res.json({
      draw: parseInt(draw),
      recordsTotal: totalRecords,
      recordsFiltered: filteredRecords,
      data: ventasTransformadas
    })
  } catch (error) {
    console.error('Error al listar ventas:', error)
    res.status(500).send('Error al listar ventas')
  }
}

const insertarVenta = async (req, res) => {
  try {
    const { total, estado, metodo_pago, detalles } = req.body
    const nuevaVenta = await Venta.create({
      total,
      estado,
      metodo_pago
    })

    if (detalles && detalles.length > 0) {
      const detallesConVentaId = detalles.map((detalle) => ({
        ...detalle,
        ventaId: nuevaVenta.id
      }))

      await DetalleVenta.bulkCreate(detallesConVentaId)
      await actualizarStockProductos(detalles)
      return res.status(200).json({
        success: true,
        message: 'Venta Realizada con exito!'
      })
    }
  } catch (error) {
    console.error('Error al insertar la venta:', error)
    return res.status(500).json({
      success: false,
      message: 'Error al insertar la venta'
    })
  }
}

export {
  listarVentas,
  insertarVenta
}
