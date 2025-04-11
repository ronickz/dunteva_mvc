import Categoria from '../../models/Categoria.js'

const listarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll()
    res.status(200).json(categorias)
  } catch (error) {
    res.status(500).json({ message: 'Error al listar categorias', error })
    console.error('Error al listar categorias:', error)
  }
}

export {
  listarCategorias
}
