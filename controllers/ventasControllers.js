import endpoints from "../config/endpoints.js";
const formularioVenta = (req, res) => {
    res.render("ventas/formulario_ventas",{
        endpoints,
        IMG_URL: process.env.IMG_URL,
    });
};

export { formularioVenta};