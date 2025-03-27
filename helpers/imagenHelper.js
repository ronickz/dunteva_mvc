import fs from "fs";
import cloudinary from "../config/cloudinary.js";

// Valido que haya ingresado una imagen
// Valido que sea diferente a mi imagen por defecto
const hayImagenNueva = (imagenNueva) => {
  let respuesta;
  
  if(imagenNueva != "" && imagenNueva !== process.env.IMG_URL){
    console.log('\x1b[32m%s\x1b[0m', '******Hay foto nueva******');
    respuesta = true;
  }
  else{
    console.log('\x1b[31m%s\x1b[0m', '******No hay foto nueva******');
    respuesta = false;
  }
  return respuesta;
};

const guardarImagen = async (sku, imagenNueva) => {
  let imagenUrl;
  const result = await cloudinary.uploader.upload(imagenNueva, {
    folder: "productos",
    public_id: sku,
    transformation: [{ quality: "auto", fetch_format: "webp" }],
  });
  imagenUrl = result.secure_url;

  fs.unlink(imagenNueva, (err) => {
    if (err) {
      console.error("Error al eliminar el archivo temporal:", err);
    } else {
      console.log("Archivo temporal eliminado");
    }
  });

  return imagenUrl;
};

const eliminarImagen = async (folder,sku) => {
  let archivo = folder + '/' + sku;
  await cloudinary.uploader.destroy(archivo);
}

export { hayImagenNueva, guardarImagen, eliminarImagen };
