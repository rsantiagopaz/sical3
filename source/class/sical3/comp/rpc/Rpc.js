qx.Class.define("sical3.comp.rpc.Rpc",
{
	extend : componente.comp.io.ramon.rpc.Rpc,
	construct : function (url, serviceName)
	{
		this.base(arguments, url, serviceName);
		
		

		var application = qx.core.Init.getApplication();
		
		var bounds = application.getRoot().getBounds();
		
		var image = this.image = new qx.ui.basic.Image("sical3/loading66.gif");
		image.setVisibility("hidden");
		image.setBackgroundColor("#FFFFFF");
		image.setDecorator("main");
		application.getRoot().add(image, {left: parseInt(bounds.width / 2 - 33), top: parseInt(bounds.height / 2 - 33)});
		
		image.addListenerOnce("appear", function(e){
			image.setZIndex(30000);
		});
		
		

		this.addListener("completed", function(e){
			var data = e.getData();
			
			image.destroy();
		}, this);
		
		this.addListener("failed", function(e){
			var data = e.getData();
			
			image.destroy();
			
			if (data.message == "sesion_terminada") {
				dialog.Dialog.warning("Sesión terminada.<br/>Debe ingresar datos de autenticación.", function(e){location.reload(true);});
			}
		});
		
		this.addListener("timeout", function(e){
			var data = e.getData();
			
			image.destroy();
		});
		
		this.addListener("aborted", function(e){
			var data = e.getData();
			
			image.destroy();
		});
	},
	
	
	members :
	{
		image: null,
		mostrar: true,
		
		callAsyncListeners : function (coalesce, methodName, p)
		{
			if (this.mostrar) this.image.setVisibility("visible");
			
			return this.base(arguments, coalesce, methodName, p);
		}
	},
	
	
	destruct : function ()
	{
		this.image.destroy();
	}
});