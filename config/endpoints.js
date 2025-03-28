const endpoints = {
    //get
    vistaProductos: '/stock/',
    vistaVentas: '/ventas/',
    vistaInicio: '/',

    vistaNuevaVenta: '/ventas/nuevaVenta',
    vistaDetalleVenta: '/ventas/detalleVenta',

    //API
    productosApi: '/stock/api/productos',
    insertarProducto: '/stock/api/nuevo',
    editarProducto: '/stock/api/editar',
    eliminarProducto: '/stock/api/eliminar',

    ventasApi: '/ventas/api/ventas',
    insertarVenta: '/ventas/api/nuevo',
};

export default endpoints;