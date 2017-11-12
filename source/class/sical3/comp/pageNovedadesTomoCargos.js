qx.Class.define("sical3.comp.pageNovedadesTomoCargos",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);

	this.setLabel('Novedades Tomo Cargos');
	this.toggleShowCloseButton();
	this.setLayout(new qx.ui.layout.Canvas());
	
	this.addListenerOnce("appear", function(e){
		btnFiltrar.execute();
		
		cboTitulo.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	
	var sharedErrorTooltip = qx.ui.tooltip.Manager.getInstance().getSharedErrorTooltip();
	
	var aux;
	
	
	
	var defineMultiLineCellDate = qx.Class.define("multiLineCellDate",{
		extend : qx.ui.table.cellrenderer.Date,
	
		members : {
		    _getContentHtml : function(cellInfo)
		    {
		      var df = this.getDateFormat();
		
		      if (df)
		      {
		        if (cellInfo.value) {
		        	var html = qx.bom.String.escape(df.format(cellInfo.value));
		          //return qx.bom.String.escape(df.format(cellInfo.value));
		          return '<div style="display: table-cell; vertical-align: middle; position: relative;">' + html + '</div>';
		        } else {
		          return "";
		        }
		      }
		      else
		      {
		        return cellInfo.value || "";
		      }
		    },

			_getCellStyle:function (cellInfo) {
				return "white-space:normal; line-height:1em; display: table;";
			}
		}
	});
	
	
	var defineMultiLineCellHtml = qx.Class.define("multiLineCellHtml",{
		extend : qx.ui.table.cellrenderer.Html,
	
		members : {
			_getContentHtml : function(cellInfo) {
				var html = qx.bom.String.escape(cellInfo.value || "");

				return '<div style="display: table-cell; vertical-align: middle; position: relative;">' + html + '</div>';
			},

			_getCellStyle:function (cellInfo) {
				return "white-space:normal; line-height:1em; display: table;";
			}
		}
	});

	
	
	var functionContarSeleccionados = function() {
		var rowCount = tableModel.getRowCount();
		var contador = 0;
		
		for (var x = 0; x <= rowCount - 1; x++) {
			if (tableModel.getValueById("seleccionar", x)) contador++;
		}
		
		tbl.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " item - " : " items - ") + contador + ((contador == 1) ? " seleccionado" : " seleccionados"));
		
		return contador;
	}
	
	
	
	
	var bounds = application.getRoot().getBounds();
	
	var imageLoading = new qx.ui.basic.Image("sical3/loading66.gif");
	imageLoading.setVisibility("hidden");
	imageLoading.setBackgroundColor("#FFFFFF");
	imageLoading.setDecorator("main");
	application.getRoot().add(imageLoading, {left: parseInt(bounds.width / 2 - 33), top: parseInt(bounds.height / 2 - 33)});
	
	
	
	
	
	
	
	
	
	
	
	var gbxTitulo = new qx.ui.groupbox.GroupBox("Filtrar novedades");
	var layout = new qx.ui.layout.Grid(6, 6);
	gbxTitulo.setLayout(layout);
	this.add(gbxTitulo, {left: 0, top: 0, right: "40%"});
	
	
	gbxTitulo.add(new qx.ui.basic.Label("Título:"), {row: 0, column: 0});
	
	var cboTitulo = new sical3.comp.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.ComisionDeTitulos", methodName: "autocompletarTitulo"});
	var lstTitulo = cboTitulo.getChildControl("list");
	gbxTitulo.add(cboTitulo, {row: 0, column: 1, colSpan: 4});
	layout.setColumnFlex(4, 1);
	
	
	
	gbxTitulo.add(new qx.ui.basic.Label("Cargo:"), {row: 1, column: 0});
	
	var cboCargo = new sical3.comp.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.ComisionDeTitulos", methodName: "autocompletarCargo"});
	var lstCargo = cboCargo.getChildControl("list");
	gbxTitulo.add(cboCargo, {row: 1, column: 1, colSpan: 4});
	
	
	
	gbxTitulo.add(new qx.ui.basic.Label("Usuario:"), {row: 2, column: 0});
	
	var slbUsuario = new qx.ui.form.SelectBox();
	slbUsuario.setMinWidth(200);
	slbUsuario.add(new qx.ui.form.ListItem("-", null, "0"));
	
	var rpc = new sical3.comp.rpc.Rpc("services/", "comp.ComisionDeTitulos");
	try {
		var resultado = rpc.callSync("autocompletarUsuario", {texto: ""});
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	for (var x in resultado) {
		slbUsuario.add(new qx.ui.form.ListItem(resultado[x].label, null, resultado[x].model));
	}
	
	gbxTitulo.add(slbUsuario, {row: 2, column: 1, colSpan: 2});
	
	
	var btnFiltrar = new qx.ui.form.Button("Filtrar");
	btnFiltrar.addListener("execute", function(e){
		gbxTitulo.setEnabled(false);
		btnImpactar.setEnabled(false);
		mnbSeleccionar.setEnabled(false);
		
		imageLoading.setVisibility("visible");
		
		tbl.resetSelection();
		tbl.setFocusedCell();
		tableModel.setDataAsMapArray([], true);
		
		var p = {};
		
		if (! lstTitulo.isSelectionEmpty()) p.id_titulo = lstTitulo.getModelSelection().getItem(0);
		if (! lstCargo.isSelectionEmpty()) p.id_cargo = lstCargo.getModelSelection().getItem(0);
		if (slbUsuario.indexOf(slbUsuario.getSelection()[0]) > 0) p.usuario = slbUsuario.getModelSelection().getItem(0);
		
		//alert(qx.lang.Json.stringify(p, null, 2));
		
		var rpc = new sical3.comp.rpc.Rpc("services/", "comp.NovedadesTomoCargos");
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			tableModel.setDataAsMapArray(data.result, true);
			
			functionContarSeleccionados();
			
			imageLoading.setVisibility("hidden");
			
			gbxTitulo.setEnabled(true);
			btnImpactar.setEnabled(true);
			mnbSeleccionar.setEnabled(true);
		});
		rpc.addListener("failed", function(e){
			var data = e.getData();
			
			alert(qx.lang.Json.stringify(data, null, 2));
		});
		rpc.callAsyncListeners(true, "leer_cargos", p);
	});
	gbxTitulo.add(btnFiltrar, {row: 3, column: 1});
	
	
	var mnuSeleccionar = new qx.ui.menu.Menu();
	var btnTodos = new qx.ui.menu.Button("Todos");
	btnTodos.addListener("execute", function(e){
		qx.event.Timer.once(function(e){
			var rowCount = tableModel.getRowCount();
			
			for (var x = 0; x <= rowCount - 1; x++) {
				tableModel.setValueById("seleccionar", x, true);
			}
		
			functionContarSeleccionados();
		}, this, 1);
	});
	mnuSeleccionar.add(btnTodos);
	
	var btnNinguno = new qx.ui.menu.Button("Ninguno");
	btnNinguno.addListener("execute", function(e){
		qx.event.Timer.once(function(e){
			var rowCount = tableModel.getRowCount();
			
			for (var x = 0; x <= rowCount - 1; x++) {
				tableModel.setValueById("seleccionar", x, false);
			}
		
			functionContarSeleccionados();
		}, this, 1);
	});
	mnuSeleccionar.add(btnNinguno);
	mnuSeleccionar.addSeparator();

	
	var mnuNivel = new qx.ui.menu.Menu();
	
	var rpc = new sical3.comp.rpc.Rpc("services/", "comp.ComisionDeTitulos");
	try {
		var resultado = rpc.callSync("autocompletarNivel", {texto: ""});
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	for (var x in resultado) {
		aux = new qx.ui.menu.Button(resultado[x].label);
		aux.setUserData("id_nivel", resultado[x].model);
		aux.addListener("execute", function(e){
			qx.event.Timer.once(function(e){
				var data = tableModel.getDataAsMapArray();
				
				for (var x in data) {
					data[x].seleccionar = (data[x].id_nivel == this.getUserData("id_nivel"));
				}
				
				tableModel.setDataAsMapArray(data, true);
				
				functionContarSeleccionados();
			}, this, 1);
		});
		mnuNivel.add(aux);
	}
	
	var btnNivel = new qx.ui.menu.Button("Nivel", null, null, mnuNivel);

	mnuSeleccionar.add(btnNivel);
	
	var mnbSeleccionar = new qx.ui.form.MenuButton("Seleccionar", null, mnuSeleccionar);
	this.add(mnbSeleccionar, {left: 0, top: 155});
	
	

	
	
	
	
	
	
	
	//Menu de contexto
	
	var commandSeleccionar = new qx.ui.command.Command("Space");
	commandSeleccionar.setEnabled(false);
	commandSeleccionar.addListener("execute", function() {
		var focusedRow = tbl.getFocusedRow();
			
		tableModel.setValueById("seleccionar", focusedRow, ! tableModel.getValueById("seleccionar", focusedRow));
		
		functionContarSeleccionados();
	});
	
	
	var menu = new componente.comp.ui.ramon.menu.Menu();
	var btnSeleccionar = new qx.ui.menu.Button("Seleccionar si/no", null, commandSeleccionar);

	var btnEliminar = new qx.ui.menu.Button("Eliminar...");
	btnEliminar.setEnabled(false);
	btnEliminar.addListener("execute", function(e){
		(new dialog.Confirm({
			"message"     : "Desea eliminar la novedad?",
			"callback"    : function(e){
								if (e) {
									var rowData = tableModel.getRowDataAsMap(tbl.getFocusedRow());
									
									var p = {};
									p.id_nov_tomo_cargos = rowData.id_nov_tomo_cargos;
									
									//alert(qx.lang.Json.stringify(p, null, 2));
									
									var rpc = new sical3.comp.rpc.Rpc("services/", "comp.NovedadesTomoCargos");
									rpc.addListener("completed", function(e){
										btnFiltrar.execute();
									});
									rpc.addListener("failed", function(e){
										var data = e.getData();
										//alert(qx.lang.Json.stringify(data, null, 2));
										if (data.message == "novedad_existente") dialog.Dialog.error("Ya existe una novedad pendiente de ser impactada para el título y cargo seleccionados.");
									});
									rpc.callAsyncListeners(true, "eliminar_novedad", p);
								}
							},
			"context"     : this,
			"image"       : "icon/48/status/dialog-warning.png"
		})).show();
	});
	
	menu.add(btnSeleccionar);
	menu.addSeparator();
	menu.add(btnEliminar);
	menu.memorizar();
	
	
	
	
	
	
	//Tabla
	
	
	var tableModel = new qx.ui.table.model.Simple();
	tableModel.setColumns(["", "Fecha", "Cod.cargo", "Cargo", "Nivel", "Cod.titulo", "Titulo", "Tipo nov.", "Tipo tit."], ["seleccionar", "fecha_novedad", "cod_cargo", "cargo_descrip", "nivel_descrip", "cod_titulo", "titulo_descrip", "tipo_novedad", "tipo_titulo_descrip"]);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tbl = new componente.comp.ui.ramon.table.Table(tableModel, custom);
	//tbl.modo = "normal";
	tbl.setShowCellFocusIndicator(false);
	tbl.toggleColumnVisibilityButtonVisible();
	tbl.setRowHeight(45);
	tbl.setContextMenu(menu);
	tbl.addListener("cellDbltap", function(e){
		if (e.getColumn() == 0) commandSeleccionar.execute();
	});
	
	var tableColumnModel = tbl.getTableColumnModel();
	
	var resizeBehavior = tableColumnModel.getBehavior();
	resizeBehavior.set(0, {width:"3%", minWidth:100});
	resizeBehavior.set(1, {width:"8%", minWidth:100});
	resizeBehavior.set(2, {width:"7%", minWidth:100});
	resizeBehavior.set(3, {width:"24%", minWidth:100});
	resizeBehavior.set(4, {width:"8%", minWidth:100});
	resizeBehavior.set(5, {width:"7%", minWidth:100});
	resizeBehavior.set(6, {width:"24%", minWidth:100});
	resizeBehavior.set(7, {width:"6%", minWidth:100});
	resizeBehavior.set(8, {width:"12%", minWidth:100});
	
	
	var cellrendererBoolean = new qx.ui.table.cellrenderer.Boolean();
	cellrendererBoolean.setDefaultCellStyle("display: table-cell; vertical-align: middle; position: relative;");
	tableColumnModel.setDataCellRenderer(0, cellrendererBoolean);
	
	var cellrendererDate = new defineMultiLineCellDate();
	cellrendererDate.setDateFormat(new qx.util.format.DateFormat("dd/MM/y"));
	tableColumnModel.setDataCellRenderer(1, cellrendererDate);
	
	var cellrenderer = new defineMultiLineCellHtml();
	tableColumnModel.setDataCellRenderer(2, cellrenderer);
	tableColumnModel.setDataCellRenderer(3, cellrenderer);
	tableColumnModel.setDataCellRenderer(4, cellrenderer);
	tableColumnModel.setDataCellRenderer(5, cellrenderer);
	tableColumnModel.setDataCellRenderer(6, cellrenderer);
	tableColumnModel.setDataCellRenderer(7, cellrenderer);
	tableColumnModel.setDataCellRenderer(8, cellrenderer);
	
	
	var selectionModel = tbl.getSelectionModel();
	selectionModel.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModel.addListener("changeSelection", function(e){
		var selectionEmpty = selectionModel.isSelectionEmpty();
		
		commandSeleccionar.setEnabled(! selectionEmpty);
		btnEliminar.setEnabled(! selectionEmpty);
		menu.memorizar([commandSeleccionar, btnEliminar]);
	});

	this.add(tbl, {left: 0, top: 180, right: 0, bottom: 0});
	
	
	
	
	var btnImpactar = new qx.ui.form.Button("Impactar...");
	btnImpactar.addListener("execute", function(e){
		var data = tableModel.getDataAsMapArray();
		var nov_tomo_cargos = [];
		
		for (var x in data) {
			if (data[x].seleccionar) nov_tomo_cargos.push(data[x].id_nov_tomo_cargos);
		}
		
		if (nov_tomo_cargos.length == 0) {
			dialog.Dialog.warning("Debe seleccionar novedades para ser impactadas.", function(e){
				tbl.focus();
			});
		} else {
			
			(new dialog.Confirm({
				"message"     : "Desea impactar las novedades seleccionadas?",
				"callback"    : function(e){
									if (e) {
										imageLoading.setVisibility("visible");
										
										gbxTitulo.setEnabled(false);
										btnImpactar.setEnabled(false);
										mnbSeleccionar.setEnabled(false);
										
										
										var p = {};
										p.nov_tomo_cargos = nov_tomo_cargos;
										
										var rpc = new sical3.comp.rpc.Rpc("services/", "comp.NovedadesTomoCargos");
										rpc.addListener("completed", function(e){
											var data = e.getData();
											
											gbxTitulo.setEnabled(true);
											btnImpactar.setEnabled(true);
											mnbSeleccionar.setEnabled(true);
											
											imageLoading.setVisibility("hidden");
											
											dialog.Dialog.alert("Las novedades seleccionadas se impactaron con éxito.", function(e){
												btnFiltrar.execute();
												
												cboTitulo.focus();
											});
										});
										rpc.addListener("failed", function(e){
											var data = e.getData();
											
											alert(qx.lang.Json.stringify(data, null, 2));
										});
										rpc.callAsyncListeners(true, "impactar", p);
									}
								},
				"context"     : this,
				"image"       : "icon/48/status/dialog-warning.png"
			})).show();
		}
	});
	this.add(btnImpactar, {left: "75%", top: 60});
	
	
		
	},
	members : 
	{

	}
});