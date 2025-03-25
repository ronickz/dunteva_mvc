import {
  cargarDropDowns,
  recargarTabla,
  previewImagen,
  limpiarFormulario,
} from "./helpers.js";

// Completa los campos del producto en el modal
const llenarCampos = (sku) => {
  $.ajax({
    url: `${window.location.origin}${endpoints.productosApi}/${sku}`, // Asumiendo que tienes un endpoint para obtener un producto por SKU
    method: "GET",
    success: (productoData) => {
      console.log(productoData);
      // Llenar los campos del producto
      $("#sku").val(productoData.sku);
      $("#nombre").val(productoData.nombre);
      $("#stock").val("");
      $("#precio").val(productoData.precio);

      // Seleccionar la marca, categoría, unidad y proveedor basados en el producto
      $("#marca").val(productoData.marcaId);
      $("#categoria").val(productoData.categoriaId);
      $("#capacidad").val(productoData.capacidad);
      $("#unidadMedida").val(productoData.unidadId);
      $("#proveedor").val(productoData.proveedorId);

      // Actualizar la imagen de previsualización
      $("#previewImage").attr("src", productoData.img);

      // Agrego info actual del stock

      $("#stockActual").text(productoData.stock);
      $("#stockInfoActual").removeClass("d-none");
      $("#stockActual").removeClass("d-none");
    },
    error: (err) => {
      console.error("Error al cargar el producto", err);
    },
  });
};

// Va actualizando la informacion del stock luego de su suma

const actualizarStock = () => {
  console.log("Info actual", parseInt($("#stockActual").text()));
  let stock = parseInt($("#stock").val()) + parseInt($("#stockActual").text());

  $("#stockInfoPosterior").text(
    `NUEVO stock a guardar= ${stock} ---> Valor anterior:${parseInt(
      $("#stockActual").text()
    )} + Valor ingresado:${parseInt($("#stock").val())}`
  );
  $("#stockInfoPosterior").addClass(
    "bg-custom-green mt-2 p-2 text-dark rounded fw-bold"
  );
  $("#stockInfoPosterior").removeClass("d-none");
};

// MODAL EDITAR
export default (tablaInstancia) => {
  $("#productos").on("click", "#editar", function () {
    $("#stock")
      .off("change")
      .on("change", function () {
        actualizarStock(); // Llama a la función actualizarStock cuando cambie el valor
      });
    limpiarFormulario();
    const sku = $(this).data("id");
    $("#sku").prop("disabled", true);
    $("#stock").prop("required", false);

    cargarDropDowns().then(() => {
      llenarCampos(sku); // Llama a llenarCampos después de cargar los dropdowns
      previewImagen();

      $("#formModalId")
        .off("submit")
        .on("submit", function (e) {
          e.preventDefault();
          let formData = new FormData(this);


          // Verifico si el campo "stock" tiene un valor
          if (!$("#stock").val()) {
            formData.set("stock", parseInt($("#stockActual").text()));
          }
          else{
            let stock= parseInt($("#stock").val()) + parseInt($("#stockActual").text())
            formData.set("stock", stock);
          }

          // Comprobar si se ha seleccionado una nueva imagen

          if ($("#formFile").val() === "") {
            // Si no se ha seleccionado una nueva imagen, elimino el campo
            formData.delete("imagen");
          }

          // Recorrer formdata
          for (var pair of formData.entries()) {
            console.log(pair[0] + ", " + pair[1]);
          }

          $.ajax({
            url: `${window.location.origin}${endpoints.editarProducto}/${sku}`,
            type: "PUT",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
              swal(response.message, "Editado", "success");
              recargarTabla(tablaInstancia);
              $("#modalProducto").modal("hide"); // Cerrar el modal
            },
            error: function (xhr, status, error) {
              const mensaje = JSON.parse(xhr.responseText).message;
              swal(mensaje, "Error al editar", "error");
            },
          });
        });
    });
  });
};
