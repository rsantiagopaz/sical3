qx.Class.define("sical3.comp.windowTitulos",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
		this.base(arguments);

	this.set({
		caption: "Títulos",
		width: 800,
		height: 500,
		showMinimize: false,
		//showMaximize: false,
		//allowMaximize: false,
		resizable: false
	});
	
	this.setLayout(new qx.ui.layout.Canvas());
		
	this.addListenerOnce("appear", function(){
		tbl.focus();
	});
	
	var application = qx.core.Init.getApplication();
	
	
	/*
	var defineMultiLineCell = qx.Class.define("multiLineCell",{
		extend : qx.ui.table.cellrenderer.Html,
	
		members : {
			_getContentHtml : function(cellInfo) {
				var html = qx.bom.String.escape(cellInfo.value || "");

				return '<div style="display: table-cell; vertical-align: middle; position: relative;">' + html + '</div>';
			},

			_getCellStyle:function (cellInfo) {
				return 'white-space: normal; line-height: 1em; display: table;';
			}
		}
	});
	*/
	
	var defineMultiLineCell = qx.Class.define("multiLineCell",{
		extend : qx.ui.table.cellrenderer.Default,
	
		members : {
			_getContentHtml : function(cellInfo) {
				var html = qx.bom.String.escape(cellInfo.value || "");

				return '<div style="display: table-cell; vertical-align: middle; position: relative;">' + html + '</div>';
			}
		}
	});
	
	var defineMultiLineCellNumber = qx.Class.define("multiLineCellNumber",{
		extend : qx.ui.table.cellrenderer.Default,
	
		members : {
			_getContentHtml : function(cellInfo) {
				return String(cellInfo.value);
			}
		}
	});
	
	
	var functionActualizar = function(id_titulo) {
		var p = {};
		
		var rpc = new sical3.comp.rpc.Rpc("services/", "comp.Parametros");
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			//alert(qx.lang.Json.stringify(data, null, 2));
			
			tableModel.setDataAsMapArray(data.result, true);
			
			if (id_titulo != null) {
				tbl.blur();
				tbl.buscar("id_titulo", id_titulo);
				tbl.focus();
			}
		});
		rpc.callAsyncListeners(true, "autocompletarTitulo", p);
		
		return rpc;
	};
	
		
		

	var commandAgregar = new qx.ui.command.Command("Insert");
	commandAgregar.addListener("execute", function(e){
		var win = new sical3.comp.windowTitulo();
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
		
		var win = new sical3.comp.windowTitulo(rowData);
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
	tableModel.setColumns(["Código", "Descripción", "Inst.que otorga", "Nivel que otorga"], ["codigo", "label", "institucion_descrip", "nivel_otorga_descrip"]);
	
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
	tbl.setRowHeight(45);
	tbl.setContextMenu(menu);
	
	tbl.addListener("cellDbltap", function(e){
		commandEditar.execute();
	});
	
	var tableColumnModel = tbl.getTableColumnModel();
	var resizeBehavior = tableColumnModel.getBehavior();
	resizeBehavior.set(0, {width:"8%", minWidth:100});
	resizeBehavior.set(1, {width:"45%", minWidth:100});
	resizeBehavior.set(2, {width:"37%", minWidth:100});
	resizeBehavior.set(3, {width:"10%", minWidth:100});
	

	
	var cellrendererNumber = new defineMultiLineCellNumber();
	cellrendererNumber.setDefaultCellStyle("display: table-cell; vertical-align: middle; text-align: center; position: relative;");
	tableColumnModel.setDataCellRenderer(0, cellrendererNumber);
	
	
	var cellrenderer = new defineMultiLineCell();
	//var cellrenderer = new qx.ui.table.cellrenderer.Default();
	cellrenderer.setDefaultCellStyle("white-space: normal; line-height: 1em; display: table;");
	tableColumnModel.setDataCellRenderer(1, cellrenderer);
	tableColumnModel.setDataCellRenderer(2, cellrenderer);
	tableColumnModel.setDataCellRenderer(3, cellrenderer);
	
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