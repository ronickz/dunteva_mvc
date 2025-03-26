const busquedas = [];

const limpiarInput = () => {
    $('#inputBuscarProducto').val('');
}

const obtenerPrecioTotal = () => {
    return parseFloat($('#totalVenta').text().replace('$', '').trim());
}

const actualizarPrecioTotal = (valor) => {
    const totalRedondeado = parseFloat(valor.toFixed(2));
    $('#totalVenta').text(`$ ${totalRedondeado}`);
}

const crearElementoProducto = (producto) => {
    // Crear el contenedor principal de la card
    const card = $(`
        <div class="card mb-3">
            <div class="row g-0">
                <div class="col-md-2 d-flex justify-content-center align-items-center">
                    <img class="img-fluid rounded-start" width="80px" height="80px" src="${producto.img}" alt="${producto.nombre}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title fs-6">${producto.nombre}</h5>
                        <p class="card-text fs-8 mb-1">Precio: $${producto.precio}</p>
                        <p class="card-text">
                            <small class="text-body-secondary fw-bold">SKU: ${producto.sku}</small>
                        </p>
                    </div>
                </div>
                <div class="col-md-2 d-flex justify-content-center align-items-center gap-3">
                    <button class="btn btn-custom-primary p-2 d-flex justify-content-center align-items-center btn-decrementar">
                        <svg class="bi bi-dash" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
                        </svg>
                    </button>
                    <h5 class="cantidad">1</h5>
                    <button class="btn btn-custom-primary p-2 d-flex justify-content-center align-items-center btn-incrementar">
                        <svg class="bi bi-plus" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                        </svg>
                    </button>
                    <button class="btn btn-danger text-white p-2 rounded btn-eliminar">
                        <svg class="bi bi-trash-fill" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `);

    // Agregar la card al contenedor deseado
    $('#contenedorProductos').append(card);

    // Funcionalidad de los botones
    card.find('.btn-incrementar').on('click', function () {
        const cantidadElement = card.find('.cantidad');
        const productoPrecio = parseFloat(producto.precio);
        const productoStock = parseInt(producto.stock);

        let cantidad = parseInt(cantidadElement.text());
        if(cantidad<productoStock){
            cantidad++;
            cantidadElement.text(cantidad);
            actualizarPrecioTotal(obtenerPrecioTotal() + productoPrecio);
        }
    });

    card.find('.btn-decrementar').on('click', function () {
        const cantidadElement = card.find('.cantidad');
        let cantidad = parseInt(cantidadElement.text());
        if (cantidad > 1) {
            cantidad--;
            cantidadElement.text(cantidad);

            actualizarPrecioTotal(obtenerPrecioTotal() - producto.precio);
        }
    });

    card.find('.btn-eliminar').on('click', function () {
        const index = busquedas.indexOf(producto.sku); // Suponiendo que `producto.sku` es único
        const cantidad = parseInt(card.find('.cantidad').text());
        if (index !== -1) {
            busquedas.splice(index, 1);
        }
        console.log(`${obtenerPrecioTotal()} - (${cantidad} * ${producto.precio})`);
        actualizarPrecioTotal(obtenerPrecioTotal() - (cantidad * producto.precio));
        card.remove();
    });
};

const mostrarToast = (tipo,mensaje) =>{

    switch(tipo)
    {
        case 'error':
            toastr.error(mensaje);
            break;
        case 'success':
            toastr.success(mensaje);
            break;
        case 'info':
            toastr.info(mensaje);
            break;
    }
}

export default () => {

    $('#inputBuscarProducto').on('input', function() {
        let palabra = $(this).val().trim();
        // Si la palabra tiene mas de 6 caracteres y no esta en el array de busquedas
        if (palabra.length > 6) {
            if (!busquedas.includes(palabra)) {
                $.ajax({
                    url: `${window.location.origin}${endpoints.productosApi}/${palabra}`, // Asumiendo que tienes un endpoint para obtener un producto por SKU
                    method: "GET",
                    success: function(respuesta) {
                        const productoPrecio = parseFloat(respuesta.precio);
                        crearElementoProducto(respuesta);
                        actualizarPrecioTotal(obtenerPrecioTotal()+productoPrecio);
                        limpiarInput();
    
                        // Push para que no ingrse la misma busqueda
                        busquedas.push(palabra);
                        mostrarToast('success','Producto agregado al carrito');
                    },
                    error: function(error) {
                        mostrarToast('error','Producto no encontrado');
                    }
                    
                })
            }
            else{
                mostrarToast('info','El Producto ya esta en la lista');
            }
    }})


    $('.btnCompletarCompra').on('click', function() {
        if(obtenerPrecioTotal()>0){
            let respuesta = {
                total: obtenerPrecioTotal(),
                estado: 'completada',
                metodo_pago: 'efectivo',
                detalles: []
            }

            $('#contenedorProductos .card').each(function() {
                const card = $(this);
    
                const sku = card.find('small.text-body-secondary').text().replace('SKU: ', '').trim();
                const precio = parseFloat(card.find('p.card-text.fs-8.mb-1').text().replace('Precio: $', '').trim());
                const cantidad = parseInt(card.find('.cantidad').text());

                respuesta.detalles.push({
                    productoSku: sku,
                    cantidad: cantidad,
                    precio_unitario:precio,
                    subtotal: cantidad * precio
                });
            });

            $.ajax({
                url: `${window.location.origin}${endpoints.insertarVenta}`,
                method: "POST",
                data: respuesta,
                success: function(response) {
                    swal(response.message, "Alta", "success");
                    $('#contenedorProductos').empty();
                    actualizarPrecioTotal(0);
                    busquedas.length = 0;
                },
                error: function (xhr, status, error) {
                    const mensaje = JSON.parse(xhr.responseText).message;
                    swal(mensaje, "Error al insertar", "error");
                  },
            });
        }
    });

}

