<?php

class class_Base
{
	protected $mysqli;
	
	function __construct() {
		require('Conexion.php');
		
		
		
		$time = $_SERVER["REQUEST_TIME"];
		$timeout_duration = 1320;
		
		if (! isset($_SESSION["LAST_ACTIVITY"])) {
			throw new JsonRpcError("session", 0);
		} else if (($time - $_SESSION["LAST_ACTIVITY"]) > $timeout_duration) {
			throw new JsonRpcError("session", 0);
		} else {
			$_SESSION["LAST_ACTIVITY"] = $time;
		}
		
		
		
		
		$aux = new mysqli_driver;
		$aux->report_mode = MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT;
		
		$this->mysqli = new mysqli("$servidor", "$usuario", "$password", "$base");
		$this->mysqli->query("SET NAMES 'utf8'");
	}
	
	
	
  public function auditoria($_mysql_query, 
                    $_mysql_link,
					$_link_auditoria,
					$_auditoria_mysql_table,
					$_id_registro,
					$_descrip,
					$_auditoria_php_file,
                    $_auditoria_php_line)
{
$_auditoria_query_user     = 'SELECT USER()     AS mysql_user';
$_auditoria_query_database = 'SELECT DATABASE() AS mysql_database';

  
    
    $_auditoria_query_user     = 'SELECT USER()     AS mysql_user';
    $_auditoria_query_database = 'SELECT DATABASE() AS mysql_database';
				
	$_auditoria_result_user     = $this->mysqli->query($_auditoria_query_user);
	$_auditoria_result_database = $this->mysqli->query($_auditoria_query_database);
 
    if(! ($this->mysqli->errno > 0)) {		
	    $_auditoria_row = $_auditoria_result_user->fetch_array();
	    $_auditoria_mysql_user = $_auditoria_row["mysql_user"];

	    $_auditoria_row = $_auditoria_result_database->fetch_array();
	    $_auditoria_mysql_database = $_auditoria_row["mysql_database"];
	} else {
	  	$_auditoria_mysql_user     = '?';
	  	$_auditoria_mysql_database = '?';
	}    
	 
    // ----------------------------
    $_auditoria_mysql_operacion  = substr(trim(strtoupper($_mysql_query)),0,6);
    $_auditoria_fecha            = date("Y-m-d"); 
    $_auditoria_hora             = date("H:i:s");
    $_auditoria_ip               = $_SERVER["REMOTE_ADDR"]; 


	/*
    // Agregado el 27/6/2008, por el problemas de las comillas simples:
    $AuxCadena = "_barra_invertida_comilla_simple_" ;
    $_mysql_query = str_replace("\'",$AuxCadena,$_mysql_query);
    // ---
    $_mysql_query = trim(str_replace("'","\'",$_mysql_query));
    $_mysql_query = trim(str_replace($AuxCadena,"\'",$_mysql_query));
    
    // --
    $_descrip = str_replace("\'",$AuxCadena,$_descrip);
    // ---
    $_descrip = trim(str_replace("'","\'",$_descrip));
    $_descrip = trim(str_replace($AuxCadena,"\'",$_descrip));
    */
    
      
	/*
    $SYSusuario = $GLOBALS["SYSusuario"];
    if (isset($GLOBALS["_sessionid"]))
    	$_sessionid = $GLOBALS["_sessionid"];
    else {
    	if ($_auditoria_mysql_table == '_usuarios')
   			$_sessionid = $_id_registro;	
    }
    */
    
    $SYSusuario = $_SESSION['usuario'];
    if (isset($_SESSION['SYSsesion_id']))
    	$_sessionid = $_SESSION['SYSsesion_id'];
    else {
    	if ($_auditoria_mysql_table == '_usuarios')
   			$_sessionid = $_id_registro;	
    }    	
   
    $_auditoria_query = "
	          INSERT INTO _auditoria 
			    (SYSusuario, _sessionid, id_registro, mysql_query, mysql_user, mysql_database, mysql_table, mysql_operacion, mysql_descrip, php_file, php_line, fecha, hora, ip )
              VALUES 
			    ('$SYSusuario', '$_sessionid', '$_id_registro', '" . $this->mysqli->real_escape_string($_mysql_query) . "', '$_auditoria_mysql_user', '$_auditoria_mysql_database', '$_auditoria_mysql_table', '$_auditoria_mysql_operacion' , '" . $this->mysqli->real_escape_string($_descrip) . "', '$_auditoria_php_file' , '$_auditoria_php_line' , '$_auditoria_fecha', '$_auditoria_hora', '$_auditoria_ip')
	          ";
	
    if($_link_auditoria)
   		$this->mysqli->query($_auditoria_query,$_link_auditoria);
    else
   		$this->mysqli->query($_auditoria_query);       	
  
}
	
	
  public function toJson($paramet, &$opciones = null) {
	if (is_string($paramet)) {
		$cadena = strtoupper(substr(trim($paramet), 0, 6));
		if ($cadena=="INSERT" || $cadena=="SELECT") {
			$paramet = $this->mysqli->query($paramet);
			if ($this->mysqli->errno > 0) {
				return $this->mysqli->errno . " " . $this->mysqli->error . "\n";
			} else if ($cadena=="INSERT"){ 
				//$nodo=$xml->addChild("insert_id", $this->mysqli->insert_id);
			} else {
				return $this->toJson($paramet, $opciones);
			}
		}
	} else if (is_a($paramet, "MySQLi_Result")) {
		$rows = array();
		if (is_null($opciones)) {
			while ($row = $paramet->fetch_object()) {
				$rows[] = $row;
			}
		} else {
			while ($row = $paramet->fetch_object()) {
				foreach($opciones as $key => $value) {
					if ($value=="int") {
						$row->$key = (int) $row->$key;
					} else if ($value=="float") {
						$row->$key = (float) $row->$key;
					} else if ($value=="bool") {
						$row->$key = (bool) $row->$key;
					} else {
						$value($row, $key);
					}
				}

				$rows[] = $row;
			}
		}
		return $rows;
	}
  }
  

  public function prepararCampos(&$model, $tabla = null) {
  	static $campos = array();
	$set = array();
	$chequear = false;
	if (!is_null($tabla)) {
		$chequear = true;
		if (is_null($campos[$tabla])) {
			$campos[$tabla] = array();
			$rs = $this->mysqli->query("SHOW COLUMNS FROM " . $tabla);
			while ($row = $rs->fetch_assoc()) {
				$campos[$tabla][$row['Field']] = true;
			}
		}
	}
	foreach($model as $key => $value) {
		if ($chequear) {
			if (!is_null($campos[$tabla][$key])) {
				$set[] = $key . "='" . $value . "'";
			}			
		} else {
			$set[] = $key . "='" . $value . "'";
		}
	}
	return implode(", ", $set);
  }
}

?>