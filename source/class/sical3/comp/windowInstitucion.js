qx.Class.define("sical3.comp.windowInstitucion",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (rowData)
	{
	this.base(arguments);
	
	this.set({
		caption: "Nueva institución",
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

	
	var form = new qx.ui.form.Form();
	
	
	var txtDescrip = new qx.ui.form.TextField("");
	txtDescrip.setRequired(true);
	txtDescrip.setMinWidth(400);
	txtDescrip.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	form.add(txtDescrip, "Descripción", null, "denominacion");
	
	
	var slbPrestador = new qx.ui.form.SelectBox();
	slbPrestador.setRequired(true);
	slbPrestador.setWidth(400);
	
	var rpc = new sical3.comp.rpc.Rpc("services/", "comp.Parametros");
	try {
		var resultado = rpc.callSync("autocompletarProvincia", {texto: ""});
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
		
	for (var x in resultado) {
		slbPrestador.add(new qx.ui.form.ListItem(resultado[x].label, null, resultado[x].model));
	}
	
	form.add(slbPrestador, "Provincia", null, "id_provincia");
	



	
	
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	
	if (rowData == null) {
		this.setCaption("Nueva institución");
		
		aux = qx.data.marshal.Json.createModel({id_institucion: "0", denominacion: "", id_provincia: "0"}, true);
	} else {
		this.setCaption("Modificar institución");
		
		//alert(qx.lang.Json.stringify(rowData, null, 2));
		
		aux = qx.data.marshal.Json.createModel(rowData, true);
	}
	
	controllerForm.setModel(aux);
	
	
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (form.validate()) {
			var p = {};
			p.model = qx.util.Serializer.toNativeObject(controllerForm.getModel());
			
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
					txtDescrip.focus();
					txtDescrip.setInvalidMessage("Ya existe una institución con la misma descripción");
					txtDescrip.setValid(false);
				}
			}, this);
			rpc.callAsyncListeners(true, "alta_modifica_institucion", p);
			
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