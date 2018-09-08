qx.Class.define("sical3.comp.windowCargo",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (rowData)
	{
	this.base(arguments);
	
	this.set({
		caption: "Nuevo cargo",
		width: 500,
		height: 200,
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
	txtDescrip.setMinWidth(400);
	txtDescrip.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	form.add(txtDescrip, "Descripción", null, "denominacion");
	
	
	var slbNivel = new qx.ui.form.SelectBox();
	slbNivel.setRequired(true);
	slbNivel.setWidth(400);
	
	var rpc = new sical3.comp.rpc.Rpc("services/", "comp.Parametros");
	try {
		var resultado = rpc.callSync("autocompletarNivel", {texto: ""});
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
		
	for (var x in resultado) {
		slbNivel.add(new qx.ui.form.ListItem(resultado[x].label, null, resultado[x].model));
	}
	
	slbNivel.addListener("changeSelection", function(e){
		var data = e.getData();
		var model = data[0].getModel();
		
		if (model == "2") {
			formView.getLayout().getCellWidget(2, 0).setVisibility("visible");
			formView.getLayout().getCellWidget(2, 1).setVisibility("visible");
			
			formView.getLayout().getCellWidget(3, 0).setVisibility("hidden");
			formView.getLayout().getCellWidget(3, 1).setVisibility("hidden");
		} else if (model == "5") {
			formView.getLayout().getCellWidget(2, 0).setVisibility("hidden");
			formView.getLayout().getCellWidget(2, 1).setVisibility("hidden");
			
			formView.getLayout().getCellWidget(3, 0).setVisibility("visible");
			formView.getLayout().getCellWidget(3, 1).setVisibility("visible");
		} else {
			formView.getLayout().getCellWidget(2, 0).setVisibility("hidden");
			formView.getLayout().getCellWidget(2, 1).setVisibility("hidden");
		
			formView.getLayout().getCellWidget(3, 0).setVisibility("hidden");
			formView.getLayout().getCellWidget(3, 1).setVisibility("hidden");
		}
	});
	
	form.add(slbNivel, "Nivel", null, "id_nivel");
	
	
	var chkJornada_completa = new qx.ui.form.CheckBox("Jornada completa");
	form.add(chkJornada_completa, "", null, "jornada_completa");
	
	
	var slbSubtipo = new qx.ui.form.SelectBox();
	//slbSubtipo.setRequired(true);
	//slbSubtipo.setWidth(400);
	
	slbSubtipo.add(new qx.ui.form.ListItem("Especial", null, "E"));
	slbSubtipo.add(new qx.ui.form.ListItem("Capacitación", null, "C"));
	slbSubtipo.add(new qx.ui.form.ListItem("Adulto", null, "A"));
	
	form.add(slbSubtipo, "Subtipo", null, "subtipo");
	



	
	
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	formView.getLayout().getCellWidget(2, 0).setVisibility("hidden");
	formView.getLayout().getCellWidget(2, 1).setVisibility("hidden");
		
	formView.getLayout().getCellWidget(3, 0).setVisibility("hidden");
	formView.getLayout().getCellWidget(3, 1).setVisibility("hidden");
	
	
	if (rowData == null) {
		this.setCaption("Nuevo cargo");
		
		aux = qx.data.marshal.Json.createModel({id_cargo: "0", denominacion: "", id_nivel: "0", jornada_completa: false, subtipo: null}, true);
	} else {
		this.setCaption("Modificar cargo");
		
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
					txtDescrip.setInvalidMessage("Ya existe un cargo con la misma descripción");
					txtDescrip.setValid(false);
					txtDescrip.focus();
					
					sharedErrorTooltip.setLabel(txtDescrip.getInvalidMessage());
					sharedErrorTooltip.placeToWidget(txtDescrip);
					sharedErrorTooltip.show();
				}
			}, this);
			rpc.callAsyncListeners(true, "alta_modifica_cargo", p);
			
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