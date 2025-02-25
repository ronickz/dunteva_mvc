//SERVER
const server = 'http://localhost:3000';

const endpoints = {
    //get
    listarProductos: '/stock',
    formularioProducto: '/stock/formularioProducto',

    //post
    insertarProducto: '/stock/nuevo',
    editarProducto: '/stock/editar',

    vistaFormulario: 'stock/formulario_producto',
    vistaListado: 'stock/listar_productos',

    //API
    productosApi: '/stock/api/productos',
};

export default endpoints;