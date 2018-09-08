qx.Class.define("sical3.comp.windowCargos",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
		this.base(arguments);

	this.set({
		caption: "Cargos",
		width: 800,
		height: 500,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});
	
	this.setLayout(new qx.ui.layout.Canvas());
		
	this.addListenerOnce("appear", function(){
		tbl.focus();
	});
	
	var application = qx.core.Init.getApplication();
	
	
	var functionActualizar = function(id_cargo) {
		var p = {};
		
		var rpc = new sical3.comp.rpc.Rpc("services/", "comp.Parametros");
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			//alert(qx.lang.Json.stringify(data, null, 2));
			
			tableModel.setDataAsMapArray(data.result, true);
			
			if (id_cargo != null) {
				tbl.blur();
				tbl.buscar("id_cargo", id_cargo);
				tbl.focus();
			}
		});
		rpc.callAsyncListeners(true, "autocompletarCargo", p);
		
		return rpc;
	};
	
		
		

	var commandAgregar = new qx.ui.command.Command("Insert");
	commandAgregar.addListener("execute", function(e){
		var win = new sical3.comp.windowCargo();
		win.addListener("aceptado", function(e){
			var data = e.getData();

			functionActualizar(data);
		});
		win.setModal(true);
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	var commandEditar = new qx.ui.command.Command("F2");
	commandEditar.setEnabled(false);
	commandEditar.addListener("execute", function(e){
		var rowData = tableModel.getRowData(tbl.getFocusedRow());
		
		var win = new sical3.comp.windowCargo(rowData);
		win.addListener("aceptado", function(e){
			var data = e.getData();

			functionActualizar(data);
		});
		win.setModal(true);
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	
	var menu = new componente.comp.ui.ramon.menu.Menu();
	var btnAgregar = new qx.ui.menu.Button("Nuevo...", null, commandAgregar);
	var btnCambiar = new qx.ui.menu.Button("Modificar...", null, commandEditar);
	menu.add(btnAgregar);
	menu.addSeparator();
	menu.add(btnCambiar);
	menu.memorizar();

		
		
		
	//Tabla

	var tableModel = new qx.ui.table.model.Filtered();
	tableModel.setColumns(["Código", "Descripción", "Nivel", "Jor.completa", "Subtipo"], ["codigo", "denominacion", "nivel_descrip", "jornada_completa_descrip", "subtipo_descrip"]);
	
	tableModel.addListener("dataChanged", function(e){
		var rowCount = tableModel.getRowCount();
		if (rowCount == 1) tbl.setAdditionalStatusBarText(rowCount + " item"); else tbl.setAdditionalStatusBarText(rowCount + " items");
	});

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tbl = new componente.comp.ui.ramon.table.Table(tableModel, custom);
	tbl.setShowCellFocusIndicator(false);
	tbl.toggleColumnVisibilityButtonVisible();
	//tbl.toggleStatusBarVisible();
	tbl.setContextMenu(menu);
	
	tbl.addListener("cellDbltap", function(e){
		commandEditar.execute();
	});
	
	var tableColumnModel = tbl.getTableColumnModel();
	var resizeBehavior = tableColumnModel.getBehavior();
	//resizeBehavior.set(0, {width:"60%", minWidth:100});
	//resizeBehavior.set(1, {width:"40%", minWidth:100});
	
	var cellrendererNumber = new qx.ui.table.cellrenderer.Number("center");
	cellrendererNumber.setNumberFormat(application.numberformatEntero);
	tableColumnModel.setDataCellRenderer(0, cellrendererNumber);
	
	var selectionModel = tbl.getSelectionModel();
	selectionModel.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModel.addListener("changeSelection", function(){
		var bool = (selectionModel.getSelectedCount() > 0);
		commandEditar.setEnabled(bool);
		menu.memorizar([commandEditar]);
	});
	
	this.add(tbl, {left: 0, top: 0, right: 0, bottom: 0});
	

	
	functionActualizar();
		

	
		
		
	},
	members : 
	{

	}
});