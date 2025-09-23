const mysql = require('mysql2/promise'); // Importamos la versión con promesas

// Función que carga los datos y devuelve una promesa


async function cargar() {

  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'digimon'
    });

    const [rows] = await connection.query('SELECT * FROM bichos');
    await connection.end();

    return rows; // Devuelve los datos como array
  } catch (err) {
    console.error('❌ Error al cargar bichos:', err);
    return [];
  }
}

// Usar la función con async/await

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

async function guardarBicho(nombre, descripcion, rareza) {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'digimon'
    });

    // Sentencia INSERT con parámetros para evitar inyección SQL
    const sql = 'INSERT INTO bichos (nombre, descripcion, rareza) VALUES (?, ?, ?)';
    const [result] = await connection.execute(sql, [nombre, descripcion, rareza]);

    console.log(`Bicho guardado corrextamente`);
    await connection.end();
  } catch (err) {
    console.error('❌ Error al guardar bicho:', err);
  }
}

async function borrarBicho(codigo) {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'digimon'
    });

    // DELETE con placeholder para evitar inyección SQL
    const sql = 'DELETE FROM bichos WHERE id = ?';

    const [result] = await connection.execute(sql, [codigo]);

    console.log(`Bicho con id ${codigo} borrado correctamente.`);
    await connection.end();
  } catch (err) {
    console.error('❌ Error al borrar bicho:', err);
  }
}

async function menu() {
  let opcion = 0;
  while (opcion !== 4) {
    console.log("\nElige el tipo de fichero a trabajar");
    console.log("1. JSON");
    console.log("2. TXT");
    console.log("3. sql");
    console.log("4. SALIR");

    opcion = parseInt(await leeMenu("Seleccione opción:"));

    switch (opcion) {
      case 1:

        await menuJSON();
        break;
      case 2:
        await menuTXT();
        break;
      case 3:
        await menuSQL();
        break;
      case 4:
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
  let datosCarta = await cargardatos();
  while (opcion !== 5) {
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

        let nuevoNombre = await leeMenu("Nuevo nombre:");
        let nuevaDesc = await leeMenu("Nueva descripcion:");
        let nuevaRareza = await leeMenu("Nuevo rareza:");
        let nuevoId = datosCarta.length + 1;


        let nuevaCarta = {
          "id": nuevoId,
          "nombre": nuevoNombre,
          "descripcion": nuevaDesc,
          "rareza": nuevaRareza

        }
        console.log(nuevaCarta);

        datosCarta.push(nuevaCarta);
        break;
      case 2:
        console.log("Lista de cartas a eliminar");
        for (let i = 0; i < datosCarta.length; i++) {
          console.log(datosCarta[i].id + " " + datosCarta[i].nombre);


        }

        let cartaSeleccionada = await leeMenu("Selecciona la carta a borrar: ");
        let cartaEliminar = datosCarta[cartaSeleccionada - 1];
        console.log("HAS SELECCIONADO ESTA CARTA:");
        console.log(cartaEliminar);


        datosCarta.splice(cartaEliminar, 1);
        break;
      case 3:

        for (let i = 0; i < datosCarta.length; i++) {

          console.log("id: " + datosCarta[i].id + "-->" + "Nombre: " + datosCarta[i].nombre + "-->" + "Descripcion: " + datosCarta[i].descripcion + "-->" + "Rareza: " + datosCarta[i].rareza);

        }
        break;
      case 4:
        console.log("Selecciona la carta a modificar: ");

        for (let i = 0; i < datosCarta.length; i++) {

          console.log(datosCarta[i].id + " " + datosCarta[i].nombre);


        }

        let digiModificar = await leeMenu("Selecciona la carta a modificar: ");
        let degi = datosCarta[digiModificar - 1];
        console.log(degi);

        await modificarJson(degi, datosCarta);
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
  while (opcion !== 5) {
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
        let idTXT = cart.length + 1;
        let nuevoNombreTXT = await leeMenu("Escriba el nuevo nombre: ");
        let nuevaDesTXT = await leeMenu("Escriba el nuevo nombre: ");
        let nuevaRarezaTXT = await leeMenu("Escriba el nuevo nombre: ");


        let nuevoTXT = {
          "id": idTXT,
          "nombre": nuevoNombreTXT,
          "descripcion": nuevaDesTXT,
          "rareza": nuevaRarezaTXT
        }


        escribirTXT(nuevoTXT);


        break;
      case 2:
        let cartborar = leerTxt();
        console.log("holi");

        for (let i = 0; i < cartborar.length; i++) {
          console.log(cartborar[i].id + " " + cartborar[i].nombre);


        }

        let cartaAborrarTXT = await leeMenu("Seleccione carta a borrar ");
        console.log("id a borrar: " + cartaAborrarTXT);

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

async function modificarJson(degi, datosCarta) {
  let opcion = 0;

  while (opcion !== 3) {
    console.log("\n Elige el campo a modificar");
    console.log("1. Nombre");
    console.log("2. Descripcion");
    console.log("3. Rareza");
    console.log("4. Atras");


    opcion = parseInt(await leeMenu("Seleccione opción:"));

    switch (opcion) {
      case 1:
        let nombreActual = degi.nombre;
        console.log(nombreActual);

        let nombreModificar = await leeMenu("Escribe el nuevo nombre: ");
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
        let descripcionActual = degi.descripcion;
        console.log(descripcionActual);

        let descModificar = await leeMenu("Escribe la  descripcion nombre: ");
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

        let rareActual = degi.rareza;
        console.log(rareActual);

        let rareModificar = await leeMenu("Escribe la nueva raeza: ");
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

async function menuSQL() {
  let opcion = 0;
  while (opcion !== 5) {
    console.log("\n MENU DE SQL");
    console.log("1. Crear carta nueva");
    console.log("2. Borrar carta nueva");
    console.log("3. Mostrar las cartas");
    console.log("4. Modificar");
    console.log("5. Salir");


    opcion = parseInt(await leeMenu("Seleccione opción:"));

    switch (opcion) {
      case 1:

        let nuevoNombre = await leeMenu("Nuevo nombre:");
        let nuevadescc = await leeMenu("Nueva descripcion:");
        let nuevaRareza = await leeMenu("Nuevo rareza:");


        let nuevoBicho = {
          "nombre": nuevoNombre,
          "descripcion": nuevadescc,
          "rareza": nuevaRareza

        }

        console.log("Tu nuevo digimon");
        console.log(nuevoBicho);
        ;

        guardarBicho(nuevoNombre, nuevadescc, nuevaRareza);


        break;
      case 2:
        console.log("Todos los digimons a borrar: ");
        let bichos2 = await cargar();
        for (let i = 0; i < bichos2.length; i++) {

          console.log("id: " + bichos2[i].id + "-->" + "Nombre: " + bichos2[i].nombre);

        }
        let digimonSeleccionado = await leeMenu("Selecciona el digimon a borrar: ");

        borrarBicho(digimonSeleccionado);


        break;
      case 3:

        let bichos = await cargar();

        console.log("LISTA DE DIGIMONS");

        for (let i = 0; i < bichos.length; i++) {

          console.log("id: " + bichos[i].id + "-->" + "Nombre: " + bichos[i].nombre + "-->" + "Descripcion: " + bichos[i].descripcion + "-->" + "Rareza: " + bichos[i].rareza);

        }

        break;
      case 4:
        console.log("\nEscoge para modificar:");
        let bichos3 = await cargar();


        for (let i = 0; i < bichos3.length; i++) {

          console.log(bichos3[i].id + "-->" + "Nombre: " + bichos3[i].nombre + "-->" + "Descripcion: " + bichos3[i].descripcion + "-->" + "Rareza: " + bichos3[i].rareza);

        }

        let digiModificar2 = await leeMenu("Selecciona la carta a modificar: ");
        // Busca el objeto correspondiente
        let digimonSeleccionadoObj = bichos3.find(d => d.id == digiModificar2);
        console.log(digimonSeleccionadoObj);



        await modificarSQL(digimonSeleccionadoObj);

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

//funcion para modificar el nombre.




async function modificarNombre(id, nuevoValor) {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'digimon'
    });

    // DELETE con placeholder para evitar inyección SQL
    const sql = `UPDATE bichos SET nombre = ? WHERE id = ?`;
    const [result] = await connection.execute(sql, [nuevoValor, id]);

   if (result.affectedRows > 0) {
      console.log(`Carta con id ${id} modificada. Nuevo nombre: ${nuevoValor}`);
    } else {
      console.log("No se encontró la carta con ese ID.");
    }
  } catch (err) {
    console.error('Error al borrar bicho:', err);
  }
}

async function modificarDescripcion(id, nuevoValor) {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'digimon'
    });

    // DELETE con placeholder para evitar inyección SQL
    const sql = `UPDATE bichos SET descripcion = ? WHERE id = ?`;
    const [result] = await connection.execute(sql, [nuevoValor, id]);

   if (result.affectedRows > 0) {
      console.log(`Carta con id ${id} modificada. Nueva desc: ${nuevoValor}`);
    } else {
      console.log("No se encontró la carta con ese ID.");
    }
  } catch (err) {
    console.error('Error al borrar digimon:', err);
  }
}

async function modificarRareza(id, nuevoValor) {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'digimon'
    });

    // DELETE con placeholder para evitar inyección SQL
    const sql = `UPDATE bichos SET rareza = ? WHERE id = ?`;
    const [result] = await connection.execute(sql, [nuevoValor, id]);

   if (result.affectedRows > 0) {
      console.log(`Carta con id ${id} modificada. Nueva rareza: ${nuevoValor}`);
    } else {
      console.log("No se encontró la carta con ese ID.");
    }
  } catch (err) {
    console.error('Error al borrar digimon:', err);
  }
}


async function modificarSQL(digimon) {
  let opcion = 0;

  while (opcion !== 4) {
    console.log("\n Elige el campo a modificar");
    console.log("1. Nombre");
    console.log("2. Descripcion");
    console.log("3. Rareza");
    console.log("4. Atras");


    opcion = parseInt(await leeMenu("Seleccione opción:"));

    switch (opcion) {
      case 1:
        console.log("Nombre actual: " + digimon.nombre);
        let nombreModificar = await leeMenu("Escribe el nuevo nombre: ");
        let id= digimon.id;
        digimon.nombre = nombreModificar;
        console.log("Carta actualizada: ", digimon);
        await modificarNombre(id,nombreModificar);
        break;
      case 2:
        console.log("Desc actual: " + digimon.descripcion);
        let descModificar = await leeMenu("Escribe la nueva decripcion: ");
        let idd= digimon.id;
        digimon.nombre = descModificar;
        console.log("Carta actualizada: ", digimon);
        await modificarDescripcion(idd,descModificar);


        break;
      case 3:
      console.log("Rareza actual: " + digimon.rareza);
        let rareModificar = await leeMenu("Escribe la nueva rareza: ");
        let iddd= digimon.id;
        digimon.nombre = rareModificar;
        console.log("Carta actualizada: ", digimon);
        await modificarRareza(iddd,rareModificar);

        break;
        

      case 4:
        await menuSQL();
        break;
      default:
        console.log("Opción no válida");
        break;
    }
  }
}
