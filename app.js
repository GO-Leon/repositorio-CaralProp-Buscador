mostrarPropiedades(propiedades);

function mostrarPropiedades(propiedades) {
  for (const propiedad of propiedades) {
    $("#busquedaPropiedades").append(`
<div class="card" style="width: 18rem;">
  <img class="card-img-top" src=${propiedad.img} >
  <div class="card-body">
    <h3 class="card-title">${propiedad.direccion}</h3>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">Tipo: ${propiedad.tipo}</li>
    <li class="list-group-item">Superficie: ${propiedad.m2}</li>
    <li class="list-group-item">Ambientes: ${propiedad.ambientes}</li>
    <li class="list-group-item">Barrio: ${propiedad.barrio}</li>
    <li class="list-group-item">Operacion: ${propiedad.operacion}</li>
    <li class="list-group-item">Precio: ${propiedad.precio}</li>
  </ul>
  <div class="card-body">
    <a href="#" class="btn btn-secondary">Ver mas</a>
    <button onclick=agregarFavoritos(${propiedad.id}) class="btn btn-secondary btnAgregar">Agregar <img src=/Media/casaLikeRojo.png ></button>
  </div>
</div>
`);
  }
}
/////////////////////////////             FILTROS                ///////////////////////////
$("#tipoPropiedad");
$("#tipoBarrio");
$("#tipoOperacion");

function filtrar() {
  let valorPropiedad = $("#tipoPropiedad").val();
  let valorBarrio = $("#tipoBarrio").val();
  let valorOperacion = $("#tipoOperacion").val();

  let filterPropiedades = [];

  if (valorBarrio == "todos") {
    filterPropiedades = propiedades;
  } else {
    filterPropiedades = propiedades.filter(
      (el) => el.barrio == $("#tipoBarrio").val()
    );
    console.log($("#tipoBarrio").val());
    console.log(filterPropiedades);
  }

  if (valorPropiedad == "Departamento") {
    filterPropiedades = filterPropiedades.filter(
      (el) => el.tipo == $("#tipoPropiedad").val()
    );
  } else if (valorPropiedad == "Casa") {
    filterPropiedades = filterPropiedades.filter(
      (el) => el.tipo == $("#tipoPropiedad").val()
    );
  }

  if (valorOperacion == "Venta") {
    filterPropiedades = filterPropiedades.filter(
      (el) => el.operacion == $("#tipoOperacion").val()
    );
  } else if (valorOperacion == "Alquiler") {
    filterPropiedades = filterPropiedades.filter(
      (el) => el.operacion == $("#tipoOperacion").val()
    );
  }

  $("#busquedaPropiedades").html("");
  mostrarPropiedades(filterPropiedades);
}

$("#tipoOperacion").change(function () {
  filtrar();
});
$("#tipoBarrio").change(function () {
  filtrar();
});
$("#tipoPropiedad").change(function () {
  filtrar();
});

$("#botonReiniciar").click(function () {
  $("#tipoPropiedad").val("todos");
  $("#tipoBarrio").val("todos");
  $("#tipoOperacion").val("todos");
  filtrar();
});

/////////////////////////////            VISITAS OPEN HOUSES                ///////////////////////////

$.getJSON("./visitas.json", (res) => {
  console.log(res);
  for (const visita of res) {
    $("#visita__div--col").append(`
    <div class="visita__individual--row">
    <h4>${visita.direccion}</h4>
    <h4>${visita.tipo}</h4>
    <h4>${visita.horario}</h4>
    </div>
    `);
  }
});

$("#btnVisita").click(function () {
  $(".contenedorVisitaShow").slideDown();
  $("#btnVisita").addClass("btnActivo");
});

$("#btnVisita__cerrar").click(function () {
  $(".contenedorVisitaShow").slideUp();
  $("#btnVisita").removeClass("btnActivo");
});

/////////////////////////           FAVORITOS              /////////////////////////////////////

const contenedorFav = document.getElementById("seleccion__div");
const contenedorInputs = document.getElementById("formPropiedades");

const propiedadesCantidad = document.getElementById("propiedadesCantidad");
const totalPropiedades = document.getElementById("totalPropiedades");
const favoritos = [];

function agregarFavoritos(itemId) {
  let itemFavorito = favoritos.find((el) => el.id == itemId);

  if (itemFavorito) {
    itemFavorito.cantidad = 1;
  } else {
    const { id, direccion, tipo, barrio, operacion, img } = propiedades.find(
      (el) => el.id == itemId
    );

    favoritos.push({
      id: id,
      direccion: direccion,
      tipo: tipo,
      barrio: barrio,
      operacion: operacion,
      img: img,
      cantidad: 1,
    });
  }

  localStorage.setItem("favoritos", JSON.stringify(favoritos));

  console.log(favoritos);

  actualizarFavoritos();
}

function eliminarFavorito(id) {
  let propiedadAEliminar = favoritos.find((el) => el.id == id);

  propiedadAEliminar.cantidad--;

  if (propiedadAEliminar.cantidad == 0) {
    let indice = favoritos.indexOf(propiedadAEliminar);
    favoritos.splice(indice, 1);
  }

  console.log(favoritos);
  actualizarFavoritos();
}

function actualizarFavoritos() {
  contenedorFav.innerHTML = "";
  contenedorInputs.innerHTML = "";
  favoritos.forEach((propiedad) => {
    const div = document.createElement("div");
    div.classList.add("propiedadEnFavoritos");
    div.innerHTML = `
                      <img class="imgFav" src=${propiedad.img} >
                      <p>${propiedad.direccion}</p>
                      <p>${propiedad.tipo}</p>
                      <p>${propiedad.barrio}</p>
                      <p>${propiedad.operacion}</p>
                      <button onclick=eliminarFavorito(${propiedad.id}) class="btnEliminar"><img src=./Media/remove.png ></button>
                  `;

    contenedorFav.appendChild(div);

    const divForm = document.createElement("div");
    divForm.innerHTML = `
    <input
    type="text"
    id="${propiedad.id}"
    name="Propiedad${propiedad.id}"
    value="${propiedad.direccion}"
  />
    `;
    contenedorInputs.appendChild(divForm);
  });

  propiedadesCantidad.innerText = favoritos.length;
  totalPropiedades.innerText = favoritos.length;
  submitConsulta();
}

//////////////         MODAL FAVORITOS          ///////////////////
const botonAbrir = document.getElementById("btnLike");
const botonCerrar = document.getElementById("favCerrar");
const contenedorFavoritos = document.getElementsByClassName(
  "contenedorFavoritos__div"
)[0];

$("#btnLike").click(function () {
  $(".contenedorFavoritos__div").slideToggle();
  $("#casaLike--black").hide();
  $("#casaLike--red").show();
});

$("#btnLike")
  .mouseenter(function () {
    $("#casaLike--black").hide();
    $("#casaLike--red").show();
  })
  .mouseleave(function () {
    $("#casaLike--black").show();
    $("#casaLike--red").hide();
  });

//////////////////           INPUTS               //////////////////

$("#telefonoCliente").change(function () {
  const telefono = $("#telefonoCliente").val();
  console.log(telefono);

  if (telefono.length == 10) {
    $("#telefonoCliente").addClass("inputValido");
    $("#telefonoCliente").removeClass("inputError");
    submitConsulta();
  } else {
    $("#telefonoCliente").removeClass("inputValido");
    $("#telefonoCliente").addClass("inputError");
    submitConsulta();
  }
});

$("#nombreCliente").change(function () {
  const cliente = $("#nombreCliente").val();
  console.log(cliente);

  if (cliente.length > 1) {
    $("#nombreCliente").addClass("inputValido");
    $("#nombreCliente").removeClass("inputError");
    submitConsulta();
  } else {
    $("#nombreCliente").removeClass("inputValido");
    $("#nombreCliente").addClass("inputError");
    submitConsulta();
  }
});

$("#correoCliente").change(function () {
  const correo = $("#correoCliente").val();
  console.log(correo);

  if (correo.length > 10) {
    $("#correoCliente").addClass("inputValido");
    $("#correoCliente").removeClass("inputError");
    submitConsulta();
  } else {
    $("#correoCliente").removeClass("inputValido");
    $("#correoCliente").addClass("inputError");
    submitConsulta();
  }
});

//////////////////           FORM EMAIL               //////////////////

submitConsulta();
function submitConsulta() {
  const telefono = $("#telefonoCliente").val();
  const cliente = $("#nombreCliente").val();
  const correo = $("#correoCliente").val();
  let telefonoL = telefono.length;
  let clienteL = cliente.length;
  let correoL = correo.length;
  let estadoFavoritos = favoritos.length;
  if (telefonoL == 10 && clienteL > 1 && correoL > 10 && estadoFavoritos >= 1) {
    $("#enviarPropiedades").addClass("ocultar");
    $("#submitPropiedades").remove();
    $(".favoritos__div").append(`<button
      id="submitPropiedades"
      form="formularioConsulta"
      type="submit"
      class="btn btn-secondary btnMargin btnWidth"
    >
      Enviar
    </button>`);
  } else {
    $("#enviarPropiedades").removeClass("ocultar");
    $("#submitPropiedades").remove();
  }
}
