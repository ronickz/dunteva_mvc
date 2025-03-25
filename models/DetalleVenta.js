import { DataTypes } from "sequelize";
import db from "../config/db.js";

const DetalleVenta = db.define("detalle_ventas", {
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    }
    },{
    paranoid: true
});

export default DetalleVenta;