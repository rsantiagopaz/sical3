<?php
session_start();

require("Base.php");

class class_ComisionDeTitulos extends class_Base
{


  public function method_leer_titulos($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT titulos.denominacion AS titulo_descrip, titulos.id_titulo, titulos.codigo AS cod_titulo, tipos_titulos.id_tipo_titulo, tipos_titulos.codigo AS cod_tipo_titulo, tipos_clasificacion.id_tipo_clasificacion, tipos_clasificacion.denominacion AS tipo_clasificacion, tipos_titulos.tipo AS tipo_titulo";
	$sql.= " FROM ((tomo_espacios INNER JOIN titulos USING(id_titulo)) INNER JOIN tipos_clasificacion USING(id_tipo_clasificacion)) INNER JOIN tipos_titulos USING(id_tipo_titulo)";
	$sql.= " WHERE id_espacio=" . $p->id_espacio . " AND id_carrera=" . $p->id_carrera;
	
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
		unset($row->denominacion);
		
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
		unset($row->nombre);
		
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
}

?>