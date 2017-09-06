/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "sical3"
 *
 * @asset(sical3/*)
 */
qx.Class.define("sical3.Application",
{
  extend : qx.application.Standalone,



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * This method contains the initial application code and gets called 
     * during startup of the application
     * 
     * @lint ignoreDeprecated(alert)
     */
    main : function()
    {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
      -------------------------------------------------------------------------
      */



      // Document is the application root
	var doc = this.getRoot();
	
	doc.set({blockerColor: '#bfbfbf', blockerOpacity: 0.4});
	
	var functionLogin = this.functionLogin = function(functionSuccess) {
		var loginWidget = new dialog.Login({
			text : "Ingrese datos de identificación",
			checkCredentials : function(username, password, callback) {
				loginWidget._username.setValid(true);
				loginWidget._password.setValid(true);
				
				var p = {};
				p.usuario = username;
				p.password = password;
				
				var rpc = new qx.io.remote.Rpc("services/", "comp.ControlAcceso");
				rpc.setTimeout(1000 * 60);
				rpc.callAsync(function(resultado, error, id){
					//alert(qx.lang.Json.stringify(resultado, null, 2));
					//alert(qx.lang.Json.stringify(error, null, 2));
					
					if (error) {
						callback(error);
					} else {
						callback(null, resultado);
					}
				}, "login", p);
			},
			callback : function(err, data) {
				if(err) {
					//alert(qx.lang.Json.stringify(err, null, 2));
				} else {
					//alert(qx.lang.Json.stringify(data, null, 2));
				}
			}
		});
		
		loginWidget._username.getLayoutParent().getLayout().getCellWidget(0, 0).setValue("Usuario:");
		loginWidget._username.getLayoutParent().getLayout().getCellWidget(1, 0).setValue("Contraseña:");
		
		//loginWidget._username.getLayoutParent().getLayout().getCellWidget(0, 1).setValue("danielramirez");
		//loginWidget._username.getLayoutParent().getLayout().getCellWidget(1, 1).setValue("danielramirez");
		loginWidget._username.setValue("danielramirez");
		loginWidget._password.setValue("danielramirez");
		
		
		loginWidget._password.setInvalidMessage("Contraseña incorrecta");
		
		loginWidget.setAllowCancel(false);
		loginWidget._loginButton.setLabel("Aceptar");
		loginWidget._username.addListener("appear", function(e) {
			//loginWidget.activate();
			loginWidget._username.focus();
		});
		
		loginWidget.addListener("loginSuccess", functionSuccess);
		loginWidget.addListener("loginFailure", function(e){
			var data = e.getData();
			if (data.message=="permiso") {
				loginWidget._username.setInvalidMessage("El usuario no cuenta con los permisos necesarios");
				loginWidget._username.setValid(false);
				loginWidget._username.focus();
			} else if (data.message=="nick") {
				loginWidget._username.setInvalidMessage("Usuario no encontrado");
				loginWidget._username.setValid(false);
				loginWidget._username.focus();
			} else if (data.message=="password") {
				loginWidget._password.setValid(false);
				loginWidget._password.focus();
			}
		});
		
		loginWidget.show();
	}
	
	
	
	functionLogin(qx.lang.Function.bind(function(e) {
		var data = e.getData();
		
		this.login = data;
		
		//alert(qx.lang.Json.stringify(data, null, 2));

		this._InitAPP();
	}, this));
	
	
	
	
    },
    
	_InitAPP : function ()
	{
		
      // Document is the application root
	var doc = this.getRoot();
	doc.set({blockerColor: '#bfbfbf', blockerOpacity: 0.4});
	
	//alert("entrooo");
	
	
	
	this.tipo_clasificacion = null;
	this.tipo_titulo = null;

	
	var rpc = new qx.io.remote.Rpc("services/", "comp.ComisionDeTitulos");
	try {
		var resultado = rpc.callSync("leer_tipos_clasificacion");
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	this.tipo_clasificacion = resultado;
	

	var rpc = new qx.io.remote.Rpc("services/", "comp.ComisionDeTitulos");
	try {
		var resultado = rpc.callSync("leer_tipos_titulos");
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	this.tipo_titulo = resultado;
	

	
	var pageCategorizacionEspaciosTitulos;
	var pageNovedadesTomoCargos;
	var pageNovedadesTomoEspacios;
	
	
	var numberformatMontoEs = this.numberformatMontoEs = new qx.util.format.NumberFormat("es");
	numberformatMontoEs.setGroupingUsed(true);
	numberformatMontoEs.setMaximumFractionDigits(2);
	numberformatMontoEs.setMinimumFractionDigits(2);
	
	var numberformatMontoEn = this.numberformatMontoEn = new qx.util.format.NumberFormat("en");
	numberformatMontoEn.setGroupingUsed(false);
	numberformatMontoEn.setMaximumFractionDigits(2);
	numberformatMontoEn.setMinimumFractionDigits(2);
	
	var numberformatEntero = this.numberformatEntero = new qx.util.format.NumberFormat("en");
	numberformatEntero.setGroupingUsed(false);
	numberformatEntero.setMaximumFractionDigits(0);
	numberformatEntero.setMinimumFractionDigits(0);
      

	var contenedorMain = new qx.ui.container.Composite(new qx.ui.layout.Grow());
	var tabviewMain = this.tabviewMain = new qx.ui.tabview.TabView();
	doc.add(tabviewMain, {left: 0, top: 33, right: 0, bottom: 0});
	
	//contenedorMain.add(tabviewMain);
	
	
	var mnuArchivo = new qx.ui.menu.Menu();
	var btnAcercaDe = new qx.ui.menu.Button("Acerca de...");
	btnAcercaDe.addListener("execute", function(){
		/*
		var windowAcercaDe = new elpintao.comp.varios.windowAcercaDe();
		windowAcercaDe.setModal(true);
		doc.add(windowAcercaDe);
		windowAcercaDe.center();
		windowAcercaDe.open();
		*/
	});
	mnuArchivo.add(btnAcercaDe);
	
	
	var mnuComisionDeTitulos = new qx.ui.menu.Menu();
	
	var btnCategorizacionEspaciosTitulos = new qx.ui.menu.Button("Categorización de Espacios en Títulos...");
	btnCategorizacionEspaciosTitulos.addListener("execute", function(){
		if (pageCategorizacionEspaciosTitulos == null) {
			pageCategorizacionEspaciosTitulos = new sical3.comp.pageCategorizacionEspaciosTitulos();
			pageCategorizacionEspaciosTitulos.addListenerOnce("close", function(e){
				pageCategorizacionEspaciosTitulos = null;
			});
			tabviewMain.add(pageCategorizacionEspaciosTitulos);
		}
		tabviewMain.setSelection([pageCategorizacionEspaciosTitulos]);
	});
	mnuComisionDeTitulos.add(btnCategorizacionEspaciosTitulos);
	
	
	
	var btnNovedadesTomoCargos = new qx.ui.menu.Button("Novedades Tomo cargos...");
	btnNovedadesTomoCargos.addListener("execute", function(){
		if (pageNovedadesTomoCargos == null) {
			pageNovedadesTomoCargos = new sical3.comp.pageNovedadesTomoCargos();
			pageNovedadesTomoCargos.addListenerOnce("close", function(e){
				pageNovedadesTomoCargos = null;
			});
			tabviewMain.add(pageNovedadesTomoCargos);
		}
		tabviewMain.setSelection([pageNovedadesTomoCargos]);
	});
	mnuComisionDeTitulos.add(btnNovedadesTomoCargos);
	
	var btnNovedadesTomoEspacios = new qx.ui.menu.Button("Novedades Tomo espacios...");
	btnNovedadesTomoEspacios.addListener("execute", function(){
		if (pageNovedadesTomoEspacios == null) {
			pageNovedadesTomoEspacios = new sical3.comp.pageNovedadesTomoEspacios();
			pageNovedadesTomoEspacios.addListenerOnce("close", function(e){
				pageNovedadesTomoEspacios = null;
			});
			tabviewMain.add(pageNovedadesTomoEspacios);
		}
		tabviewMain.setSelection([pageNovedadesTomoEspacios]);
	});
	mnuComisionDeTitulos.add(btnNovedadesTomoEspacios);
	


	

	

	var mnuSesion = new qx.ui.menu.Menu();

	var btnCerrar = new qx.ui.menu.Button("Cerrar");
	btnCerrar.addListener("execute", function(e){
		//var rpc = new qx.io.remote.Rpc("services/", "comp.turnos.login");
		//var result = rpc.callSync("Logout");
		location.reload(true);
	});
	mnuSesion.add(btnCerrar);
	
	  
	var mnubtnArchivo = new qx.ui.toolbar.MenuButton('Archivo');
	
	var mnubtnEdicion = new qx.ui.toolbar.MenuButton('');
	
	if (this.login._usuario_organismo_area_id == "6") {
		mnubtnEdicion = new qx.ui.toolbar.MenuButton('Comisión de Títulos');
		mnubtnEdicion.setMenu(mnuComisionDeTitulos);
	}
	
	var mnubtnSesion = new qx.ui.toolbar.MenuButton('Sesión');

	
	mnubtnArchivo.setMenu(mnuArchivo);
	
	mnubtnSesion.setMenu(mnuSesion);
	  
	
	var toolbarMain = new qx.ui.toolbar.ToolBar();
	toolbarMain.add(mnubtnArchivo);
	toolbarMain.add(mnubtnEdicion);
	toolbarMain.add(mnubtnSesion);
	toolbarMain.addSpacer();
	
	
	
	doc.add(toolbarMain, {left: 5, top: 0, right: "50%"});
	
	doc.add(new qx.ui.basic.Label("Usuario: " + this.login._usuario), {left: "51%", top: 5});
	doc.add(new qx.ui.basic.Label("Org/Area: " + this.login._usuario_organismo_area), {left: "51%", top: 25});
	
	
	//doc.add(contenedorMain, {left: 0, top: 33, right: 0, bottom: 0});
	//doc.add(tabviewMain, {left: 0, top: 33, right: 0, bottom: 0});
	
	//var pageGeneral = this.pageGeneral = new vehiculos.comp.pageGeneral();
	//tabviewMain.add(pageGeneral);
	//tabviewMain.setSelection([pageGeneral]);
	
	
	//var page = new sical3.comp.pageCatEspTit();
	//tabviewMain.add(page);
	//tabviewMain.setSelection([page]);
	
	
	
	}
  },
	statics :
	{
		Login : function (title, usuario, functionClose, context)
		{
			var winLogin = new qx.ui.window.Window(title);
			winLogin.addListener("resize", winLogin.center, winLogin);
			winLogin.set({showMaximize:false, allowMaximize:false, showMinimize:false, showClose:false, modal:true, movable:false, resizable:false, showStatusbar:false});
			winLogin.setLayout(new qx.ui.layout.Basic());
			winLogin.addListenerOnce("appear", function(e){
				if ((usuario != "") && (usuario != null) && (usuario != undefined)) {
					txpPassword.focus();
				} else {
					txtUsuario.focus();
				}
			})
			
			/*
			var txtUsuario = new qx.ui.form.ow.TextField("Usuario:").set({enabled:true});
				txtUsuario.getLabel().setWidth(60);
			var txpPassword = new qx.ui.form.ow.PassField("Password:").set({enabled:true});
				txpPassword.getLabel().setWidth(60);
			var lblMSJ = new qx.ui.basic.Label("").set({rich:true, textAlign:'center', visibility:'excluded'});
			var btnIngresar = new qx.ui.form.Button("Validar Datos");
			var cmbServicios = new qx.ui.form.ow.ComboBox("Servicio:").set({visibility:'hidden'});
				cmbServicios.getLabel().setWidth(60);
				cmbServicios.getCombo().setWidth(500);
			*/
			
			var txtUsuario = new qx.ui.form.TextField("");
			var txpPassword = new qx.ui.form.PasswordField("");

			var lblMSJ = new qx.ui.basic.Label("").set({rich:true, textAlign:'center', visibility:'excluded'});
			var btnIngresar = new qx.ui.form.Button("Validar Datos");
			//var cmbServicios = new qx.ui.form.ComboBox().set({visibility:'hidden', width: 400});
			var cmbServicios = new qx.ui.form.SelectBox().set({visibility:'hidden', width: 400});

			
			if ((usuario != "") && (usuario != null) && (usuario != undefined)) {
				txtUsuario.setValue(usuario);
				txtUsuario.setEnabled(false);
			}
			
			txtUsuario.addListener("keydown", function (e) {
				if (e.getKeyIdentifier() === 'Enter') txpPassword.tabFocus();
			});
			
			txpPassword.addListener("keydown", function (e) {
				if (e.getKeyIdentifier() === 'Enter') btnIngresar.execute();
			});
			
			winLogin.add(new qx.ui.basic.Label("Usuario:"), {left:0, top:0});
			winLogin.add(txtUsuario, {left:150, top:0});
			winLogin.add(new qx.ui.basic.Label("Password:"), {left:0, top:30});
			winLogin.add(txpPassword, {left:150, top:30});
			winLogin.add(lblMSJ, {left:200, top:60});
			winLogin.add(new qx.ui.basic.Label("Servicio:"), {left:0, top:60});
			winLogin.add(cmbServicios, {left:150, top:60});
			winLogin.add(btnIngresar, {left:250, top:90});
			
			if ((usuario != "") && (usuario != null) && (usuario != undefined))	{
				var btnSalir = new qx.ui.form.Button("Salir e Ingresar con otro Usuario");
				btnSalir.addListener("execute", function (){
					location.reload(true);
				});
				
				winLogin.add(btnSalir);
			}
			
			btnIngresar.addListener("execute", function (e) {
				var rpc = new qx.io.remote.Rpc();
				rpc.setTimeout(10000);
				rpc.setUrl("services/");
				rpc.setServiceName("comp.turnos.login");
				var params = new Object();
				params.usuario = txtUsuario.getValue();
				params.password = txpPassword.getValue();
				//params.servicio = cmbServicios.getValue();
				params.servicio = "";
				try
				{
					if (btnIngresar.getLabel() != "Ingresar") {
						var result = rpc.callSync("Login", params);
						//alert(qx.lang.Json.stringify(result, null, 2));
						if (result.login == true) {
							txtUsuario.setEnabled(false);
							txpPassword.setEnabled(false);
							lblMSJ.setVisibility("excluded");
							lblMSJ.setValue("");
							cmbServicios.setVisibility("visible");
							//alert(qx.lang.Json.stringify(result));
							//cmbServicios.setNewValues(result.servicios);
							//alert(qx.lang.Json.stringify(result.servicios, null, 2));
							for (var x in result.servicios) {
								cmbServicios.add(new qx.ui.form.ListItem(result.servicios[x].label, result.servicios[x].icon, result.servicios[x]));
							}
							btnIngresar.setLabel("Ingresar");
						} else {
							if (result) {
								cmbServicios.setVisibility("hidden");
								lblMSJ.setValue("<font color='red'>Ud. no posee permisos para este Sistema.!</font>");
								lblMSJ.setVisibility("visible");
							} else {
								cmbServicios.setVisibility("hidden");
								lblMSJ.setValue("<font color='red'>Usuario y/o Password incorrecta!</font>");
								lblMSJ.setVisibility("visible");
							}
							if ((usuario != "") && (usuario != null) && (usuario != undefined)) {
								txpPassword.focus();
							} else {
								txtUsuario.focus();
							}
						}
					} else {
						//context.rowOrganismo_area = qx.util.Serializer.toNativeObject(cmbServicios.getChildControl("list").getModelSelection().getItem(0));
						context.rowOrganismo_area = qx.util.Serializer.toNativeObject(cmbServicios.getModelSelection().getItem(0));
						
						if (context.rowOrganismo_area.perfiles[qx.core.Init.getApplication().perfil] != null) {
							params.organismo_area = context.rowOrganismo_area;
							var result = rpc.callSync("Ingresar", params);
							context._SYSusuario = txtUsuario.getValue();
							
							winLogin.close();
						} else {
							dialog.Dialog.error("Ud. no tiene permisos para este sistema.", function(e){cmbServicios.focus();});
						}
					}
				} catch (ex) {
					lblMSJ.setValue("<font color='red'>Se produjo un error en el Sistema!</font>");
					alert(ex);
				}
			}, this);

			if ((functionClose != "") && (functionClose != null) && (functionClose != undefined)) {
				if (context)
					winLogin.addListener("close", functionClose, context);
				else
					winLogin.addListener("close", functionClose);
			}
			
			winLogin.open();
		}
	}
});
