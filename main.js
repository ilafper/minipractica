
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






function leerTxt() {
  try {
    const data = fs.readFileSync("cartas.txt", "utf-8");

    // Dividir en bloques por doble salto de línea
    // Normalizar saltos de línea (Windows o Linux)
    const normalizado = data.replace(/\r\n/g, "\n").trim();

    // Dividir en bloques por línea vacía
    const bloques = normalizado.split(/\n\s*\n/);

    const cartasLeidas = bloques.map(bloque => {
      const lineas = bloque.split("\n");
      const carta = {};
      lineas.forEach(linea => {
        const partes = linea.split(":");
        if (partes.length >= 2) {
          const clave = partes[0].trim();
          const valor = partes.slice(1).join(":").trim(); // soporta ":" en valores
          carta[clave] = valor;
        }
      });
      return carta;
    });

    return cartasLeidas;
  } catch (err) {
    console.error("Error al leer el archivo:", err.message);
    return [];
  }
}

function escribirTXT(carta) {
  try {
    // Construir el texto de la carta
    const contenido = 
      `id:${carta.id}\n` +
      `nombre:${carta.nombre}\n` +
      `descripcion:${carta.descripcion}\n` +
      `rareza:${carta.rareza}\n\n`;

    // Añadir al archivo sin borrar lo que ya hay
    fs.appendFileSync("cartas.txt", contenido, "utf-8");


    console.log(`Carta "${carta.nombre}" guardada `);
  } catch (err) {
    console.error("Error al guardar la carta:", err.message);
  }
}

function borrarCartaPorId(idABorrar) {
  const fs = require("fs");
  try {
    const data = fs.readFileSync("cartas.txt", "utf-8").replace(/\r\n/g, "\n").trim();
    const bloques = data.split(/\n\s*\n/);

    const cartasFiltradas = bloques.filter(bloque => {
      const lineas = bloque.split("\n");
      for (let linea of lineas) {
        const partes = linea.split(":");
        if (partes.length >= 2 && partes[0].trim() === "id" && partes[1].trim() === String(idABorrar)) {
          return false; // borrar esta carta
        }
      }
      return true; // conservar
    });

    fs.writeFileSync("cartas.txt", cartasFiltradas.join("\n\n") + "\n\n", "utf-8");
    console.log(`Carta con id=${idABorrar} eliminada ✅`);
  } catch (err) {
    console.error("Error al borrar la carta:", err.message);
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
               await menuTXT();
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
                rl.close();
                break;
              
            default:
                console.log("Opción no válida");
                break;
        }
    }
}


async function menuTXT() {
    let opcion = 0;
    while (opcion!== 5) {
       console.log("\n MENU DE TXT");
        console.log("1. Crear carta nueva");
        console.log("2. Borrar carta nueva");
        console.log("3. Mostrar las cartas");
        console.log("4. Modificar");
        console.log("5. Salir");


        opcion = parseInt(await leeMenu("Seleccione opción:"));

        switch (opcion) {
            case 1:
                    const cart = leerTxt();
                    let idTXT= cart.length +1;
                    let nuevoNombreTXT = await leeMenu("Escriba el nuevo nombre: ");
                    let nuevaDesTXT = await leeMenu("Escriba el nuevo nombre: ");
                    let nuevaRarezaTXT = await leeMenu("Escriba el nuevo nombre: ");
                    

                    let nuevoTXT={
                        "id":idTXT,
                        "nombre":nuevoNombreTXT,
                        "descripcion":nuevaDesTXT,
                        "rareza":nuevaRarezaTXT
                    }


                    escribirTXT(nuevoTXT);

                
                break;
            case 2:
                    let cartborar = leerTxt();
                    console.log("holi");
                    
                    for (let i = 0; i < cartborar.length; i++) {
                        console.log( cartborar[i].id +" "+ cartborar[i].nombre);
                        
                        
                    }

                    let cartaAborrarTXT=await leeMenu("Seleccione carta a borrar ");
                    console.log("id a borrar: "+ cartaAborrarTXT);
                    
                    borrarCartaPorId(cartaAborrarTXT);
                    

                    
                break;
            case 3:
               const cart2 = leerTxt();
                console.log(cart2);
               
                break;
            case 4:

                
                break;
            case 5:
                console.log("Saliendo del menú");
                rl.close(); 
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
               
                fs.writeFileSync('C:/Users/ialfper/Desktop/minipractica/cartas.json', JSON.stringify(datosCarta), 'utf-8');
                
                break;
            case 2:
               let descripcionActual=degi.descripcion;
                console.log(descripcionActual);
                
                let descModificar= await leeMenu("Escribe la  descripcion nombre: ");
                console.log(descModificar);
                
                let digimonActualizar2 = datosCarta.find(digimon => digimon.id === degi.id);
                if (digimonActualizar2) {
                digimonActualizar2.descripcion = descModificar;
                }


                console.log("Carta actualizada:");
                console.log(datosCarta);


               
                fs.writeFileSync('C:/Users/ialfper/Desktop/minipractica/cartas.json', JSON.stringify(datosCarta), 'utf-8');
                break;
            case 3:

               let rareActual=degi.rareza;
                console.log(rareActual);
                
                let rareModificar= await leeMenu("Escribe la nueva raeza: ");
                console.log(descModificar);
                
                let digimonActualizar3 = datosCarta.find(digimon => digimon.id === degi.id);
                if (digimonActualizar3) {
                digimonActualizar3.rareza = rareModificar;
                }



                console.log("Carta actualizada:");
                console.log(datosCarta);
               
                fs.writeFileSync('C:/Users/ialfper/Desktop/minipractica/cartas.json', JSON.stringify(datosCarta), 'utf-8');
                break;

            case 4:
                await menuJSON();
                break;
            default:
                console.log("Opción no válida");
                break;
        }
    }
}
