import { recargarTabla } from "./helpers.js";

export default (tablaInstancia) => {
  $(document).on("click", "#eliminar", function () {
    const sku = $(this).data("id");
    swal({
      title: "Estas seguro de eliminar este producto?",
      text: "Se realizara una baja logica",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        //Realizar peticion ajax para eliminar producto
        $.ajax({
          url: `${window.location.origin}${endpoints.eliminarProducto}/${sku}`,
          type: "DELETE",
          success: function (response) {
            swal(response.message, {
              icon: "success",
            });
            recargarTabla(tablaInstancia);
          },
          error: function (xhr,error) {
            const mensaje = JSON.parse(xhr.responseText).message;
            swal(mensaje, "Error al editar", "error");
          },
        });
      } else {
        swal("Se cancelo la baja!");
      }
    });
  });
};
