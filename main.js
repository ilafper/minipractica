const { log } = require("console");
const fs = require("fs");
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});


function cargardatos() {
    try {
        let datos = fs.readFileSync('cartas.json'); // Lee los datos del archivo Eventos.json
        return JSON.parse(datos); // Devuelve los eventos parseados desde JSON a objetos JavaScript
    } catch (error) {
        console.error("Error al cargar los eventos:", error); // Manejo de errores en caso de fallo al leer el archivo
        return []; // Devuelve un array vacío en caso de error
    }
}

function leeMenu(question) {
    return new Promise((resolve) => {
        rl.question(question, (respuesta) => {
            resolve(respuesta);
        });
    });
}



async function menu() {
    let opcion = 0;

    while (opcion!== 3) {
        console.log("\nElige el tipo de fichero a trabajar");
        console.log("1. JSON");
        console.log("2. TXT");
        console.log("3. SALIR");

        opcion = parseInt(await leeMenu("Seleccione opción:"));

        switch (opcion) {
            case 1:
                    await menuJSON();
                break;
            case 2:
               
                break;
            case 3:
               console.log("Saliendo del menú");
                rl.close(); // Corrección aquí
                break;
            default:
                console.log("Opción no válida");
                break;
        }
    }
}
menu();

async function menuJSON() {
    let opcion = 0;
    let datosCarta= await cargardatos();
    while (opcion!== 5) {
        console.log("\n MENU DE JSON");
        console.log("1. Crear carta nueva");
        console.log("2. Borrar carta nueva");
        console.log("3. Mostrar las cartas");
        console.log("4. Modificar");
        console.log("5. Salir");

        opcion = parseInt(await leeMenu("Seleccione opción:"));

        switch (opcion) {
            case 1:
              
                for (let i = 0; i < datosCarta.length; i++) {
                   
                }
                console.log("Rellena los campos para crear la nueva carta");
                
                let nuevoNombre=await leeMenu("Nuevo nombre:");
                let nuevaDesc=await leeMenu("Nueva descripcion:");
                let nuevaRareza=await leeMenu("Nuevo rareza:");
                let nuevoId=datosCarta.length + 1;
               
                
                let nuevaCarta={
                    "id":nuevoId,
                    "nombre":nuevoNombre,
                    "descripcion":nuevaDesc,
                    "rareza":nuevaRareza

                }
                console.log(nuevaCarta);
                
                datosCarta.push(nuevaCarta);
                break;
            case 2:
                console.log("Lista de cartas a eliminar");
                for (let i = 0; i < datosCarta.length; i++) {
                    console.log(datosCarta[i].id +" "+ datosCarta[i].nombre );
                    
                    
                }

                let cartaSeleccionada=await leeMenu("Selecciona la carta a borrar: ");
                let cartaEliminar = datosCarta[cartaSeleccionada - 1];
                console.log("HAS SELECCIONADO ESTA CARTA:");
                console.log(cartaEliminar);
                
                
                datosCarta.splice(cartaEliminar ,1);
                break;
            case 3:
               
                for (let i = 0; i < datosCarta.length; i++) {
                   
                    console.log("id: "+ datosCarta[i].id + "-->" +"Nombre: "+ datosCarta[i].nombre+"-->"+"Descripcion: " + datosCarta[i].descripcion+ "-->" +"Rareza: "+ datosCarta[i].rareza);
                
                }
                break;
            case 4:
                console.log("Selecciona la carta a modificar: ");
                
                for (let i = 0; i < datosCarta.length; i++) {
                
                   console.log(datosCarta[i].id +" "+ datosCarta[i].nombre);
                   
                    
                }

                let digiModificar=await leeMenu("Selecciona la carta a modificar: ");
                let degi = datosCarta[digiModificar - 1];
                console.log(degi);
                
                await modificarJson(degi,datosCarta);
                break;
            case 5:
                console.log("Saliendo del menú");
                rl.close(); // Corrección aquí
                break;
              
            default:
                console.log("Opción no válida");
                break;
        }
    }
}




async function modificarJson(degi,datosCarta) {
    let opcion = 0;

    while (opcion!== 3) {
        console.log("\n Elige el campo a modificar");
        console.log("1. Nombre");
        console.log("2. Descripcion");
        console.log("3. Rareza");
        console.log("4. Atras");
        

        opcion = parseInt(await leeMenu("Seleccione opción:"));

        switch (opcion) {
            case 1:
                let nombreActual=degi.nombre;
                console.log(nombreActual);
                
                let nombreModificar= await leeMenu("Escribe el nuevo nombre: ");
                console.log(nombreModificar);
                
                let digimonActualizar = datosCarta.find(digimon => digimon.id === degi.id);
                if (digimonActualizar) {
                digimonActualizar.nombre = nombreModificar;
                }


                console.log("Carta actualizada:");
                console.log(datosCarta);
                
                
                break;
            case 2:
               
                break;
            case 3:
               

            case 4:
                await menuJSON();
                break;
            default:
                console.log("Opción no válida");
                break;
        }
    }
}
