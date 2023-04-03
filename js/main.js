// Crear el formulario principal
let form = document.createElement("form");
// creo e inicializo variables que voy a usar
const consultorio = [];
const fechaActual = new Date();
// inicializo Id
let id = 1;

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
  consultorio.push(new Paciente({
    dni:DNI,
    nombre: NOMBRE,
    apellido:APELLIDO,
    nacimiento:NACIMIENTO,
    email: EMAIL,
    telefono: TELEFONO,
  }));
  guardar();
  alert ("AGREGADO");
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
//buscvo 1 paciente por ID
function busqPorId(){
  let idConsulta = Number (prompt ("Ingrese ID del Paciente"));
  const person = consultorio.find(p => p.id === idConsulta);
  if (person) {
                  alert (`${person.id}- ${person.nombre} ${person.apellido}\n Edad:${person.edad}\n La agenda es: ${person.agenda}`);
                  return [true,person.id]
  } else {
                  alert (`No existe el paciente en el consultorio`);
  }               
}

function guardar() {
  // Convierto el arreglo a JSON y la guardo en el LocalStorage con la clave "clinica"
  localStorage.setItem("clinica", JSON.stringify(consultorio));
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
    } else {
      console.log('No hay Pacientes almacenados');
    }
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

//************************Cierro el formulario******************************
document.body.appendChild(form);
//*******************************EVENTOS************************************
form.addEventListener("submit", cargaPacientes);
botonConsultar.addEventListener("click", () => busqPorId());
botonMostrar.addEventListener("click", () => mostrar());