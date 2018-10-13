qx.Class.define("sical3.comp.pageIncumbenciaEspaciosxTitulo",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);

	this.setLabel('Incumbencia de Espacios para un Título');
	this.toggleShowCloseButton();
	this.setLayout(new qx.ui.layout.Canvas());
	
	this.addListenerOnce("appear", function(e){
		cboTituloD.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	
	var sharedErrorTooltip = qx.ui.tooltip.Manager.getInstance().getSharedErrorTooltip();
	
	var lengthDest;
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
		
		if (lstTituloD.isSelectionEmpty()) {
			tableModelDest.setDataAsMapArray([], true);
			lengthDest = null;
			functionSeleccion();
		} else {
			var p = {};
			p.id_titulo = lstTituloD.getModelSelection().getItem(0);
			
			var rpc = new sical3.comp.rpc.Rpc("services/", "comp.IncumbenciaEspaciosxTitulo");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data.result, null, 2));
				
				tableModelDest.setDataAsMapArray(data.result, true);
				lengthDest = data.result.length;
				functionSeleccion();
				
				if (id_tomo_espacio != null) tblDest.buscar("id_tomo_espacio", id_tomo_espacio);
			});
			rpc.callAsyncListeners(true, "leer_espacios", p);
		}
	}
	
	
	
	var functionSeleccion = function() {
		if (lengthDest == null) {
			gbxAfin.setEnabled(false);
			gbxAgregar.setEnabled(false);
		} else if (lengthDest == 0) {
			gbxAfin.setEnabled(true);
			gbxAgregar.setEnabled(true);
			
			dialog.Dialog.warning("Atención<br/><br/>Luego de editar las incumbencias respectivas debe Confirmar los cambios realizados.");
		} else {
			gbxAfin.setEnabled(false);
			gbxAgregar.setEnabled(true);
		}
	}
	
	
	
	var functionAgregar = function(rowData){
		var focusedRow;
		var bandera = true;
		
		var data = tableModelDest.getDataAsMapArray();
		for (var x = 0; x <= data.length - 1; x++) {
			if (data[x].id_carrera == rowData.id_carrera && data[x].id_espacio == rowData.id_espacio) {
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
		//selectionModelDest.setSelectionInterval(focusedRow, focusedRow);
		tblDest.focus();
		
		sharedErrorTooltip.hide();
		tblDest.setValid(true);
		
		return bandera;
	}
	
	

	
	
	
	
	




	
	
	
	var composite3 = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
	this.add(composite3, {left: 0, top: 0, right: 0, bottom: 140})
	
	
	composite3.add(new qx.ui.basic.Label("Título:"), {left: 0, top: 0});
	
	var cboTituloD = new sical3.comp.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.ComisionDeTitulos", methodName: "autocompletarTitulo"});
	cboTituloD.getChildControl("popup").addListener("disappear", functionDest_disappear);
	var lstTituloD = cboTituloD.getChildControl("list");
	lstTituloD.addListener("changeSelection", function(e){
		if (lstTituloD.isSelectionEmpty()) functionDest_disappear();
	}, this);
	composite3.add(cboTituloD, {left: 70, top: 0, right: "25%"});
	
	
	
	
	
	
	
	
	
	//Menu
	
	var menu = new componente.comp.ui.ramon.menu.Menu();
	var btnEliminar = new qx.ui.menu.Button("Eliminar...");
	btnEliminar.setEnabled(false);
	btnEliminar.addListener("execute", function(e){
		
		if (lengthDest == 0) {
			var focusedRow = tblDest.getFocusedRow();
			tableModelDest.removeRows(focusedRow, 1);
			
		} else {
		
			(new dialog.Confirm({
				"message"     : "Desea eliminar la incumbencia del cargo seleccionado para este título?",
				"callback"    : function(e){
									if (e) {
										var rowData = tableModelDest.getRowDataAsMap(tblDest.getFocusedRow());
										
										var p = {};
										p.cargo = lstTituloD.getSelection()[0].getUserData("datos");
										p.titulo = [rowData];
										
										//alert(qx.lang.Json.stringify(p, null, 2));
										
										var rpc = new sical3.comp.rpc.Rpc("services/", "comp.IncumbenciaTitulosxCargo");
										rpc.addListener("completed", function(e){
											//var data = e.getData();
											//alert(qx.lang.Json.stringify(data, null, 2));
											
											dialog.Dialog.alert("Se ha generado una novedad que estará pendiente de confirmación.");
										});
										rpc.addListener("failed", function(e){
											var data = e.getData();
											//alert(qx.lang.Json.stringify(data, null, 2));
											if (data.message == "novedad_existente") dialog.Dialog.error("Ya existe una novedad pendiente de ser impactada para el título y cargo seleccionados.");
										});
										rpc.callAsyncListeners(true, "eliminar_titulo", p);
									}
								},
				"context"     : this,
				"image"       : "icon/48/status/dialog-warning.png"
			})).show();
		}
	});
	menu.add(btnEliminar);
	menu.memorizar();
	
	
	
	
	
	//Tabla
	
	
	var tableModelDest = new qx.ui.table.model.Simple();
	tableModelDest.setColumns(["Carrera", "Espacio", "Tipo cla.", "Tipo tit."], ["carrera_descrip", "espacio_descrip", "tipo_clasificacion", "id_tipo_titulo"]);
	tableModelDest.setColumnEditable(3, true);
	tableModelDest.addListener("dataChanged", function(e){
		var rowCount = tableModelDest.getRowCount();
		
		tblDest.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " item" : " items"));
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
		
		if (lengthDest == 0) {
			
		} else {
		
			if (data.value != data.oldValue) {
				var focusedRow = tblDest.getFocusedRow();
				var rowData = tableModelDest.getRowDataAsMap(focusedRow);
				
				var p = {};
				p.cargo = lstTituloD.getSelection()[0].getUserData("datos");
				p.titulo = [rowData];
				
				//alert(qx.lang.Json.stringify(p, null, 2));
				//return
				
				var functionCompleted = function(e) {
					dialog.Dialog.alert("Se ha generado una novedad que estará pendiente de confirmación.");
				}
				
				var rpc = new sical3.comp.rpc.Rpc("services/", "comp.IncumbenciaTitulosxCargo");
				rpc.addListener("completed", function(e){
					var data = e.getData();
					
					p.message = data.result.message;
					
					if (data.result.message == "INSERT") {
						var rpc = new sical3.comp.rpc.Rpc("services/", "comp.IncumbenciaTitulosxCargo");
						rpc.addListener("completed", functionCompleted);
						rpc.callAsyncListeners(true, "escribir_novedad_modificacion", p);
						
					} else if (data.result.message == "UPDATE") {
						p.id_nov_tomo_espacios = data.result.id_nov_tomo_espacios;
						
						(new dialog.Confirm({
							"message"     : "Ya existe modificación previa pendiente de ser impactada. Desea continuar con la nueva modificación?",
							"callback"    : function(e){
												if (e) {
													var rpc = new sical3.comp.rpc.Rpc("services/", "comp.IncumbenciaTitulosxCargo");
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
					
					if (data.message == "titulo_ya_asignado") dialog.Dialog.error("El título seleccionado ya ha sido asignado al cargo.");
					if (data.message == "novedad_existente") dialog.Dialog.error("Ya existe una novedad pendiente de ser impactada para el título y cargo seleccionados.");
				}, this);
				rpc.callAsyncListeners(true, "verificar_novedad_modificacion", p);
			}
		}
	});
	
	var tableColumnModelDest = tblDest.getTableColumnModel();
	
	var resizeBehavior = tableColumnModelDest.getBehavior();
	resizeBehavior.set(0, {width:"35%", minWidth:100});
	resizeBehavior.set(1, {width:"35%", minWidth:100});
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
	
	
	

	var layout = new qx.ui.layout.Grid(6, 6);
	var gbxAfin = new qx.ui.groupbox.GroupBox("");
	gbxAfin.setLayout(layout);
	gbxAfin.setEnabled(false);
	this.add(gbxAfin, {left: 0, right: "80%", bottom: 0});
	
	var btnAgregarAfin = new qx.ui.form.Button("Agregar espacios desde título afín...");
	btnAgregarAfin.addListener("execute", function(e){
		var win = new sical3.comp.windowEspaciosxTituloAfin();
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
		
			functionAgregar(data);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	gbxAfin.add(btnAgregarAfin, {row: 0, column: 1, colSpan: 40});
	//layout.setColumnFlex(1, 1);
	
	
	var btnConfirmar = new qx.ui.form.Button("Confirmar...");
	btnConfirmar.addListener("execute", function(e){
		var bandera = true;
		

			if (tableModelDest.getRowCount() == 0) {
				bandera = false;
				tblDest.setValid(false);
				
				sharedErrorTooltip.setLabel("Debe ingresar cargos categorizados");
				sharedErrorTooltip.placeToWidget(tblDest);
			}
			
			if (bandera) {
				dialog.Dialog.confirm("Desea incluir los cargos seleccionados en el título destino?", function(e){
					if (e) {
						var p = {};
						p.titulo = lstTituloD.getSelection()[0].getUserData("datos");
						p.cargo = tableModelDest.getDataAsMapArray();
						
						alert(qx.lang.Json.stringify(p, null, 2));
						return;
						
						var rpc = new sical3.comp.rpc.Rpc("services/", "comp.ComisionDeTitulos");
						rpc.addListener("completed", function(e){
							var data = e.getData();
							
							lstTituloD.resetSelection();
							cboTituloD.setValue("");
							
							tableModelDest.setDataAsMapArray([], true);
							
							dialog.Dialog.alert("El alta de cargos para el título destino se ha realizado con éxito.", function(e){
								cboTituloD.focus();
							});
						});
						rpc.callAsyncListeners(true, "guardar_cargos", p);
					}
				});
			} else {
				sharedErrorTooltip.show();
			}
	})
	gbxAfin.add(btnConfirmar, {row: 2, column: 1, colSpan: 40});
	//layout.setColumnFlex(1, 1);
	




	var layout = new qx.ui.layout.Grid(6, 6);
	var gbxAgregar = new qx.ui.groupbox.GroupBox("Agregar espacio");
	gbxAgregar.setLayout(layout);
	gbxAgregar.setEnabled(false);
	this.add(gbxAgregar, {left: "53%", right: 0, bottom: 0});

	
	
	gbxAgregar.add(new qx.ui.basic.Label("Espacio:"), {row: 0, column: 0});
	
	var cboEspacio = new sical3.comp.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.ComisionDeTitulos", methodName: "autocompletarEspacio"});
	cboEspacio.setRequired(true);
	var lstEspacio = cboEspacio.getChildControl("list");
	lstEspacio.addListener("changeSelection", function(e){
		var data = e.getData();
		
		if (lstEspacio.isSelectionEmpty()) {
			cboCarrera.setPhpParametros(null);
		} else {
			cboCarrera.setPhpParametros({id_espacio: data[0].getModel()});
		}
	});
	gbxAgregar.add(cboEspacio, {row: 0, column: 1, colSpan: 4});
	layout.setColumnFlex(1, 1);
	
	
	gbxAgregar.add(new qx.ui.basic.Label("Carrera:"), {row: 1, column: 0});
	
	var cboCarrera = new sical3.comp.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.ComisionDeTitulos", methodName: "autocompletarCarrera"});
	cboCarrera.setRequired(true);
	var lstCarrera = cboCarrera.getChildControl("list");
	lstCarrera.addListener("changeSelection", function(e){
		var data = e.getData();
		
		if (lstCarrera.isSelectionEmpty()) {
			cboEspacio.setPhpParametros(null);
		} else {
			cboEspacio.setPhpParametros({id_carrera: data[0].getModel()});
		}
	});
	gbxAgregar.add(cboCarrera, {row: 1, column: 1, colSpan: 4});
	
	
	
	
	
	
	
	gbxAgregar.add(new qx.ui.basic.Label("Tipo clasificación:"), {row: 2, column: 0});
	
	var slbTipo_clasificacion = new qx.ui.form.SelectBox();
	for (var x in application.tipo_clasificacion) {
		//var item = new qx.ui.form.ListItem(application.tipo_clasificacion[x].denominacion, null, application.tipo_clasificacion[x]);
		slbTipo_clasificacion.add(new qx.ui.form.ListItem(application.tipo_clasificacion[x].descrip, null, application.tipo_clasificacion[x]));
	}
	gbxAgregar.add(slbTipo_clasificacion, {row: 2, column: 1});
	layout.setColumnFlex(1, 1);
	
	
	
	gbxAgregar.add(new qx.ui.basic.Label("Tipo título:"), {row: 2, column: 2});
	
	var slbTipo_titulo = new qx.ui.form.SelectBox();
	for (var x in application.tipo_titulo) {
		//var item = new qx.ui.form.ListItem(application.tipo_clasificacion[x].denominacion, null, application.tipo_clasificacion[x]);
		slbTipo_titulo.add(new qx.ui.form.ListItem(application.tipo_titulo[x].descrip, null, application.tipo_titulo[x]));
	}
	gbxAgregar.add(slbTipo_titulo, {row: 2, column: 3});
	layout.setColumnFlex(3, 1);
	
	
	var btnAgregar = new qx.ui.form.Button("Agregar");
	btnAgregar.addListener("execute", function(e){
		if (lstEspacio.isSelectionEmpty()) {
			cboEspacio.focus();
		} else if (lstCarrera.isSelectionEmpty()) {
			cboCarrera.focus();
		} else {
			
			var datos = lstCargo.getSelection()[0].getUserData("datos");
			var tipo_clasificacion = slbTipo_clasificacion.getSelection()[0].getModel();
			var tipo_titulo = slbTipo_titulo.getSelection()[0].getModel();
			
			var rowData = {};
			rowData.cod_cargo = datos.codigo;
			rowData.cargo_descrip = datos.denominacion;
			rowData.tipo_clasificacion = tipo_clasificacion.denominacion;
			rowData.tipo_titulo = tipo_titulo.tipo;
			rowData.id_cargo = datos.model;
			rowData.id_tipo_titulo = tipo_titulo.id_tipo_titulo;
			rowData.cod_tipo_titulo = tipo_titulo.codigo;
			rowData.id_tipo_clasificacion = tipo_clasificacion.id_tipo_clasificacion;
			rowData.id_nivel = datos.id_nivel;
			rowData.nivel = datos.nivel;
			
			
			if (tblDest.buscar("id_cargo", rowData.id_cargo) == null) {
				if (lengthDest == 0) {
					tableModelDest.addRowsAsMapArray([rowData], null, true);
					var focusedRow = tableModelDest.getRowCount() - 1;

					tblDest.setFocusedCell(3, focusedRow, true);
					tblDest.focus();
					//selectionModelDest.setSelectionInterval(focusedRow, focusedRow);
					
					lstCargo.resetSelection();
					cboCargo.setValue("");
					cboCargo.focus();
				} else {

					var p = {};
					p.titulo = lstTituloD.getSelection()[0].getUserData("datos");
					p.cargo = [rowData];
					
					alert(qx.lang.Json.stringify(p, null, 2));
					return
					
					var rpc = new sical3.comp.rpc.Rpc("services/", "comp.IncumbenciaCargosxTitulo");
					rpc.addListener("completed", function(e){
						var data = e.getData();
						
						if (data.result.id_tomo_espacio != null) {
							functionDest_disappear(null, data.result.id_tomo_espacio);
							
							dialog.Dialog.alert("El alta se registro con éxito.", function(e){cboCargo.focus();});
						} else {
							dialog.Dialog.alert("Se ha generado una novedad que estará pendiente de confirmación.", function(e){cboCargo.focus();});
						}
						
						lstCargo.resetSelection();
						cboCargo.setValue("");
						cboCargo.focus();
					});
					rpc.addListener("failed", function(e){
						var data = e.getData();
						
						if (data.message == "cargo_ya_asignado") dialog.Dialog.error("El cargo seleccionado ya ha sido asignado al título.");
						if (data.message == "novedad_existente") dialog.Dialog.error("Ya existe una novedad pendiente de ser impactada para el cargo y título seleccionados.");
					});
					rpc.callAsyncListeners(true, "guardar_cargos", p);
				}

			} else {
				if (lengthDest == 0) {
					
				} else {
					dialog.Dialog.warning("Ya existe el cargo seleccionado en el título seleccionado.", function(e){
						cboCargo.focus();
					});
				}
			}
		}
	})
	gbxAgregar.add(btnAgregar, {row: 2, column: 4});
	
	
	
	
	
	
	
	cboTituloD.setTabIndex(1);
	tblDest.setTabIndex(3);
	cboEspacio.setTabIndex(4);
	cboCarrera.setTabIndex(5);
	slbTipo_clasificacion.setTabIndex(6);
	slbTipo_titulo.setTabIndex(7);
	btnAgregar.setTabIndex(8);
	
		
	},
	members : 
	{

	}
});