import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Venta = db.define("ventas", {
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  metodo_pago: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
},{
  paranoid: true
});

export default Venta;