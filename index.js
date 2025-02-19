import express from "express";


//Imports modelos

import { Marca, Categoria, UnidadMedida, Proveedor, Producto } from "./models/index.js";

//Imports de rutas

import stockRoutes from "./routes/stockRoutes.js";
import ventasRoutes from "./routes/ventasRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

//DB

import db from "./config/db.js";

// App
const app = express();

// Habilitar lectura forms

app.use(express.urlencoded({ extended: true }));

// Database

try {
  await db.authenticate();
  db.sync({ force: true });
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}


// Pug
app.set("view engine", "pug");
app.set("views", "./views");

// Static files

app.use(express.static("public"));

//Routes
app.use("/",adminRoutes)
app.use("/stock", stockRoutes);
app.use("/ventas", ventasRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});