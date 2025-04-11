import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const UnidadMedida = db.define('unidades_medidas', {
  nombre: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  abreviatura: {
    type: DataTypes.STRING(10),
    allowNull: false
  }
}, {
  paranoid: true
})

export default UnidadMedida
