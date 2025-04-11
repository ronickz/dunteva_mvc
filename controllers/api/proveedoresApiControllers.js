import { Proveedor } from '../../models/index.js'

// Proveedores

const listarProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll()
    res.json(proveedores)
  } catch (error) {
    console.error('Error al listar proveedores:', error)
  }
}

export {
  listarProveedores
}
