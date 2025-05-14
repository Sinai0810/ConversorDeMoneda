async function obtenerDatos() {
    try {
        const respuesta = await fetch ('https://mindicador.cl/api/');
        const datos = await respuesta.json() ;
        return datos;

    }
    catch  (error){
        document.getElementById('result').textContent = 'Error al cargar los datos';
        console.error (error);

    }
}

async function convertirMoneda() {
    const datos = await obtenerDatos ();
    const montoCLP = Number (document.getElementById ('pesosInput').value);
    const moneda = document.getElementById ('monedaSelect').value;

    if (!datos || !datos[moneda]) return;

    const valorMoneda = datos[moneda].valor;
    const resultado = (montoCLP / valorMoneda).toFixed(2);

    document.getElementById('result').textContent =
    `Resultado: ${resultado} ${moneda.toUpperCase()}`;

    obtenerHistorial(moneda)
    
}

async function obtenerHistorial(moneda) {
    try {
        const respuesta =  await fetch(`https://mindicador.cl/api/${moneda}`)
        const datos = await respuesta.json ();
        const historial =  datos.serie.slice(0,10).reverse ();
        
        const labels = historial.map(item => item.fecha.split('T')[0])
        const valores = historial.map(item => item.valor);

    renderizarGrafico(labels, valores, moneda);
   } catch (error) {
  console.error('Error al obtener el historial:', error);
}

}

let grafico; 

function renderizarGrafico(fechas, valores, moneda) {
  const ctx = document.getElementById('grafico').getContext('2d');

  if (grafico) {
    grafico.destroy();
  }

  grafico = new Chart(ctx, {
    type: 'line',
    data: {
      labels: fechas,
      datasets: [{
        label: `Valor del ${moneda.toUpperCase()}`,
        data: valores,
        borderColor: 'blue',
        borderWidth: 2
      }]
    }
  });
}

document.getElementById('btn').addEventListener('click', convertirMoneda);

