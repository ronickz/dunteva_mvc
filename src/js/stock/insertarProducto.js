import { cargarDropDowns, limpiarFormulario, reestablecerImagen, previewImagen, recargarTabla } from "./helpers.js";


export default (tablaInstancia) => {
    $("#productos_wrapper").on("click", ".nuevo", function () {
      $('#sku').prop('disabled', false);
      $('#stock').prop('required',true);
      $('#stock').off('change')
      $("#stockInfoActual").addClass("d-none");
      $("#stockInfoPosterior").addClass("d-none");
      $("#stockActual").addClass("d-none");
  
      limpiarFormulario();
      cargarDropDowns();
      reestablecerImagen();
      previewImagen();
      $("#formModalId").off("submit").on("submit", function (e) {
        e.preventDefault();
    
        let formData = new FormData(this);
    
        $.ajax({
          url: `${window.location.origin}${endpoints.insertarProducto}`,
          type: "POST",
          data: formData,
          contentType: false,
          processData: false,
          success: function (response) {
            // Aquí puedes manejar la respuesta de la API, por ejemplo, mostrar un mensaje de éxito
            swal(response.message, "Alta", "success");
            recargarTabla(tablaInstancia);
            $("#modalProducto").modal("hide"); // Cerrar el modal
          },
          error: function (xhr, status, error) {
            const mensaje = JSON.parse(xhr.responseText).message;
            swal(mensaje, "Error al insertar", "error");
          },
        });
      });
    });
  };