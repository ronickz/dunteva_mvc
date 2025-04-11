// Datos seeder
import categorias from './categorias.js'
import marcas from './marcas.js'
import unidad_medidas from './unidad_medidas.js'
import proveedores from './proveedores.js'
import productos from './productos.js'

// Modelos

import db from '../config/db.js'
import { Categoria, Marca, UnidadMedida, Proveedor, Producto } from '../models/index.js'

const importarDatos = async () => {
  try {
    await db.authenticate()
    await db.sync()
    await Promise.all([
      Categoria.bulkCreate(categorias),
      Marca.bulkCreate(marcas),
      Proveedor.bulkCreate(proveedores),
      UnidadMedida.bulkCreate(unidad_medidas)
    ])
    await Producto.bulkCreate(productos)
    console.log('Datos importados')
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

if (process.argv[2] === '-i') {
  await importarDatos()
}
