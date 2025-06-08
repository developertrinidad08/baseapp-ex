// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"
import topbar from "../vendor/topbar"


let Hooks = {};  






Hooks.TablaDinamica = {
  mounted() {
    const self = this;
    this.filtros = {};
    this.orden = null;
    this.pagina = 1;

    const rows = JSON.parse(this.el.dataset.rows || "[]");
    const columns = JSON.parse(this.el.dataset.columns || "[]");

    const colsConFiltros = columns.map(col => ({
      ...col,
      headerFilter: "input",
      headerFilterLiveFilter: true,
      //headerFilterFunc: function(value, row, filterParams) {
        //// 'col.field' es fijo para cada filtro
        //const field = col.field;

        //if (value && value.trim() !== "") {
          //self.filtros[field] = value.trim();
        //} else {
          //delete self.filtros[field];
        //}
        //self.pagina = 1;

        //// Enviamos evento a LiveView
        //self.pushEvent("aplicar_filtros", {
          //filtros: self.filtros,
          //orden: self.orden
        //});

        //// Este filtro interno para Tabulator no hace filtro real, siempre devuelve true
        //return true;
      //}
    }));

    this.table = new Tabulator(this.el, {
      data: rows,
      columns: colsConFiltros,
      layout: "fitColumns",
      pagination: false,
      movableColumns: true,
      initialSort: [],

      columnSorted: function(column, dir) {
        self.orden = dir ? { campo: column.getField(), direccion: dir } : null;
        self.pagina = 1;
        self.pushEvent("aplicar_filtros", {
          filtros: self.filtros,
          orden: self.orden
        });
      }
    });



    setTimeout(() => {
      const inputs = this.el.querySelectorAll(".tabulator-header input");

      inputs.forEach(input => {
        input.addEventListener("input", () => {
          const filtrosActuales = {};

          inputs.forEach(i => {
            const field = i.closest(".tabulator-col")?.getAttribute("tabulator-field");
            if (field !== null && field !== undefined) {
              filtrosActuales[field] = i.value.trim();
            }
          });

          console.log("Filtros actuales:", filtrosActuales);

        self.pushEvent("aplicar_filtros", {
          filtros: filtrosActuales,
          orden: self.orden
        });

          const todosVacios = Object.values(filtrosActuales).every(v => v === "");
          if (todosVacios) {
            console.log("Todos los filtros están vacíos");
            // Aquí podés hacer lo que quieras, ej:
            // this.pushEvent("filtros_vacios", {});
          }
        });
      });
    }, 200);
  },


  updated() {
  // Obtenemos los datos que vienen del backend
  const newData = JSON.parse(this.el.dataset.rows || "[]");


    const filters = this.table.getHeaderFilters();
    console.log(filters, "a ver ") 

   if (filters.length === 0) {
    console.log("No hay filtros activos");
   }



  // Si la data está vacía, no hacemos nada (evitamos que Tabulator se rompa)
  if (Array.isArray(newData) && newData.length === 0) {
    this.table.alert("No se encontraron resultados...");
    setTimeout(() => {
  this.table.clearAlert();
}, 2000)
    console.warn("alerta")

    return; // Salimos sin cambiar nada
  }

  // Si hay datos, reemplazamos los datos de la tabla
  if (this.table && typeof this.table.replaceData === "function") {
    this.table.replaceData(newData);
  } else {
    console.warn("No se pudo reemplazar los datos en Tabulator");
  }
},

  destroyed() {
    if(this.table) {
      this.table.destroy();
    }
  }
}





let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, {
  hooks: Hooks,
  longPollFallbackMs: 2500,
  params: {_csrf_token: csrfToken}
})

// Show progress bar on live navigation and form submits
topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
window.addEventListener("phx:page-loading-start", _info => topbar.show(300))
window.addEventListener("phx:page-loading-stop", _info => topbar.hide())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket

