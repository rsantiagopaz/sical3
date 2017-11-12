<?php

require("Base.php");

class class_ComisionDeTitulos extends class_Base
{
	
	
  public function method_guardar_titulos($params, $error) {
  	$p = $params[0];
  	
  	$this->mysqli->query("START TRANSACTION");
  	
	foreach ($p->titulo as $titulo) {
		$sql = "INSERT tomo_espacios SET";
		$sql.= "  id_espacio='" . $p->espacio->model . "'";
		$sql.= ", cod_espacio='" . $p->espacio->codigo . "'";
		$sql.= ", id_carrera='" . $p->carrera->model . "'";
		$sql.= ", cod_carrera='" . $p->carrera->codigo . "'";
		$sql.= ", id_titulo='" . $titulo->id_titulo . "'";
		$sql.= ", cod_titulo='" . $titulo->cod_titulo . "'";
		$sql.= ", id_tipo_titulo='" . $titulo->id_tipo_titulo . "'";
		$sql.= ", cod_tipo_titulo='" . $titulo->cod_tipo_titulo . "'";
		$sql.= ", id_tipo_clasificacion='" . $titulo->id_tipo_clasificacion . "'";
		
		$this->mysqli->query($sql);
		
		$id_tomo_espacio = $this->mysqli->insert_id;
		
		
		
		
		$_descrip = "ALTA DE TOMO-ESPACIO CON id='" . $id_tomo_espacio . "', TITULO '" . $titulo->titulo_descrip . "', CARRERA '" . $p->carrera->label . "', ESPACIO '" . $p->espacio->label . "'";
		
		$this->auditoria($sql, null, null, 'tomo_espacios', $id_tomo_espacio, $_descrip, '', '');
		
		
		
		$sql = "INSERT nov_tomo_espacios SET";
		$sql.= "  id_espacio='" . $p->espacio->model . "'";
		$sql.= ", cod_espacio='" . $p->espacio->codigo . "'";
		$sql.= ", id_carrera='" . $p->carrera->model . "'";
		$sql.= ", cod_carrera='" . $p->carrera->codigo . "'";
		$sql.= ", id_titulo='" . $titulo->id_titulo . "'";
		$sql.= ", cod_titulo='" . $titulo->cod_titulo . "'";
		$sql.= ", id_tipo_titulo='" . $titulo->id_tipo_titulo . "'";
		$sql.= ", cod_tipo_titulo='" . $titulo->cod_tipo_titulo . "'";
		$sql.= ", id_tipo_clasificacion='" . $titulo->id_tipo_clasificacion . "'";
		
		$sql.= ", id_tomo_espacio='" . $id_tomo_espacio . "'";
		$sql.= ", tipo_novedad='N'";
		$sql.= ", estado='V'";
		$sql.= ", fecha_novedad=NOW()";
		$sql.= ", timestamp=NOW()";
		$sql.= ", usuario_novedad='" . $_SESSION['usuario'] . "'";
		
		$this->mysqli->query($sql);
	}
	
	$this->mysqli->query("COMMIT");
  }
  
  
  public function method_leer_titulos($params, $error) {
	$p = $params[0];

	$sql = "SELECT id_tomo_espacio, TRIM(titulos.denominacion) AS titulo_descrip, titulos.id_titulo, titulos.codigo AS cod_titulo, tipos_titulos.id_tipo_titulo, tipos_titulos.codigo AS cod_tipo_titulo, tipos_clasificacion.id_tipo_clasificacion, tipos_clasificacion.denominacion AS tipo_clasificacion, tipos_titulos.tipo AS tipo_titulo";
	$sql.= " FROM ((tomo_espacios INNER JOIN titulos USING(id_titulo)) INNER JOIN tipos_clasificacion USING(id_tipo_clasificacion)) INNER JOIN tipos_titulos USING(id_tipo_titulo)";
	$sql.= " WHERE id_espacio=" . $p->id_espacio . " AND id_carrera=" . $p->id_carrera;
	$sql.= " ORDER BY titulo_descrip";

	return $this->toJson($sql);
  }
  
  
  public function method_leer_tipos_clasificacion($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT tipos_clasificacion.*, denominacion AS descrip FROM tipos_clasificacion ORDER BY descrip";
	return $this->toJson($sql);
  }
  
  
  public function method_leer_tipos_titulos($params, $error) {
	$p = $params[0];
	
	$sql = "SELECT tipos_titulos.*, tipo AS descrip FROM tipos_titulos ORDER BY descrip";
	return $this->toJson($sql);
  }
  
  
  public function method_autocompletarCargo($params, $error) {
  	$p = $params[0];
  	
	if (is_numeric($p->texto)) {
	 	$sql = "SELECT id_cargo AS model, CONCAT(CAST(codigo AS CHAR), ' - ', denominacion) AS label, codigo, denominacion, id_nivel";
		$sql.= " FROM cargos";
		$sql.= " WHERE codigo LIKE '" . $p->texto . "%'";
		$sql.= " ORDER BY codigo, denominacion";
	} else {
	 	$sql = "SELECT id_cargo AS model, CONCAT(CAST(codigo AS CHAR), ' - ', denominacion) AS label, codigo, denominacion, id_nivel";
		$sql.= " FROM cargos";
		$sql.= " WHERE denominacion LIKE '%" . $p->texto . "%'";
		$sql.= " ORDER BY denominacion, codigo";
	}
	
	return $this->toJson($sql);
  }
  


  
  
  public function method_autocompletarEspacio($params, $error) {
  	$p = $params[0];
  	
  	$resultado = array();
  	
  	if (is_numeric($p->texto)) {
	 	$sql = "SELECT id_espacio AS model, CONCAT(CAST(codigo AS CHAR), ' - ', denominacion) AS label, codigo, denominacion";
		$sql.= " FROM espacios";
		if (! is_null($p->phpParametros)) $sql.= " INNER JOIN carreras_espacios USING(id_espacio)";
		$sql.= " WHERE codigo LIKE '" . $p->texto . "%'";
		if (! is_null($p->phpParametros)) $sql.= " AND carreras_espacios.id_carrera=" . $p->phpParametros->id_carrera;
		$sql.= " ORDER BY codigo, denominacion";
  	} else {
	 	$sql = "SELECT id_espacio AS model, CONCAT(CAST(codigo AS CHAR), ' - ', denominacion) AS label, codigo, denominacion";
		$sql.= " FROM espacios";
		if (! is_null($p->phpParametros)) $sql.= " INNER JOIN carreras_espacios USING(id_espacio)";
		$sql.= " WHERE denominacion LIKE '%" . $p->texto . "%'";
		if (! is_null($p->phpParametros)) $sql.= " AND carreras_espacios.id_carrera=" . $p->phpParametros->id_carrera;
		$sql.= " ORDER BY denominacion, codigo";
  	}
  	
	$rs = $this->mysqli->query($sql);
	while ($row = $rs->fetch_object()) {
		//unset($row->denominacion);
		
		$resultado[] = $row;
	}
	
	return $resultado;
  }
  
  public function method_autocompletarCarrera($params, $error) {
  	$p = $params[0];
  	
  	$resultado = array();
  	
	if (is_numeric($p->texto)) {
	 	$sql = "SELECT id_carrera AS model, CONCAT(CAST(codigo AS CHAR), ' - ', nombre) AS label, codigo, nombre";
		$sql.= " FROM carreras";
		if (! is_null($p->phpParametros)) $sql.= " INNER JOIN carreras_espacios USING(id_carrera)";
		$sql.= " WHERE codigo LIKE '" . $p->texto . "%'";
		if (! is_null($p->phpParametros)) $sql.= " AND carreras_espacios.id_espacio=" . $p->phpParametros->id_espacio;
		$sql.= " ORDER BY codigo, nombre";
	} else {
	 	$sql = "SELECT id_carrera AS model, CONCAT(CAST(codigo AS CHAR), ' - ', nombre) AS label, codigo, nombre";
		$sql.= " FROM carreras";
		if (! is_null($p->phpParametros)) $sql.= " INNER JOIN carreras_espacios USING(id_carrera)";
		$sql.= " WHERE nombre LIKE '%" . $p->texto . "%'";
		if (! is_null($p->phpParametros)) $sql.= " AND carreras_espacios.id_espacio=" . $p->phpParametros->id_espacio;
		$sql.= " ORDER BY nombre, codigo";
	}
	
	$rs = $this->mysqli->query($sql);
	while ($row = $rs->fetch_object()) {
		//unset($row->nombre);
		
		$resultado[] = $row;
	}
	
	return $resultado;
  }
  
  public function method_autocompletarTitulo($params, $error) {
  	$p = $params[0];
  	
	if (is_numeric($p->texto)) {
	 	$sql = "SELECT id_titulo AS model, CONCAT(CAST(codigo AS CHAR), ' - ', denominacion) AS label, codigo, denominacion";
		$sql.= " FROM titulos";
		$sql.= " WHERE codigo LIKE '" . $p->texto . "%'";
		$sql.= " ORDER BY codigo, denominacion";
	} else {
	 	$sql = "SELECT id_titulo AS model, CONCAT(CAST(codigo AS CHAR), ' - ', denominacion) AS label, codigo, denominacion";
		$sql.= " FROM titulos";
		$sql.= " WHERE denominacion LIKE '%" . $p->texto . "%'";
		$sql.= " ORDER BY denominacion, codigo";
	}
	
	return $this->toJson($sql);
  }
  
  
  public function method_autocompletarUsuario($params, $error) {
  	$p = $params[0];
  	
 	$sql = "SELECT SYSusuario AS model, SYSusuarionombre AS label";
	$sql.= " FROM _usuarios INNER JOIN _organismos_areas_usuarios USING(SYSusuario)";
	$sql.= " WHERE _organismos_areas_usuarios.organismo_area_id='6' AND SYSusuario LIKE '%" . $p->texto . "%'";
	$sql.= " ORDER BY label";
	
	return $this->toJson($sql);
  }
  
  
  public function method_autocompletarNivel($params, $error) {
  	$p = $params[0];
  	
 	$sql = "SELECT id_nivel AS model, nivel AS label";
	$sql.= " FROM niveles";
	$sql.= " WHERE nivel LIKE '%" . $p->texto . "%'";
	$sql.= " ORDER BY label";
	
	return $this->toJson($sql);
  }
}

?>