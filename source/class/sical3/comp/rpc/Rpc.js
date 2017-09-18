qx.Class.define("sical3.comp.rpc.Rpc",
{
	extend : componente.comp.io.ramon.rpc.Rpc,
	construct : function (url, serviceName)
	{
		this.base(arguments, url, serviceName);
		
		this.addListener("failed", function(e){
			var data = e.getData();
			
			if (data.message == "session") {
				dialog.Dialog.warning("Sesión terminada.<br/>Debe ingresar datos de autenticación.", function(e){location.reload(true);});
			}
		});
	}
});