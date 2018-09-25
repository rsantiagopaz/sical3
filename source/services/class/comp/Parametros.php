<?php

require("Base.php");

class class_Parametros extends class_Base
{
	
	
  public function method_alta_modifica_titulo($params, $error) {
  	$p = $params[0];
  	
  	$id_titulo = $p->model->id_titulo;
	
	$sql = "SELECT id_titulo FROM titulos WHERE denominacion LIKE '" . $p->model->denominacion . "' AND id_titulo <> '" . $id_titulo . "'";
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		$row = $rs->fetch_object();
		
		$error->SetError((int) $row->id_titulo, "descrip_duplicado");
		return $error;
	}

		
	$this->mysqli->query("START TRANSACTION");
		
	if ($id_titulo == "0") {
		
		$sql = "SELECT MAX(codigo) AS maxcodigo FROM titulos";
		$rs = $this->mysqli->query($sql);
		$row = $rs->fetch_object();
		$p->model->codigo = $row->maxcodigo + 1;
		
		$set = $this->prepararCampos($p->model, "titulos");
		
		$sql = "INSERT titulos SET " . $set;
		$this->mysqli->query($sql);
		
		$id_titulo = $this->mysqli->insert_id;
		
		$_descrip = "ALTA DEL TÍTULO '" . $p->model->denominacion . "' CON id='" . $id_titulo . "'";
		
		$this->auditoria($sql, null, null, 'titulos', $id_titulo, $_descrip, '', '');
	} else {
		
		$set = $this->prepararCampos($p->model, "titulos");
		
		$sql = "UPDATE titulos SET " . $set . " WHERE id_titulo=" . $id_titulo;
		$this->mysqli->query($sql);
		
		$_descrip = "MODIFICACIÓN DEL TÍTULO '" . $p->model->denominacion . "' CON id='" . $id_titulo . "' ";
		
		$this->auditoria($sql, null, null, 'titulos', $id_titulo, $_descrip, '', '');
	}
	
	$sql = "DELETE FROM titulos_nivel_para WHERE id_titulo=" . $id_titulo;
	$this->mysqli->query($sql);
	
	foreach ($p->nivel_para as $item) {
		$sql = "INSERT titulos_nivel_para SET id_titulo=" . $id_titulo . ", id_nivel_para=" . $item;
		$this->mysqli->query($sql);		
	}

	
	$this->mysqli->query("COMMIT");
	
	return $id_titulo;
  }
	
	
  public function method_alta_modifica_institucion($params, $error) {
  	$p = $params[0];
  	
  	$id_institucion = $p->model->id_institucion;
	
	$sql = "SELECT id_institucion FROM instituciones WHERE denominacion LIKE '" . $p->model->denominacion . "' AND id_institucion <> '" . $id_institucion . "'";
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		$row = $rs->fetch_object();
		
		$error->SetError((int) $row->id_institucion, "descrip_duplicado");
		return $error;
	}

		
	$this->mysqli->query("START TRANSACTION");
		
	if ($id_institucion == "0") {
		$set = $this->prepararCampos($p->model, "instituciones");
		
		$sql = "INSERT instituciones SET " . $set;
		$this->mysqli->query($sql);
		
		$id_institucion = $this->mysqli->insert_id;
		
		$_descrip = "ALTA DE LA INSTITUCIÓN '" . $p->model->denominacion . "' CON id='" . $id_institucion . "'";
		
		$this->auditoria($sql, null, null, 'instituciones', $id_institucion, $_descrip, '', '');
	} else {
		
		$set = $this->prepararCampos($p->model, "instituciones");
		
		$sql = "UPDATE instituciones SET " . $set . " WHERE id_institucion=" . $id_institucion;
		$this->mysqli->query($sql);
		
		$_descrip = "MODIFICACIÓN DE LA INSTITUCIÓN '" . $p->model->denominacion . "' CON id='" . $id_institucion . "' ";
		
		$this->auditoria($sql, null, null, 'instituciones', $id_institucion, $_descrip, '', '');
	}
	
	$this->mysqli->query("COMMIT");
	
	return $id_institucion;
  }
  
  
  public function method_alta_modifica_cargo($params, $error) {
  	$p = $params[0];
  	
  	$id_cargo = $p->model->id_cargo;
	
	$sql = "SELECT id_cargo FROM cargos WHERE denominacion LIKE '" . $p->model->denominacion . "' AND id_cargo <> '" . $id_cargo . "'";
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		$row = $rs->fetch_object();
		
		$error->SetError((int) $row->id_cargo, "descrip_duplicado");
		return $error;
	}

		
	$this->mysqli->query("START TRANSACTION");
		
	if ($id_cargo == "0") {
		
		$sql = "SELECT MAX(codigo) AS maxcodigo FROM cargos";
		$rs = $this->mysqli->query($sql);
		$row = $rs->fetch_object();
		$p->model->codigo = $row->maxcodigo + 1;
		
		$set = $this->prepararCampos($p->model, "cargos");
		
		$sql = "INSERT cargos SET " . $set;
		$this->mysqli->query($sql);
		
		$id_cargo = $this->mysqli->insert_id;
		
		$_descrip = "ALTA DEL CARGO '" . $p->model->denominacion . "' CON id='" . $id_cargo . "'";
		
		$this->auditoria($sql, null, null, 'cargos', $id_cargo, $_descrip, '', '');
	} else {
		
		$set = $this->prepararCampos($p->model, "cargos");
		
		$sql = "UPDATE cargos SET " . $set . " WHERE id_cargo=" . $id_cargo;
		$this->mysqli->query($sql);
		
		$_descrip = "MODIFICACIÓN DEL CARGO '" . $p->model->denominacion . "' CON id='" . $id_cargo . "' ";
		
		$this->auditoria($sql, null, null, 'cargos', $id_cargo, $_descrip, '', '');
	}
	
	$this->mysqli->query("COMMIT");
	
	return $id_cargo;
  }
  
  
  public function method_alta_modifica_espacio($params, $error) {
  	$p = $params[0];
  	
  	$id_espacio = $p->model->id_espacio;
	
	$sql = "SELECT id_espacio FROM espacios WHERE denominacion LIKE '" . $p->model->denominacion . "' AND id_espacio <> '" . $id_espacio . "'";
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		$row = $rs->fetch_object();
		
		$error->SetError((int) $row->id_espacio, "descrip_duplicado");
		return $error;
	}

		
	$this->mysqli->query("START TRANSACTION");
		
	if ($id_espacio == "0") {
		
		$sql = "SELECT MAX(codigo) AS maxcodigo FROM espacios";
		$rs = $this->mysqli->query($sql);
		$row = $rs->fetch_object();
		$p->model->codigo = $row->maxcodigo + 1;
		
		$set = $this->prepararCampos($p->model, "espacios");
		
		$sql = "INSERT espacios SET " . $set;
		$this->mysqli->query($sql);
		
		$id_espacio = $this->mysqli->insert_id;
		
		$_descrip = "ALTA DEL ESPACIO '" . $p->model->denominacion . "' CON id='" . $id_espacio . "'";
		
		$this->auditoria($sql, null, null, 'espacios', $id_espacio, $_descrip, '', '');
	} else {
		
		$set = $this->prepararCampos($p->model, "espacios");
		
		$sql = "UPDATE espacios SET " . $set . " WHERE id_espacio=" . $id_espacio;
		$this->mysqli->query($sql);
		
		$_descrip = "MODIFICACIÓN DEL ESPACIO '" . $p->model->denominacion . "' CON id='" . $id_espacio . "' ";
		
		$this->auditoria($sql, null, null, 'espacios', $id_espacio, $_descrip, '', '');
	}
	
	$this->mysqli->query("COMMIT");
	
	return $id_espacio;
  }
  
  
  public function method_leerTitulo($params, $error) {
	$p = $params[0];
	
	$resultado = new stdClass;
	
	$opciones = new stdClass;
	$opciones->anios_duracion = "int";	
	$opciones->carga_horaria = "int";
	$opciones->disciplina_unica = "bool";
	
	$sql = "SELECT *";
	$sql.= " FROM titulos";		
	$sql.= " WHERE id_titulo=" . $p->id_titulo;
	$resultado->titulo = $this->toJson($sql, $opciones);
	$resultado->titulo = $resultado->titulo[0];
	
	
	$sql = "SELECT instituciones.id_institucion AS model, CONCAT(instituciones.denominacion, ' (', provincias.denominacion, ')') AS label, instituciones.*";
	$sql.= " FROM instituciones INNER JOIN provincias USING(id_provincia)";		
	$sql.= " WHERE instituciones.id_institucion=" . $resultado->titulo->id_institucion;
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		$row = $rs->fetch_object();
	
		$resultado->cboId_institucion = $row;		
	}
	
	
	$sql = "SELECT nivel_para.id_nivel_para AS model, nivel_para.descripcion AS label FROM titulos_nivel_para INNER JOIN nivel_para USING(id_nivel_para) WHERE titulos_nivel_para.id_titulo=" . $p->id_titulo;
	$resultado->nivel_para = $this->toJson($sql);
	
	
	return $resultado;
  }
  
  
  public function method_autocompletarTitulo($params, $error) {
	$p = $params[0];
	
	$opciones = new stdClass;
	$opciones->codigo = "int";

	$sql = "SELECT titulos.id_titulo, titulos.id_titulo AS model, titulos.denominacion AS label, titulos.codigo, CONCAT(instituciones.denominacion, ' (', provincias.denominacion, ')') AS institucion_descrip, nivel_otorga.descripcion AS nivel_otorga_descrip";
	$sql.= " FROM titulos LEFT JOIN instituciones USING(id_institucion) LEFT JOIN provincias USING(id_provincia) LEFT JOIN nivel_otorga USING(id_nivel_otorga)";		
	$sql.= " WHERE titulos.denominacion LIKE '%" . $p->texto . "%'";
	$sql.= " ORDER BY label";
	
	return $this->toJson($sql, $opciones);
  }
	
	
  public function method_autocompletarProvincia($params, $error) {
  	$p = $params[0];

  	$sql = "SELECT id_provincia AS model, denominacion AS label FROM provincias WHERE denominacion LIKE '%" . $p->texto . "%' ORDER BY label";
	return $this->toJson($sql);
  }
  
  
  public function method_autocompletarInstitucion($params, $error) {
	$p = $params[0];

	if ($p->parametros->tipo == "combobox") {
		$sql = "SELECT instituciones.id_institucion AS model, CONCAT(instituciones.denominacion, ' (', provincias.denominacion, ')') AS label, instituciones.*";
	} else {
		$sql = "SELECT instituciones.id_institucion AS model, instituciones.denominacion AS label, instituciones.*, provincias.denominacion AS provincia_descrip";
	}

	//$sql = "SELECT instituciones.id_institucion AS model, instituciones.denominacion AS label, instituciones.*, provincias.denominacion AS provincia_descrip";
	$sql.= " FROM instituciones INNER JOIN provincias USING(id_provincia)";		
	$sql.= " WHERE instituciones.denominacion LIKE '%" . $p->texto . "%'";
	$sql.= " ORDER BY label";
	
	return $this->toJson($sql);
  }
  
  
  public function method_autocompletarCargo($params, $error) {
  	$p = $params[0];
  	
	function functionAux1(&$row, $key) {
		$row->codigo = (int) $row->codigo;
		$row->jornada_completa = (bool) $row->jornada_completa;

		if ($row->id_nivel == "2") {
			$row->jornada_completa_descrip = ($row->jornada_completa) ? "Si" : "No";
		} else if ($row->id_nivel == "5") {
			if ($row->subtipo == "E") $row->subtipo_descrip = "Especial";
			if ($row->subtipo == "C") $row->subtipo_descrip = "Capacitación";
			if ($row->subtipo == "A") $row->subtipo_descrip = "Adultos";
		}
	};
  	
  	$opciones = new stdClass;
  	$opciones->functionAux = functionAux1;


	$sql = "SELECT cargos.id_cargo AS model, cargos.denominacion AS label, cargos.*, niveles.nivel AS nivel_descrip";
	$sql.= " FROM cargos INNER JOIN niveles USING(id_nivel)";
	$sql.= " WHERE cargos.denominacion LIKE '%" . $p->texto . "%'";
	$sql.= " ORDER BY label";
	
	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_autocompletarEspacio($params, $error) {
  	$p = $params[0];

	$opciones = new stdClass;
	$opciones->codigo = "int";

	$sql = "SELECT id_espacio AS model, denominacion AS label, espacios.*";
	$sql.= " FROM espacios";		
	$sql.= " WHERE denominacion LIKE '%" . $p->texto . "%'";
	$sql.= " ORDER BY label";
	
	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_autocompletarNivel($params, $error) {
  	$p = $params[0];

  	$sql = "SELECT id_nivel AS model, nivel AS label FROM niveles WHERE nivel LIKE '%" . $p->texto . "%' ORDER BY label";
	return $this->toJson($sql);
  }
  
  
  public function method_autocompletarGrados_titulos($params, $error) {
  	$p = $params[0];

  	$sql = "SELECT id_grado_titulo AS model, denominacion AS label, grados_titulos.* FROM grados_titulos WHERE denominacion LIKE '%" . $p->texto . "%' ORDER BY label";
	return $this->toJson($sql);
  }
  
  
  public function method_autocompletarNivel_otorga($params, $error) {
  	$p = $params[0];

  	$sql = "SELECT id_nivel_otorga AS model, descripcion AS label, nivel_otorga.* FROM nivel_otorga WHERE descripcion LIKE '%" . $p->texto . "%' ORDER BY label";
	return $this->toJson($sql);
  }
  
  
  public function method_autocompletarNivel_para($params, $error) {
  	$p = $params[0];

  	$sql = "SELECT id_nivel_para AS model, descripcion AS label, nivel_para.* FROM nivel_para WHERE descripcion LIKE '%" . $p->texto . "%' ORDER BY label";
	return $this->toJson($sql);
  }
}

?>