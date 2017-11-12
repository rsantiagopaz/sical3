<?php

require("Base.php");

class class_NovedadesTomoCargos extends class_Base
{
	
	
  public function method_impactar($params, $error) {
  	$p = $params[0];
  	
  	$this->mysqli->query("START TRANSACTION");
  	
  	foreach ($p->nov_tomo_cargos as $id_nov_tomo_cargos) {
		$sql = "SELECT";
		$sql.= "  nov_tomo_cargos.*";
		$sql.= ", cargos.denominacion AS cargo_descrip";
		$sql.= ", titulos.denominacion AS titulo_descrip";
		$sql.= " FROM nov_tomo_cargos";
		$sql.= " INNER JOIN cargos USING(id_cargo)";
		$sql.= " INNER JOIN titulos USING(id_titulo)";
		$sql.= " WHERE id_nov_tomo_cargos=" . $id_nov_tomo_cargos;
		
		$rs = $this->mysqli->query($sql);
		$row = $rs->fetch_object();
		
		if ($row->estado == "S") {
			if ($row->tipo_novedad == "B") {
				$sql = "DELETE FROM tomo_cargos WHERE id_tomo_cargo=" . $row->id_tomo_cargo;
				
				$this->mysqli->query($sql);
				
			} else if ($row->tipo_novedad == "M") {
				$sql = "UPDATE tomo_cargos SET";
				$sql.= "  id_cargo=" . $row->id_cargo;
				$sql.= ", cod_cargo=" . $row->cod_cargo;
				$sql.= ", id_titulo=" . $row->id_titulo;
				$sql.= ", cod_titulo=" . $row->cod_titulo;
				$sql.= ", id_tipo_titulo=" . $row->id_tipo_titulo;
				$sql.= ", cod_tipo_titulo=" . $row->cod_tipo_titulo;
				$sql.= ", id_tipo_clasificacion=" . $row->id_tipo_clasificacion;
				$sql.= ", cod_tipo_clasificacion=" . $row->cod_tipo_clasificacion;
				$sql.= ", cod_nivel=" . $row->cod_nivel;
				$sql.= ", marcado = 0";
				$sql.= " WHERE id_tomo_cargo=" . $row->id_tomo_cargo;
				
				$this->mysqli->query($sql);
				
			} else if ($row->tipo_novedad == "A") {
				$sql = "INSERT tomo_cargos SET";
				$sql.= "  id_cargo=" . $row->id_cargo;
				$sql.= ", cod_cargo=" . $row->cod_cargo;
				$sql.= ", id_titulo=" . $row->id_titulo;
				$sql.= ", cod_titulo=" . $row->cod_titulo;
				$sql.= ", id_tipo_titulo=" . $row->id_tipo_titulo;
				$sql.= ", cod_tipo_titulo=" . $row->cod_tipo_titulo;
				$sql.= ", id_tipo_clasificacion=" . $row->id_tipo_clasificacion;
				$sql.= ", cod_tipo_clasificacion=" . $row->cod_tipo_clasificacion;
				$sql.= ", cod_nivel=" . $row->cod_nivel;
				
				$this->mysqli->query($sql);
				
			}
			
			$_descrip = "IMPACTADO DE LA NOVEDAD CON id='" . $id_nov_tomo_cargos . "', CORRESPONDIENTE A UNA '" . $row->tipo_novedad . "'.";
			$_descrip.= " TITULO '" . $row->titulo_descrip . "', CARGO '" . $row->cargo_descrip . "'";
			
			$this->auditoria($sql, null, null, 'tomo_cargos', $id_nov_tomo_cargos, $_descrip, '', '');
			

			
			
			$sql = "UPDATE nov_tomo_cargos SET estado='V', fecha_volcado=NOW(), usuario_volcado='" . $_SESSION['usuario'] . "' WHERE id_nov_tomo_cargos=" . $id_nov_tomo_cargos;
			$this->mysqli->query($sql);
		}
  	}
  	
  	$this->mysqli->query("COMMIT");
  }
	
	
  public function method_leer_cargos($params, $error) {
  	$p = $params[0];
  	
  	$opciones = new stdClass;
  	$opciones->seleccionar = "bool";
  	
	$sql = "SELECT";
	$sql.= "  FALSE AS seleccionar";
	$sql.= ", nov_tomo_cargos.id_nov_tomo_cargos";
	$sql.= ", fecha_novedad";
	$sql.= ", nov_tomo_cargos.cod_cargo";
	$sql.= ", cargos.denominacion AS cargo_descrip";
	$sql.= ", cargos.id_nivel";
	$sql.= ", niveles.nivel AS nivel_descrip";
	$sql.= ", nov_tomo_cargos.cod_titulo";
	$sql.= ", titulos.denominacion AS titulo_descrip";
	$sql.= ", nov_tomo_cargos.tipo_novedad";
	$sql.= ", tipos_titulos.tipo AS tipo_titulo_descrip";
	
	$sql.= " FROM nov_tomo_cargos";
	$sql.= " INNER JOIN cargos USING(id_cargo)";
	$sql.= " INNER JOIN titulos USING(id_titulo)";
	$sql.= " INNER JOIN tipos_titulos USING(id_tipo_titulo)";
	$sql.= " INNER JOIN tipos_clasificacion USING(id_tipo_clasificacion)";
	$sql.= " INNER JOIN niveles USING(id_nivel)";
	
	$sql.= " WHERE nov_tomo_cargos.estado = 'S'";
	
	if (! is_null($p->id_titulo)) $sql.= " AND nov_tomo_cargos.id_titulo='" . $p->id_titulo . "'";
	if (! is_null($p->id_cargo)) $sql.= " AND nov_tomo_cargos.id_cargo='" . $p->id_cargo . "'";
	if (! is_null($p->usuario)) $sql.= " AND nov_tomo_cargos.usuario_novedad='" . $p->usuario . "'";
	
	$sql.= " ORDER BY nov_tomo_cargos.fecha_novedad";
	
	
	
	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_eliminar_novedad($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT * FROM nov_tomo_cargos WHERE id_nov_tomo_cargos=" . $p->id_nov_tomo_cargos;
	$rs = $this->mysqli->query($sql);
	$row = $rs->fetch_object();
	
	if ($row->estado == "S") {
		$this->mysqli->query("START TRANSACTION");
		
		$sql = "UPDATE tomo_cargos SET marcado='0' WHERE id_tomo_cargo=" . $row->id_tomo_cargo;
		$this->mysqli->query($sql);
		
		$sql = "DELETE FROM nov_tomo_cargos WHERE id_nov_tomo_cargos=" . $p->id_nov_tomo_cargos;
		$this->mysqli->query($sql);
		
		$this->mysqli->query("COMMIT");
	}
  }
}

?>