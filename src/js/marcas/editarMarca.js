const llenarCampos = (URL, id) => {
  $.ajax({
    url: `${URL}/${id}`,
    method: 'GET',
    success: (idData) => {
      $('#nombre').val(idData.nombre)
    },
    error: (err) => {
      console.error('Error al cargar la ID', err)
    }
  })
}

export default () => {
  $('#marcas').on('click', '.editar', async function () {
    const id = $(this).data('id')
    llenarCampos(marcasURL, id)
  })
  
}
