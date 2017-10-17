<?php

require("Base.php");

class class_IncumbenciaTitulosxCargo extends class_Base
{
	
	
  public function method_escribir_novedad_modificacion($params, $error) {
  	$p = $params[0];
  	
  	$titulo = $p->titulo[0];
  	
	$sql = "SELECT codigo AS cod_tipo_titulo FROM tipos_titulos WHERE id_tipo_titulo=" . $titulo->id_tipo_titulo;
	$rs = $this->mysqli->query($sql);
	$row = $rs->fetch_object();
	
	$titulo->cod_tipo_titulo = $row->cod_tipo_titulo;
	
	
	$sql = "SELECT codigo AS cod_tipo_clasificacion FROM tipos_clasificacion WHERE id_tipo_clasificacion=" . $titulo->id_tipo_clasificacion;
	$rs = $this->mysqli->query($sql);
	$row = $rs->fetch_object();
	
	$titulo->cod_tipo_clasificacion = $row->cod_tipo_clasificacion;
	
  	
	if ($p->message == "INSERT") {
		
			$sql = "INSERT nov_tomo_cargos SET";
			$sql.= "  id_cargo='" . $p->cargo->model . "'";
			$sql.= ", cod_cargo='" . $p->cargo->codigo . "'";

			$sql.= ", id_titulo='" . $titulo->id_titulo . "'";
			$sql.= ", cod_titulo='" . $titulo->cod_titulo . "'";
			$sql.= ", id_tipo_titulo='" . $titulo->id_tipo_titulo . "'";
			$sql.= ", cod_tipo_titulo='" . $titulo->cod_tipo_titulo . "'";
			$sql.= ", id_tipo_clasificacion='" . $titulo->id_tipo_clasificacion . "'";
			$sql.= ", cod_tipo_clasificacion='" . $titulo->cod_tipo_clasificacion . "'";
			
			$sql.= ", cod_nivel='" . $p->cargo->id_nivel . "'";
			$sql.= ", id_tomo_cargo='" . $titulo->id_tomo_cargo . "'";
			$sql.= ", tipo_novedad='M'";
			$sql.= ", estado='S'";
			$sql.= ", fecha_novedad=NOW()";
			$sql.= ", timestamp=NOW()";
			$sql.= ", usuario_novedad='" . $_SESSION['usuario'] . "'";
			
	} else if ($p->message == "UPDATE") {
		$sql = "UPDATE nov_tomo_cargos";
		$sql.= " SET id_tipo_titulo=" . $titulo->id_tipo_titulo . ", cod_tipo_titulo=" . $titulo->cod_tipo_titulo;
		$sql.= " WHERE id_nov_tomo_cargos=" . $p->id_nov_tomo_cargos;
	}
	
	$this->mysqli->query($sql);
  }
	
	
  public function method_verificar_novedad_modificacion($params, $error) {
  	$p = $params[0];
  	
  	$resultado = new stdClass;
  	
  	$titulo = $p->titulo[0];
  	
	$sql = "SELECT *";
	$sql.= " FROM nov_tomo_cargos";
	$sql.= " WHERE id_tomo_cargo=" . $titulo->id_tomo_cargo;
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
			$resultado->id_nov_tomo_cargos = $row->id_nov_tomo_cargos;
		}
	}
	
	return $resultado;
  }
	
	
  public function method_guardar_titulos($params, $error) {
  	$p = $params[0];
  	
  	$resultado = new stdClass;
  	
	$this->mysqli->query("START TRANSACTION");
  	
  	foreach ($p->titulo as $titulo) {
		$sql = "SELECT codigo AS cod_tipo_clasificacion FROM tipos_clasificacion WHERE id_tipo_clasificacion=" . $titulo->id_tipo_clasificacion;
		$rs = $this->mysqli->query($sql);
		$row = $rs->fetch_object();
		
		$titulo->cod_tipo_clasificacion = $row->cod_tipo_clasificacion;
		
		
		  		
  		
		$sql = "SELECT id_tomo_cargo";
		$sql.= " FROM tomo_cargos";
		$sql.= " WHERE id_titulo = " . $titulo->id_titulo;
		$sql.= " AND id_cargo = " . $p->cargo->model;
		
		$rs = $this->mysqli->query($sql);
		
		if ($rs->num_rows == 0) {
			$sql = "SELECT id_tomo_cargo";
			$sql.= " FROM nov_tomo_cargos";
			$sql.= " WHERE id_titulo =" . $titulo->id_titulo;
			$sql.= " AND id_cargo =" . $p->cargo->model;
			$sql.= " AND estado = 'S'";
			
			$rs = $this->mysqli->query($sql);
			
			if ($rs->num_rows == 0) {
				$sql = "SELECT id_tomo_cargo";
				$sql.= " FROM tomo_cargos";
				$sql.= " WHERE id_cargo = " . $p->cargo->model;
				
				$rs = $this->mysqli->query($sql);
				
				if ($rs->num_rows == 0) {
					$sql = "INSERT tomo_cargos SET";
					$sql.= "  id_cargo='" . $p->cargo->model . "'";
					$sql.= ", cod_cargo='" . $p->cargo->codigo . "'";
					$sql.= ", id_titulo='" . $titulo->id_titulo . "'";
					$sql.= ", cod_titulo='" . $titulo->cod_titulo . "'";
					$sql.= ", id_tipo_titulo='" . $titulo->id_tipo_titulo . "'";
					$sql.= ", cod_tipo_titulo='" . $titulo->cod_tipo_titulo . "'";
					$sql.= ", id_tipo_clasificacion='" . $titulo->id_tipo_clasificacion . "'";
					$sql.= ", cod_tipo_clasificacion='" . $titulo->cod_tipo_clasificacion . "'";
					$sql.= ", cod_nivel='" . $p->cargo->id_nivel . "'";
					
					$this->mysqli->query($sql);
					
					$id_tomo_cargo = $this->mysqli->insert_id;
					
					$resultado->id_tomo_cargo = $id_tomo_cargo;
					
					$_descrip = "ALTA DE TOMO-CARGO CON id='" . $id_tomo_cargo . "', TITULO '" . $titulo->titulo_descrip . "', CARGO '" . $p->cargo->label . "'";
					
					$this->auditoria($sql, null, null, 'tomo_cargos', $id_tomo_cargo, $_descrip, '', '');
					
					
							
					$sql = "INSERT nov_tomo_cargos SET";
					$sql.= "  id_cargo='" . $p->cargo->model . "'";
					$sql.= ", cod_cargo='" . $p->cargo->codigo . "'";
		
					$sql.= ", id_titulo='" . $titulo->id_titulo . "'";
					$sql.= ", cod_titulo='" . $titulo->cod_titulo . "'";
					$sql.= ", id_tipo_titulo='" . $titulo->id_tipo_titulo . "'";
					$sql.= ", cod_tipo_titulo='" . $titulo->cod_tipo_titulo . "'";
					$sql.= ", id_tipo_clasificacion='" . $titulo->id_tipo_clasificacion . "'";
					$sql.= ", cod_tipo_clasificacion='" . $titulo->cod_tipo_clasificacion . "'";
					
					$sql.= ", cod_nivel='" . $p->cargo->id_nivel . "'";
					$sql.= ", id_tomo_cargo='" . $id_tomo_cargo . "'";
					
					$sql.= ", tipo_novedad='N'";
					$sql.= ", estado='V'";
					$sql.= ", fecha_novedad=NOW()";
					$sql.= ", timestamp=NOW()";
					$sql.= ", usuario_novedad='" . $_SESSION['usuario'] . "'";
					
					$this->mysqli->query($sql);
					
					
				} else {
					$sql = "SELECT id_nov_tomo_cargos FROM nov_tomo_cargos WHERE id_cargo='" . $p->cargo->model . "' AND tipo_novedad='N' AND CURDATE() <= DATE_ADD(fecha_novedad, INTERVAL 1 DAY)";
					
					$rs = $this->mysqli->query($sql);
					
					if ($rs->num_rows == 0) {
						$sql = "INSERT nov_tomo_cargos SET";
						$sql.= "  id_cargo='" . $p->cargo->model . "'";
						$sql.= ", cod_cargo='" . $p->cargo->codigo . "'";
			
						$sql.= ", id_titulo='" . $titulo->id_titulo . "'";
						$sql.= ", cod_titulo='" . $titulo->cod_titulo . "'";
						$sql.= ", id_tipo_titulo='" . $titulo->id_tipo_titulo . "'";
						$sql.= ", cod_tipo_titulo='" . $titulo->cod_tipo_titulo . "'";
						$sql.= ", id_tipo_clasificacion='" . $titulo->id_tipo_clasificacion . "'";
						$sql.= ", cod_tipo_clasificacion='" . $titulo->cod_tipo_clasificacion . "'";
						
						$sql.= ", cod_nivel='" . $p->cargo->id_nivel . "'";
						//$sql.= ", id_tomo_cargo='" . "'";
						$sql.= ", tipo_novedad='A'";
						$sql.= ", estado='S'";
						$sql.= ", fecha_novedad=NOW()";
						$sql.= ", timestamp=NOW()";
						$sql.= ", usuario_novedad='" . $_SESSION['usuario'] . "'";
						
						$this->mysqli->query($sql);
						
						$id_nov_tomo_cargos = $this->mysqli->insert_id;
						
						$resultado->id_nov_tomo_cargos = $id_nov_tomo_cargos;
						
					} else {
						
						$sql = "INSERT tomo_cargos SET";
						$sql.= "  id_cargo='" . $p->cargo->model . "'";
						$sql.= ", cod_cargo='" . $p->cargo->codigo . "'";
						$sql.= ", id_titulo='" . $titulo->id_titulo . "'";
						$sql.= ", cod_titulo='" . $titulo->cod_titulo . "'";
						$sql.= ", id_tipo_titulo='" . $titulo->id_tipo_titulo . "'";
						$sql.= ", cod_tipo_titulo='" . $titulo->cod_tipo_titulo . "'";
						$sql.= ", id_tipo_clasificacion='" . $titulo->id_tipo_clasificacion . "'";
						$sql.= ", cod_tipo_clasificacion='" . $titulo->cod_tipo_clasificacion . "'";
						$sql.= ", cod_nivel='" . $p->cargo->id_nivel . "'";
						
						$this->mysqli->query($sql);
						
						$id_tomo_cargo = $this->mysqli->insert_id;
						
						$resultado->id_tomo_cargo = $id_tomo_cargo;
						
						$_descrip = "ALTA DE TOMO-CARGO CON id='" . $id_tomo_cargo . "', TITULO '" . $titulo->titulo_descrip . "', CARGO '" . $p->cargo->label . "'";
						
						$this->auditoria($sql, null, null, 'tomo_cargos', $id_tomo_cargo, $_descrip, '', '');
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
		$sql = "SELECT codigo AS cod_tipo_clasificacion FROM tipos_clasificacion WHERE id_tipo_clasificacion=" . $titulo->id_tipo_clasificacion;
		$rs = $this->mysqli->query($sql);
		$row = $rs->fetch_object();
		
		$titulo->cod_tipo_clasificacion = $row->cod_tipo_clasificacion;
		
		
		
  		
		$sql = "SELECT id_tomo_cargo";
		$sql.= " FROM nov_tomo_cargos";
		$sql.= " WHERE id_tomo_cargo = " . $titulo->id_tomo_cargo;
		$sql.= " AND estado = 'S'";
		
		$rs = $this->mysqli->query($sql);
		
		if ($rs->num_rows == 0) {
			$sql = "UPDATE tomo_cargos SET marcado='1' WHERE id_tomo_cargo=" . $titulo->id_tomo_cargo;
			
			$this->mysqli->query($sql);
			
			
			$sql = "INSERT nov_tomo_cargos SET";
			$sql.= "  id_cargo='" . $p->cargo->model . "'";
			$sql.= ", cod_cargo='" . $p->cargo->codigo . "'";

			$sql.= ", id_titulo='" . $titulo->id_titulo . "'";
			$sql.= ", cod_titulo='" . $titulo->cod_titulo . "'";
			$sql.= ", id_tipo_titulo='" . $titulo->id_tipo_titulo . "'";
			$sql.= ", cod_tipo_titulo='" . $titulo->cod_tipo_titulo . "'";
			$sql.= ", id_tipo_clasificacion='" . $titulo->id_tipo_clasificacion . "'";
			$sql.= ", cod_tipo_clasificacion='" . $titulo->cod_tipo_clasificacion . "'";
			
			$sql.= ", cod_nivel='" . $p->cargo->id_nivel . "'";
			$sql.= ", id_tomo_cargo='" . $titulo->id_tomo_cargo . "'";
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
  	
	$sql = "SELECT id_tomo_cargo, titulos.denominacion AS titulo_descrip, titulos.id_titulo, titulos.codigo AS cod_titulo, tipos_titulos.id_tipo_titulo, tipos_titulos.codigo AS cod_tipo_titulo, tipos_clasificacion.id_tipo_clasificacion, tipos_clasificacion.denominacion AS tipo_clasificacion, tipos_titulos.tipo AS tipo_titulo";
	$sql.= " FROM ((tomo_cargos INNER JOIN titulos USING(id_titulo)) INNER JOIN tipos_clasificacion USING(id_tipo_clasificacion)) INNER JOIN tipos_titulos USING(id_tipo_titulo)";
	$sql.= " WHERE id_cargo=" . $p->id_cargo;
	
	return $this->toJson($sql);
  }
}

?>