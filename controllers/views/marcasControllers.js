import endpoints from '../../config/endpoints.js'

// Marcas

const renderizarMarcas = async (req, res) => {
  try {
    res.render('marcas/marcas', {
      endpoints
    })
  } catch (error) {
    console.error('Error al listar marcas:', error)
  }
}

export {
  renderizarMarcas
}
