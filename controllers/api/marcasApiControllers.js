import Marca from '../../models/Marca.js'
import { Op } from 'sequelize'

const listarMarcas = async (req, res) => {
  try {
    const marcas = await Marca.findAll()
    res.json(marcas)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Hubo un error al listar marcas, intente mas tarde'
    })
  }
}

const listarMarcasDataTables = async (req, res) => {
  try {
    const { draw, start, length, search, order, columns } = req.query

    // Construir la cláusula where para la búsqueda
    const whereClause = search?.value
      ? {
          [Op.or]: [
            {
              id: {
                [Op.eq]: isNaN(search.value) ? null : parseInt(search.value)
              }
            }, // Para ID numérico
            { nombre: { [Op.like]: `%${search.value}%` } } // Para nombre
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
      case 'id':
      case 'nombre':
        listaRelaciones.push([nombreColumna, ordenColumna])
        break
      default:
        listaRelaciones.push(['id', 'ASC']) // Orden por defecto
        break
    }

    // Obtener el total de registros
    const totalRecords = await Marca.count()

    // Obtener el total de registros filtrados
    const filteredRecords = await Marca.count({
      where: whereClause
    })

    // Obtener los registros paginados
    const marcas = await Marca.findAll({
      where: whereClause,
      order: listaRelaciones,
      offset: parseInt(start),
      limit: length === '-1' ? null : parseInt(length)
    })

    // Transformar los datos para la respuesta
    const marcasTransformadas = marcas.map((marca) => {
      return {
        id: marca.id,
        nombre: marca.nombre
      }
    })

    return res.status(200).json({
      draw: parseInt(draw),
      recordsTotal: totalRecords,
      recordsFiltered: filteredRecords,
      data: marcasTransformadas
    })
  } catch (error) {
    console.error('Error al listar marcas:', error)
    res.status(500).send('Error al listar marcas')
  }
}

const obtenerMarcaPorId = async (req, res) => {
  const { id } = req.params
  try {
    const marca = await Marca.findByPk(id)
    if (!marca) {
      return res.status(404).json({
        success: false,
        message: 'Marca no encontrada'
      })
    }
    res.status(200).json(marca)
  } catch (error) {
    console.error('Error al obtener la marca:', error)
    res.status(500).json({
      success: false,
      message: 'Error al obtener la marca'
    })
  }
}

export {
  listarMarcas,
  listarMarcasDataTables,
  obtenerMarcaPorId
}
