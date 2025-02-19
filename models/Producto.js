import { DataTypes } from "sequelize";
import db from "../config/db.js";
import { text } from "express";

const Producto = db.define("productos", {
    sku: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Genera automáticamente un UUID v4
        allowNull: false,
        unique: true,
      },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    capacidad: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    stock:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,  
    },
    img:{
        type: DataTypes.STRING(100),
        allowNull: true,
    }
},{
    paranoid: true,
    indexes: [
        {
          unique: true,
          fields: ["sku"],
        },
      ],
});

export default Producto;