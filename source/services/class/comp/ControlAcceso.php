<?php

class class_ControlAcceso
{
	protected $mysqli;
	
	function __construct() {
		require('Conexion.php');
		
		session_unset();
		session_destroy();
		session_start();
		
		$_SESSION["LAST_ACTIVITY"] = $_SERVER["REQUEST_TIME"];
		
		
		
    
		$aux = new mysqli_driver;
		$aux->report_mode = MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT;
		
		$this->mysqli = new mysqli("$servidor", "$usuario", "$password", "$base");
		$this->mysqli->query("SET NAMES 'utf8'");
	}


  public function method_login($params, $error) {
  	$p = $params[0];
  	
	
	
	//$error->SetError(0, "mantenimiento");
	//return $error;
	
	
	
    session_destroy();
	session_start();
	// Si ya había un usuario logueado, lo borra
	$_SESSION['usuario']   = '';
	$_SESSION['sesion_id'] = '';


	$_mensaje='';
	
	$SYSusuario = $p->usuario;
	$SYSpassword = $p->password;
	$SYSsistema_id = "SiCal";
	
	
	if (empty($SYSusuario)) $_mensaje.='No ingresó su nombre de usuario. ';
	
	if (empty($SYSpassword)) $_mensaje.='No ingresó su contraseña. ';

	if (empty($SYSsistema_id)) $_mensaje.='No está indicado a que sistema desea conectarse. ';
	 
	
	if (empty($SYSusuario)) {
		$error->SetError(0, "nick");
		return $error;
	}
	if (empty($SYSpassword)) {
		$error->SetError(0, "password");
		return $error;
	}
	
	
	// Verifico si el suario es válido
	if (!empty($SYSusuario) AND !empty($SYSpassword)) {
		//$rs = $this->mysqli->query("SELECT * FROM _usuarios WHERE SYSusuario = BINARY '$SYSusuario' AND SYSpassword = MD5('$SYSpassword')");
		$rs = $this->mysqli->query("SELECT * FROM _usuarios WHERE SYSusuario = BINARY '$SYSusuario'");
		if ($rs->num_rows == 1) {
			$row = $rs->fetch_object();
			if ($row->SYSpassword != md5($SYSpassword)) {
				$error->SetError(0, "password");
				return $error;
			}
		}
		
		
		
		
		  // ---------------
		  //$fila=mysql_fetch_array($rs);
		  //$num=mysql_num_rows($rs);
		if ($rs->num_rows == 1) {
	         // Verifico si el usuario está activo es decir que "SYSusuario_estado = 1" 
			$rs = $this->mysqli->query("SELECT * FROM _usuarios 
		                        LEFT JOIN _organismos_areas_usuarios
							          ON _organismos_areas_usuarios.SYSusuario = _usuarios.SYSusuario
		                        LEFT JOIN _organismos_areas
							          ON _organismos_areas.organismo_area_id = _organismos_areas_usuarios.organismo_area_id
		                        LEFT JOIN _organismos
							          ON _organismos.organismo_id = _organismos_areas.organismo_id
		                        WHERE _usuarios.SYSusuario= BINARY '$SYSusuario'");
		 
		 
	         //$num=@mysql_numrows($rs);
			if ($rs->num_rows == 1) {
				$aux = $rs->fetch_assoc();
				
				
				/*
				$_SESSION['usuario']                             = mysql_result($rs,0,SYSusuario);
				//$_SESSION['usuario_id']                             = mysql_result($rs,0,id_usuario);
				$_SESSION['usuario_nombre']                         = mysql_result($rs,0,SYSusuarionombre);
				$_SESSION['usuario_estado']                         = mysql_result($rs,0,SYSusuario_estado);
				$SYSusuario_estado = $_SESSION['usuario_estado'];
				$_SESSION['usuario_organismo_id']                = mysql_result($rs,0,organismo_id);
				$_SESSION['usuario_nivel_id']                = mysql_result($rs,0,organismo_area_id_nivel);
				$_SESSION['usuario_organismo']                   = mysql_result($rs,0,organismo);
				$_SESSION['usuario_organismo_area_id']           = mysql_result($rs,0,organismo_area_id);
				$_SESSION['usuario_organismo_area']              = mysql_result($rs,0,organismo_area);
				//$_SESSION['usuario_organismo_area_mesa_entrada'] = mysql_result($rs,0,organismo_area_mesa_entrada);
				*/
				
				
				
				$_SESSION['usuario']                             = $aux["SYSusuario"];
				//$_SESSION['usuario_id']                             = $aux["id_usuario"];
				$_SESSION['usuario_nombre']                         = $aux["SYSusuarionombre"];
				$_SESSION['usuario_estado']                         = $aux["SYSusuario_estado"];
				$SYSusuario_estado = $_SESSION['usuario_estado'];
				$_SESSION['usuario_organismo_id']                = $aux["organismo_id"];
				$_SESSION['usuario_nivel_id']                = $aux["organismo_area_id_nivel"];
				$_SESSION['usuario_organismo']                   = $aux["organismo"];
				$_SESSION['usuario_organismo_area_id']           = $aux["organismo_area_id"];
				$_SESSION['usuario_organismo_area']              = $aux["organismo_area"];
				//$_SESSION['usuario_organismo_area_mesa_entrada'] = $aux["organismo_area_mesa_entrada"];
				
				
				//$SYSusuario_ = mysql_result($rs,0,);
				$SYSsistemas_perfiles_usuario[0]='';
		   		   
				if ($SYSusuario_estado == 1) {
	    	           // Verifico si el usuario está autorizado a utilizar el sistema.
					   // Veo en tabla _sistemas_ususarios si está autorizado el usuario
					$query = "SELECT SYSusuario, sistema_id FROM _sistemas_usuarios 
				                        WHERE SYSusuario= BINARY '$SYSusuario' 
										  AND sistema_id='$SYSsistema_id'
								      ";
					   //print $query;					  
					$rs = $this->mysqli->query($query);
		               //$num=@mysql_num_rows($rs);
					if ($rs->num_rows == 1) {
						 // Agregado el 2/1/2007
			             // Obtengo un arreglo $SYSsistemas_perfiles_usuario con los perfiles del usuario
						$rs = $this->mysqli->query("SELECT * FROM _sistemas_perfiles_usuarios 
				                                   WHERE SYSusuario= BINARY '$SYSusuario' 
								         ");
	                      //$num=@mysql_numrows($rs);
						if ($rs->num_rows > 0) {
						    // Cargo en el arreglo SYSsistemas_perfiles_usuarios los perfiles del usuario SYSusuario
							// para ver si un perfil está en el arreglo, usar la func. in_array($perfil_id,$SYSsistemas_perfiles_usuario)
							// devolverá true si está o false.
							$SYSsistemas_perfiles_usuario = array();
							$indice = 0;
							if ($row = $rs->fetch_array()) {
								do {
									$indice++;
									$SYSsistemas_perfiles_usuario[$indice] = $row["perfil_id"];
								} while($row = $rs->fetch_array()); 
								$_SESSION['sistemas_perfiles_usuario'] = $SYSsistemas_perfiles_usuario;
							}
						}
				             // ------------------------------------

							 // Como todo está bien, guardo la sesión en la BD
						$_sessionid = date('YmdHis') . "-" . session_id();	
							 // Grabo en las variables de sesión:
						$_SESSION['SYSsesion_id'] = $_sessionid;
						$_SESSION['SYSusuario']   = $SYSusuario;
							 // --
						$SYSsesionfecha = date('Y-m-d');
						$SYSsesionhora  = date('H:i:s');
							 // Ingreso en tabla _sesiones los campos _sessionid y SYSusuario
						$ip = $HTTP_SERVER_VARS["REMOTE_ADDR"];
						$this->mysqli->query("INSERT INTO _sesiones 
						   (
							 _sessionid,
							 SYSusuario,
							 SYSsesionfecha,
							 SYSsesionhora,
							 SYSsesiondetalle,
							 ip
							 )  
						   VALUES 
							(
							 '$_sessionid',	  
							 '$SYSusuario',
							 '$SYSsesionfecha',
							 '$SYSsesionhora',
							 '$SYSsesiondetalle',
							 '$ip'
							)");
							 // Verifico si se grabaron los datos
						$rs = $this->mysqli->query("SELECT * FROM _sesiones WHERE _sessionid='$_sessionid' AND SYSusuario='$SYSusuario'");
							 //$num=mysql_numrows($rs);
						if ($rs->num_rows <= 0) $_mensaje.='No se pudo grabar la sesión y el usuario en tabla _sesiones. Contáctese con el administrador del sistema. ';
				
							 // ------------------------------------ 
					} else {
						$_mensaje.='¡El usuario '.$SYSusuario.' NO ESTA AUTORIZADO a utilizar el sistema '.$SYSsistema_id.'! ';
						
						$error->SetError(0, "permiso");
						return $error;
					}
						  // FIN: Veo en tabla _sistemas_ususarios si está autorizado el usuario
				} else {
					$_mensaje='¡El usuario '.$SYSusuario.' no está AUTORIZADO PARA EL USO DE NINGUN SISTEMA! ';
					
					$error->SetError(0, "permiso");
					return $error;
				}
			} else {
				$_mensaje='¡El usuario '.$SYSusuario.' NO EXISTE! ';
				
				$error->SetError(0, "nick");
				return $error;
			}
		     
			
		         // FIN: Verifico si el usuario está activo es decir que "SYSusuario_estado = 1" 
		 			
	   
		} else {
			$_mensaje.="¡ Sus datos de acceso NO SON VALIDOS !\n\n";
			$_mensaje.="Verifique haber ingresado bien su nombre de usuario y contraseña, respetando mayúsculas y minúsculas.\n";
			$_mensaje.="Por ejemplo, si su nombre de usuario es juanperez, no intente escribir JuanPerez ni JUANPEREZ, u otra forma. Idem para la contraseña.";
			
			$error->SetError(0, "nick");
			return $error;
		}
		  
	}
	
		 // Armo el XML ---------------------------------------
	$xml = "<?xml version='1.0' encoding='UTF-8' ?>";
	$xml.= "<xml>";
	if (!empty($_mensaje)) {     
		$xml.="<error>$_mensaje</error>";
	} else {
		
		$_SESSION["LAST_ACTIVITY"] = $_SERVER["REQUEST_TIME"];
		
		$resultado = new stdClass;
		
		$resultado->ok = "¡¡Bienvenido ".$_SESSION['usuario_nombre']." (".$SYSusuario.")!!\n\n";
		$resultado->ok.="Puede comenzar a trabajar. Recuerde CERRAR SESION cuando termine o si desea cambiar de usuario.\n\n";
		$resultado->ok.="¡NUNCA DEJE EL NAVEGADOR ABIERTO Y SE RETIRE!";
		$resultado->_sistema_id = $SYSsistema_id;
		$resultado->_usuario = $_SESSION['usuario'];
		$resultado->_usuario_id = $_SESSION['usuario_id'];
		$resultado->_usuario_nombre = $_SESSION['usuario_nombre'];
		$resultado->_usuario_estado = $_SESSION['usuario_estado'];
		$resultado->_sesion_id = $_SESSION['SYSsesion_id'];
		$resultado->_autorizado = true;
		$resultado->_usuario_organismo_id = $_SESSION['usuario_organismo_id'];
		$resultado->_usuario_nivel_id = $_SESSION['usuario_nivel_id'];
		$resultado->_usuario_organismo = $_SESSION['usuario_organismo'];
		$resultado->_usuario_organismo_area_id = $_SESSION['usuario_organismo_area_id'];
		$resultado->_usuario_organismo_area = $_SESSION['usuario_organismo_area'];
		$resultado->_usuario_sistemas_perfiles = $_SESSION['sistemas_perfiles_usuario'];
		$resultado->_usuario_organismo_area_mesa_entradas = ((empty($_SESSION['usuario_organismo_area_mesa_entrada'])) ? "0" : $_SESSION['usuario_organismo_area_mesa_entrada']);


		return $resultado;
		
		
		
		$xml.="<ok>";
		$xml.="¡¡Bienvenido ".$_SESSION['usuario_nombre']." (".$SYSusuario.")!!\n\n";
		$xml.="Puede comenzar a trabajar. Recuerde CERRAR SESION cuando termine o si desea cambiar de usuario.\n\n";
		$xml.="¡NUNCA DEJE EL NAVEGADOR ABIERTO Y SE RETIRE!";
		$xml.="</ok>";
		// Aquí mando todos los valores necesarios para algunas propiedades de la clase ControlAcceso
		$xml.="<ControlAcceso>";
		
		$xml.=  "<_sistema_id>";
		$xml.=    $SYSsistema_id;
		$xml.=  "</_sistema_id>";
		
		$xml.=  "<_usuario>";
		$xml.=    utf8_encode($_SESSION['usuario']);
		$xml.=  "</_usuario>";
		
		$xml.=  "<_usuario_id>";
		$xml.=    utf8_encode($_SESSION['usuario_id']);
		$xml.=  "</_usuario_id>";
		
		$xml.=  "<_usuario_nombre>";
		$xml.=    utf8_encode($_SESSION['usuario_nombre']);
		$xml.=  "</_usuario_nombre>";
		
		$xml.=  "<_usuario_estado>";
		$xml.=    $_SESSION['usuario_estado'];
		$xml.=  "</_usuario_estado>";
		
		$xml.=  "<_sesion_id>";
		$xml.=    $_SESSION['SYSsesion_id'];
		$xml.=  "</_sesion_id>";
		
		$xml.=  "<_autorizado>";
		$xml.=   "true";
		$xml.=  "</_autorizado>";
		
		$xml.=  "<_usuario_organismo_id>";
		$xml.=    $_SESSION['usuario_organismo_id'];
		$xml.=  "</_usuario_organismo_id>";
		
		$xml.=  "<_usuario_nivel_id>";
		$xml.=    $_SESSION['usuario_nivel_id'];
		$xml.=  "</_usuario_nivel_id>";
		
		$xml.=  "<_usuario_organismo>";
		$xml.=   utf8_encode($_SESSION['usuario_organismo']);
		$xml.=  "</_usuario_organismo>";
		
		$xml.=  "<_usuario_organismo_area_id>";
		$xml.=   $_SESSION['usuario_organismo_area_id'];
		$xml.=  "</_usuario_organismo_area_id>";
		
		$xml.=  "<_usuario_organismo_area>";
		$xml.=    utf8_encode($_SESSION['usuario_organismo_area']);
		$xml.=  "</_usuario_organismo_area>";
		
		$xml.=  "<_usuario_sistemas_perfiles>";
		if(isset($_SESSION['sistemas_perfiles_usuario']) and !empty($_SESSION['sistemas_perfiles_usuario'])) {
			$vectorPerfiles = $_SESSION['sistemas_perfiles_usuario'];
			foreach($vectorPerfiles as $perfil_id) {
				$xml.= "<perfil_id>";
				$xml.=   $perfil_id;
				$xml.= "</perfil_id>";
			}
		}
	
		$xml.=  "</_usuario_sistemas_perfiles>";
		
		$xml.=  "<_usuario_organismo_area_mesa_entradas>";
		           if (empty($_SESSION['usuario_organismo_area_mesa_entrada']))
				      $xml.= "0";
					 else 
					  $xml.= $_SESSION['usuario_organismo_area_mesa_entrada'];
		$xml.=  "</_usuario_organismo_area_mesa_entradas>";
		
		$xml.="</ControlAcceso>";
		
		
	}
	
	$xml.= "</xml>";
	header('Content-Type: text/xml');
	print $xml;
	 // FIN: Armo el XML -----------------------------------
	 
	
	
	
  }
}

?>