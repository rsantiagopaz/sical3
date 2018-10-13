<?php

require("Base.php");

class class_IncumbenciaEspaciosxTitulo extends class_Base
{
	
	
  public function method_leer_espacios($params, $error) {
  	$p = $params[0];
	
	$sql = "SELECT tomo_espacios.*, TRIM(carreras.nombre) AS carrera_descrip, TRIM(espacios.denominacion) AS espacio_descrip, tipos_clasificacion.denominacion AS tipo_clasificacion, tipos_titulos.tipo AS tipo_titulo";
	$sql.= " FROM (((tomo_espacios INNER JOIN carreras USING(id_carrera)) INNER JOIN espacios USING(id_espacio)) INNER JOIN tipos_clasificacion USING(id_tipo_clasificacion)) INNER JOIN tipos_titulos USING(id_tipo_titulo)";
	$sql.= " WHERE id_titulo=" . $p->id_titulo;
	$sql.= " ORDER BY carrera_descrip, espacio_descrip";
	
	return $this->toJson($sql);
  }
}

?>