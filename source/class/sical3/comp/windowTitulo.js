qx.Class.define("sical3.comp.windowTitulo",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (rowData)
	{
	this.base(arguments);
	
	this.set({
		caption: "Nuevo título",
		width: 800,
		height: 600,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		txtDescrip.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	var aux;
	var sharedErrorTooltip = qx.ui.tooltip.Manager.getInstance().getSharedErrorTooltip();

	
	var form = new qx.ui.form.Form();
	
	
	var txtDescrip = new qx.ui.form.TextField("");
	txtDescrip.setRequired(true);
	txtDescrip.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	form.add(txtDescrip, "Descripción", null, "denominacion", null, {tabIndex: 1, item: {row: 0, column: 1, colSpan: 10}});
	
	
	var slbGrado_titulo = new qx.ui.form.SelectBox();
	
	var rpc = new sical3.comp.rpc.Rpc("services/", "comp.Parametros");
	try {
		var resultado = rpc.callSync("autocompletarGrados_titulos", {texto: ""});
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
		
	for (var x in resultado) {
		slbGrado_titulo.add(new qx.ui.form.ListItem(resultado[x].label, null, resultado[x].model));
	}
	
	form.add(slbGrado_titulo, "Grado", null, "id_grado_titulo", null, {tabIndex: 1, item: {row: 1, column: 1, colSpan: 6}});
	
	
	
	var cboId_institucion = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarInstitucion"}, {tipo: "combobox"});
	//cboDependencia.setRequired(true);
	form.add(cboId_institucion, "Inst.que otorga", null, "cboDependencia", null, {tabIndex: 1, item: {row: 2, column: 1, colSpan: 10}});
	var lstId_institucion = cboId_institucion.getChildControl("list");
	form.add(lstId_institucion, "", null, "id_institucion");
	
	
	var slbNivel_otorga = new qx.ui.form.SelectBox();
	
	var rpc = new sical3.comp.rpc.Rpc("services/", "comp.Parametros");
	try {
		var resultado = rpc.callSync("autocompletarNivel_otorga", {texto: ""});
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
		
	for (var x in resultado) {
		slbNivel_otorga.add(new qx.ui.form.ListItem(resultado[x].label, null, resultado[x].model));
	}
	
	form.add(slbNivel_otorga, "Nivel que otorga", null, "id_nivel_otorga", null, {tabIndex: 1, item: {row: 2, column: 13, colSpan: 5}});
	
	
	
	
	
	
	
	var chkDisciplina_unica = new qx.ui.form.CheckBox("Disciplina única");
	form.add(chkDisciplina_unica, "", null, "disciplina_unica", null, {tabIndex: 1, item: {row: 3, column: 1, colSpan: 4}});
	
	var txtNorma_creacion = new qx.ui.form.TextField();
	form.add(txtNorma_creacion, "Norma creación", null, "norma_creacion", null, {tabIndex: 1, item: {row: 3, column: 7, colSpan: 11}});
	
	
	var slbModalidad = new qx.ui.form.SelectBox();
	slbModalidad.add(new qx.ui.form.ListItem("Presencial", null, "P"));
	slbModalidad.add(new qx.ui.form.ListItem("Semipresencial", null, "S"));
	slbModalidad.add(new qx.ui.form.ListItem("Distancia", null, "D"));
	form.add(slbModalidad, "Modalidad", null, "modalidad_cursado", null, {tabIndex: 1, item: {row: 4, column: 1, colSpan: 5}});
	
	
	var slbEspecifico = new qx.ui.form.SelectBox();
	slbEspecifico.add(new qx.ui.form.ListItem("Si", null, "S"));
	slbEspecifico.add(new qx.ui.form.ListItem("No", null, "N"));
	form.add(slbEspecifico, "Específico p.Nivel Superior", null, "especifico", null, {tabIndex: 1, item: {row: 4, column: 8, colSpan: 2}});
	
	
	var txtRequisitos_ingreso = new qx.ui.form.TextArea();
	form.add(txtRequisitos_ingreso, "Requisitos de ingreso", null, "requisitos_ingreso", null, {tabIndex: 1, item: {row: 5, column: 1, colSpan: 13}});
	
	
	var txtAnios_duracion = new componente.comp.ui.ramon.spinner.Spinner(0, 0, 1000);
	txtAnios_duracion.getChildControl("upbutton").setVisibility("excluded");
	txtAnios_duracion.getChildControl("downbutton").setVisibility("excluded");
	txtAnios_duracion.setNumberFormat(application.numberformatEntero);
	form.add(txtAnios_duracion, "Años duración", null, "anios_duracion", null, {tabIndex: 1, item: {row: 6, column: 1, colSpan: 2}});
	
	
	var txtCarga_horaria = new componente.comp.ui.ramon.spinner.Spinner(0, 0, 1000);
	txtCarga_horaria.getChildControl("upbutton").setVisibility("excluded");
	txtCarga_horaria.getChildControl("downbutton").setVisibility("excluded");
	txtCarga_horaria.setNumberFormat(application.numberformatEntero);
	form.add(txtCarga_horaria, "Carga horaria", null, "carga_horaria", null, {tabIndex: 1, item: {row: 6, column: 4, colSpan: 2}});
	


	var gbx = new qx.ui.groupbox.GroupBox(" Nivel para el que habilita el Título ")
	gbx.setLayout(new qx.ui.layout.Basic());
	this.add(gbx, {left: 0, top: 300});
	
	
	var slbNivel = new qx.ui.form.SelectBox();
	
	var rpc = new sical3.comp.rpc.Rpc("services/", "comp.Parametros");
	try {
		var resultado = rpc.callSync("autocompletarNivel_otorga", {texto: ""});
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
		
	for (var x in resultado) {
		slbNivel.add(new qx.ui.form.ListItem(resultado[x].label, null, resultado[x].model));
	}
	
	gbx.add(slbNivel, {left: 0, top: 0});
	

	var btnAgregar = new qx.ui.form.Button("Agregar");
	gbx.add(btnAgregar, {left: 0, top: 30});
	
	
	
	
	
	var menu = new componente.comp.ui.ramon.menu.Menu();
	
	var btnEliminar = new qx.ui.menu.Button("Eliminar");
	btnEliminar.setEnabled(false);
	btnEliminar.addListener("execute", function(e){
		dialog.Dialog.confirm("Desea eliminar el mensaje seleccionado?", function(e){
			if (e) {
				var p = {id_mensaje: list.getModelSelection().getItem(0).get("id_mensaje")};

				var rpc = new qx.io.remote.Rpc(application.conexion.rpc_elpintao_services, "componente.elpintao.ramon.Productos");
				try {
					var resultado = rpc.callSync("eliminar_mensaje", p);
				} catch (ex) {
					alert("Sync exception: " + ex);
				}
				
				store.reload();
			}
		});
	});
	menu.add(btnEliminar);
	menu.memorizar();
  
  
  
  // create and add the list
  var list = new componente.comp.ui.ramon.list.List();
  list.setSelectionMode("one");
  list.setContextMenu(menu);
  list.addListener("changeSelection", function(e){
  	var bool = !list.isSelectionEmpty();
  	//commandVerMensaje.setEnabled(bool);
  	//menu.memorizar([commandVerMensaje]);
  	menu.memorizarEnabled([btnEliminar], bool);
  });
  gbx.add(list, {left: 150, top: 0});

	
	
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	//var formView = new qx.ui.form.renderer.Single(form);
	var formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 30, 30);
	this.add(formView, {left: 0, top: 0});
	
	
	
	if (rowData == null) {
		this.setCaption("Nuevo título");
		
		aux = qx.data.marshal.Json.createModel({id_titulo: "0", denominacion: "", id_nivel: "0", jornada_completa: false, subtipo: null}, true);
	} else {
		this.setCaption("Modificar título");
		
		//alert(qx.lang.Json.stringify(rowData, null, 2));
		
		aux = qx.data.marshal.Json.createModel(rowData, true);
	}
	
	controllerForm.setModel(aux);
	
	
	
	
	
	
	
	
	
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (form.validate()) {
			var p = {};
			p.model = qx.util.Serializer.toNativeObject(controllerForm.getModel());
			
			if (p.model.id_nivel != "2") p.model.jornada_completa = false;
			if (p.model.id_nivel != "5") p.model.subtipo = null;

			
			//alert(qx.lang.Json.stringify(p, null, 2));
			
			var rpc = new sical3.comp.rpc.Rpc("services/", "comp.Parametros");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				this.fireDataEvent("aceptado", data.result);
				
				btnCancelar.execute();
			}, this);
			rpc.addListener("failed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));
				
				if (data.message == "descrip_duplicado") {
					txtDescrip.setInvalidMessage("Ya existe un título con la misma descripción");
					txtDescrip.setValid(false);
					txtDescrip.focus();
					
					sharedErrorTooltip.setLabel(txtDescrip.getInvalidMessage());
					sharedErrorTooltip.placeToWidget(txtDescrip);
					sharedErrorTooltip.show();
				}
			}, this);
			rpc.callAsyncListeners(true, "alta_modifica_titulo", p);
			
		} else {
			form.getValidationManager().getInvalidFormItems()[0].focus();
		}
	}, this);
	
	var btnCancelar = new qx.ui.form.Button("Cancelar");
	btnCancelar.addListener("execute", function(e){
		this.close();
		
		this.destroy();
	}, this);
	
	this.add(btnAceptar, {left: "20%", bottom: 0});
	this.add(btnCancelar, {right: "20%", bottom: 0});
	
	},

	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});