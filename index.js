import express from "express";
import fileUpload from "express-fileupload";
import db from "./config/db.js";
import cors from "cors";

//Imports de rutas
import stockRoutes from "./routes/stockRoutes.js";
import ventasRoutes from "./routes/ventasRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// App
const app = express();
const PORT = 3001;

//Database
try {
  await db.authenticate();
  //await db.sync({force: true});
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.use(cors())
// Pug
app.set("view engine", "pug");
app.set("views", "./views");

// Static files
app.use(express.static("public"));
// File Upload
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : "/tmp/"            
}));
// Habilitar lectura forms
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/",adminRoutes)
app.use("/stock", stockRoutes);
app.use("/ventas", ventasRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});