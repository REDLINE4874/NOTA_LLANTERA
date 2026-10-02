// Inicialización al cargar la página
window.onload = function() {
  // Cargar fecha actual
  const hoy = new Date();
  document.getElementById('diaInput').value = String(hoy.getDate()).padStart(2, '0');
  document.getElementById('mesInput').value = String(hoy.getMonth() + 1).padStart(2, '0');
  document.getElementById('anioInput').value = hoy.getFullYear();

  // Generar 8 filas por defecto según la nota original
  for (let i = 0; i < 8; i++) {
    agregarFila();
  }
  calcularTotal();
};

// Agregar nueva fila a la tabla
function agregarFila() {
  const tbody = document.getElementById('tablaCuerpo');
  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td class="py-1 px-1 border-r-2 border-black text-center">
      <input type="number" min="0" oninput="calcularTotal()" class="cant-input w-full text-center font-bold focus:outline-none bg-transparent" placeholder="">
    </td>
    <td class="py-1 px-2 border-r-2 border-black">
      <input type="text" class="w-full font-medium focus:outline-none bg-transparent" placeholder="">
    </td>
    <td class="py-1 px-2 border-r-2 border-black">
      <input type="number" min="0" step="0.01" oninput="calcularTotal()" class="precio-input w-full text-right font-bold focus:outline-none bg-transparent" placeholder="">
    </td>
    <td class="py-1 px-2 text-right">
      <input type="text" readonly class="importe-input w-full text-right font-black text-black bg-transparent focus:outline-none" value="0.00">
    </td>
    <td class="py-1 px-0.5 text-center no-print">
      <button onclick="eliminarFila(this)" class="text-slate-400 hover:text-red-600 font-black text-sm p-0.5">✕</button>
    </td>
  `;

  tbody.appendChild(tr);
}

// Eliminar fila individual
function eliminarFila(btn) {
  const tbody = document.getElementById('tablaCuerpo');
  if (tbody.children.length > 1) {
    btn.closest('tr').remove();
    calcularTotal();
  }
}

function apocoparUno(texto) {
  return texto.replace(/VEINTIUNO$/, 'VEINTIÚN').replace(/ Y UNO$/, ' Y UN').replace(/UNO$/, 'UN');
}

function numeroEnLetras(numero) {
  const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const decenasEspeciales = {
    10: 'DIEZ', 11: 'ONCE', 12: 'DOCE', 13: 'TRECE', 14: 'CATORCE', 15: 'QUINCE',
    16: 'DIECISÉIS', 17: 'DIECISIETE', 18: 'DIECIOCHO', 19: 'DIECINUEVE',
    20: 'VEINTE', 21: 'VEINTIUNO', 22: 'VEINTIDÓS', 23: 'VEINTITRÉS', 24: 'VEINTICUATRO',
    25: 'VEINTICINCO', 26: 'VEINTISÉIS', 27: 'VEINTISIETE', 28: 'VEINTIOCHO', 29: 'VEINTINUEVE'
  };

  if (numero === 0) return 'CERO';
  if (numero >= 1000000000) {
    const milesDeMillones = Math.floor(numero / 1000000000);
    const resto = numero % 1000000000;
    const grupo = milesDeMillones === 1 ? 'MIL MILLONES' : `${apocoparUno(numeroEnLetras(milesDeMillones))} MIL MILLONES`;
    return [grupo, resto ? numeroEnLetras(resto) : ''].filter(Boolean).join(' ');
  }
  if (numero >= 1000000) {
    const millones = Math.floor(numero / 1000000);
    const resto = numero % 1000000;
    const grupo = millones === 1 ? 'UN MILLÓN' : `${apocoparUno(numeroEnLetras(millones))} MILLONES`;
    return [grupo, resto ? numeroEnLetras(resto) : ''].filter(Boolean).join(' ');
  }
  if (numero >= 1000) {
    const miles = Math.floor(numero / 1000);
    const resto = numero % 1000;
    const grupo = miles === 1 ? 'MIL' : `${apocoparUno(numeroEnLetras(miles))} MIL`;
    return [grupo, resto ? numeroEnLetras(resto) : ''].filter(Boolean).join(' ');
  }
  if (numero >= 100) {
    const centenas = ['CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];
    if (numero === 100) return 'CIEN';
    return `${centenas[Math.floor(numero / 100) - 1]}${numero % 100 ? ` ${numeroEnLetras(numero % 100)}` : ''}`;
  }
  if (numero < 10) return unidades[numero];
  if (numero < 30) return decenasEspeciales[numero];

  const decenas = ['VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const decena = decenas[Math.floor(numero / 10) - 2];
  return numero % 10 ? `${decena} Y ${unidades[numero % 10]}` : decena;
}

function importeEnLetras(importe) {
  const cantidadPesos = Math.floor(Number(importe.toFixed(2)));
  const moneda = cantidadPesos === 1 ? 'PESO' : 'PESOS';
  return `${apocoparUno(numeroEnLetras(cantidadPesos))} ${moneda}`;
}

// Cálculo automático de importes
function calcularTotal() {
  const filas = document.querySelectorAll('#tablaCuerpo tr');
  let total = 0;

  filas.forEach(fila => {
    const cant = parseFloat(fila.querySelector('.cant-input').value) || 0;
    const precio = parseFloat(fila.querySelector('.precio-input').value) || 0;
    const importe = cant * precio;

    fila.querySelector('.importe-input').value = importe > 0 ? importe.toFixed(2) : '0.00';
    total += importe;
  });

  const totalConImpuesto = total * 1.16;
  document.getElementById('subtotalGeneral').value = total.toFixed(2);
  document.getElementById('totalGeneral').value = totalConImpuesto.toFixed(2);
  document.getElementById('cantidadLetra').value = importeEnLetras(totalConImpuesto);
}

// Limpiar campos para nueva nota
function limpiarFormulario() {
  if (confirm('¿Deseas vaciar los campos de la nota?')) {
    document.querySelectorAll('input').forEach(input => {
      if (input.id !== 'diaInput' && input.id !== 'mesInput' && input.id !== 'anioInput') {
        input.value = '';
      }
    });
    document.querySelectorAll('.importe-input').forEach(i => i.value = '0.00');
    calcularTotal();
  }
}

// Disparar ventana de impresión o guardado en PDF
function imprimirNota() {
  window.print();
}

async function descargarFacturaComoImagen() {
  const boton = document.getElementById('descargarImagenBtn');
  const contenidoOriginal = boton.innerHTML;
  boton.disabled = true;
  boton.textContent = 'Generando...';

  try {
    await document.fonts.ready;
    const canvas = await html2canvas(document.querySelector('.print-container'), {
      scale: 2,
      backgroundColor: '#ffffff',
      ignoreElements: elemento => elemento.classList.contains('no-print'),
      onclone: documentoClonado => {
        const camposOriginales = [...document.querySelectorAll('.print-container input')];
        const camposClonados = [...documentoClonado.querySelectorAll('.print-container input')];
        const fechaOriginal = document.getElementById('diaInput').parentElement;
        const fechaClonada = documentoClonado.getElementById('diaInput').parentElement;
        const textoFecha = documentoClonado.createElement('span');
        textoFecha.textContent = [
          document.getElementById('diaInput').value,
          document.getElementById('mesInput').value,
          document.getElementById('anioInput').value
        ].join(' / ');
        textoFecha.style.display = 'flex';
        textoFecha.style.alignItems = 'center';
        textoFecha.style.justifyContent = 'center';
        textoFecha.style.width = '100%';
        textoFecha.style.minHeight = '28px';
        textoFecha.style.lineHeight = '1.5';
        textoFecha.style.color = '#000000';
        textoFecha.style.backgroundColor = '#ffffff';
        textoFecha.style.font = window.getComputedStyle(fechaOriginal).font;
        textoFecha.style.fontSize = '16px';
        textoFecha.style.fontWeight = '800';
        textoFecha.style.whiteSpace = 'nowrap';
        fechaClonada.replaceWith(textoFecha);

        camposOriginales.forEach((campoOriginal, indice) => {
          if (['diaInput', 'mesInput', 'anioInput'].includes(campoOriginal.id)) return;

          const campoClonado = camposClonados[indice];
          const estilos = window.getComputedStyle(campoOriginal);
          const texto = documentoClonado.createElement('span');
          texto.className = campoClonado.className;
          texto.textContent = campoOriginal.value;
          texto.style.display = 'inline-flex';
          texto.style.alignItems = 'center';
          texto.style.width = estilos.width;
          texto.style.height = estilos.height;
          texto.style.boxSizing = estilos.boxSizing;
          texto.style.padding = estilos.padding;
          texto.style.color = estilos.color;
          texto.style.backgroundColor = estilos.backgroundColor;
          texto.style.font = estilos.font;
          texto.style.fontWeight = estilos.fontWeight;
          texto.style.textAlign = estilos.textAlign;
          texto.style.textTransform = estilos.textTransform;
          texto.style.whiteSpace = campoOriginal.id === 'cantidadLetra' ? 'normal' : 'nowrap';
          texto.style.overflowWrap = campoOriginal.id === 'cantidadLetra' ? 'anywhere' : 'normal';
          texto.style.border = estilos.border;
          campoClonado.replaceWith(texto);
        });
      }
    });
    const enlace = document.createElement('a');
    const folio = document.getElementById('folioInput').value.trim().replace(/[^a-z0-9_-]/gi, '') || 'sin-folio';
    enlace.download = `nota-${folio}.png`;
    enlace.href = canvas.toDataURL('image/png');
    enlace.click();
  } catch (error) {
    console.error('No se pudo generar la imagen de la nota:', error);
    alert('No se pudo generar la imagen. Verifica tu conexión e inténtalo de nuevo.');
  } finally {
    boton.disabled = false;
    boton.innerHTML = contenidoOriginal;
  }
}