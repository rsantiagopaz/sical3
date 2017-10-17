<?php

require("Base.php");

class class_IncumbenciaTitulosxEspacio extends class_Base
{
	
	
  public function method_escribir_novedad_modificacion($params, $error) {
  	$p = $params[0];
  	
  	$titulo = $p->titulo[0];
  	
	$sql = "SELECT codigo AS cod_tipo_titulo FROM tipos_titulos WHERE id_tipo_titulo=" . $titulo->id_tipo_titulo;
	$rs = $this->mysqli->query($sql);
	$row = $rs->fetch_object();
	
	$titulo->cod_tipo_titulo = $row->cod_tipo_titulo;
	
  	
	if ($p->message == "INSERT") {
		
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
			
			$sql.= ", id_tomo_espacio='" . $titulo->id_tomo_espacio . "'";
			$sql.= ", tipo_novedad='M'";
			$sql.= ", estado='S'";
			$sql.= ", fecha_novedad=NOW()";
			$sql.= ", timestamp=NOW()";
			$sql.= ", usuario_novedad='" . $_SESSION['usuario'] . "'";
			
	} else if ($p->message == "UPDATE") {
		$sql = "UPDATE nov_tomo_espacios";
		$sql.= " SET id_tipo_titulo=" . $titulo->id_tipo_titulo . ", cod_tipo_titulo=" . $titulo->cod_tipo_titulo;
		$sql.= " WHERE id_nov_tomo_espacios=" . $p->id_nov_tomo_espacios;
	}
	
	$this->mysqli->query($sql);
  }
	
	
  public function method_verificar_novedad_modificacion($params, $error) {
  	$p = $params[0];
  	
  	$resultado = new stdClass;
  	
  	$titulo = $p->titulo[0];
  	
	$sql = "SELECT *";
	$sql.= " FROM nov_tomo_espacios";
	$sql.= " WHERE id_tomo_espacio=" . $titulo->id_tomo_espacio;
	$sql.= " AND estado = 'S'";
	
	$rs = $this->mysqli->query($sql);
	
	if ($rs->num_rows == 0) {
		$resultado->message = "INSERT";
	} else {
		$row = $rs->fetch_object();
		
		if ($row->tipo_novedad == "B") {
			$error->SetError(0, "novedad_existente");
			return $error;
			
		} else if ($row->tipo_novedad == "M") {
			$resultado->message = "UPDATE";
			$resultado->id_nov_tomo_espacios = $row->id_nov_tomo_espacios;
		}
	}
	
	return $resultado;
  }
	
	
  public function method_guardar_titulos($params, $error) {
  	$p = $params[0];
  	
  	$resultado = new stdClass;
  	
	$this->mysqli->query("START TRANSACTION");
  	
  	foreach ($p->titulo as $titulo) {
		$sql = "SELECT id_tomo_espacio";
		$sql.= " FROM tomo_espacios";
		$sql.= " WHERE id_titulo = " . $titulo->id_titulo;
		$sql.= " AND id_espacio = " . $p->espacio->model;
		$sql.= " AND id_carrera = " . $p->carrera->model;
		
		$rs = $this->mysqli->query($sql);
		
		if ($rs->num_rows == 0) {
			$sql = "SELECT id_tomo_espacio";
			$sql.= " FROM nov_tomo_espacios";
			$sql.= " WHERE id_titulo =" . $titulo->id_titulo;
			$sql.= " AND id_espacio =" . $p->espacio->model;
			$sql.= " AND id_carrera =" . $p->carrera->model;
			$sql.= " AND estado = 'S'";
			
			$rs = $this->mysqli->query($sql);
			
			if ($rs->num_rows == 0) {
				$sql = "SELECT id_tomo_espacio";
				$sql.= " FROM tomo_espacios";
				$sql.= " WHERE id_espacio = " . $p->espacio->model;
				
				$rs = $this->mysqli->query($sql);
				
				if ($rs->num_rows == 0) {
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
					
					$resultado->id_tomo_espacio = $id_tomo_espacio;
					
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
					
					
				} else {
					$sql = "SELECT id_nov_tomo_espacios FROM nov_tomo_espacios WHERE id_espacio='" . $p->espacio->model . "' AND tipo_novedad='N' AND CURDATE() <= DATE_ADD(fecha_novedad, INTERVAL 1 DAY)";
					
					$rs = $this->mysqli->query($sql);
					
					if ($rs->num_rows == 0) {
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
						
						//$sql.= ", id_tomo_espacio='" . "'";
						$sql.= ", tipo_novedad='A'";
						$sql.= ", estado='S'";
						$sql.= ", fecha_novedad=NOW()";
						$sql.= ", timestamp=NOW()";
						$sql.= ", usuario_novedad='" . $_SESSION['usuario'] . "'";
						
						$this->mysqli->query($sql);
						
						$id_nov_tomo_espacios = $this->mysqli->insert_id;
						
						$resultado->id_nov_tomo_espacios = $id_nov_tomo_espacios;
						
					} else {
						
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
						
						$resultado->id_tomo_espacio = $id_tomo_espacio;
						
						$_descrip = "ALTA DE TOMO-ESPACIO CON id='" . $id_tomo_espacio . "', TITULO '" . $titulo->titulo_descrip . "', CARRERA '" . $p->carrera->label . "', ESPACIO '" . $p->espacio->label . "'";
						
						$this->auditoria($sql, null, null, 'tomo_espacios', $id_tomo_espacio, $_descrip, '', '');
					}
				}
				
			} else {
				$error->SetError(0, "novedad_existente");
				return $error;
			}
			
		} else {
			$error->SetError(0, "titulo_ya_asignado");
			return $error;
		}
  	}
  	
  	$this->mysqli->query("COMMIT");
  	
  	return $resultado;
  }
  
  
  public function method_eliminar_titulo($params, $error) {
  	$p = $params[0];
  	
  	$this->mysqli->query("START TRANSACTION");
  	
  	foreach ($p->titulo as $titulo) {
		$sql = "SELECT id_tomo_espacio";
		$sql.= " FROM nov_tomo_espacios";
		$sql.= " WHERE id_tomo_espacio = " . $titulo->id_tomo_espacio;
		$sql.= " AND estado = 'S'";
		
		$rs = $this->mysqli->query($sql);
		
		if ($rs->num_rows == 0) {
			$sql = "UPDATE tomo_espacios SET marcado='1' WHERE id_tomo_espacio=" . $titulo->id_tomo_espacio;
			
			$this->mysqli->query($sql);
			
			
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
			
			$sql.= ", id_tomo_espacio='" . $titulo->id_tomo_espacio . "'";
			$sql.= ", tipo_novedad='B'";
			$sql.= ", estado='S'";
			$sql.= ", fecha_novedad=NOW()";
			$sql.= ", timestamp=NOW()";
			$sql.= ", usuario_novedad='" . $_SESSION['usuario'] . "'";
			
			$this->mysqli->query($sql);
		} else {
			$error->SetError(0, "novedad_existente");
			return $error;
		}
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
  
  
  public function method_eliminar_titulo_xxx($params, $error) {
  	$p = $params[0];
  	
	$contador = 0;

	$sql = "SELECT * FROM tomo_espacios WHERE novedades >= '2017-09-08'";
	$rsTE = $this->mysqli->query($sql);
	while ($rowTE = $rsTE->fetch_object()) {
		$sql = "SELECT * FROM nov_tomo_espacios";
		$sql.= " WHERE";
		$sql.= " id_espacio=" . $rowTE->id_espacio;
		$sql.= " AND id_carrera=" . $rowTE->id_carrera;
		$sql.= " AND id_titulo=" . $rowTE->id_titulo;
		$sql.= " AND id_tipo_titulo=" . $rowTE->id_tipo_titulo;
		$sql.= " AND id_tipo_clasificacion=" . $rowTE->id_tipo_clasificacion;
		$sql.= " AND tipo_novedad='N'";
		$sql.= " AND estado='V'";
		//$sql.= " AND fecha_novedad >= '2017-09-08'";
		
		$rsNTE = $this->mysqli->query($sql);
		
		if ($rsNTE->num_rows == 0) $contador = $contador + 1;
	}
	
	return $contador;
  }
}

?>