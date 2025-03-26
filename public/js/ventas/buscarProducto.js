let busquedas=[],limpiarInput=()=>{$("#inputBuscarProducto").val("")},obtenerPrecioTotal=()=>parseFloat($("#totalVenta").text().replace("$","").trim()),actualizarPrecioTotal=t=>{t=parseFloat(t.toFixed(2));$("#totalVenta").text("$ "+t)},crearElementoProducto=r=>{let s=$(`
        <div class="card mb-3">
            <div class="row g-0">
                <div class="col-md-2 d-flex justify-content-center align-items-center">
                    <img class="img-fluid rounded-start" width="80px" height="80px" src="${r.img}" alt="${r.nombre}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title fs-6">${r.nombre}</h5>
                        <p class="card-text fs-8 mb-1">Precio: $${r.precio}</p>
                        <p class="card-text">
                            <small class="text-body-secondary fw-bold">SKU: ${r.sku}</small>
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
    `);$("#contenedorProductos").append(s),s.find(".btn-incrementar").on("click",function(){var t=s.find(".cantidad"),a=parseFloat(r.precio),e=parseInt(r.stock),o=parseInt(t.text());o<e&&(t.text(++o),actualizarPrecioTotal(obtenerPrecioTotal()+a))}),s.find(".btn-decrementar").on("click",function(){var t=s.find(".cantidad"),a=parseInt(t.text());1<a&&(t.text(--a),actualizarPrecioTotal(obtenerPrecioTotal()-r.precio))}),s.find(".btn-eliminar").on("click",function(){var t=busquedas.indexOf(r.sku),a=parseInt(s.find(".cantidad").text());-1!==t&&busquedas.splice(t,1),console.log(`${obtenerPrecioTotal()} - (${a} * ${r.precio})`),actualizarPrecioTotal(obtenerPrecioTotal()-a*r.precio),s.remove()})},mostrarToast=(t,a)=>{switch(t){case"error":toastr.error(a);break;case"success":toastr.success(a);break;case"info":toastr.info(a)}};export default()=>{$("#inputBuscarProducto").on("input",function(){let e=$(this).val().trim();6<e.length&&(busquedas.includes(e)?mostrarToast("info","El Producto ya esta en la lista"):$.ajax({url:""+window.location.origin+endpoints.productosApi+"/"+e,method:"GET",success:function(t){var a=parseFloat(t.precio);crearElementoProducto(t),actualizarPrecioTotal(obtenerPrecioTotal()+a),limpiarInput(),busquedas.push(e),mostrarToast("success","Producto agregado al carrito")},error:function(t){mostrarToast("error","Producto no encontrado")}}))}),$(".btnCompletarCompra").on("click",function(){if(0<obtenerPrecioTotal()){let o={total:obtenerPrecioTotal(),estado:"completada",metodo_pago:"efectivo",detalles:[]};$("#contenedorProductos .card").each(function(){var t=$(this),a=t.find("small.text-body-secondary").text().replace("SKU: ","").trim(),e=parseFloat(t.find("p.card-text.fs-8.mb-1").text().replace("Precio: $","").trim()),t=parseInt(t.find(".cantidad").text());o.detalles.push({productoSku:a,cantidad:t,precio_unitario:e,subtotal:t*e})}),$.ajax({url:""+window.location.origin+endpoints.insertarVenta,method:"POST",data:o,success:function(t){swal(t.message,"Alta","success"),$("#contenedorProductos").empty(),actualizarPrecioTotal(0),busquedas.length=0},error:function(t,a,e){t=JSON.parse(t.responseText).message;swal(t,"Error al insertar","error")}})}})};