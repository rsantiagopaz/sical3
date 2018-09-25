<?php

require("Base.php");

class class_IncumbenciaCargosxTitulo extends class_Base
{
	
	
  public function method_leer_cargos($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT id_tomo_cargo, TRIM(cargos.denominacion) AS cargo_descrip, niveles.id_nivel, niveles.nivel, cargos.id_cargo, cargos.codigo AS cod_cargo, tipos_titulos.id_tipo_titulo, tipos_titulos.codigo AS cod_tipo_titulo, tipos_clasificacion.id_tipo_clasificacion, tipos_clasificacion.denominacion AS tipo_clasificacion, tipos_titulos.tipo AS tipo_titulo";
	$sql.= " FROM (((tomo_cargos INNER JOIN cargos USING(id_cargo)) INNER JOIN niveles USING(id_nivel)) INNER JOIN tipos_clasificacion USING(id_tipo_clasificacion)) INNER JOIN tipos_titulos USING(id_tipo_titulo)";
	$sql.= " WHERE id_titulo=" . $p->id_titulo;
	$sql.= " ORDER BY cargo_descrip";
	
	return $this->toJson($sql);
  }
  
  
  
  public function method_guardar_cargos($params, $error) {
  	$p = $params[0];
  	
  	$resultado = new stdClass;
  	
	$this->mysqli->query("START TRANSACTION");
  	
  	foreach ($p->cargo as $cargo) {
		$sql = "SELECT codigo AS cod_tipo_clasificacion FROM tipos_clasificacion WHERE id_tipo_clasificacion=" . $cargo->id_tipo_clasificacion;
		$rs = $this->mysqli->query($sql);
		$row = $rs->fetch_object();
		
		$cargo->cod_tipo_clasificacion = $row->cod_tipo_clasificacion;
		
		
		  		
  		
		$sql = "SELECT id_tomo_cargo";
		$sql.= " FROM tomo_cargos";
		$sql.= " WHERE id_cargo = " . $cargo->id_cargo;
		$sql.= " AND id_titulo = " . $p->titulo->model;
		
		$rs = $this->mysqli->query($sql);
		
		if ($rs->num_rows == 0) {
			$sql = "SELECT id_tomo_cargo";
			$sql.= " FROM nov_tomo_cargos";
			$sql.= " WHERE id_cargo =" . $cargo->id_cargo;
			$sql.= " AND id_titulo =" . $p->titulo->model;
			$sql.= " AND estado = 'S'";
			
			$rs = $this->mysqli->query($sql);
			
			if ($rs->num_rows == 0) {
				$sql = "SELECT id_tomo_cargo";
				$sql.= " FROM tomo_cargos";
				$sql.= " WHERE id_cargo=" . $cargo->id_cargo;
				
				$rs = $this->mysqli->query($sql);
				
				if ($rs->num_rows == 0) {
					$sql = "INSERT tomo_cargos SET";
					$sql.= "  id_titulo='" . $p->titulo->model . "'";
					$sql.= ", cod_titulo='" . $p->titulo->codigo . "'";
					$sql.= ", id_cargo='" . $cargo->id_cargo . "'";
					$sql.= ", cod_cargo='" . $cargo->cod_cargo . "'";
					$sql.= ", id_tipo_titulo='" . $cargo->id_tipo_titulo . "'";
					$sql.= ", cod_tipo_titulo='" . $cargo->cod_tipo_titulo . "'";
					$sql.= ", id_tipo_clasificacion='" . $cargo->id_tipo_clasificacion . "'";
					$sql.= ", cod_tipo_clasificacion='" . $cargo->cod_tipo_clasificacion . "'";
					$sql.= ", cod_nivel='" . $cargo->id_nivel . "'";
					
					$this->mysqli->query($sql);
					
					$id_tomo_cargo = $this->mysqli->insert_id;
					
					$resultado->id_tomo_cargo = $id_tomo_cargo;
					
					$_descrip = "ALTA DE TOMO-CARGO CON id='" . $id_tomo_cargo . "', CARGO '" . $cargo->cargo_descrip . "', TITULO '" . $p->titulo->label . "'";
					
					$this->auditoria($sql, null, null, 'tomo_cargos', $id_tomo_cargo, $_descrip, '', '');
					
					
							
					$sql = "INSERT nov_tomo_cargos SET";
					$sql.= "  id_titulo='" . $p->titulo->model . "'";
					$sql.= ", cod_titulo='" . $p->titulo->codigo . "'";
		
					$sql.= ", id_cargo='" . $cargo->id_cargo . "'";
					$sql.= ", cod_cargo='" . $cargo->cod_cargo . "'";
					$sql.= ", id_tipo_titulo='" . $cargo->id_tipo_titulo . "'";
					$sql.= ", cod_tipo_titulo='" . $cargo->cod_tipo_titulo . "'";
					$sql.= ", id_tipo_clasificacion='" . $cargo->id_tipo_clasificacion . "'";
					$sql.= ", cod_tipo_clasificacion='" . $cargo->cod_tipo_clasificacion . "'";
					
					$sql.= ", cod_nivel='" . $cargo->id_nivel . "'";
					$sql.= ", id_tomo_cargo='" . $id_tomo_cargo . "'";
					
					$sql.= ", tipo_novedad='N'";
					$sql.= ", estado='V'";
					$sql.= ", fecha_novedad=NOW()";
					$sql.= ", timestamp=NOW()";
					$sql.= ", usuario_novedad='" . $_SESSION['usuario'] . "'";
					
					$this->mysqli->query($sql);
					
					
				} else {
					$sql = "SELECT id_nov_tomo_cargos FROM nov_tomo_cargos WHERE id_cargo='" . $cargo->id_cargo . "' AND tipo_novedad='N' AND CURDATE() <= DATE_ADD(fecha_novedad, INTERVAL 1 DAY)";
					
					$rs = $this->mysqli->query($sql);
					
					if ($rs->num_rows == 0) {
						$sql = "INSERT nov_tomo_cargos SET";
						$sql.= "  id_titulo='" . $p->titulo->model . "'";
						$sql.= ", cod_titulo='" . $p->titulo->codigo . "'";
			
						$sql.= ", id_cargo='" . $cargo->id_cargo . "'";
						$sql.= ", cod_cargo='" . $cargo->cod_cargo . "'";
						$sql.= ", id_tipo_titulo='" . $cargo->id_tipo_titulo . "'";
						$sql.= ", cod_tipo_titulo='" . $cargo->cod_tipo_titulo . "'";
						$sql.= ", id_tipo_clasificacion='" . $cargo->id_tipo_clasificacion . "'";
						$sql.= ", cod_tipo_clasificacion='" . $cargo->cod_tipo_clasificacion . "'";
						
						$sql.= ", cod_nivel='" . $cargo->id_nivel . "'";
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
						$sql.= "  id_titulo='" . $p->titulo->model . "'";
						$sql.= ", cod_titulo='" . $p->titulo->codigo . "'";
						$sql.= ", id_cargo='" . $cargo->id_cargo . "'";
						$sql.= ", cod_cargo='" . $cargo->cod_cargo . "'";
						$sql.= ", id_tipo_titulo='" . $cargo->id_tipo_titulo . "'";
						$sql.= ", cod_tipo_titulo='" . $cargo->cod_tipo_titulo . "'";
						$sql.= ", id_tipo_clasificacion='" . $cargo->id_tipo_clasificacion . "'";
						$sql.= ", cod_tipo_clasificacion='" . $cargo->cod_tipo_clasificacion . "'";
						$sql.= ", cod_nivel='" . $cargo->id_nivel . "'";
						
						$this->mysqli->query($sql);
						
						$id_tomo_cargo = $this->mysqli->insert_id;
						
						$resultado->id_tomo_cargo = $id_tomo_cargo;
						
						$_descrip = "ALTA DE TOMO-CARGO CON id='" . $id_tomo_cargo . "', CARGO '" . $cargo->cargo_descrip . "', TITULO '" . $p->titulo->label . "'";
						
						$this->auditoria($sql, null, null, 'tomo_cargos', $id_tomo_cargo, $_descrip, '', '');
					}
				}
				
			} else {
				$error->SetError(0, "novedad_existente");
				return $error;
			}
			
		} else {
			$error->SetError(0, "cargo_ya_asignado");
			return $error;
		}
  	}
  	
  	$this->mysqli->query("COMMIT");
  	
  	return $resultado;
  }
}

?>