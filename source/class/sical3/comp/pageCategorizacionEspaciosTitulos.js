qx.Class.define("sical3.comp.pageCategorizacionEspaciosTitulos",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);

	this.setLabel('Categorización de Espacios en Títulos');
	this.toggleShowCloseButton();
	this.setLayout(new qx.ui.layout.Canvas());
	
	this.addListenerOnce("appear", function(e){
		cboEspacioA.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	
	var sharedErrorTooltip = qx.ui.tooltip.Manager.getInstance().getSharedErrorTooltip();
	
	var aux;
	var modelDest = 0;
	
	
	var defineMultiLineCell = qx.Class.define("multiLineCell",{
		extend : qx.ui.table.cellrenderer.Html,
	
		members : {
			_getContentHtml : function(cellInfo) {
				var html = qx.bom.String.escape(cellInfo.value || "");

				return "<div style='display: table-cell; vertical-align: middle; position: relative;'>" + html + "</div>";
			},

			_getCellStyle:function (cellInfo) {
				return "white-space:normal; line-height:1em; display: table;";
			}
		}
	});
	
	var defineMultiLineCellReplace = qx.Class.define("multiLineCellReplace",{
		extend : qx.ui.table.cellrenderer.Replace,
	
		members : {
			_getContentHtml : function(cellInfo) {
				var value         = cellInfo.value;
				var replaceMap    = this.getReplaceMap();
				var label;
				
				// use map
				if ( replaceMap  )
				{
				  label = replaceMap[value];
				  if ( typeof label != "undefined" )
				  {
				    cellInfo.value = label;
				    //return qx.bom.String.escape(this._formatValue(cellInfo));
				    
					var html = qx.bom.String.escape(cellInfo.value || "");

					return "<div style='display: table-cell; vertical-align: middle; position: relative;'>" + html + "</div>";
				  }
				}
			},

			_getCellStyle:function (cellInfo) {
				return "white-space:normal; line-height:1em; display: table;";
			}
		}
	});
	

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
			modelDest = 0;
		} else {
			var p = {};
			p.id_espacio = lstEspacioD.getModelSelection().getItem(0);
			p.id_carrera = lstCarreraD.getModelSelection().getItem(0);
			
			var rpc = new qx.io.remote.Rpc("services/", "comp.ComisionDeTitulos");
			rpc.callAsync(function(resultado, error, id) {
				modelDest = resultado.length;
				
				if (modelDest > 0) {
					dialog.Dialog.error("El espacio/carrera de destino ya tiene títulos asignados previamente.", function(e){
						cboEspacioD.focus();
					});
				}
			}, "leer_titulos", p);
		}
	}
	
	
	var functionAgregar = function(rowData){
		var focusedRow;
		var bandera = true;
		
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
			
			//alert(qx.lang.Json.stringify(rowData, null, 2));

			tableModelDest.addRowsAsMapArray([rowData], null, true);
			focusedRow = tableModelDest.getRowCount() - 1;			
		}
		
		tblDest.setFocusedCell(3, focusedRow, true);
		selectionModelDest.setSelectionInterval(focusedRow, focusedRow);
		
		sharedErrorTooltip.hide();
		tblDest.setValid(true);
		
		return bandera;
	}
	
	var composite1 = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
	this.add(composite1, {left: 0, top: 0, right: "53%", bottom: 140});
	
	composite1.add(new qx.ui.basic.Label("Espacio afin:"), {left: 0, top: 0});
	
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
	composite1.add(cboEspacioA, {left: 70, top: 0, right: 0});
	
	
	composite1.add(new qx.ui.basic.Label("Carrera afin:"), {left: 0, top: 30});
	
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
	composite1.add(cboCarreraA, {left: 70, top: 30, right: 0});
	
	
	
	
	
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
	tblAfin.setRowHeight(45);
	tblAfin.addListener("cellDbltap", function(e){
		btnAddUno.execute();
	});
	
	var tableColumnModelAfin = tblAfin.getTableColumnModel();
	
	var resizeBehavior = tableColumnModelAfin.getBehavior();
	resizeBehavior.set(0, {width:"10%", minWidth:100});
	resizeBehavior.set(1, {width:"60%", minWidth:100});
	resizeBehavior.set(2, {width:"15%", minWidth:100});
	resizeBehavior.set(3, {width:"15%", minWidth:100});
	
	
	var cellrenderer = new defineMultiLineCell();
	tableColumnModelAfin.setDataCellRenderer(0, cellrenderer);
	tableColumnModelAfin.setDataCellRenderer(1, cellrenderer);
	tableColumnModelAfin.setDataCellRenderer(2, cellrenderer);
	tableColumnModelAfin.setDataCellRenderer(3, cellrenderer);
	
	
	var selectionModelAfin = tblAfin.getSelectionModel();
	selectionModelAfin.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelAfin.addListener("changeSelection", function(e){
		btnAddUno.setEnabled(! selectionModelAfin.isSelectionEmpty());
	});

	composite1.add(tblAfin, {left: 0, top: 60, right: 0, bottom: 0});
	
	
	
	
	
	var composite2 = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
	this.add(composite2, {left: "47%", top: 0, right: "47%", bottom: 140})

	var btnAddUno = new qx.ui.form.Button(">");
	btnAddUno.setEnabled(false);
	btnAddUno.setHeight(35);
	btnAddUno.addListener("execute", function(e){
		/*
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
		*/
		
		var rowData = tableModelAfin.getRowDataAsMap(tblAfin.getFocusedRow());
		functionAgregar(rowData);
	});
	composite2.add(btnAddUno, {left: 10, top: "25%", right: 10});
	
	var btnAddTodos = new qx.ui.form.Button(">>");
	btnAddTodos.setEnabled(false);
	btnAddTodos.setHeight(35);
	btnAddTodos.addListener("execute", function(e){
		/*
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
		*/
		
		var rowData;
		var dataAfin = tableModelAfin.getDataAsMapArray();
		
		for (var x in dataAfin) {
			rowData = dataAfin[x];
			
			functionAgregar(rowData);
		}
	});
	composite2.add(btnAddTodos, {left: 10, top: "35%", right: 10});
	
	var btnDelUno = new qx.ui.form.Button("<");
	btnDelUno.setEnabled(false);
	btnDelUno.setHeight(35);
	btnDelUno.addListener("execute", function(e){
		var focusedRow = tblDest.getFocusedRow();
		
		tableModelDest.removeRows(focusedRow, 1);
	});
	composite2.add(btnDelUno, {left: 10, bottom: "35%", right: 10});
	
	var btnDelTodos = new qx.ui.form.Button("<<");
	btnDelTodos.setEnabled(false);
	btnDelTodos.setHeight(35);
	btnDelTodos.addListener("execute", function(e){
		tableModelDest.setDataAsMapArray([], true);
	});
	composite2.add(btnDelTodos, {left: 10, bottom: "25%", right: 10});



	
	
	
	var composite3 = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
	this.add(composite3, {left: "53%", top: 0, right: 0, bottom: 140})
	
	
	composite3.add(new qx.ui.basic.Label("Espacio dest:"), {left: 0, top: 0});
	
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
			sharedErrorTooltip.hide();
			cboEspacioD.setValid(true);
			cboCarreraD.setPhpParametros({id_espacio: data[0].getModel()});
		}
	}, this);
	composite3.add(cboEspacioD, {left: 70, top: 0, right: 0});
	
	
	composite3.add(new qx.ui.basic.Label("Carrera dest:"), {left: 0, top: 30});
	
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
			sharedErrorTooltip.hide();
			cboCarreraD.setValid(true);
			cboEspacioD.setPhpParametros({id_carrera: data[0].getModel()});
		}
	}, this);
	composite3.add(cboCarreraD, {left: 70, top: 30, right: 0});
	
	
	
	
	
	
	
	
	
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
	tblDest.setRowHeight(45);
	
	//tblDest.addListener("focusout", function(e){
	//	if (tblDest.isEditing()) tblDest.cancelEditing();
	//});
	
	var tableColumnModelDest = tblDest.getTableColumnModel();
	
	var resizeBehavior = tableColumnModelDest.getBehavior();
	resizeBehavior.set(0, {width:"10%", minWidth:100});
	resizeBehavior.set(1, {width:"60%", minWidth:100});
	resizeBehavior.set(2, {width:"15%", minWidth:100});
	resizeBehavior.set(3, {width:"15%", minWidth:100});
	
	
	var cellrenderer = new defineMultiLineCell();
	tableColumnModelDest.setDataCellRenderer(0, cellrenderer);
	tableColumnModelDest.setDataCellRenderer(1, cellrenderer);
	tableColumnModelDest.setDataCellRenderer(2, cellrenderer);
	tableColumnModelDest.setDataCellRenderer(3, cellrenderer);


	aux = {};
	for (var x in application.tipo_titulo) aux[application.tipo_titulo[x].id_tipo_titulo] = application.tipo_titulo[x].descrip;
	
	var cellrendererReplace = new qx.ui.table.cellrenderer.Replace();
	cellrendererReplace.setDefaultCellStyle("display: table-cell; vertical-align: middle; position: relative;");
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

	composite3.add(tblDest, {left: 0, top: 60, right: 0, bottom: 0});




	var gbxTitulo = new qx.ui.groupbox.GroupBox("Agregar título");
	var l = new qx.ui.layout.Grid(6, 6);
	gbxTitulo.setLayout(l);
	this.add(gbxTitulo, {left: "53%", right: 0, bottom: 0});


	gbxTitulo.add(new qx.ui.basic.Label("Título:"), {row: 0, column: 0});
	
	var cboTitulo = new sical3.comp.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.ComisionDeTitulos", methodName: "autocompletarTitulo"});
	var lstTitulo = cboTitulo.getChildControl("list");
	lstTitulo.addListener("changeSelection", function(e){
		if (lstTitulo.isSelectionEmpty()) {

		} else {

		}
	}, this);
	gbxTitulo.add(cboTitulo, {row: 0, column: 1, colSpan: 4});
	l.setColumnFlex(1, 1);
	
	
	
	
	gbxTitulo.add(new qx.ui.basic.Label("Tipo clasificación:"), {row: 1, column: 0});
	
	var slbTipo_clasificacion = new qx.ui.form.SelectBox();
	for (var x in application.tipo_clasificacion) {
		//var item = new qx.ui.form.ListItem(application.tipo_clasificacion[x].denominacion, null, application.tipo_clasificacion[x]);
		slbTipo_clasificacion.add(new qx.ui.form.ListItem(application.tipo_clasificacion[x].descrip, null, application.tipo_clasificacion[x]));
	}
	gbxTitulo.add(slbTipo_clasificacion, {row: 1, column: 1});
	l.setColumnFlex(1, 1);
	
	
	
	gbxTitulo.add(new qx.ui.basic.Label("Tipo título:"), {row: 1, column: 2});
	
	var slbTipo_titulo = new qx.ui.form.SelectBox();
	for (var x in application.tipo_titulo) {
		//var item = new qx.ui.form.ListItem(application.tipo_clasificacion[x].denominacion, null, application.tipo_clasificacion[x]);
		slbTipo_titulo.add(new qx.ui.form.ListItem(application.tipo_titulo[x].descrip, null, application.tipo_titulo[x]));
	}
	gbxTitulo.add(slbTipo_titulo, {row: 1, column: 3});
	l.setColumnFlex(3, 1);
	
	
	var btnAgregar = new qx.ui.form.Button("Agregar");
	btnAgregar.addListener("execute", function(e){
		if (lstTitulo.isSelectionEmpty()) {
			cboTitulo.focus();
		} else {
			var datos = lstTitulo.getSelection()[0].getUserData("datos");
			var tipo_clasificacion = slbTipo_clasificacion.getSelection()[0].getModel();
			var tipo_titulo = slbTipo_titulo.getSelection()[0].getModel();
			
			var rowData = {};
			rowData.cod_titulo = datos.codigo;
			rowData.titulo_descrip = datos.denominacion;
			rowData.tipo_clasificacion = tipo_clasificacion.denominacion;
			rowData.tipo_titulo = tipo_titulo.tipo;
			rowData.id_titulo = datos.model;
			rowData.id_tipo_titulo = tipo_titulo.id_tipo_titulo;
			rowData.cod_tipo_titulo = tipo_titulo.codigo;
			rowData.id_tipo_clasificacion = tipo_clasificacion.id_tipo_clasificacion;
			
			if (functionAgregar(rowData)) {
				lstTitulo.resetSelection();
				cboTitulo.setValue("");
				cboTitulo.focus();
			} else {
				dialog.Dialog.warning("Ya existe el título seleccionado en la tabla destino.", function(e){
					cboTitulo.focus();
				});
			}
		}
	})
	gbxTitulo.add(btnAgregar, {row: 2, column: 4});
	
	
	
	
	var btnConfirmar = new qx.ui.form.Button("Confirmar...");
	btnConfirmar.addListener("execute", function(e){
		var bandera = true;
		
		if (modelDest > 0) {
		//if (false) {
			dialog.Dialog.error("El espacio/carrera de destino ya tiene títulos asignados previamente.", function(e){
				cboEspacioD.focus();
			});
		} else {
			if (tableModelDest.getRowCount() == 0) {
				bandera = false;
				tblDest.setValid(false);
				
				sharedErrorTooltip.setLabel("Debe ingresar títulos categorizados");
				sharedErrorTooltip.placeToWidget(tblDest);
			}
			
			if (lstCarreraD.isSelectionEmpty()) {
				bandera = false;
				cboCarreraD.setValid(false);
				cboCarreraD.focus();
				
				sharedErrorTooltip.setLabel("Debe seleccionar carrera de destino");
				sharedErrorTooltip.placeToWidget(cboCarreraD);
			}
			
			if (lstEspacioD.isSelectionEmpty()) {
				bandera = false;
				cboEspacioD.setValid(false);
				cboEspacioD.focus();
				
				sharedErrorTooltip.setLabel("Debe seleccionar espacio de destino");
				sharedErrorTooltip.placeToWidget(cboEspacioD);
			}
			
			if (bandera) {
				dialog.Dialog.confirm("Desea incluir los títulos seleccionados en el espacio/carrera destino?", function(e){
					if (e) {
						var p = {};
						p.espacio = lstEspacioD.getSelection()[0].getUserData("datos");
						p.carrera = lstCarreraD.getSelection()[0].getUserData("datos");
						p.titulo = tableModelDest.getDataAsMapArray();
						
						//alert(qx.lang.Json.stringify(p, null, 2));
						
						var rpc = new qx.io.remote.Rpc("services/", "comp.ComisionDeTitulos");
						rpc.callAsync(function(resultado, error, id) {
							lstEspacioA.resetSelection();
							cboEspacioA.setValue("");
							lstCarreraA.resetSelection();
							cboCarreraA.setValue("");
							
							lstEspacioD.resetSelection();
							cboEspacioD.setValue("");
							lstCarreraD.resetSelection();
							cboCarreraD.setValue("");
							
							tableModelDest.setDataAsMapArray([], true);
							
							dialog.Dialog.alert("El alta de títulos para el espacio/carrera de destino se ha realizado con éxito.", function(e){
								cboEspacioA.focus();
							});
						}, "guardar_titulos", p);
					}
				});
			} else {
				sharedErrorTooltip.show();
			}
		}
	})
	this.add(btnConfirmar, {left: "20%", bottom: 50});
	
	
	
	
	
	cboEspacioA.setTabIndex(1);
	cboCarreraA.setTabIndex(2);
	cboEspacioD.setTabIndex(3);
	cboCarreraD.setTabIndex(4);
	tblAfin.setTabIndex(5);
	btnAddUno.setTabIndex(6);
	btnAddTodos.setTabIndex(7);
	btnDelUno.setTabIndex(8);
	btnDelTodos.setTabIndex(9);
	tblDest.setTabIndex(10);
	cboTitulo.setTabIndex(11);
	slbTipo_clasificacion.setTabIndex(12);
	slbTipo_titulo.setTabIndex(13);
	btnAgregar.setTabIndex(14);
	btnConfirmar.setTabIndex(15);
	
		
	},
	members : 
	{

	}
});