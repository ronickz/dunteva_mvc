import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Proveedor = db.define("proveedores", {
  
  nombre: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  telefono:{
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  direccion: {
        type: DataTypes.STRING(50),
        allowNull: true,
 },
 correo:{
    type: DataTypes.STRING(50),
    allowNull: true,
  },
},{
    paranoid: true,
});

export default Proveedor;