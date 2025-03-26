const limpiarFormulario = () => {
  $("#sku").val("");
  $("#nombre").val("");
  $("#stock").val("");
  $("#precio").val("");
  $("#marca").val("");
  $("#categoria").val("");
  $("#unidadMedida").val("");
  $("#proveedor").val("");
  $("#capacidad").val("");
  $("#formFile").val("");
  $("#previewImage").attr(
    "src",
    "https://res.cloudinary.com/dtxc85yhv/image/upload/v1740168506/productos/ts0vbu9uyagzunrveh1u.webp"
  );
  $("#stockInfoActual").addClass("d-none");
  $("#stockInfoPosterior").addClass("d-none");

  $("#stockInfoActual").val(0);
  $("#stockInfoPosterior").val(0);
};

// Completa los dropdowns del modal
const cargarDropDowns = () => {
  return Promise.all([
    $.ajax({ url: "api/marcas", method: "GET" }),
    $.ajax({ url: "api/categorias", method: "GET" }),
    $.ajax({ url: "api/unidades", method: "GET" }),
    $.ajax({ url: "api/proveedores", method: "GET" }),
  ]).then(([marcasData, categoriasData, unidadesData, proveedoresData]) => {
      let marcasOptions = '<option value="">Seleccionar Marca</option>';
      marcasData.forEach((marca) => {
        marcasOptions += `<option value="${marca.id}">${marca.nombre}</option>`;
      });
      $("#marca").html(marcasOptions); // Llenar el select de marcas

      // Categorías
      let categoriasOptions = '<option value="">Seleccionar Categoria</option>';
      categoriasData.forEach((categoria) => {
        categoriasOptions += `<option value="${categoria.id}">${categoria.nombre}</option>`;
      });
      $("#categoria").html(categoriasOptions); // Llenar el select de categorías

      // Unidades
      let unidadesOptions = '<option value="">Seleccionar Unidad</option>';
      unidadesData.forEach((unidad) => {
        unidadesOptions += `<option value="${unidad.id}">${unidad.nombre}</option>`;
      });
      $("#unidadMedida").html(unidadesOptions); // Llenar el select de unidades

      // Proveedores
      let proveedoresOptions =
        '<option value="">Seleccionar Proveedor</option>';
      proveedoresData.forEach((proveedor) => {
        proveedoresOptions += `<option value="${proveedor.id}">${proveedor.nombre}</option>`;
      });
      $("#proveedor").html(proveedoresOptions); // Llenar el select de proveedores
    })
    .catch((err) => {
      console.error("Error al cargar los dropdowns", err);
    });
};

// REESTABLECE la preview imagen del modal
const reestablecerImagen = () => {
  $("#formFile").val("");
  const previewImage = $("#previewImage");
  previewImage.attr("src", imagenURL);
};
// Setea la NUEVA preview imagen
const previewImagen = () => {
  $("#formFile").on("change", function (event) {
    var file = event.target.files[0]; // Obtener el archivo seleccionado

    if (file) {
      var reader = new FileReader(); // Crear un FileReader

      reader.onload = function (e) {
        // Actualizar la imagen de previsualización
        var previewImage = $("#previewImage"); // Seleccionar la imagen
        previewImage.attr("src", e.target.result); // Establecer la nueva fuente de la imagen
      };

      // Leer el archivo como una URL de datos (Data URL)
      reader.readAsDataURL(file);
    }
  });
};

const recargarTabla = (tablaInstancia) => {
    tablaInstancia.ajax.reload(null, false); // `false` mantiene la página actual
};

const mostrarSpinner = (mostrar) => {
  if(mostrar) {
    $("#spinnerContainer").removeClass("d-none");
  }
  else {
    $("#spinnerContainer").addClass("d-none");
  }
}



export { 
  limpiarFormulario,
  cargarDropDowns,
  reestablecerImagen,
  previewImagen,
  recargarTabla,
  mostrarSpinner 
};