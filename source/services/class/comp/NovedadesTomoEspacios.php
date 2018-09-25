<?php

require("Base.php");

class class_NovedadesTomoEspacios extends class_Base
{
	
	
  public function method_impactar($params, $error) {
  	$p = $params[0];
  	
  	$this->mysqli->query("START TRANSACTION");
  	
  	foreach ($p->nov_tomo_espacios as $id_nov_tomo_espacios) {
		$sql = "SELECT";
		$sql.= "  nov_tomo_espacios.*";
		$sql.= ", carreras.nombre AS carrera_descrip";
		$sql.= ", espacios.denominacion AS espacio_descrip";
		$sql.= ", titulos.denominacion AS titulo_descrip";
		$sql.= " FROM nov_tomo_espacios";
		$sql.= " INNER JOIN carreras USING(id_carrera)";
		$sql.= " INNER JOIN espacios USING(id_espacio)";
		$sql.= " INNER JOIN titulos USING(id_titulo)";
		$sql.= " WHERE id_nov_tomo_espacios=" . $id_nov_tomo_espacios;
		
		$rs = $this->mysqli->query($sql);
		$row = $rs->fetch_object();
		
		if ($row->estado == "S") {
			if ($row->tipo_novedad == "B") {
				$sql = "DELETE FROM tomo_espacios WHERE id_tomo_espacio=" . $row->id_tomo_espacio;
				
				$this->mysqli->query($sql);
				
			} else if ($row->tipo_novedad == "M") {
				$sql = "UPDATE tomo_espacios SET";
				$sql.= "  id_espacio=" . $row->id_espacio;
				$sql.= ", cod_espacio=" . $row->cod_espacio;
				$sql.= ", id_carrera=" . $row->id_carrera;
				$sql.= ", cod_carrera=" . $row->cod_carrera;
				$sql.= ", id_titulo=" . $row->id_titulo;
				$sql.= ", cod_titulo=" . $row->cod_titulo;
				$sql.= ", id_tipo_titulo=" . $row->id_tipo_titulo;
				$sql.= ", cod_tipo_titulo=" . $row->cod_tipo_titulo;
				$sql.= ", id_tipo_clasificacion=" . $row->id_tipo_clasificacion;
				$sql.= ", marcado = 0";
				$sql.= " WHERE id_tomo_espacio=" . $row->id_tomo_espacio;
				
				$this->mysqli->query($sql);
				
			} else if ($row->tipo_novedad == "A") {
				$sql = "INSERT tomo_espacios SET";
				$sql.= "  id_espacio=" . $row->id_espacio;
				$sql.= ", cod_espacio=" . $row->cod_espacio;
				$sql.= ", id_carrera=" . $row->id_carrera;
				$sql.= ", cod_carrera=" . $row->cod_carrera;
				$sql.= ", id_titulo=" . $row->id_titulo;
				$sql.= ", cod_titulo=" . $row->cod_titulo;
				$sql.= ", id_tipo_titulo=" . $row->id_tipo_titulo;
				$sql.= ", cod_tipo_titulo=" . $row->cod_tipo_titulo;
				$sql.= ", id_tipo_clasificacion=" . $row->id_tipo_clasificacion;
				
				$this->mysqli->query($sql);
				
			}
			
			$_descrip = "IMPACTADO DE LA NOVEDAD CON id='" . $id_nov_tomo_espacios . "', CORRESPONDIENTE A UNA '" . $row->tipo_novedad . "'.";
			$_descrip.= " TITULO '" . $row->titulo_descrip . "', CARRERA '" . $row->carrera_descrip . "', ESPACIO '" . $row->espacio_descrip . "'";
			
			$this->auditoria($sql, null, null, 'tomo_espacios', $id_nov_tomo_espacios, $_descrip, '', '');
			

			
			
			$sql = "UPDATE nov_tomo_espacios SET estado='V', fecha_volcado=NOW(), usuario_volcado='" . $_SESSION['usuario'] . "' WHERE id_nov_tomo_espacios=" . $id_nov_tomo_espacios;
			$this->mysqli->query($sql);
		}
  	}
  	
  	$this->mysqli->query("COMMIT");
  }
	
	
  public function method_leer_espacios($params, $error) {
  	$p = $params[0];
  	
  	$opciones = new stdClass;
  	$opciones->seleccionar = "bool";
  	
	$sql = "SELECT";
	$sql.= "  FALSE AS seleccionar";
	$sql.= ", nov_tomo_espacios.id_nov_tomo_espacios";
	$sql.= ", fecha_novedad";
	$sql.= ", nov_tomo_espacios.cod_carrera";
	$sql.= ", carreras.nombre AS carrera_descrip";
	$sql.= ", nov_tomo_espacios.cod_espacio";
	$sql.= ", espacios.denominacion AS espacio_descrip";
	$sql.= ", carreras.id_nivel";
	$sql.= ", niveles.nivel AS nivel_descrip";
	$sql.= ", nov_tomo_espacios.cod_titulo";
	$sql.= ", titulos.denominacion AS titulo_descrip";
	$sql.= ", nov_tomo_espacios.tipo_novedad";
	$sql.= ", tipos_titulos.tipo AS tipo_titulo_descrip";
	
	$sql.= " FROM nov_tomo_espacios";
	$sql.= " INNER JOIN carreras USING(id_carrera)";
	$sql.= " INNER JOIN espacios USING(id_espacio)";
	$sql.= " INNER JOIN titulos USING(id_titulo)";
	$sql.= " INNER JOIN tipos_titulos USING(id_tipo_titulo)";
	$sql.= " INNER JOIN tipos_clasificacion USING(id_tipo_clasificacion)";
	$sql.= " INNER JOIN niveles USING(id_nivel)";
	
	$sql.= " WHERE nov_tomo_espacios.estado = 'S'";
	
	if (! is_null($p->id_titulo)) $sql.= " AND nov_tomo_espacios.id_titulo='" . $p->id_titulo . "'";
	if (! is_null($p->id_espacio)) $sql.= " AND nov_tomo_espacios.id_espacio='" . $p->id_espacio . "'";
	if (! is_null($p->usuario)) $sql.= " AND nov_tomo_espacios.usuario_novedad='" . $p->usuario . "'";
	
	$sql.= " ORDER BY nov_tomo_espacios.fecha_novedad";
	
	
	
	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_eliminar_novedad($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT * FROM nov_tomo_espacios WHERE id_nov_tomo_espacios=" . $p->id_nov_tomo_espacios;
	$rs = $this->mysqli->query($sql);
	$row = $rs->fetch_object();
	
	if ($row->estado == "S") {
		$this->mysqli->query("START TRANSACTION");
		
		$sql = "UPDATE tomo_espacios SET marcado='0' WHERE id_tomo_espacio='" . $row->id_tomo_espacio . "'";
		$this->mysqli->query($sql);
		
		$sql = "DELETE FROM nov_tomo_espacios WHERE id_nov_tomo_espacios=" . $p->id_nov_tomo_espacios;
		$this->mysqli->query($sql);
		
		$this->mysqli->query("COMMIT");
	}
  }
}

?>