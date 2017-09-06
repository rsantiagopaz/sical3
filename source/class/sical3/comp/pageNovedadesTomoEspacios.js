qx.Class.define("sical3.comp.pageNovedadesTomoEspacios",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);

	this.setLabel('Novedades Tomo espacios');
	this.toggleShowCloseButton();
	this.setLayout(new qx.ui.layout.Canvas());
	
	this.addListenerOnce("appear", function(e){
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
		var count = 0;
		
		for (var x = 0; x <= rowCount - 1; x++) {
			if (tableModel.getValueById("seleccionar", x)) count++;
		}
		
		return count;
	}
	
	
	var gbxTitulo = new qx.ui.groupbox.GroupBox("Filtrar novedades");
	var layout = new qx.ui.layout.Grid(6, 6);
	gbxTitulo.setLayout(layout);
	this.add(gbxTitulo, {left: 0, top: 0, right: "50%"});
	
	
	gbxTitulo.add(new qx.ui.basic.Label("Título:"), {row: 0, column: 0});
	
	var cboTitulo = new sical3.comp.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.ComisionDeTitulos", methodName: "autocompletarTitulo"});
	var lstTitulo = cboTitulo.getChildControl("list");
	lstTitulo.addListener("changeSelection", function(e){
		if (lstTitulo.isSelectionEmpty()) {

		} else {

		}
	}, this);
	gbxTitulo.add(cboTitulo, {row: 0, column: 1, colSpan: 4});
	layout.setColumnFlex(4, 1);
	
	
	
	gbxTitulo.add(new qx.ui.basic.Label("Espacio:"), {row: 1, column: 0});
	
	var cboEspacio = new sical3.comp.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.ComisionDeTitulos", methodName: "autocompletarEspacio"});
	//aux = cboEspacioA.getChildControl("popup");
	//aux.addListener("disappear", functionAfin_disappear);
	
	var lstEspacio = cboEspacio.getChildControl("list");
	lstEspacio.addListener("changeSelection", function(e){
		var data = e.getData();
		
		if (lstEspacio.isSelectionEmpty()) {
			cboCarreraA.setPhpParametros(null);
			
			functionAfin_disappear();
		} else {
			cboCarreraA.setPhpParametros({id_espacio: data[0].getModel()});
		}
	});
	gbxTitulo.add(cboEspacio, {row: 1, column: 1, colSpan: 4});
	
	
	
	gbxTitulo.add(new qx.ui.basic.Label("Usuario:"), {row: 2, column: 0});
	
	var slbUsuario = new qx.ui.form.SelectBox();
	slbUsuario.setMinWidth(200);
	slbUsuario.add(new qx.ui.form.ListItem("-", null, "0"));
	
	var rpc = new qx.io.remote.Rpc("services/", "comp.ComisionDeTitulos");
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
		btnFiltrar.setEnabled(false);
		
		tbl.setFocusedCell();
		tableModel.setDataAsMapArray([], true);
		
		var p = {};
		
		var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.NovedadesTomoEspacios");
		rpc.callAsync(function(resultado, error, id) {
			tableModel.setDataAsMapArray(resultado, true);
			
			tbl.setAdditionalStatusBarText(tableModel.getRowCount() + " item/s - " + functionContarSeleccionados() + " seleccionados");
			
			btnFiltrar.setEnabled(true);
		}, "leer_espacios", p);
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
		
			tbl.setAdditionalStatusBarText(rowCount + " item/s - " + rowCount + " seleccionados");		
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
		
			tbl.setAdditionalStatusBarText(rowCount + " item/s - " + 0 + " seleccionados");		
		}, this, 1);
	});
	mnuSeleccionar.add(btnNinguno);
	mnuSeleccionar.addSeparator();

	
	var mnuNivel = new qx.ui.menu.Menu();
	
	var rpc = new qx.io.remote.Rpc("services/", "comp.ComisionDeTitulos");
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
				tbl.setAdditionalStatusBarText(tableModel.getRowCount() + " item/s - " + functionContarSeleccionados() + " seleccionados");
			}, this, 1);
		});
		mnuNivel.add(aux);
	}
	
	var btnNivel = new qx.ui.menu.Button("Nivel", null, null, mnuNivel);

	mnuSeleccionar.add(btnNivel);
	
	var mnbSeleccionar = new qx.ui.form.MenuButton("Seleccionar", null, mnuSeleccionar);
	this.add(mnbSeleccionar, {left: 0, top: 155});
	
	

	
	
	
	
	
	//Tabla
	
	
	var tableModel = new qx.ui.table.model.Simple();
	tableModel.setColumns(["", "Fecha", "Cód.carrera", "Carrera", "Cod.espacio", "Espacio", "Nivel", "Cod.titulo", "Titulo", "Tipo nov.", "Tipo tit."], ["seleccionar", "fecha_novedad", "cod_carrera", "carrera_descrip", "cod_espacio", "espacio_descrip", "nivel_descrip", "cod_titulo", "titulo_descrip", "tipo_novedad", "tipo_titulo_descrip"]);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tbl = new componente.comp.ui.ramon.table.Table(tableModel, custom);
	//tbl.modo = "normal";
	tbl.setShowCellFocusIndicator(false);
	tbl.toggleColumnVisibilityButtonVisible();
	tbl.setRowHeight(45);
	tbl.addListener("cellDbltap", function(e){
		if (e.getColumn() == 0) {
			var focusedRow = tbl.getFocusedRow();
			
			tableModel.setValueById("seleccionar", focusedRow, ! tableModel.getValueById("seleccionar", focusedRow));
			tbl.setAdditionalStatusBarText(tableModel.getRowCount() + " item/s - " + functionContarSeleccionados() + " seleccionados");
		}
	});
	
	var tableColumnModel = tbl.getTableColumnModel();
	
	var resizeBehavior = tableColumnModel.getBehavior();
	resizeBehavior.set(0, {width:"3%", minWidth:100});
	resizeBehavior.set(1, {width:"5%", minWidth:100});
	resizeBehavior.set(2, {width:"5%", minWidth:100});
	resizeBehavior.set(3, {width:"21%", minWidth:100});
	resizeBehavior.set(4, {width:"5%", minWidth:100});
	resizeBehavior.set(5, {width:"21%", minWidth:100});
	resizeBehavior.set(6, {width:"5%", minWidth:100});
	resizeBehavior.set(7, {width:"5%", minWidth:100});
	resizeBehavior.set(8, {width:"21%", minWidth:100});
	resizeBehavior.set(9, {width:"4%", minWidth:100});
	resizeBehavior.set(10, {width:"5%", minWidth:100});
	
	
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
	tableColumnModel.setDataCellRenderer(9, cellrenderer);
	tableColumnModel.setDataCellRenderer(10, cellrenderer);
	
	
	var selectionModel = tbl.getSelectionModel();
	selectionModel.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModel.addListener("changeSelection", function(e){
		//btnAddUno.setEnabled(! selectionModel.isSelectionEmpty());
	});

	this.add(tbl, {left: 0, top: 180, right: 0, bottom: 0});
	
	
	
	
	var btnImpactar = new qx.ui.form.Button("Impactar...");
	btnImpactar.addListener("execute", function(e){
		var data = tableModel.getDataAsMapArray();
		var nov_tomo_espacios = [];
		
		for (var x in data) {
			if (data[x].seleccionar) nov_tomo_espacios.push(data[x].id_nov_tomo_espacios);
		}
		
		if (nov_tomo_espacios.length == 0) {
			dialog.Dialog.warning("Debe seleccionar novedades para ser impactadas.", function(e){
				tbl.focus();
			});
		} else {
			dialog.Dialog.confirm("Desea impactar las las novedades seleccionadas?", function(e){
				if (e) {
					var p = {};
					p.nov_tomo_espacios = nov_tomo_espacios;
					
					var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.NovedadesTomoEspacios");
					rpc.callAsync(function(resultado, error, id) {
						dialog.Dialog.alert("Las novedades seleccionadas se impactaron con éxito.", function(e){
							cboTitulo.focus();
						});
					}, "impactar", p);
				}
			});
		}
	});
	this.add(btnImpactar, {left: "70%", top: 60});
	
	
		
	},
	members : 
	{

	}
});