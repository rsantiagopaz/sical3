qx.Class.define("sical3.comp.windowTituloAfin",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
	this.base(arguments);
	
	this.set({
		caption: "Agregar cargos desde título afín",
		width: 800,
		height: 800,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		cboTitulo.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
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


	
	
	var functionDest_disappear = function(e, id_tomo_cargo){
		
		tblDest.resetSelection();
		tblDest.setFocusedCell();
		
		if (lstTitulo.isSelectionEmpty()) {
			tableModelDest.setDataAsMapArray([], true);
		} else {
			var p = {};
			p.id_titulo = lstTitulo.getModelSelection().getItem(0);
			
			var rpc = new sical3.comp.rpc.Rpc("services/", "comp.IncumbenciaCargosxTitulo");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data.result, null, 2));
				
				tableModelDest.setDataAsMapArray(data.result, true);
			});
			rpc.callAsyncListeners(true, "leer_cargos", p);
		}
	}
	
	
	
	this.add(new qx.ui.basic.Label("Título:"), {left: 0, top: 0});
	
	var cboTitulo = new sical3.comp.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.ComisionDeTitulos", methodName: "autocompletarTitulo"});
	cboTitulo.getChildControl("popup").addListener("disappear", functionDest_disappear);
	var lstTitulo = cboTitulo.getChildControl("list");
	lstTitulo.addListener("changeSelection", function(e){
		if (lstTitulo.isSelectionEmpty()) functionDest_disappear();
	}, this);
	this.add(cboTitulo, {left: 70, top: 0, right: "25%"});
	
	
	
	
	//Tabla
	
	
	var tableModelDest = new qx.ui.table.model.Simple();
	tableModelDest.setColumns(["Cargo", "Nivel", "Tipo cla.", "Tipo tit."], ["cargo_descrip", "nivel", "tipo_clasificacion", "id_tipo_titulo"]);
	//tableModelDest.setColumnEditable(3, true);
	tableModelDest.addListener("dataChanged", function(e){
		var rowCount = tableModelDest.getRowCount();
		
		tblDest.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " item" : " items"));
		
		btnAddTodos.setEnabled(! (rowCount == 0));
	});

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblDest = new componente.comp.ui.ramon.table.Table(tableModelDest, custom);
	tblDest.modo = "normal";
	tblDest.setShowCellFocusIndicator(false);
	tblDest.toggleColumnVisibilityButtonVisible();
	tblDest.setRowHeight(45);
	tblDest.addListener("cellDbltap", function(e){
		btnAddUno.execute();
	});

	
	var tableColumnModelDest = tblDest.getTableColumnModel();
	
	var resizeBehavior = tableColumnModelDest.getBehavior();
	resizeBehavior.set(0, {width:"50%", minWidth:100});
	resizeBehavior.set(1, {width:"20%", minWidth:100});
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
		//var selectionEmpty = selectionModelDest.isSelectionEmpty();
		//btnEliminar.setEnabled(! selectionEmpty);
		//menu.memorizar([btnEliminar]);
		
		btnAddUno.setEnabled(! selectionModelDest.isSelectionEmpty());
	});

	this.add(tblDest, {left: 0, top: 60, right: 0, bottom: 40});
	
	
	
	
	
	
	var btnAddUno = new qx.ui.form.Button("Agregar");
	btnAddUno.setEnabled(false);
	btnAddUno.addListener("execute", function(e){
		var rowData = tableModelDest.getRowDataAsMap(tblDest.getFocusedRow());

		this.fireDataEvent("aceptado", rowData);
		
		this.focus();
	}, this);
	
	var btnAddTodos = new qx.ui.form.Button("Agregar todos");
	btnAddTodos.setEnabled(false);
	btnAddTodos.addListener("execute", function(e){
		var rowData;
		var dataAfin = tableModelDest.getDataAsMapArray();
		
		for (var x in dataAfin) {
			rowData = dataAfin[x];
			
			this.fireDataEvent("aceptado", rowData);
		}
		
		this.focus();
	}, this);
	
	var btnCancelar = new qx.ui.form.Button("Cerrar");
	btnCancelar.addListener("execute", function(e){
		this.close();
		
		this.destroy();
	}, this);
	
	this.add(btnAddUno, {left: "20%", bottom: 0});
	this.add(btnAddTodos, {left: "40%", bottom: 0});
	this.add(btnCancelar, {right: "20%", bottom: 0});
	
	
	
	
	cboTitulo.setTabIndex(1);
	tblDest.setTabIndex(2);
	btnAddUno.setTabIndex(3);
	btnAddTodos.setTabIndex(4);

	
	},

	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});