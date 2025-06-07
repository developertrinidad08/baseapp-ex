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
    
const colsConFiltros = columns.map(col => {
  const field = col.field; // ✅ fijamos el field acá para el closure

  return {
    ...col,
    headerFilter: "input",
    headerFilterLiveFilter: false,
headerFilterFunc: function(value) {
   console.log(value, "-----> que hay en value")
  const limpio = (value || "").trim();

  if (limpio !== "") {
    console.log(limpio, "antes")
    self.filtros[field] = limpio;

    console.log(limpio, "despues")
  } else {
    console.log("se borro")
    delete self.filtros[field];
  }

  const filtrosLimpios = Object.fromEntries(
    Object.entries(self.filtros).filter(
      ([_, val]) => val != null && val.toString().trim() !== ""
    )
  );
  console.log(filtrosLimpios, "filtros limpios")

  self.pagina = 1;

  self.pushEvent("aplicar_filtros", {
    filtros: filtrosLimpios,
    orden: self.orden
  });

  return true; // Para que el frontend no bloquee el cambio
}
    //headerFilterFunc: function(value) {
      //console.log("Filtrando campo:", field, "con valor:", value);

      //if (value && value.trim() !== "") {
        //self.filtros[field] = value.trim();
      //} else {
        //delete self.filtros[field];
      //}

      //self.pagina = 1; // reset página

      //self.pushEvent("aplicar_filtros", {
        //filtros: self.filtros,
        //orden: self.orden
      //});

      //// Por si querés filtrado interno básico también
      //return !value || String(value).toLowerCase().includes(value.toLowerCase());
    //}
  };
});

    //const colsConFiltros = columns.map(col => ({

      //...col,
      //headerFilter: "input",
      //headerFilterLiveFilter: false,
      //headerFilterFunc: function(value) {
        
      //const field = col.field;  // guardo el field fuera
        //console.log(field, "-----> field")
        //console.log(value, "-----> field")

         //if (value && value.trim() !== "") {
    //self.filtros[field] = value.trim();
  //} else {
    //delete self.filtros[field];
  //}
        
////      self.filtros[field] = value || "";
      //self.pagina = 1; // reset pagina

      //self.pushEvent("aplicar_filtros", {
        //filtros: self.filtros,
        //orden: self.orden
      //});

      //// Aquí retornamos true o false para filtrar en frontend si querés
      //if (!value) return true;
      //// por ejemplo filtrado básico:
      //return String(value).toLowerCase().includes(value.toLowerCase());
    //} 
        ////headerFilterFunc: (function(field) {
    ////return function(value) {
      ////if (value && value.trim() !== "") {
        ////self.filtros[field] = value.trim();
      ////} else {
        ////delete self.filtros[field];
      ////}
      ////self.pagina = 1; // reset página
      ////self.pushEvent("aplicar_filtros", {
        ////filtros: self.filtros,
        ////orden: self.orden
      ////});
    ////}
  ////})(col.field)

    //}));



    this.table = new Tabulator(this.el, {
      data: rows,
      columns: colsConFiltros,
      layout: "fitColumns",
      pagination: false, // Desactivamos paginación interna
      movableColumns: true,
      initialSort: [],

      // Orden remoto manual
      columnSorted: function(column, dir) {
        self.orden = dir ? { campo: column.getField(), direccion: dir } : null;
        self.pagina = 1;
        self.pushEvent("aplicar_filtros", {
          filtros: self.filtros,
          orden: self.orden
        });
      }
    });

    this.table.on("headerFilterChanged", (filters) => {
  // Aquí armás un objeto con los filtros para mandar a LiveView
  let filtroObj = {};
  filters.forEach(filtro => {
    filtroObj[filtro.field] = filtro.value;
  });
  self.filtros = filtroObj;
  self.pushEvent("aplicar_filtros", self.filtros);
});


  },


  updated() {
  const newData = JSON.parse(this.el.dataset.rows || "[]");

  if (this.table && typeof this.table.replaceData === "function") {
    const currentFilters = this.table.getHeaderFilters(); // guardamos los filtros actuales

    this.table.replaceData(newData).then(() => {
      // 👇 Si no hay datos, Tabulator no vuelve a aplicar los filtros automáticamente.
      // Entonces los volvemos a aplicar manualmente.
      if (currentFilters.length > 0) {
        this.table.clearHeaderFilter(true); // limpia sin emitir eventos
        currentFilters.forEach(({ field, value }) => {
          this.table.setHeaderFilterValue(field, value); // reaplica cada filtro
        });
      }

      // 🔁 Si la tabla queda vacía, forzamos un re-render para asegurar que los filtros siguen vivos.
      if (newData.length === 0) {
        this.table.redraw(true); // forzar re-render de headers y celdas
      }
    });
  } else {
    console.warn("No se pudo reemplazar los datos en Tabulator");
  }
},


//updated() {
//const newData = JSON.parse(this.el.dataset.rows || "[]");
//this.table.replaceData(newData);

  //if (this.table && typeof this.table.replaceData === "function") {
    //this.table.replaceData(newData);
  //} else {
    //console.warn("No se pudo reemplazar los datos en Tabulator");
  //}
//},

  destroyed() {
    this.table.destroy();
  }
}



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
      headerFilterLiveFilter: false,
      headerFilterFunc: function(value, row, filterParams) {
        // 'col.field' es fijo para cada filtro
        const field = col.field;

        if (value && value.trim() !== "") {
          self.filtros[field] = value.trim();
        } else {
          delete self.filtros[field];
        }
        self.pagina = 1;

        // Enviamos evento a LiveView
        self.pushEvent("aplicar_filtros", {
          filtros: self.filtros,
          orden: self.orden
        });

        // Este filtro interno para Tabulator no hace filtro real, siempre devuelve true
        return true;
      }
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

    // Cuando cambian filtros externos, sincronizamos con self.filtros
    this.table.on("headerFilterChanged", (filters) => {
      let filtroObj = {};
      filters.forEach(filtro => {
        if(filtro.value && filtro.value.trim() !== "") {
          filtroObj[filtro.field] = filtro.value.trim();
        }
      });
      self.filtros = filtroObj;
    });
  },



  updated() {
  // Obtenemos los datos que vienen del backend
  const newData = JSON.parse(this.el.dataset.rows || "[]");

  // Si la data está vacía, no hacemos nada (evitamos que Tabulator se rompa)
  if (Array.isArray(newData) && newData.length === 0) {
    console.log("Datos vacíos recibidos, no se actualiza Tabulator para evitar romper el filtro");
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

