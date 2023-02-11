/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/

// Array de palos
let palos = ["viu", "cua", "hex", "cir"];
// Array de número de cartas
let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// En las pruebas iniciales solo se trabajará con cuatro cartas por palo:
//let numeros = [9, 10, 11, 12];

// paso (top y left) en pixeles de una carta a la siguiente en un mazo
let paso = 5;

// Tapetes		
let tapete = "";
let tapete_eventos = [];	
let tapeteInicial = document.getElementById("inicial");
let tapeteSobrantes = document.getElementById("sobrantes");
let tapeteReceptor1 = document.getElementById("receptor1");
let tapeteReceptor2 = document.getElementById("receptor2");
let tapeteReceptor3 = document.getElementById("receptor3");
let tapeteReceptor4 = document.getElementById("receptor4");

// Mazos
let mazoInicial = [];
let mazoSobrantes = [];
let mazoReceptor1 = [];
let mazoReceptor2 = [];
let mazoReceptor3 = [];
let mazoReceptor4 = [];

// Contadores de cartas
let contInicial = document.getElementById("contador_inicial");
let contSobrantes = document.getElementById("contador_sobrantes");
let contReceptor1 = document.getElementById("contador_receptor1");
let contReceptor2 = document.getElementById("contador_receptor2");
let contReceptor3 = document.getElementById("contador_receptor3");
let contReceptor4 = document.getElementById("contador_receptor4");
let contMovimientos = document.getElementById("contador_movimientos");

// Tiempo
let contTiempo = document.getElementById("contador_tiempo"); // span cuenta tiempo
let segundos = 0;    // cuenta de segundos
let temporizador = null; // manejador del temporizador

// Controles
let control_palo_recep1 = "";
let control_palo_recep2 = "";
let control_palo_recep3 = "";
let control_palo_recep4 = "";
var contador_inicial = 0;
var contador_sobrantes = 0;
var contador_receptor1 = 0;
var contador_receptor2 = 0;
var contador_receptor3 = 0;
var contador_receptor4 = 0;
var contador_movimientos = 0;

/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/

// Rutina asociada a boton reset
/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
function reset() {
	window.location.reload()
}

// El juego arranca ya al cargar la página: no se espera a reiniciar
/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
comenzarJuego();

// Desarrollo del comienzo de juego
function comenzarJuego() {
	/* Crear baraja, es decir crear el mazoInicial. Este será un array cuyos 
	elementos serán elementos HTML <img>, siendo cada uno de ellos una carta.
	Sugerencia: en dos bucles for, bárranse los "palos" y los "numeros", formando
	oportunamente el nombre del fichero png que contiene a la carta (recuérdese poner
	el path correcto en la URL asociada al atributo src de <img>). Una vez creado
	el elemento img, inclúyase como elemento del array mazoInicial. 
	*/

	for (let i = 0; i < palos.length; i++){
		for (let j = 0; j < numeros.length; j++){
			let img_carta = document.createElement('img');
			img_carta.setAttribute("id",`${numeros[j]}-${palos[i]}`);
			img_carta.setAttribute("dato-palo", palos[i]);
			img_carta.setAttribute("dato-numero", numeros[j]);
			img_carta.src = `/imagenes/baraja/${numeros[j]}-${palos[i]}.png`;
			mazoInicial.push(img_carta);
		}
	}

	// Barajar y dejar mazoInicial en tapete inicial
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
	cargarTapeteInicial(barajar(mazoInicial));

	// Puesta a cero de contadores de mazos
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
	setContador(contInicial, mazoInicial.length);
	setContador(contSobrantes, 0);
	setContador(contReceptor1, 0);
	setContador(contReceptor2, 0);
	setContador(contReceptor3, 0);
	setContador(contReceptor4, 0);
	setContador(contMovimientos, 0);

	// Arrancar el conteo de tiempo
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
	arrancarTiempo();
} // comenzarJuego

/**
	Se debe encargar de arrancar el temporizador: cada 1000 ms se
	debe ejecutar una función que a partir de la cuenta autoincrementada
	de los segundos (segundos totales) visualice el tiempo oportunamente con el 
	format hh:mm:ss en el contador adecuado.

	Para descomponer los segundos en horas, minutos y segundos pueden emplearse
	las siguientes igualdades:

	segundos = truncar (   segundos_totales % (60)                 )
	minutos  = truncar ( ( segundos_totales % (60*60) )     / 60   )
	horas    = truncar ( ( segundos_totales % (60*60*24)) ) / 3600 )

	donde % denota la operación módulo (resto de la división entre los operadores)

	Así, por ejemplo, si la cuenta de segundos totales es de 134 s, entonces será:
	   00:02:14

	Como existe la posibilidad de "resetear" el juego en cualquier momento, hay que 
	evitar que exista más de un temporizador simultáneo, por lo que debería guardarse
	el resultado de la llamada a setInterval en alguna variable para llamar oportunamente
	a clearInterval en su caso.   
*/

function arrancarTiempo() {
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
	if (temporizador) clearInterval(temporizador);
	let hms = function () {
		let seg = Math.trunc(segundos % 60);
		let min = Math.trunc((segundos % 3600) / 60);
		let hor = Math.trunc((segundos % 86400) / 3600);
		let tiempo = ((hor < 10) ? "0" + hor : "" + hor)
			+ ":" + ((min < 10) ? "0" + min : "" + min)
			+ ":" + ((seg < 10) ? "0" + seg : "" + seg);
		setContador(contTiempo, tiempo);
		segundos++;
	}
	segundos = 0;
	hms(); // Primera visualización 00:00:00
	temporizador = setInterval(hms, 1000);

} // arrancarTiempo

/**
	Si mazo es un array de elementos <img>, en esta rutina debe ser
	reordenado aleatoriamente. Al ser un array un objeto, se pasa
	por referencia, de modo que si se altera el orden de dicho array
	dentro de la rutina, esto aparecerá reflejado fuera de la misma.
*/
function barajar(mazo) {
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
	let indexActual = mazo.length, randomIndex;

	while (indexActual != 0) {
		randomIndex = Math.floor(Math.random() * indexActual);
		indexActual--;
		[mazo[indexActual], mazo[randomIndex]] = [
			mazo[randomIndex], mazo[indexActual]];
	}
	return mazo;
} // barajar

/**
	  En el elemento HTML que representa el tapete inicial (variable tapeteInicial)
	se deben añadir como hijos todos los elementos <img> del array mazo.
	Antes de añadirlos, se deberían fijar propiedades como la anchura, la posición,
	coordenadas top y left, algun atributo de tipo data-...
	Al final se debe ajustar el contador de cartas a la cantidad oportuna
*/
function cargarTapeteInicial(mazo) {
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
	let posicionInicialTop = 10;
	let posicionInicialLeft = 10;
	for (let i = 0; i < mazo.length; i++) {
		let img_carta = mazo[i];
		img_carta.style.top = `${posicionInicialTop + i * paso}px`;
		img_carta.style.left = `${posicionInicialLeft + i * paso}px`;
		img_carta.style.height = "70px";
		img_carta.style.position = "absolute";
		img_carta.setAttribute("dato-tapete", "inicial");
		img_carta.setAttribute('draggable', false);
		tapeteInicial.appendChild(img_carta);

		console.log(mazo.length-1);
		if (i==(mazo.length-1)){
			img_carta.setAttribute('draggable', true);
		}

		img_carta.addEventListener("drag", () => {
			console.log("dragging");
		  });
		  
		img_carta.addEventListener("dragstart", (event) => {
			event.dataTransfer.effecAllowed = 'move';
			event.dataTransfer.setData("text", event.target.id);
			event.dataTransfer.setDragImage(event.target, 0, 0);
			event.target.style.opacity = '0.4'
		});
		  
		img_carta.addEventListener("dragend", (event) => {
			event.target.style.opacity = '';
			event.dataTransfer.clearData("text");
		});
	}
} // cargarTapeteInicial


/**
	  Esta función debe incrementar el número correspondiente al contenido textual
		  del elemento que actúa de contador
*/
function incContador(contador) {
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
	contador=contador+1;
	return contador;
} // incContador

/**
	Idem que anterior, pero decrementando 
*/
function decContador(contador) {
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! ***/
	contador=contador-1;
	return contador;
} // decContador

/**
	Similar a las anteriores, pero ajustando la cuenta al
	valor especificado
*/
function setContador(contador, valor) {
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
	contador.innerHTML = valor;
} // setContador

/**
	Esta función permite identificar el palo de la carta para colocar con alternancia de colores entre naranja y gris. 
*/
function controlCartasToShow (numero_carta,contador_receptor,control_palo_recep,palo_carta){
	let mostrar_tapete = false;
	if (numero_carta==(12-contador_receptor)){
		if (control_palo_recep == ""){
			mostrar_tapete = true;
			control_palo_recep = palo_carta;							
		} else {
			if (palo_carta==control_palo_recep){
				mostrar_tapete = false;
			} else {
				mostrar_tapete = true;
			}
			control_palo_recep = palo_carta;
		}
	}
	return [mostrar_tapete, control_palo_recep];
}

/**
	Esta función permite mostrar la carta en los tapetes e incrementar o decrementar los contadores. 
*/
function showOnTapete(tapeteReceptor,mazoReceptor,carta,setdrag,datotapete,tapete_encuentra,contador_receptor){
	tapeteReceptor.appendChild(carta);
	mazoReceptor.push(carta);
	carta.setAttribute('draggable',setdrag);
	carta.style.top = "25%";
	carta.style.left = "25%";
	carta.setAttribute("dato-tapete", datotapete);

	if (tapete_encuentra=="inicial"){
		contador_inicial=decContador(contador_inicial);
		mazoInicial.pop(carta);
	} 
	if (tapete_encuentra=="sobrantes"){
		contador_sobrantes=decContador(contador_sobrantes);
		mazoSobrantes.pop(carta);
	}	
	contador_receptor=incContador(contador_receptor);
	contador_movimientos=incContador(contador_movimientos);
	return contador_receptor;
}

/**
	Funciones para eventos drag y drop
*/
function dragover(event) {
	if (event.preventDefault) {
		event.preventDefault();
	  }
	  return false;
}

function dragenter(event){
	event.target.style.border = '2px dotted #555'; 
	tapete_eventos.push(event.target.id);
}

function dragleave(event){
	event.target.style.border = '';
}

function drop(event) {
	event.stopPropagation()
	event.target.style.border = '';

	let carta = document.createElement('img');
	let data = event.dataTransfer.getData("text");
	carta = document.getElementById(data); 
	var numero_carta = carta.getAttribute("dato-numero");	
	var palo_carta = carta.getAttribute("dato-palo");
	var tapete_encuentra = carta.getAttribute("dato-tapete");

	var numero = 0;
	var i = tapete_eventos.length-1;
	while (numero >= 0){
		numero = tapete_eventos[i].substring(0,1);
		tapete = tapete_eventos[i];
		i--;
	}

	contador_inicial = parseInt(contInicial.innerText,10);
	contador_sobrantes = parseInt(contSobrantes.innerText,10);
	contador_receptor1 = parseInt(contReceptor1.innerText,10);
	contador_receptor2 = parseInt(contReceptor2.innerText,10);
	contador_receptor3 = parseInt(contReceptor3.innerText,10);
	contador_receptor4 = parseInt(contReceptor4.innerText,10);
	contador_movimientos = parseInt(contMovimientos.innerText,10);

	if ((palo_carta=="cir")||(palo_carta=="hex")){
		palo_carta="cir-hex";
	} else {
		palo_carta="cua-viu";
	}

	if (tapete=="sobrantes") {
		contador_sobrantes = showOnTapete (tapeteSobrantes,mazoSobrantes,carta,true,"sobrantes",tapete_encuentra,contador_sobrantes);
	}

	if (tapete=="receptor1") {
		let mostrar_tapete = false;

		var temArray =  controlCartasToShow (numero_carta,contador_receptor1,control_palo_recep1,palo_carta);
		mostrar_tapete = temArray[0];
		control_palo_recep1 = temArray[1];

		if (mostrar_tapete != false) {
			contador_receptor1 = showOnTapete (tapeteReceptor1,mazoReceptor1,carta,false,"receptor1",tapete_encuentra,contador_receptor1);
		}
	}

	if (tapete=="receptor2") {
		let mostrar_tapete = false;
		
		var temArray =  controlCartasToShow (numero_carta,contador_receptor2,control_palo_recep2,palo_carta);
		mostrar_tapete = temArray[0];
		control_palo_recep2 = temArray[1];

		if (mostrar_tapete != false) {
			contador_receptor2 = showOnTapete (tapeteReceptor2,mazoReceptor2,carta,false,"receptor2",tapete_encuentra,contador_receptor2);
		}
	}

	if (tapete=="receptor3") {
		let mostrar_tapete = false;

		var temArray =  controlCartasToShow (numero_carta,contador_receptor3,control_palo_recep3,palo_carta);
		mostrar_tapete = temArray[0];
		control_palo_recep3 = temArray[1];

		if (mostrar_tapete != false) {
			contador_receptor3 = showOnTapete (tapeteReceptor3,mazoReceptor3,carta,false,"receptor3",tapete_encuentra,contador_receptor3);
		}
	}

	if (tapete=="receptor4") {
		let mostrar_tapete = false;
		
		var temArray =  controlCartasToShow (numero_carta,contador_receptor4,control_palo_recep4,palo_carta);
		mostrar_tapete = temArray[0];
		control_palo_recep4 = temArray[1];

		if (mostrar_tapete != false) {
			contador_receptor4 = showOnTapete (tapeteReceptor4,mazoReceptor4,carta,false,"receptor4",tapete_encuentra,contador_receptor4);
		}
	}

	if (contador_inicial==0) {
		mazoInicial=mazoSobrantes;
		cargarTapeteInicial(barajar(mazoInicial));
		contador_inicial = mazoInicial.length;
		contador_sobrantes = 0;
		mazoSobrantes=[];
	}

	if ((contador_sobrantes==0)&&(contador_inicial==0)) {
		let text = `Felicidades!! Has ganado la partida en ${contTiempo.innerText} segundos y ${contador_movimientos} movimientos. Quieres volver a jugar?`;
		if (confirm(text) == true) {
			text = "You pressed OK!";
			reset()
		} else {
			text = "You canceled!";
		}
	
	} 
	
	tapete_eventos = [];

	setContador(contInicial, contador_inicial);
	setContador(contSobrantes, contador_sobrantes);
	setContador(contReceptor1, contador_receptor1);
	setContador(contReceptor2, contador_receptor2);
	setContador(contReceptor3, contador_receptor3);
	setContador(contReceptor4, contador_receptor4);
	setContador(contMovimientos, contador_movimientos);

	console.log(mazoInicial)
	cargarTapeteInicial(mazoInicial);
}