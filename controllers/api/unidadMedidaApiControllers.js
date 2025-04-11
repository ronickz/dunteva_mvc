import UnidadMedida from '../../models/UnidadMedida.js'

const listarUnidades = async (req, res) => {
  try {
    const unidades = await UnidadMedida.findAll()
    res.status(200).json(unidades)
  } catch (error) {
    console.error('Error al listar unidades de medida: ', error)
    res.status(500).send('Error al listar unidades de medida')
  }
}

export {
  listarUnidades
}
