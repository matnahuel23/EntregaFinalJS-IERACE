// Crear el formulario principal
let form = document.createElement("form");
// creo e inicializo variables que voy a usar
const consultorio = JSON.parse(localStorage.getItem('clinica')) || [];
const fechaActual = new Date();
// inicializo Id
let id = 1;
id = consultorio.length + id;
// API para tener feriados del año en la Argentina
const apiKey = "f6512b99426294cacaf287d9e27d9c1655f50fe2";
const country = "AR";
const year = "2023";

//--------------------------------------OBJETO PACIENTE-----------------------------------------
class Paciente {
    constructor (info) {
        // AUMENTO ID POR CADA PACIENTE
        this.id = id++;
        this.dni = parseInt(info.dni);
        this.nombre = info.nombre.toUpperCase ();
        this.apellido = info.apellido.toUpperCase ();
        this.nacimiento = info.nacimiento;
        // fecha de nacimiento en formato toLocaleDateString()
        const edad = new Date(Date.parse(info.nacimiento));
        // diferencia fecha actual - nacimiento y ademas en la misma linea convertir diferencia en años y redondear
        this.edad = Math.floor( (fechaActual - edad) / (365.25 * 24 * 60 * 60 * 1000));
        this.email = info.email;
        this.telefono = parseInt(info.telefono);
        this.nacimiento = info.nacimiento;
        this.agenda = false; 
    }
    agendado (){
        this.agenda = true;
    }
}
//------------------------------------ARRAY CONSULTORIO-----------------------------------------
const cargaPacientes = (e) => {
  //Cancelamos el comportamiento del evento
  e.preventDefault();
  //Obtenemos el elemento desde el cual se disparó el evento
  let formulario = e.target;
  //Completo Paciente
  let DNI = formulario.children[0].value;
  let NOMBRE = formulario.children[1].value;
  let APELLIDO = formulario.children[2].value;
  let NACIMIENTO = formulario.children[3].value;
  let EMAIL = formulario.children[4].value;
  let TELEFONO = formulario.children[5].value;
  if (unicoPaciente(DNI)){
      Swal.fire({
                  icon: 'error',
                  title:'No se pudo agregar al Paciente',
                  text: 'El número de DNI pertenece a otro paciente',
      })
  }
  else{
        const nuevoPaciente = new Paciente({
                                      dni:DNI,
                                      nombre: NOMBRE,
                                      apellido:APELLIDO,
                                      nacimiento:NACIMIENTO,
                                      email: EMAIL,
                                      telefono: TELEFONO,
        });
        if (noNulos(nuevoPaciente)){
            Swal.fire({
            icon: 'error',
            title:'No se pudo agregar al Paciente',
            text: 'Faltan Datos',
            })
        }
        else{    
            consultorio.push(nuevoPaciente);
            guardar();
            Toastify({
                      text: `Paciente ${APELLIDO.toUpperCase()} agregado exitosamente`,
                      duration: 1000,
                      destination: "https://github.com/apvarun/toastify-js",
                      newWindow: true,
                      close: true,
                      gravity: "top", // `top` or `bottom`
                      position: "center", // `left`, `center` or `right`
                      stopOnFocus: true, // Prevents dismissing of toast on hover
                      style: {
                      background: "linear-gradient(to right, #00b09b, #96c93d)",
                      },
                      onClick: function(){} // Callback after click
            }).showToast();
        }
}
  limpiarForm ();
}
//--------------------------------------FUNCIONES---------------------------------------------------------
//limpio los inputs luego de agregar un Paciente, me parece mas prolijo
function limpiarForm (){
  inputDni.value = '';
  inputNombre.value = '';
  inputApellido.value = '';
  inputNacimiento.value = '';
  inputEmail.value = '';
  inputTel.value = '';
}
//busco 1 paciente por ID
function busqPorId(){
  let idConsulta = Number (prompt ("Ingrese ID del Paciente"));
  const person = consultorio.find(p => p.id === idConsulta);
  if (person) {
                  Swal.fire (`${person.id}- ${person.nombre} ${person.apellido}\n Edad:${person.edad}\n La agenda es: ${person.agenda}`);
                  return [true,person.id]
  } else {
                  Swal.fire({
                  icon: 'error',
                  title: 'No existe el Paciente',
                  text: 'Intente agregarlo',
                  })
  }             
}

function guardar() {
  // Convierto el arreglo a JSON y la guardo en el LocalStorage con la clave "clinica"
  localStorage.setItem("clinica", JSON.stringify(consultorio));
}

function unicoPaciente (dniConsulta){
  let existe;
  const person = consultorio.some(p => p.dni == dniConsulta);
  if (person) {
                  existe = true;
                  return existe
  } else {
                  return existe
  }   
}

function noNulos (objeto){
  const nulo = Object.values(objeto).some(value => value === null || value === '');
  if (nulo){
    return true
  }
  else {
    return false
  }
}

function mostrar(){
    // Obtener los datos almacenados en localStorage
    const consultorioLS = JSON.parse(localStorage.getItem('clinica'));
    // Verificar si hay datos almacenados
    if (consultorioLS && consultorioLS.length > 0) {
      // Mostrar los datos en la página
      const lista = document.createElement('ol');
      consultorioLS.forEach(consultorioLS => {
        const item = document.createElement('li');
        item.textContent = JSON.stringify(consultorioLS.nombre +" "+ consultorioLS.apellido +" de "+ consultorioLS.edad + " años").replace(/\"/g, "");
        lista.appendChild(item);
      });
      document.body.appendChild(lista);
      tiempoRecarga();
    } else {
        Swal.fire({
        icon: 'error',
        title:'Consultorio vacio',
        text: 'No hay pacientes almacenados',
        })
    }
}

function mostrarFeriados(){
  fetch(`https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${country}&year=${year}`)
  .then(response => response.json())
  .then(data => {
    const lista = document.createElement('ul');
    data.response.holidays.forEach(holiday => {
      const item = document.createElement('li');
      item.textContent = JSON.stringify ( holiday.date.iso + " - " + holiday.description);
      lista.appendChild(item);
    });
    document.body.appendChild(lista);
    tiempoRecarga();
  })
  .catch(error => console.log(error));
}

// A los 5 segundos se actualizara
function tiempoRecarga(){
  setTimeout(function() {
    location.reload();
  }, 5000);
}
    
//-----------------------------------Creo Inputs con sus propiedades-----------------------------
// Crear el input de dni
let inputDni = document.createElement("input");
inputDni.type = "number";
inputDni.name = "nombre";
inputDni.placeholder = "DNI";

// Crear el input de nombre
let inputNombre = document.createElement("input");
inputNombre.type = "text";
inputNombre.name = "nombre";
inputNombre.placeholder = "Nombre";

// Crear el input de apellido
let inputApellido = document.createElement("input");
inputApellido.type = "text";
inputApellido.name = "apellido";
inputApellido.placeholder = "Apellido";

// Crear el input de correo electrónico
let inputEmail = document.createElement("input");
inputEmail.type = "email";
inputEmail.name = "email";
inputEmail.placeholder = "Correo electrónico";

// Crear el input de telefono
let inputTel= document.createElement("input");
inputTel.type = "tel";
inputTel.name = "tel";
inputTel.placeholder = "Celular";

// Crear el input de fecha
let inputNacimiento = document.createElement("input");
inputNacimiento.type = "date";
inputNacimiento.name = "nacimiento";

//****************************************BOTONES********************************************************
//Creo boton Agregar
const botonAgregar = document.createElement('button');
botonAgregar.type = "submit";
botonAgregar.textContent = 'Agregar';

//Creo boton Consultar 
const botonConsultar = document.createElement('button');
botonConsultar.type = 'button';
botonConsultar.textContent = 'Consultar';

//Creo boton Mostrar todo
const botonMostrar = document.createElement('button');
botonMostrar.type = 'button';
botonMostrar.textContent = 'Mostrar';

//Creo boton Feriados
const botonFeriados = document.createElement('button');
botonFeriados.type = 'button';
botonFeriados.textContent = 'Feriados';

//****************************************FIN BOTONES**************************************
// cierro los inputs del formulario
form.appendChild(inputDni);
form.appendChild(inputNombre);
form.appendChild(inputApellido);
form.appendChild(inputNacimiento);
form.appendChild(inputEmail);
form.appendChild(inputTel);
form.appendChild(botonAgregar);
form.appendChild(botonConsultar);
form.appendChild(botonMostrar);
form.appendChild(botonFeriados);

//************************Cierro el formulario******************************
document.body.appendChild(form);
//*******************************EVENTOS************************************
form.addEventListener("submit", cargaPacientes);
botonConsultar.addEventListener("click", () => busqPorId());
botonMostrar.addEventListener("click", () => mostrar());
botonFeriados.addEventListener("click", () => mostrarFeriados ());
