qx.Class.define("sical3.comp.pageCatEspTit",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);

	this.setLabel('Categorización de Espacios en Títulos');
	this.setLayout(new qx.ui.layout.Grid(6, 6));
	
	this.addListenerOnce("appear", function(e){
		//txtBuscar.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	
	var aux;
	

	var functionAfin_disappear = function(e){
		if (lstEspacioA.isSelectionEmpty() || lstCarreraA.isSelectionEmpty()) {
			tableModelAfin.setDataAsMapArray([], true);
		} else {
			var p = {};
			p.id_espacio = lstEspacioA.getModelSelection().getItem(0);
			p.id_carrera = lstCarreraA.getModelSelection().getItem(0);
			
			var rpc = new qx.io.remote.Rpc("services/", "comp.ComisionDeTitulos");
			rpc.callAsync(function(resultado, error, id) {
				tableModelAfin.setDataAsMapArray(resultado, true);
			}, "leer_titulos", p);
		}
	}
	
	var functionDest_disappear = function(e){
		if (lstEspacioD.isSelectionEmpty() || lstCarreraD.isSelectionEmpty()) {
			//tableModelAfin.setDataAsMapArray([], true);
		} else {
			var p = {};
			p.id_espacio = lstEspacioD.getModelSelection().getItem(0);
			p.id_carrera = lstCarreraD.getModelSelection().getItem(0);
			
			var rpc = new qx.io.remote.Rpc("services/", "comp.ComisionDeTitulos");
			rpc.callAsync(function(resultado, error, id) {
				//tableModelAfin.setDataAsMapArray(resultado, true);
			}, "leer_titulos", p);
		}
	}
	
	
	
	this.add(new qx.ui.basic.Label("Espacio afin:"), {row: 0, column: 0});
	
	var cboEspacioA = new sical3.comp.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.ComisionDeTitulos", methodName: "autocompletarEspacio"});
	aux = cboEspacioA.getChildControl("popup");
	aux.addListener("disappear", functionAfin_disappear);
	
	var lstEspacioA = cboEspacioA.getChildControl("list");
	lstEspacioA.addListener("changeSelection", function(e){
		var data = e.getData();
		
		if (lstEspacioA.isSelectionEmpty()) {
			cboCarreraA.setPhpParametros(null);
			
			functionAfin_disappear();
		} else {
			cboCarreraA.setPhpParametros({id_espacio: data[0].getModel()});
		}
	});
	this.add(cboEspacioA, {row: 0, column: 1});
	
	
	this.add(new qx.ui.basic.Label("Carrera afin:"), {row: 1, column: 0});
	
	var cboCarreraA = new sical3.comp.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.ComisionDeTitulos", methodName: "autocompletarCarrera"});
	aux = cboCarreraA.getChildControl("popup");
	aux.addListener("disappear", functionAfin_disappear);
	var lstCarreraA = cboCarreraA.getChildControl("list");
	lstCarreraA.addListener("changeSelection", function(e){
		var data = e.getData();
		
		if (lstCarreraA.isSelectionEmpty()) {
			cboEspacioA.setPhpParametros(null);
			
			functionAfin_disappear();
		} else {
			cboEspacioA.setPhpParametros({id_carrera: data[0].getModel()});
		}
	});
	this.add(cboCarreraA, {row: 1, column: 1});
	
	
	
	
	
	//Tabla
	
	
	var tableModelAfin = new qx.ui.table.model.Simple();
	tableModelAfin.setColumns(["Código", "Título", "Tipo cla.", "Tipo tit."], ["cod_titulo", "titulo_descrip", "tipo_clasificacion", "tipo_titulo"]);
	tableModelAfin.addListener("dataChanged", function(e){
		var rowCount = tableModelAfin.getRowCount();
		
		if (rowCount == 0) {
			btnAddTodos.setEnabled(false);
			tblAfin.setAdditionalStatusBarText(" ");
		} else {
			btnAddTodos.setEnabled(true);
			tblAfin.setAdditionalStatusBarText(rowCount + " título/s");
		}
	});

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblAfin = new componente.comp.ui.ramon.table.Table(tableModelAfin, custom);
	tblAfin.modo = "normal";
	tblAfin.setShowCellFocusIndicator(false);
	tblAfin.toggleColumnVisibilityButtonVisible();
	tblAfin.addListener("cellDbltap", function(e){
		btnAddUno.execute();
	});
	
	var selectionModelAfin = tblAfin.getSelectionModel();
	selectionModelAfin.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelAfin.addListener("changeSelection", function(e){
		btnAddUno.setEnabled(! selectionModelAfin.isSelectionEmpty());
	});

	this.add(tblAfin, {row: 2, column: 0, rowSpan: 10, colSpan: 10});
	
	
	
	

	var btnAddUno = new qx.ui.form.Button(">");
	btnAddUno.setEnabled(false);
	btnAddUno.addListener("execute", function(e){
		var focusedRow;
		var bandera = true;
		
		var rowData = tableModelAfin.getRowDataAsMap(tblAfin.getFocusedRow());
		
		var data = tableModelDest.getDataAsMapArray();
		for (var x = 0; x <= data.length - 1; x++) {
			if (data[x].id_titulo == rowData.id_titulo) {
				focusedRow = x;
				bandera = false;
				break;
			}
		}
		
		if (bandera) {
			rowData = qx.lang.Json.parse(qx.lang.Json.stringify(rowData));
			
			alert(qx.lang.Json.stringify(rowData, null, 2));

			tableModelDest.addRowsAsMapArray([rowData], null, true);
			focusedRow = tableModelDest.getRowCount() - 1;			
		}
		
		tblDest.setFocusedCell(3, focusedRow, true);
		selectionModelDest.setSelectionInterval(focusedRow, focusedRow);
	});
	this.add(btnAddUno, {row: 5, column: 10});
	
	var btnAddTodos = new qx.ui.form.Button(">>");
	btnAddTodos.setEnabled(false);
	btnAddTodos.addListener("execute", function(e){
		var focusedRow, rowData, dataAfin, dataDest;
		var bandera;
		
		dataAfin = tableModelAfin.getDataAsMapArray();
		dataDest = tableModelDest.getDataAsMapArray();
		
		for (var x in dataAfin) {
			bandera = true;
			rowData = dataAfin[x];
			
			for (var y = 0; y <= dataDest.length - 1; y++) {
				if (dataDest[y].id_titulo == rowData.id_titulo) {
					focusedRow = y;
					bandera = false;
					break;
				}
			}
			
			if (bandera) {
				rowData = qx.lang.Json.parse(qx.lang.Json.stringify(rowData));
	
				tableModelDest.addRowsAsMapArray([rowData], null, true);
				focusedRow = tableModelDest.getRowCount() - 1;			
			}
			
			tblDest.setFocusedCell(3, focusedRow, true);
			selectionModelDest.setSelectionInterval(focusedRow, focusedRow);
		}
	});
	this.add(btnAddTodos, {row: 6, column: 10});
	
	var btnDelUno = new qx.ui.form.Button("<");
	btnDelUno.setEnabled(false);
	btnDelUno.addListener("execute", function(e){
		var focusedRow = tblDest.getFocusedRow();
		
		tableModelDest.removeRows(focusedRow, 1);
	});
	this.add(btnDelUno, {row: 8, column: 10});
	
	var btnDelTodos = new qx.ui.form.Button("<<");
	btnDelTodos.setEnabled(false);
	btnDelTodos.addListener("execute", function(e){
		tableModelDest.setDataAsMapArray([], true);
	});
	this.add(btnDelTodos, {row: 9, column: 10});



	
	
	
	
	
	
	this.add(new qx.ui.basic.Label("Espacio dest:"), {row: 0, column: 12});
	
	var cboEspacioD = new sical3.comp.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.ComisionDeTitulos", methodName: "autocompletarEspacio"});
	aux = cboEspacioD.getChildControl("popup");
	aux.addListener("disappear", functionDest_disappear);
	var lstEspacioD = cboEspacioD.getChildControl("list");
	lstEspacioD.addListener("changeSelection", function(e){
		var data = e.getData();
		
		if (lstEspacioD.isSelectionEmpty()) {
			cboCarreraD.setPhpParametros(null);
			
			functionDest_disappear();
		} else {
			cboCarreraD.setPhpParametros({id_espacio: data[0].getModel()});
		}
	}, this);
	this.add(cboEspacioD, {row: 0, column: 13});
	
	
	this.add(new qx.ui.basic.Label("Carrera dest:"), {row: 1, column: 12});
	
	var cboCarreraD = new sical3.comp.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.ComisionDeTitulos", methodName: "autocompletarCarrera"});
	aux = cboCarreraD.getChildControl("popup");
	aux.addListener("disappear", functionDest_disappear);
	var lstCarreraD = cboCarreraD.getChildControl("list");
	lstCarreraD.addListener("changeSelection", function(e){
		var data = e.getData();
		
		if (lstCarreraD.isSelectionEmpty()) {
			cboEspacioD.setPhpParametros(null);
			
			functionDest_disappear();
		} else {
			cboEspacioD.setPhpParametros({id_carrera: data[0].getModel()});
		}
	}, this);
	this.add(cboCarreraD, {row: 1, column: 13});
	
	
	//Tabla
	
	
	var tableModelDest = new qx.ui.table.model.Simple();
	tableModelDest.setColumns(["Código", "Título", "Tipo cla.", "Tipo tit."], ["cod_titulo", "titulo_descrip", "tipo_clasificacion", "id_tipo_titulo"]);
	tableModelDest.setColumnEditable(3, true);
	tableModelDest.addListener("dataChanged", function(e){
		var rowCount = tableModelDest.getRowCount();
		
		if (rowCount == 0) {
			btnDelTodos.setEnabled(false);
			tblDest.setAdditionalStatusBarText(" ");
		} else {
			btnDelTodos.setEnabled(true);
			tblDest.setAdditionalStatusBarText(rowCount + " título/s");
		}
	});

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblDest = new componente.comp.ui.ramon.table.Table(tableModelDest, custom);
	tblDest.modo = "normal";
	//tblDest.setShowCellFocusIndicator(false);
	tblDest.toggleColumnVisibilityButtonVisible();
	
	//tblDest.addListener("focusout", function(e){
	//	if (tblDest.isEditing()) tblDest.cancelEditing();
	//});
	
	var tableColumnModelDest = tblDest.getTableColumnModel();
	
	

	aux = {};
	for (var x in application.tipo_titulo) aux[application.tipo_titulo[x].id_tipo_titulo] = application.tipo_titulo[x].descrip;
	
	var cellrendererReplace = new qx.ui.table.cellrenderer.Replace();
	cellrendererReplace.setReplaceMap(aux);
	tableColumnModelDest.setDataCellRenderer(3, cellrendererReplace);
	


	
	
	aux = [];
	for (var x in application.tipo_titulo) aux.push([application.tipo_titulo[x].descrip, null, application.tipo_titulo[x].id_tipo_titulo]);
	
	var celleditorSelectBox = new qx.ui.table.celleditor.SelectBox();
	celleditorSelectBox.setListData(aux);
	//aux = celleditorSelectBox.getChildControl("popup");
	//alert(aux);
	tableColumnModelDest.setCellEditorFactory(3, celleditorSelectBox);
	
	

	
	
	
	var selectionModelDest = tblDest.getSelectionModel();
	selectionModelDest.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelDest.addListener("changeSelection", function(e){
		btnDelUno.setEnabled(! selectionModelDest.isSelectionEmpty());
	});

	this.add(tblDest, {row: 2, column: 12, rowSpan: 10, colSpan: 10});




	var gbxTitulo = new qx.ui.groupbox.GroupBox("Agregar título");
	gbxTitulo.setLayout(new qx.ui.layout.Grid(6, 6));
	this.add(gbxTitulo, {row: 15, column: 0, colSpan: 10});


	gbxTitulo.add(new qx.ui.basic.Label("Título:"), {row: 0, column: 0});
	
	var cboTitulo = new sical3.comp.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.ComisionDeTitulos", methodName: "autocompletarTitulo"});
	var lstTitulo = cboTitulo.getChildControl("list");
	lstTitulo.addListener("changeSelection", function(e){
		if (lstTitulo.isSelectionEmpty()) {

		} else {

		}
	}, this);
	gbxTitulo.add(cboTitulo, {row: 0, column: 1});
	
	
	
	
	gbxTitulo.add(new qx.ui.basic.Label("Tipo clasificación:"), {row: 1, column: 0});
	
	var slbTipo_clasificacion = new qx.ui.form.SelectBox();
	for (var x in application.tipo_clasificacion) {
		//var item = new qx.ui.form.ListItem(application.tipo_clasificacion[x].denominacion, null, application.tipo_clasificacion[x]);
		slbTipo_clasificacion.add(new qx.ui.form.ListItem(application.tipo_clasificacion[x].descrip, null, application.tipo_clasificacion[x]));
	}
	gbxTitulo.add(slbTipo_clasificacion, {row: 1, column: 1});
	
	
	
	gbxTitulo.add(new qx.ui.basic.Label("Tipo título:"), {row: 1, column: 3});
	
	var slbTipo_titulo = new qx.ui.form.SelectBox();
	for (var x in application.tipo_titulo) {
		//var item = new qx.ui.form.ListItem(application.tipo_clasificacion[x].denominacion, null, application.tipo_clasificacion[x]);
		slbTipo_titulo.add(new qx.ui.form.ListItem(application.tipo_titulo[x].descrip, null, application.tipo_titulo[x]));
	}
	gbxTitulo.add(slbTipo_titulo, {row: 1, column: 4});
	
	
	var btnAgregar = new qx.ui.form.Button("Agregar");
	btnAgregar.addListener("execute", function(e){
	
	})
	gbxTitulo.add(btnAgregar, {row: 2, column: 4});
	
		
	},
	members : 
	{

	}
});