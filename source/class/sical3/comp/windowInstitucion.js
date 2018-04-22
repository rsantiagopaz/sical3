qx.Class.define("sical3.comp.windowInstitucion",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
	this.base(arguments);
	
	this.set({
		caption: "Institucion",
		width: 500,
		height: 500,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});

	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		//txtDescrip.focus();
	});
	
	var application = qx.core.Init.getApplication();
	
	
	
	
	var functionActualizar = this.functionActualizar = qx.lang.Function.bind(function(id_remito) {
        var timer = qx.util.TimerManager.getInstance();
        // check for the old listener
        if (this.timerId != null) {
          // stop the old one
          timer.stop(this.timerId);
          if (this.rpc != null) this.rpc.abort(this.opaqueCallRef);
          this.timerId = null;
        }
        
		tbl.blur();
		tbl.setFocusedCell();
        tableModelDetalle.setDataAsMapArray([], true);
		tableModelTotales.setDataAsMapArray([], true);
		tableModel.setDataAsMapArray([], true);
		tableModelTotgen.setDataAsMapArray([], true);
		
		btnAutorizar.setEnabled(false);
		btnImprimir.setEnabled(false);
		btnModificar.setEnabled(false);
		menutbl.memorizar([btnAutorizar, btnImprimir, btnModificar]);
			
        // start a new listener to update the controller
		this.timerId = timer.start(function(userData, timerId) {
			imageLoadingRemito.setVisibility("visible");
			
			var p = {};
			p.estado = this.slbEstado.getModelSelection().getItem(0);
			p.desde = this.dtfDesde.getValue();
			p.hasta = this.dtfHasta.getValue();
			p.id_sucursal = this.slbSucursal.getModelSelection().getItem(0);
			p.id_fabrica = this.slbFabrica.getModelSelection().getItem(0);
			p.buscar = this.txtBuscar.getValue().trim();
			
			this.rpc = new sical3.comp.rpc.Rpc("services/", "comp.Remitos");
			this.rpc.setTimeout(1000 * 60 * 2);
			this.rpc.addListener("completed", function(e){
				var resultado = e.getData().result;
				
				tableModel.setDataAsMapArray(resultado.remito, true);
				
				if (id_remito == null) {
					if (tableModel.getRowCount() > 0) tbl.setFocusedCell(0, 0, true);
				} else {
					if (emitir) {
						tbl.buscar("id_remito_emi", id_remito);
					} else {
						tbl.buscar("id_remito_rec", id_remito);
					}
					
					tbl.focus();
				}
				
				imageLoadingRemito.setVisibility("hidden");
			});
			this.rpc.addListener("failed", function(e){
				imageLoadingRemito.setVisibility("hidden");
			});
			
			if (emitir) {
				this.opaqueCallRef = this.rpc.callAsyncListeners(true, "leer_remitos_emi", p);
			} else {
				this.opaqueCallRef = this.rpc.callAsyncListeners(true, "leer_remitos_rec", p);
			}
		}, null, this, null, 200);
	}, this);
	
	
	
	
	
	
	
	
	//Menu de contexto
	
	var menutbl = new componente.comp.ui.ramon.menu.Menu();
	
	var btnNuevo = new qx.ui.menu.Button("Nueva...");
	btnNuevo.addListener("execute", function(e){
		var win = new elpintao.comp.remitos.windowRemito(null, emitir);
		win.addListener("aceptado", function(e){
			var data = e.getData();

			functionActualizar(data);
			//application.functionTransmitir();
		});
		win.setModal(true);
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnModificar = new qx.ui.menu.Button("Modificar...");
	btnModificar.setEnabled(false);
	btnModificar.addListener("execute", function(e){
		var win = new elpintao.comp.remitos.windowRemito(rowDataRemito, emitir);
		win.addListener("aceptado", function(e){
			var data = e.getData();

			functionActualizar(data);
			//application.functionTransmitir();
		});
		win.setModal(true);
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	menutbl.add(btnNuevo);
	menutbl.add(btnModificar);
	menutbl.memorizar();
	
		
		
	//Tabla

	
	var tableModel = new qx.ui.table.model.Simple();
	tableModel.setColumns(["Descripción", "Provincia"], ["nro_remito", "destino_descrip"]);
	tableModel.setColumnSortable(0, false);
	tableModel.setColumnSortable(1, false);
	

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tbl = new componente.comp.ui.ramon.table.Table(tableModel, custom);
	tbl.toggleColumnVisibilityButtonVisible();
	tbl.toggleShowCellFocusIndicator();
	tbl.toggleStatusBarVisible();
	tbl.setContextMenu(menutbl);

	tbl.addListener("cellDbltap", function(e){

	});
	
	
	var tableColumnModel = tbl.getTableColumnModel();
	// Obtain the behavior object to manipulate
	var resizeBehavior = tableColumnModel.getBehavior();
	//resizeBehavior.set(0, {width:"40%", minWidth:100});
	//resizeBehavior.set(1, {width:"20%", minWidth:100});
	//resizeBehavior.set(2, {width:"40%", minWidth:100});
	
	

	
	var selectionModel = tbl.getSelectionModel();
	selectionModel.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModel.addListener("changeSelection", function(e){
		if (! selectionModel.isSelectionEmpty()) {
	        var timer = qx.util.TimerManager.getInstance();
	        // check for the old listener
	        if (this.timerId != null) {
	          // stop the old one
	          timer.stop(this.timerId);
	          if (this.rpc != null) this.rpc.abort(this.opaqueCallRef);
	          this.timerId = null;
	        }

			this.timerId = timer.start(function(userData, timerId) {
				imageLoadingDetalle.setVisibility("visible");
				
				rowDataRemito = tableModel.getRowData(tbl.getFocusedRow());
				tblDetalle.setFocusedCell();
				
				btnModificar.setEnabled(rowDataRemito.estado == 'R');
				menutbl.memorizar([btnModificar]);
				
				var p = {};
				p.emitir = emitir;
				p.id_remito = ((emitir) ? rowDataRemito.id_remito_emi : rowDataRemito.id_remito_rec) ;
				p.id_fabrica = slbFabrica.getModelSelection().getItem(0);
				p.buscar = txtBuscar.getValue().trim();
				
				this.rpc = new qx.io.remote.Rpc("services/", "comp.Remitos");
				this.rpc.setTimeout(1000 * 60 * 2);
				this.opaqueCallRef = this.rpc.callAsync(qx.lang.Function.bind(function(resultado, error, id){
					//alert(qx.lang.Json.stringify(resultado, null, 2));
					
					if (error == null) {
						tableModelDetalle.setDataAsMapArray(resultado, true);
					}
					
					functionCalcularTotales(tableModelDetalle, tableModelTotales);
					
					imageLoadingDetalle.setVisibility("hidden");
				}, this), "leer_remitos_detalle", p);
			}, null, this, null, 200);
		}
	});
	
	
	
	this.add(tbl, {left: 0, top: 0, right: 0, bottom: 0});
	
	
	
	

	
	}
});