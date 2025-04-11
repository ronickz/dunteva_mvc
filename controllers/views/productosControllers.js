// Modelos
import {
  Producto,
  Venta
} from '../../models/index.js'
import { Op } from 'sequelize'

// Mis rutas
import endpoints from '../../config/endpoints.js'

const renderizarProductos = async (req, res) => {
  try {
    const productosBajoStock = await Producto.count({
      where: {
        stock: {
          [Op.lte]: 10 // Menor o igual a 10
        }
      }
    })

    // Contar productos con stock > 10
    const productosAltoStock = await Producto.count({
      where: {
        stock: {
          [Op.gt]: 10 // Mayor a 10
        }
      }
    })

    const ventasConfirmadas = await Venta.count({
      where: {
        estado: {
          [Op.eq]: 'Completada'
        }
      }
    })

    res.status(200).render('stock/productos', {
      endpoints,
      IMG_URL: process.env.IMG_URL,
      productosBajoStock,
      productosAltoStock,
      ventasConfirmadas
    })
  } catch (error) {
    console.error('Error al listar productos:', error)
    res.status(500).send('Error al listar productos')
  }
}

export {
  renderizarProductos
}
