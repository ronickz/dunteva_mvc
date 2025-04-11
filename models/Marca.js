import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Marca = db.define('marcas', {
  nombre: {
    type: DataTypes.STRING(30),
    allowNull: false
  }
}, {
  paranoid: true
})

export default Marca
