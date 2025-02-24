const endpoints = {

    //get
    listarProductos: '/stock',
    formularioProducto: '/stock/formularioProducto',

    //post
    insertarProducto: '/stock/nuevo',
    editarProducto: '/stock/editar',

    vistaFormulario: 'stock/formulario_producto',
    vistaListado: 'stock/listar_productos',


    //SERVER
    server:'http://localhost:3000'
};

export default endpoints;