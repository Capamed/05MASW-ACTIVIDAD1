/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/

// Array de palos
let palos = ["viu", "cua", "hex", "cir"];
// Array de número de cartas
//let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// En las pruebas iniciales solo se trabajará con cuatro cartas por palo:
let numeros = [9, 10, 11, 12];

// paso (top y left) en pixeles de una carta a la siguiente en un mazo
let paso = 5;

// Tapetes				
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

/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/


// Rutina asociada a boton reset
/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/


// El juego arranca ya al cargar la página: no se espera a reiniciar
/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/

// Desarrollo del comienzo de juego
function comenzarJuego() {
	/* Crear baraja, es decir crear el mazoInicial. Este será un array cuyos 
	elementos serán elementos HTML <img>, siendo cada uno de ellos una carta.
	Sugerencia: en dos bucles for, bárranse los "palos" y los "numeros", formando
	oportunamente el nombre del fichero png que contiene a la carta (recuérdese poner
	el path correcto en la URL asociada al atributo src de <img>). Una vez creado
	el elemento img, inclúyase como elemento del array mazoInicial. 
	*/

	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
	for (let tmpPalos = 0; tmpPalos < palos.length; tmpPalos++) {
		const elemPalos = palos[tmpPalos];
		for (let tmpNumeros = 0; tmpNumeros < numeros.length; tmpNumeros++) {
			const elemNumeros = numeros[tmpNumeros];
			mazoInicial.push(`${elemNumeros}-${elemPalos}.png`);
		}
	}

	// Barajar y dejar mazoInicial en tapete inicial
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
	let tmpMazoRandom = barajar(mazoInicial);
	cargarTapeteInicial(tmpMazoRandom);

	// Puesta a cero de contadores de mazos
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
	contInicial.innerHTML = tmpMazoRandom.length;
	contSobrantes.innerHTML = 0;
	contReceptor1.innerHTML = 0;
	contReceptor2.innerHTML = 0;
	contReceptor3.innerHTML = 0;
	contReceptor4.innerHTML = 0;
	contMovimientos.innerHTML = 0;

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

	// While there remain elements to shuffle.
	while (indexActual != 0) {

		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * indexActual);
		indexActual--;

		// And swap it with the current element.
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
	let posicionInicialTop = 10;
	let posicionInicialLeft = 10;
	for (let index = 0; index < mazo.length; index++) {
		let carta = document.createElement('img');
		carta.setAttribute("id", mazo[index].split(".png")[0]);
		carta.src = `/imagenes/baraja/${mazo[index]}`;
		carta.style.top = `${posicionInicialTop + index * paso}px`;
		carta.style.left = `${posicionInicialLeft + index * paso}px`;
		carta.style.height = "70px";
		carta.style.position = "absolute";
		carta.setAttribute('draggable', true);
		document.getElementById('inicial').appendChild(carta);
		carta.addEventListener("drag", (event) => {
			event.dataTransfer.setData("text", event.target.id);
		});

	}
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
} // cargarTapeteInicial


/**
	  Esta función debe incrementar el número correspondiente al contenido textual
		  del elemento que actúa de contador
*/
function incContador(contador) {
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
} // incContador

/**
	Idem que anterior, pero decrementando 
*/
function decContador(contador) {
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! ***/
} // decContador

/**
	Similar a las anteriores, pero ajustando la cuenta al
	valor especificado
*/
function setContador(contador, valor) {
	/*** !!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! **/
	contador.innerHTML = valor;
} // setContador

function allowDrop(event) {
	event.preventDefault();
}

function drop(event) {
	event.preventDefault();
	let data = event.dataTransfer.getData("text");
	let indexLastSlash = data.lastIndexOf("/");
	let palabraCortada = data.substring(indexLastSlash + 1, data.length);
	event.target.appendChild(document.getElementById(palabraCortada.split(".png")[0]));
}

comenzarJuego();