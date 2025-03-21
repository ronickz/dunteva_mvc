const tablaProductos = () =>  {
    const tabla = document.getElementById("productos");
    new DataTable(tabla,{
      scrollY: "400px",
      lengthMenu: [[5, 10, 20,-1],[5,10,20,"Todos"]],
      stateSave: true,
      searching: true,
      paging: true,
      processing: true,
      serverSide: true,
      ajax: {
        url: `${window.location.origin}${endpoints.productosApi}`,
        type: "GET",
      },
      columns: [
        {
          data: "img",
          render: function (data) {
            return `<img src="${data}" alt="" width="60" height="50" style="object-fit: cover;" class="rounded-2">`
          },
        },
        {
           data: "sku",
           render: function (data) {
            return `<span class="">${data}</span>`;
           },
        },
        { 
          data: "nombre",
          render: function (data) {
            return `<a href="../../../apps/e-commerce/landing/product-details.html" class="line-clamp-3 fw-bold">${data}</a>`;
          },
        },
        { 
          data: "marca",
          render: function (data) {
            return `<span class="badge text-bg-secondary">${data}</span>`;
          } 
        },
        { 
          data: "categoria",
          render: function (data) {
            return `<span class="badge bg-custom-primary p-2">${data}</span>`;
          }
         },
         {
          data: null,
          render: function (data) {
            return `<span class="">${parseInt(data.capacidad)} ${data.unidad}</span>`;
          },
          orderable: false
        },
        { 
          data: "precio",
          render: function (data) {
            return `<span class="badge bg-custom-violetaOscuro p-2">$ ${data}</span>`;
          }
        },
        { 
          data: "stock",
          render: function (data) {
            let colorClass = data <= 10 ? "bg-danger" : "bg-custom-green";
            return `<span class="badge px-4 py-2  ${colorClass}">${data}</span>`;
          }
         },
        { 
          data: "proveedor"
        },
        { 
          data: "fecha"
        },
        {
          data:"sku",
          render: function (data) {
            const SERVER_URL = `${window.location.origin}${endpoints.formularioProducto}/${data}`;
            return `<button id="editar" class="btn btn-warning text-white p-2 rounded" data-id=${data} data-bs-toggle="modal" data-bs-target="#modalProducto"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen-fill" viewBox="0 0 16 16">
  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001"/>
</svg></button><button class="btn btn-danger text-white p-2 rounded mx-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
</svg></button>`
          },
          title:'ACCIONES'
        }
      ],
      columnDefs: [
        {
          targets: "_all",
          className: "align-middle",
        },
        {
          targets: [ 6, 7],
          className: "text-center",
        },
        {
          targets:[3,4,6,7],
          className: "fs-6"
        }

      ],
      layout:{

        top3End: {
          buttons:[
            {
              text:'Nuevo Producto',
              className: 'btn nuevo btn-sm bg-custom-green px-3',
              attr:{
                'data-bs-toggle':"modal",
                'data-bs-target':'#modalProducto'
              }
            },
            {
              extend: 'copy',
              text: 'Copiar',
              className: 'btn btn-sm bg-custom-primary',
              exportOptions: {
                  columns: [1,2,3,4,5,6]
              }
            },
            {
              extend:'pdf',
              className: 'btn btn-sm btn-danger',
              text:'PDF'
            }
          ],
        }
      },
      language:
      {
        "processing": "Procesando...",
        "lengthMenu": "Mostrar _MENU_ registros",
        "zeroRecords": "No se encontraron resultados",
        "emptyTable": "Ningún dato disponible en esta tabla",
        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
        "search": "Buscar:",
        "loadingRecords": "Cargando...",
        "paginate": {
            "first": "Primero",
            "last": "Último",
            "next": "Siguiente",
            "previous": "Anterior"
        },
        "aria": {
            "sortAscending": ": Activar para ordenar la columna de manera ascendente",
            "sortDescending": ": Activar para ordenar la columna de manera descendente"
        },
        "buttons": {
            "copy": "Copiar",
            "colvis": "Visibilidad",
            "collection": "Colección",
            "colvisRestore": "Restaurar visibilidad",
            "copyKeys": "Presione ctrl o u2318 + C para copiar los datos de la tabla al portapapeles del sistema. <br \/> <br \/> Para cancelar, haga clic en este mensaje o presione escape.",
            "copySuccess": {
                "1": "Copiada 1 fila al portapapeles",
                "_": "Copiadas %ds fila al portapapeles"
            },
            "copyTitle": "Copiar al portapapeles",
            "csv": "CSV",
            "excel": "Excel",
            "pageLength": {
                "-1": "Mostrar todas las filas",
                "_": "Mostrar %d filas"
            },
            "pdf": "PDF",
            "print": "Imprimir",
            "renameState": "Cambiar nombre",
            "updateState": "Actualizar",
            "createState": "Crear Estado",
            "removeAllStates": "Remover Estados",
            "removeState": "Remover",
            "savedStates": "Estados Guardados",
            "stateRestore": "Estado %d"
        },
        "autoFill": {
            "cancel": "Cancelar",
            "fill": "Rellene todas las celdas con <i>%d<\/i>",
            "fillHorizontal": "Rellenar celdas horizontalmente",
            "fillVertical": "Rellenar celdas verticalmente"
        },
        "decimal": ",",
        "searchBuilder": {
            "add": "Añadir condición",
            "button": {
                "0": "Constructor de búsqueda",
                "_": "Constructor de búsqueda (%d)"
            },
            "clearAll": "Borrar todo",
            "condition": "Condición",
            "conditions": {
                "date": {
                    "before": "Antes",
                    "between": "Entre",
                    "empty": "Vacío",
                    "equals": "Igual a",
                    "notBetween": "No entre",
                    "not": "Diferente de",
                    "after": "Después",
                    "notEmpty": "No Vacío"
                },
                "number": {
                    "between": "Entre",
                    "equals": "Igual a",
                    "gt": "Mayor a",
                    "gte": "Mayor o igual a",
                    "lt": "Menor que",
                    "lte": "Menor o igual que",
                    "notBetween": "No entre",
                    "notEmpty": "No vacío",
                    "not": "Diferente de",
                    "empty": "Vacío"
                },
                "string": {
                    "contains": "Contiene",
                    "empty": "Vacío",
                    "endsWith": "Termina en",
                    "equals": "Igual a",
                    "startsWith": "Empieza con",
                    "not": "Diferente de",
                    "notContains": "No Contiene",
                    "notStartsWith": "No empieza con",
                    "notEndsWith": "No termina con",
                    "notEmpty": "No Vacío"
                },
                "array": {
                    "not": "Diferente de",
                    "equals": "Igual",
                    "empty": "Vacío",
                    "contains": "Contiene",
                    "notEmpty": "No Vacío",
                    "without": "Sin"
                }
            },
            "data": "Data",
            "deleteTitle": "Eliminar regla de filtrado",
            "leftTitle": "Criterios anulados",
            "logicAnd": "Y",
            "logicOr": "O",
            "rightTitle": "Criterios de sangría",
            "title": {
                "0": "Constructor de búsqueda",
                "_": "Constructor de búsqueda (%d)"
            },
            "value": "Valor"
        },
        "searchPanes": {
            "clearMessage": "Borrar todo",
            "collapse": {
                "0": "Paneles de búsqueda",
                "_": "Paneles de búsqueda (%d)"
            },
            "count": "{total}",
            "countFiltered": "{shown} ({total})",
            "emptyPanes": "Sin paneles de búsqueda",
            "loadMessage": "Cargando paneles de búsqueda",
            "title": "Filtros Activos - %d",
            "showMessage": "Mostrar Todo",
            "collapseMessage": "Colapsar Todo"
        },
        "select": {
            "cells": {
                "1": "1 celda seleccionada",
                "_": "%d celdas seleccionadas"
            },
            "columns": {
                "1": "1 columna seleccionada",
                "_": "%d columnas seleccionadas"
            },
            "rows": {
                "1": "1 fila seleccionada",
                "_": "%d filas seleccionadas"
            }
        },
        "thousands": ".",
        "datetime": {
            "previous": "Anterior",
            "hours": "Horas",
            "minutes": "Minutos",
            "seconds": "Segundos",
            "unknown": "-",
            "amPm": [
                "AM",
                "PM"
            ],
            "months": {
                "0": "Enero",
                "1": "Febrero",
                "10": "Noviembre",
                "11": "Diciembre",
                "2": "Marzo",
                "3": "Abril",
                "4": "Mayo",
                "5": "Junio",
                "6": "Julio",
                "7": "Agosto",
                "8": "Septiembre",
                "9": "Octubre"
            },
            "weekdays": {
                "0": "Dom",
                "1": "Lun",
                "2": "Mar",
                "4": "Jue",
                "5": "Vie",
                "3": "Mié",
                "6": "Sáb"
            },
            "next": "Próximo"
        },
        "editor": {
            "close": "Cerrar",
            "create": {
                "button": "Nuevo",
                "title": "Crear Nuevo Registro",
                "submit": "Crear"
            },
            "edit": {
                "button": "Editar",
                "title": "Editar Registro",
                "submit": "Actualizar"
            },
            "remove": {
                "button": "Eliminar",
                "title": "Eliminar Registro",
                "submit": "Eliminar",
                "confirm": {
                    "_": "¿Está seguro de que desea eliminar %d filas?",
                    "1": "¿Está seguro de que desea eliminar 1 fila?"
                }
            },
            "error": {
                "system": "Ha ocurrido un error en el sistema (<a target=\"\\\" rel=\"\\ nofollow\" href=\"\\\">Más información&lt;\\\/a&gt;).<\/a>"
            },
            "multi": {
                "title": "Múltiples Valores",
                "restore": "Deshacer Cambios",
                "noMulti": "Este registro puede ser editado individualmente, pero no como parte de un grupo.",
                "info": "Los elementos seleccionados contienen diferentes valores para este registro. Para editar y establecer todos los elementos de este registro con el mismo valor, haga clic o pulse aquí, de lo contrario conservarán sus valores individuales."
            }
        },
        "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
        "stateRestore": {
            "creationModal": {
                "button": "Crear",
                "name": "Nombre:",
                "order": "Clasificación",
                "paging": "Paginación",
                "select": "Seleccionar",
                "columns": {
                    "search": "Búsqueda de Columna",
                    "visible": "Visibilidad de Columna"
                },
                "title": "Crear Nuevo Estado",
                "toggleLabel": "Incluir:",
                "scroller": "Posición de desplazamiento",
                "search": "Búsqueda",
                "searchBuilder": "Búsqueda avanzada"
            },
            "removeJoiner": "y",
            "removeSubmit": "Eliminar",
            "renameButton": "Cambiar Nombre",
            "duplicateError": "Ya existe un Estado con este nombre.",
            "emptyStates": "No hay Estados guardados",
            "removeTitle": "Remover Estado",
            "renameTitle": "Cambiar Nombre Estado",
            "emptyError": "El nombre no puede estar vacío.",
            "removeConfirm": "¿Seguro que quiere eliminar %s?",
            "removeError": "Error al eliminar el Estado",
            "renameLabel": "Nuevo nombre para %s:"
        },
        "infoThousands": "."
      }
    });
};
// Completa los dropdowns del modal
const cargarDropDowns = () => {
  return Promise.all([
    $.ajax({ url: 'api/marcas', method: 'GET' }),
    $.ajax({ url: 'api/categorias', method: 'GET' }),
    $.ajax({ url: 'api/unidades', method: 'GET' }),
    $.ajax({ url: 'api/proveedores', method: 'GET' }),
  ])
  .then(([marcasData, categoriasData, unidadesData, proveedoresData]) => {
    let marcasOptions = '<option value="">Seleccionar Marca</option>';
    marcasData.forEach(marca => {
      marcasOptions += `<option value="${marca.id}">${marca.nombre}</option>`;
    });
    $('#marca').html(marcasOptions); // Llenar el select de marcas

    // Categorías
    let categoriasOptions = '<option value="">Seleccionar Categoria</option>';
    categoriasData.forEach(categoria => {
      categoriasOptions += `<option value="${categoria.id}">${categoria.nombre}</option>`;
    });
    $('#categoria').html(categoriasOptions); // Llenar el select de categorías

    // Unidades
    let unidadesOptions = '<option value="">Seleccionar Unidad</option>';
    unidadesData.forEach(unidad => {
      unidadesOptions += `<option value="${unidad.id}">${unidad.nombre}</option>`;
    });
    $('#unidadMedida').html(unidadesOptions); // Llenar el select de unidades

    // Proveedores
    let proveedoresOptions = '<option value="">Seleccionar Proveedor</option>';
    proveedoresData.forEach(proveedor => {
      proveedoresOptions += `<option value="${proveedor.id}">${proveedor.nombre}</option>`;
    });
    $('#proveedor').html(proveedoresOptions); // Llenar el select de proveedores
  })
  .catch(err => {
    console.error('Error al cargar los dropdowns', err);
  });
}
// Completa los campos del producto en el modal
const cargarProducto = (sku) => {
  $.ajax({
    url: `${window.location.origin}${endpoints.productosApi}/${sku}`, // Asumiendo que tienes un endpoint para obtener un producto por SKU
    method: 'GET',
    success: (productoData) => {
      console.log(productoData)
      // Llenar los campos del producto
      $('#sku').val(productoData.sku);
      $('#nombre').val(productoData.nombre);
      $('#stock').val(productoData.stock);
      $('#precio').val(productoData.precio);
      
      // Seleccionar la marca, categoría, unidad y proveedor basados en el producto
      $('#marca').val(productoData.marcaId);
      $('#categoria').val(productoData.categoriaId);
      $('#unidadMedida').val(productoData.unidadId);
      $('#proveedor').val(productoData.proveedorId);
    },
    error: (err) => {
      console.error('Error al cargar el producto', err);
    }
  });
}
// Reestablece la preview imagen del modal
const reestablecerImagen = () => {
  $('#formFile').val('');
  const previewImage = $('#previewImage');
  previewImage.attr('src', "https://res.cloudinary.com/dtxc85yhv/image/upload/v1740168506/productos/ts0vbu9uyagzunrveh1u.webp");
}
// Setea la nueva preview imagen
const previewImagen = () =>{ 
  $('#formFile').on('change', function(event) {
    var file = event.target.files[0]; // Obtener el archivo seleccionado

    if (file) {
      var reader = new FileReader(); // Crear un FileReader

      reader.onload = function(e) {
        // Actualizar la imagen de previsualización
        var previewImage = $('#previewImage'); // Seleccionar la imagen
        previewImage.attr('src', e.target.result); // Establecer la nueva fuente de la imagen
      };

      // Leer el archivo como una URL de datos (Data URL)
      reader.readAsDataURL(file);
    }
  });
}

// MODAL INSERTAR
const modalInsertar = () => {
  $('#productos_wrapper').on('click', '.nuevo', function() {
    reestablecerImagen();
    cargarDropDowns();
    previewImagen();
  })
  // Aseguramos que el botón Guardar esté correctamente enlazado
  $('#formModalId').on('submit', function(e) {
    e.preventDefault();
   // Crear un objeto con los datos del formulario
   let formData = {
    sku: $('#sku').val(),
    nombre: $('#nombre').val(),
    marca: $('#marca').val(),
    categoria: $('#categoria').val(),
    stock: $('#stock').val(),
    capacidad: $('#capacidad').val(),
    unidadMedida: $('#unidadMedida').val(),
    precio: $('#precio').val(),
    proveedor: $('#proveedor').val(),
};

    // Verificar si hay imagen, y agregarla al objeto si existe
    let imagen = $('#formFile')[0].files[0];
    if (imagen) {
        formData.imagen = imagen;
    }

// Mostrar el objeto JSON en la consola para ver cómo está quedando
console.log(JSON.stringify(formData));
    $.ajax({
      url: `${window.location.origin}${endpoints.insertarProducto}`,
      type: 'POST',
      data: JSON.stringify(formData),
      contentType: 'application/json',
      success: function(response) {
          // Aquí puedes manejar la respuesta de la API, por ejemplo, mostrar un mensaje de éxito
          alert('Producto guardado correctamente');
          $('#modalProducto').modal('hide'); // Cerrar el modal
      },
      error: function(xhr, status, error) {
          // Manejar errores si la solicitud falla
          alert('Hubo un error al guardar el producto');
      }
  });
  });
}
// MODAL EDITAR
const modalEditar = () => {
  $('#productos').on('click', '#editar', function() {
    const sku = $(this).data('id');
    $('#formModalId').attr('action', '/productos/editar');
    cargarDropDowns()
      .then(() => {
        cargarProducto(sku);  // Llama a cargarProducto después de cargar los dropdowns
        previewImagen();
      })
      .catch(err => {
        console.error('Error al cargar los datos', err);  // Maneja cualquier error aquí
      });
});
}


// Inicializo las funciones creadas
$(document).ready(function() {
  tablaProductos();
  modalEditar();
  modalInsertar();

});

