// Modelos
import {
  Producto,
  Categoria,
  Marca,
  UnidadMedida,
  Proveedor
} from '../../models/index.js'
import { Op } from 'sequelize'

import { hayImagenNueva, guardarImagen, eliminarImagen } from '../../helpers/imagenHelper.js'

const listarProductos = async (req, res) => {
  try {
    const { draw, start, length, search, order, columns } = req.query
    const modelos = [
      { model: Marca, as: 'marca' },
      { model: Categoria, as: 'categoria' },
      { model: Proveedor, as: 'proveedor' },
      { model: UnidadMedida, as: 'unidad' }
    ]
    // Construir la cláusula where para la búsqueda
    const whereClause = search.value
      ? {
          [Op.or]: [
            { nombre: { [Op.like]: `%${search.value}%` } },
            { sku: { [Op.like]: `%${search.value}%` } },
            { '$marca.nombre$': { [Op.like]: `%${search.value}%` } },
            { '$categoria.nombre$': { [Op.like]: `%${search.value}%` } },
            { '$proveedor.nombre$': { [Op.like]: `%${search.value}%` } },
            { '$unidad.nombre$': { [Op.like]: `%${search.value}%` } }
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
      case 'marca':
        listaRelaciones.push([
          { model: Marca, as: 'marca' },
          'nombre',
          ordenColumna
        ])
        break
      case 'categoria':
        listaRelaciones.push([
          { model: Categoria, as: 'categoria' },
          'nombre',
          ordenColumna
        ])
        break
      case 'proveedor':
        listaRelaciones.push([
          { model: Proveedor, as: 'proveedor' },
          'nombre',
          ordenColumna
        ])
        break
      case 'unidad':
        listaRelaciones.push([
          { model: UnidadMedida, as: 'unidad' },
          'nombre',
          ordenColumna
        ])
        break
      case 'fecha':
        listaRelaciones.push(['updatedAt', ordenColumna])
        break
      default:
        listaRelaciones.push([nombreColumna, ordenColumna])
        break
    }

    const totalRecords = await Producto.count()
    const filteredRecords = await Producto.count({
      where: whereClause,
      include: modelos
    })

    const productos = await Producto.findAll({
      where: whereClause,
      include: modelos,
      order: listaRelaciones,
      offset: parseInt(start),
      limit: length === '-1' ? null : parseInt(length)
    })

    const productosTransformados = productos.map((producto) => {
      return {
        img: producto.img ? producto.img : '',
        sku: producto.sku,
        nombre: producto.nombre,
        marca: producto.marca.nombre,
        categoria: producto.categoria.nombre,
        capacidad: producto.capacidad,
        unidad: producto.unidad.nombre,
        precio: producto.precio,
        stock: producto.stock,
        proveedor: producto.proveedor.nombre,
        fecha: new Date(producto.updatedAt).toLocaleDateString('es-ES', {
          timeZone: 'UTC'
        }) // Asegúrate de que la fecha se muestra en el formato correcto
      }
    })

    console.log('filter,', filteredRecords)

    return res.json({
      draw: parseInt(draw),
      recordsTotal: totalRecords,
      recordsFiltered: totalRecords,
      data: productosTransformados
    })
  } catch (error) {
    console.error('Error al listar productos:', error)
    res.status(500).send('Error al listar productos')
  }
}

const insertarProducto = async (req, res) => {
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
      proveedor
    } = req.body

    let imagenGuardar = process.env.IMG_URL
    const imagenNueva = req.files && req.files.imagen ? req.files.imagen : ''
    const productoExistente = await Producto.findOne({ where: { sku } })

    if (productoExistente) {
      return res.status(400).json({
        success: false,
        message:
          'Este SKU ya está registrado. No se puede agregar el producto.'
      })
    }

    if (hayImagenNueva(imagenNueva)) {
      imagenGuardar = await guardarImagen(sku, imagenNueva.tempFilePath)
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
      unidadId: unidadMedida, // Cambiado a unidadId
      img: imagenGuardar
    })

    return res.status(200).json({
      success: true,
      message: 'Producto guardado correctamente'
    })
  } catch (error) {
    console.log('Hubo un error al insertar un producto:', error)
    return res.status(500).json({
      success: false,
      message: 'Hubo un error al guardar el producto, intente mas tarde'
    })
  }
}

const actualizarProducto = async (req, res) => {
  const { sku } = req.params
  const {
    nombre,
    marca,
    categoria,
    capacidad,
    unidadMedida,
    precio,
    stock,
    proveedor
  } = req.body

  try {
    const productoExistente = await Producto.findOne({ where: { sku } })

    if (productoExistente) {
      let imagenGuardar = productoExistente.img
      const imagenNueva = req.files && req.files.imagen ? req.files.imagen : ''

      if (hayImagenNueva(imagenNueva)) {
        imagenGuardar = await guardarImagen(sku, imagenNueva.tempFilePath)
        if (productoExistente.img !== process.env.IMG_URL) {
          console.log('El producto NO INCLUIA la imagen por defecto')
          eliminarImagen(sku)
        }
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
          img: imagenGuardar
        },
        {
          where: {
            sku
          }
        }
      )
    }

    return res.status(200).json({
      success: true,
      message: 'Producto actualizado exitosamente.'
    })
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    return res.status(500).json({
      success: false,
      message: 'Hubo un error al actualizar el producto'
    })
  }
}

const obtenerProducto = async (req, res) => {
  try {
    const { sku } = req.params
    const producto = await Producto.findOne({
      where: {
        sku
      }
    })

    if (!producto) {
      res.status(404).json('Producto no encontrado')
      return
    }

    res.json(producto)
  } catch (error) {
    console.error('Error al obtener producto:', error)
    return res.status(500).json({
      success: false,
      message: 'Hubo un error al obtener el producto, intente mas tarde'
    })
  }
}

const eliminarProducto = async (req, res) => {
  try {
    const { sku } = req.params

    // Buscar el producto por SKU
    const producto = await Producto.findOne({
      where: {
        sku
      }
    })

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      })
    }

    // Realizar la baja lógica
    await producto.destroy()

    return res.status(200).json({
      success: true,
      message: 'Producto eliminado exitosamente (baja lógica).'
    })
  } catch (error) {
    console.error('Error al eliminar producto:', error)
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar producto.'
    })
  }
}

export {
  listarProductos,
  obtenerProducto,
  insertarProducto,
  actualizarProducto,
  eliminarProducto
}
