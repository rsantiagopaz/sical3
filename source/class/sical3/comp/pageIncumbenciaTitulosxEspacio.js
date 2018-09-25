qx.Class.define("sical3.comp.pageIncumbenciaTitulosxEspacio",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);

	this.setLabel('Incumbencia de Títulos para un Espacio');
	this.toggleShowCloseButton();
	this.setLayout(new qx.ui.layout.Canvas());
	
	this.addListenerOnce("appear", function(e){
		cboEspacioD.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	
	var sharedErrorTooltip = qx.ui.tooltip.Manager.getInstance().getSharedErrorTooltip();
	
	var aux;

	
	
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
	


	
	var functionDest_disappear = function(e, id_tomo_espacio){
		
		tblDest.resetSelection();
		tblDest.setFocusedCell();
		
		if (lstEspacioD.isSelectionEmpty() || lstCarreraD.isSelectionEmpty()) {
			tableModelDest.setDataAsMapArray([], true);
		} else {
			var p = {};
			p.id_espacio = lstEspacioD.getModelSelection().getItem(0);
			p.id_carrera = lstCarreraD.getModelSelection().getItem(0);
			
			var rpc = new sical3.comp.rpc.Rpc("services/", "comp.IncumbenciaTitulosxEspacio");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data.result, null, 2));
				
				tableModelDest.setDataAsMapArray(data.result, true);
				
				if (id_tomo_espacio != null) tblDest.buscar("id_tomo_espacio", id_tomo_espacio);
			});
			rpc.callAsyncListeners(true, "leer_titulos", p);
		}
	}
	
	

	
	
	
	
	




	
	
	
	var composite3 = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
	this.add(composite3, {left: 0, top: 0, right: 0, bottom: 140})
	
	
	composite3.add(new qx.ui.basic.Label("Espacio:"), {left: 0, top: 0});
	
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
	composite3.add(cboEspacioD, {left: 70, top: 0, right: "25%"});
	
	
	composite3.add(new qx.ui.basic.Label("Carrera:"), {left: 0, top: 30});
	
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
	composite3.add(cboCarreraD, {left: 70, top: 30, right: "25%"});
	
	
	
	
	
	
	
	//Menu
	
	var menu = new componente.comp.ui.ramon.menu.Menu();
	var btnEliminar = new qx.ui.menu.Button("Eliminar...");
	btnEliminar.setEnabled(false);
	btnEliminar.addListener("execute", function(e){
		/*
		dialog.Dialog.confirm("Desea eliminar el título seleccionado del espacio/carrera?", function(e){
			if (e) {
				var rowData = tableModelDest.getRowDataAsMap(tblDest.getFocusedRow());
				
				var p = {};
				p.espacio = lstEspacioD.getSelection()[0].getUserData("datos");
				p.carrera = lstCarreraD.getSelection()[0].getUserData("datos");
				p.titulo = [rowData];
				
				//alert(qx.lang.Json.stringify(p, null, 2));
				
				var rpc = new sical3.comp.rpc.Rpc("services/", "comp.IncumbenciaTitulosxEspacio");
				rpc.addListener("completed", function(e){
					dialog.Dialog.alert("Se ha generado una novedad que estará pendiente de confirmación.");
				});
				rpc.addListener("failed", function(e){
					var data = e.getData();
					
					if (data.message == "novedad_existente") dialog.Dialog.error("Ya existe una novedad pendiente de ser impactada para el título, carrera, y espacio seleccionados.");
				});
				rpc.callAsyncListeners(true, "eliminar_titulo", p);
			}
		});
		*/
		
		
		
		
		(new dialog.Confirm({
			"message"     : "Desea eliminar el título seleccionado del espacio/carrera?",
			"callback"    : function(e){
								if (e) {
									var rowData = tableModelDest.getRowDataAsMap(tblDest.getFocusedRow());
									
									var p = {};
									p.espacio = lstEspacioD.getSelection()[0].getUserData("datos");
									p.carrera = lstCarreraD.getSelection()[0].getUserData("datos");
									p.titulo = [rowData];
									
									//alert(qx.lang.Json.stringify(p, null, 2));
									
									var rpc = new sical3.comp.rpc.Rpc("services/", "comp.IncumbenciaTitulosxEspacio");
									rpc.addListener("completed", function(e){
										//var data = e.getData();
										//alert(qx.lang.Json.stringify(data, null, 2));
										
										dialog.Dialog.alert("Se ha generado una novedad que estará pendiente de confirmación.");
									});
									rpc.addListener("failed", function(e){
										var data = e.getData();
										//alert(qx.lang.Json.stringify(data, null, 2));
										if (data.message == "novedad_existente") dialog.Dialog.error("Ya existe una novedad pendiente de ser impactada para el título, carrera, y espacio seleccionados.");
									});
									rpc.callAsyncListeners(true, "eliminar_titulo", p);
								}
							},
			"context"     : this,
			"image"       : "icon/48/status/dialog-warning.png"
		})).show();

	});
	menu.add(btnEliminar);
	menu.memorizar();
	
	
	
	
	
	//Tabla
	
	
	var tableModelDest = new qx.ui.table.model.Simple();
	tableModelDest.setColumns(["Código", "Título", "Tipo cla.", "Tipo tit."], ["cod_titulo", "titulo_descrip", "tipo_clasificacion", "id_tipo_titulo"]);
	tableModelDest.setColumnEditable(3, true);
	tableModelDest.addListener("dataChanged", function(e){
		var rowCount = tableModelDest.getRowCount();
		
		tblDest.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " título" : " títulos"));
	});

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblDest = new componente.comp.ui.ramon.table.Table(tableModelDest, custom);
	//tblDest.modo = "normal";
	//tblDest.setShowCellFocusIndicator(false);
	tblDest.toggleColumnVisibilityButtonVisible();
	tblDest.setRowHeight(45);
	tblDest.setContextMenu(menu);
	
	tblDest.addListener("dataEdited", function(e){
		var data = this.data = e.getData();
		
		if (data.value != data.oldValue) {
			var focusedRow = tblDest.getFocusedRow();
			var rowData = tableModelDest.getRowDataAsMap(focusedRow);
			
			var p = {};
			p.espacio = lstEspacioD.getSelection()[0].getUserData("datos");
			p.carrera = lstCarreraD.getSelection()[0].getUserData("datos");
			p.titulo = [rowData];
			
			//alert(qx.lang.Json.stringify(p, null, 2));
			//return
			
			var functionCompleted = function(e) {
				dialog.Dialog.alert("Se ha generado una novedad que estará pendiente de confirmación.");
			}
			
			var rpc = new sical3.comp.rpc.Rpc("services/", "comp.IncumbenciaTitulosxEspacio");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				p.message = data.result.message;
				
				if (data.result.message == "INSERT") {
					var rpc = new sical3.comp.rpc.Rpc("services/", "comp.IncumbenciaTitulosxEspacio");
					rpc.addListener("completed", functionCompleted);
					rpc.callAsyncListeners(true, "escribir_novedad_modificacion", p);
					
				} else if (data.result.message == "UPDATE") {
					p.id_nov_tomo_espacios = data.result.id_nov_tomo_espacios;
					
					(new dialog.Confirm({
						"message"     : "Ya existe modificación previa pendiente de ser impactada. Desea continuar con la nueva modificación?",
						"callback"    : function(e){
											if (e) {
												var rpc = new sical3.comp.rpc.Rpc("services/", "comp.IncumbenciaTitulosxEspacio");
												rpc.addListener("completed", functionCompleted);
												rpc.callAsyncListeners(true, "escribir_novedad_modificacion", p);
											} else {
												rowData.id_tipo_titulo = this.data.oldValue;
												tableModelDest.setRowsAsMapArray([rowData], focusedRow, true);
											}
										},
						"context"     : this,
						"image"       : "icon/48/status/dialog-warning.png"
					})).show();
				}
			}, this);
			rpc.addListener("failed", function(e){
				var data = e.getData();
				
				rowData.id_tipo_titulo = this.data.oldValue;
				tableModelDest.setRowsAsMapArray([rowData], focusedRow, true);
				
				if (data.message == "titulo_ya_asignado") dialog.Dialog.error("El título seleccionado ya ha sido asignado al espacio.");
				if (data.message == "novedad_existente") dialog.Dialog.error("Ya existe una novedad pendiente de ser impactada para el título, carrera, y espacio seleccionados.");
			}, this);
			rpc.callAsyncListeners(true, "verificar_novedad_modificacion", p);
		}
	});
	
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
	//tableColumnModelDest.setDataCellRenderer(3, cellrenderer);


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
		var selectionEmpty = selectionModelDest.isSelectionEmpty();
		btnEliminar.setEnabled(! selectionEmpty);
		menu.memorizar([btnEliminar]);
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
			var bandera = true;
			
			if (lstCarreraD.isSelectionEmpty()) {
				bandera = false;
				cboCarreraD.setValid(false);
				cboCarreraD.focus();
				
				sharedErrorTooltip.setLabel("Debe seleccionar carrera");
				sharedErrorTooltip.placeToWidget(cboCarreraD);
			}
			
			if (lstEspacioD.isSelectionEmpty()) {
				bandera = false;
				cboEspacioD.setValid(false);
				cboEspacioD.focus();
				
				sharedErrorTooltip.setLabel("Debe seleccionar espacio");
				sharedErrorTooltip.placeToWidget(cboEspacioD);
			}
			
			if (bandera) {
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
				
				var aux = tblDest.buscar("id_titulo", rowData.id_titulo);
				
				if (aux == null) {
					var p = {};
					p.espacio = lstEspacioD.getSelection()[0].getUserData("datos");
					p.carrera = lstCarreraD.getSelection()[0].getUserData("datos");
					p.titulo = [rowData];
					
					//alert(qx.lang.Json.stringify(p, null, 2));
					
					var rpc = new sical3.comp.rpc.Rpc("services/", "comp.IncumbenciaTitulosxEspacio");
					rpc.addListener("completed", function(e){
						var data = e.getData();
						
						if (data.result.id_tomo_espacio != null) {
							functionDest_disappear(null, data.result.id_tomo_espacio);
							
							dialog.Dialog.alert("El alta se registro con éxito.");
						} else {
							dialog.Dialog.alert("Se ha generado una novedad que estará pendiente de confirmación.");
						}
						
						lstTitulo.resetSelection();
						cboTitulo.setValue("");
						cboTitulo.focus();
					});
					rpc.addListener("failed", function(e){
						var data = e.getData();
						
						if (data.message == "titulo_ya_asignado") dialog.Dialog.error("El título seleccionado ya ha sido asignado al espacio.");
						if (data.message == "novedad_existente") dialog.Dialog.error("Ya existe una novedad pendiente de ser impactada para el título, carrera, y espacio seleccionados.");
					});
					rpc.callAsyncListeners(true, "guardar_titulos", p);

				} else {
					dialog.Dialog.warning("Ya existe el título seleccionado en el espacio/carrera seleccionado.", function(e){
						cboTitulo.focus();
					});
				}
			} else {
				sharedErrorTooltip.show();
			}
		}
	})
	gbxTitulo.add(btnAgregar, {row: 2, column: 4});
	
	
	
	
	var btnConfirmar = new qx.ui.form.Button("Confirmar...");
	btnConfirmar.addListener("execute", function(e){
		/*
		var bandera = true;
		
		//if (false) {
		if (modelDest > 0) {
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
						//return;
						
						var rpc = new sical3.comp.rpc.Rpc("services/", "comp.ComisionDeTitulos");
						rpc.addListener("completed", function(e){
							var data = e.getData();
							
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
						});
						rpc.callAsyncListeners(true, "guardar_titulos", p);
					}
				});
			} else {
				sharedErrorTooltip.show();
			}
		}
		*/
	})
	//this.add(btnConfirmar, {left: "20%", bottom: 50});
	
	
	
	
	
	cboEspacioD.setTabIndex(1);
	cboCarreraD.setTabIndex(2);
	tblDest.setTabIndex(3);
	cboTitulo.setTabIndex(4);
	slbTipo_clasificacion.setTabIndex(5);
	slbTipo_titulo.setTabIndex(6);
	btnAgregar.setTabIndex(7);
	btnConfirmar.setTabIndex(8);
	
		
	},
	members : 
	{

	}
});