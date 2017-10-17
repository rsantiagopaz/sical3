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
				
				var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.ControlAcceso");
				rpc.addListener("completed", function(e){
					var data = e.getData();
				
					callback(null, data.result);
				});
				rpc.addListener("failed", function(e){
					var data = e.getData();
					
					callback(data);
				});
				rpc.callAsyncListeners(true, "login", p);

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
		loginWidget._password.setValue("daniel");
		
		
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
			
			if (data.message=="mantenimiento") {
				dialog.Dialog.warning("Atención: Esta aplicación fue desactivada temporalmente por tareas de mantenimiento. Consultar administrador.", function(e){loginWidget._username.focus();});
			} else if (data.message=="permiso") {
				loginWidget._username.setInvalidMessage("El usuario no cuenta con los permisos necesarios");
				loginWidget._username.setValid(false);
				loginWidget._username.focus();
			} else if (data.message=="nick") {
				loginWidget._username.setInvalidMessage("Usuario no encontrado");
				loginWidget._username.setValid(false);
				loginWidget._username.focus();
			} else if (data.message=="password") {
				loginWidget._password.setInvalidMessage("Contraseña inválida");
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

	
	var rpc1 = new sical3.comp.rpc.Rpc("services/", "comp.ComisionDeTitulos");
	rpc1.addListener("completed", function(e){
		var data = e.getData();
		
		//alert(qx.lang.Json.stringify(data, null, 2));
		
		this.tipo_clasificacion = data.result;
	}, this);
	rpc1.callAsyncListeners(true, "leer_tipos_clasificacion");
	
	var rpc2 = new sical3.comp.rpc.Rpc("services/", "comp.ComisionDeTitulos");
	rpc2.addListener("completed", function(e){
		var data = e.getData();
		
		this.tipo_titulo = data.result;
	}, this);
	rpc2.callAsyncListeners(true, "leer_tipos_titulos");
	
	

	

		
	var pageCategorizacionEspaciosTitulos;
	var pageIncumbenciaTitulosxCargo;
	var pageIncumbenciaTitulosxEspacio;
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
		var win = new sical3.comp.windowAcercaDe();
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	});
	mnuArchivo.add(btnAcercaDe);
	
	
	var mnuComisionDeTitulos = new qx.ui.menu.Menu();
	
	
	
	var mnuTitulosEnCargos = new qx.ui.menu.Menu();
	var btnTitulosEnCargos = new qx.ui.menu.Button("Títulos en Cargos ", null, null, mnuTitulosEnCargos);
	mnuComisionDeTitulos.add(btnTitulosEnCargos);
	
	
	var btnIncumbenciaTitulosxCargo = new qx.ui.menu.Button("Incumbencia de Títulos para un Cargo...");
	btnIncumbenciaTitulosxCargo.addListener("execute", function(){
		if (pageIncumbenciaTitulosxCargo == null) {
			pageIncumbenciaTitulosxCargo = new sical3.comp.pageIncumbenciaTitulosxCargo();
			pageIncumbenciaTitulosxCargo.addListenerOnce("close", function(e){
				pageIncumbenciaTitulosxCargo = null;
			});
			tabviewMain.add(pageIncumbenciaTitulosxCargo);
		}
		tabviewMain.setSelection([pageIncumbenciaTitulosxCargo]);
	});
	mnuTitulosEnCargos.add(btnIncumbenciaTitulosxCargo);
	
	
	
	
	
	
	
	var mnuTitulosEnEspacios = new qx.ui.menu.Menu();
	var btnTitulosEnEspacios = new qx.ui.menu.Button("Títulos en Espacios ", null, null, mnuTitulosEnEspacios);
	mnuComisionDeTitulos.add(btnTitulosEnEspacios);
	
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
	mnuTitulosEnEspacios.add(btnCategorizacionEspaciosTitulos);
	
	
	
	var btnIncumbenciaTitulosxEspacio = new qx.ui.menu.Button("Incumbencia de Títulos para un Espacio...");
	btnIncumbenciaTitulosxEspacio.addListener("execute", function(){
		if (pageIncumbenciaTitulosxEspacio == null) {
			pageIncumbenciaTitulosxEspacio = new sical3.comp.pageIncumbenciaTitulosxEspacio();
			pageIncumbenciaTitulosxEspacio.addListenerOnce("close", function(e){
				pageIncumbenciaTitulosxEspacio = null;
			});
			tabviewMain.add(pageIncumbenciaTitulosxEspacio);
		}
		tabviewMain.setSelection([pageIncumbenciaTitulosxEspacio]);
	});
	mnuTitulosEnEspacios.add(btnIncumbenciaTitulosxEspacio);
	
	
	
	var mnuNovedades = new qx.ui.menu.Menu();
	var btnNovedades = new qx.ui.menu.Button("Novedades", null, null, mnuNovedades);
	mnuComisionDeTitulos.add(btnNovedades);
	
	
	
	var btnNovedadesTomoCargos = new qx.ui.menu.Button("Tomo Cargos...");
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
	mnuNovedades.add(btnNovedadesTomoCargos);
	
	var btnNovedadesTomoEspacios = new qx.ui.menu.Button("Tomo Espacios...");
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
	mnuNovedades.add(btnNovedadesTomoEspacios);
	
	
	
	
	

	


	

	

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
  }
});
