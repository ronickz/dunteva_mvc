import { DataTypes } from "sequelize";
import db from "../config/db.js";
import { text } from "express";

const Marca = db.define("marcas", {
  nombre: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
},{
  paranoid: true
});

export default Marca;