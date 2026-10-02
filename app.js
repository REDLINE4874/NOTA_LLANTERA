// Inicialización al cargar la página
window.onload = function () {
  const hoy = new Date();
  document.getElementById("diaInput").value = String(hoy.getDate()).padStart(
    2,
    "0",
  );
  document.getElementById("mesInput").value = String(
    hoy.getMonth() + 1,
  ).padStart(2, "0");
  document.getElementById("anioInput").value = hoy.getFullYear();

  for (let i = 0; i < 8; i++) {
    agregarFila();
  }
  calcularTotal();
};

// Agregar nueva fila a la tabla con elementos centrados
function agregarFila() {
  const tbody = document.getElementById('tablaCuerpo');
  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td class="py-1 px-1 border-r-2 border-black text-center">
      <input type="number" min="0" oninput="calcularTotal()" class="cant-input w-full text-center font-bold focus:outline-none bg-transparent" placeholder="">
    </td>
    <td class="py-1 px-2 border-r-2 border-black text-center">
      <input type="text" class="w-full text-center font-medium focus:outline-none bg-transparent" placeholder="">
    </td>
    <td class="py-1 px-2 border-r-2 border-black text-center">
      <input type="number" min="0" step="0.01" oninput="calcularTotal()" class="precio-input w-full text-center font-bold focus:outline-none bg-transparent" placeholder="">
    </td>
    <td class="py-1 px-2 text-center">
      <input type="text" readonly class="importe-input w-full text-center font-black text-black bg-transparent focus:outline-none" value="0.00">
    </td>
    <td class="py-1 px-0.5 text-center no-print">
      <button onclick="eliminarFila(this)" class="text-slate-400 hover:text-red-600 font-black text-sm p-0.5">✕</button>
    </td>
  `;

  tbody.appendChild(tr);
}

// Eliminar fila individual
function eliminarFila(btn) {
  const tbody = document.getElementById("tablaCuerpo");
  if (tbody.children.length > 1) {
    btn.closest("tr").remove();
    calcularTotal();
  }
}

function apocoparUno(texto) {
  return texto
    .replace(/VEINTIUNO$/, "VEINTIÚN")
    .replace(/ Y UNO$/, " Y UN")
    .replace(/UNO$/, "UN");
}

function numeroEnLetras(numero) {
  const unidades = [
    "",
    "UNO",
    "DOS",
    "TRES",
    "CUATRO",
    "CINCO",
    "SEIS",
    "SIETE",
    "OCHO",
    "NUEVE",
  ];
  const decenasEspeciales = {
    10: "DIEZ",
    11: "ONCE",
    12: "DOCE",
    13: "TRECE",
    14: "CATORCE",
    15: "QUINCE",
    16: "DIECISÉIS",
    17: "DIECISIETE",
    18: "DIECIOCHO",
    19: "DIECINUEVE",
    20: "VEINTE",
    21: "VEINTIUNO",
    22: "VEINTIDÓS",
    23: "VEINTITRÉS",
    24: "VEINTICUATRO",
    25: "VEINTICINCO",
    26: "VEINTISÉIS",
    27: "VEINTISIETE",
    28: "VEINTIOCHO",
    29: "VEINTINUEVE",
  };

  if (numero === 0) return "CERO";
  if (numero >= 1000000000) {
    const milesDeMillones = Math.floor(numero / 1000000000);
    const resto = numero % 1000000000;
    const grupo =
      milesDeMillones === 1
        ? "MIL MILLONES"
        : `${apocoparUno(numeroEnLetras(milesDeMillones))} MIL MILLONES`;
    return [grupo, resto ? numeroEnLetras(resto) : ""]
      .filter(Boolean)
      .join(" ");
  }
  if (numero >= 1000000) {
    const millones = Math.floor(numero / 1000000);
    const resto = numero % 1000000;
    const grupo =
      millones === 1
        ? "UN MILLÓN"
        : `${apocoparUno(numeroEnLetras(millones))} MILLONES`;
    return [grupo, resto ? numeroEnLetras(resto) : ""]
      .filter(Boolean)
      .join(" ");
  }
  if (numero >= 1000) {
    const miles = Math.floor(numero / 1000);
    const resto = numero % 1000;
    const grupo =
      miles === 1 ? "MIL" : `${apocoparUno(numeroEnLetras(miles))} MIL`;
    return [grupo, resto ? numeroEnLetras(resto) : ""]
      .filter(Boolean)
      .join(" ");
  }
  if (numero >= 100) {
    const centenas = [
      "CIENTO",
      "DOSCIENTOS",
      "TRESCIENTOS",
      "CUATROCIENTOS",
      "QUINIENTOS",
      "SEISCIENTOS",
      "SETECIENTOS",
      "OCHOCIENTOS",
      "NOVECIENTOS",
    ];
    if (numero === 100) return "CIEN";
    return `${centenas[Math.floor(numero / 100) - 1]}${numero % 100 ? ` ${numeroEnLetras(numero % 100)}` : ""}`;
  }
  if (numero < 10) return unidades[numero];
  if (numero < 30) return decenasEspeciales[numero];

  const decenas = [
    "VEINTE",
    "TREINTA",
    "CUARENTA",
    "CINCUENTA",
    "SESENTA",
    "SETENTA",
    "OCHENTA",
    "NOVENTA",
  ];
  const decena = decenas[Math.floor(numero / 10) - 2];
  return numero % 10 ? `${decena} Y ${unidades[numero % 10]}` : decena;
}

function importeEnLetras(importe) {
  const cantidadPesos = Math.floor(Number(importe.toFixed(2)));
  const moneda = cantidadPesos === 1 ? "PESO" : "PESOS";
  return `${apocoparUno(numeroEnLetras(cantidadPesos))} ${moneda}`;
}

// Cálculo automático de importes
function calcularTotal() {
  const filas = document.querySelectorAll("#tablaCuerpo tr");
  let total = 0;

  filas.forEach((fila) => {
    const cant = parseFloat(fila.querySelector(".cant-input").value) || 0;
    const precio = parseFloat(fila.querySelector(".precio-input").value) || 0;
    const importe = cant * precio;

    fila.querySelector(".importe-input").value =
      importe > 0 ? importe.toFixed(2) : "0.00";
    total += importe;
  });

  const totalConImpuesto = total * 1.16;
  document.getElementById("subtotalGeneral").value = total.toFixed(2);
  document.getElementById("totalGeneral").value = totalConImpuesto.toFixed(2);
  document.getElementById("cantidadLetra").value =
    importeEnLetras(totalConImpuesto);
}

// Limpiar campos para nueva nota
function limpiarFormulario() {
  if (confirm("¿Deseas vaciar los campos de la nota?")) {
    document.querySelectorAll("input").forEach((input) => {
      if (
        input.id !== "diaInput" &&
        input.id !== "mesInput" &&
        input.id !== "anioInput" &&
        input.type !== "file"
      ) {
        input.value = "";
      }
    });

    // Limpiar imagen de la firma si existe
    const imgFirma = document.getElementById("imgFirma");
    if (imgFirma) {
      imgFirma.src = "";
      imgFirma.style.display = "none";
    }
    const inputArchivo = document.getElementById("inputArchivoFirma");
    if (inputArchivo) inputArchivo.value = "";

    document
      .querySelectorAll(".importe-input")
      .forEach((i) => (i.value = "0.00"));
    calcularTotal();
  }
}

// Cargar imagen de la firma desde archivo local
function cargarFirmaDesdeArchivo(evento) {
  const archivo = evento.target.files[0];
  if (!archivo) return;

  const lector = new FileReader();
  lector.onload = function (e) {
    const imgFirma = document.getElementById("imgFirma");
    if (imgFirma) {
      imgFirma.src = e.target.result;
      imgFirma.style.display = "block";
    }
  };
  lector.readAsDataURL(archivo);
}

// Disparar ventana de impresión o guardado en PDF
function imprimirNota() {
  window.print();
}

// Generar y descargar el ticket en formato de imagen PNG
async function generarTicketImagen(btn) {
  const ticket = document.getElementById("ticketContainer");
  if (!ticket) return;

  const textoOriginal = btn ? btn.innerHTML : "";
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      Generando...
    `;
  }

  try {
    const canvas = await html2canvas(ticket, {
      scale: 3, // Alta definición
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      scrollY: -window.scrollY,
      scrollX: -window.scrollX,
      onclone: (docClonado) => {
        const ticketClonado = docClonado.getElementById("ticketContainer");

        // Eliminar elementos no imprimibles
        docClonado.querySelectorAll(".no-print").forEach((el) => el.remove());

        // Forzar Arial en el clon para resolver bugs de renderizado de la fuente web
        ticketClonado.style.fontFamily = "Arial, Helvetica, sans-serif";

        // Solo procesar inputs visibles dentro del ticket (ignorar file u otros)
        const inputsOriginales = ticket.querySelectorAll(
          'input:not([type="file"])',
        );
        const inputsClonados = ticketClonado.querySelectorAll(
          'input:not([type="file"])',
        );

        inputsClonados.forEach((inputClon, index) => {
          const inputOrig = inputsOriginales[index];
          let valor = inputOrig ? inputOrig.value : inputClon.value;

          // Si el renglón está vacío, no mostrar '0.00'
          const fila = inputClon.closest("tr");
          if (fila) {
            const cant = fila.querySelector(".cant-input")?.value;
            const desc = fila.querySelectorAll("input")[1]?.value;
            if (
              !cant &&
              !desc &&
              inputClon.classList.contains("importe-input")
            ) {
              valor = "";
            }
          }

          const div = docClonado.createElement("div");
          div.className = inputClon.className;
          div.textContent = valor || "";

          // Dimensiones de texto estables para evitar recortes
          div.style.minHeight = "1.35rem";
          div.style.lineHeight = "1.35rem";
          div.style.paddingTop = "1px";
          div.style.paddingBottom = "1px";
          div.style.display = "block";
          div.style.width = "100%";
          div.style.boxSizing = "border-box";
          div.style.fontFamily = "Arial, Helvetica, sans-serif";

          if (
            inputClon.classList.contains("date-input") ||
            inputClon.classList.contains("border-b")
          ) {
            div.style.borderBottom = "1.5px solid black";
          }

          inputClon.replaceWith(div);
        });
      },
    });

    const folio =
      document.getElementById("folioInput")?.value?.trim() || "ticket";
    const link = document.createElement("a");
    link.download = `Ticket_${folio}.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  } catch (error) {
    console.error("Error al generar la imagen:", error);
    alert("Ocurrió un error al generar la imagen del ticket.");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = textoOriginal;
    }
  }
}
