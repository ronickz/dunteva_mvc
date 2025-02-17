import express from "express";
import stockRoutes from "./routes/stockRoutes.js";
import ventasRoutes from "./routes/ventasRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// App
const app = express();

// Habilitar lectura forms

app.use(express.urlencoded({ extended: true }));


// Pug
app.set("view engine", "pug");
app.set("views", "./views");

// Static files

app.use(express.static("public"));

//Routes
app.use("/",adminRoutes)
app.use("/stock", stockRoutes);
app.use("/ventas", ventasRoutes);

app.listen(3005, () => {
  console.log("Server is running on port 3000");
});