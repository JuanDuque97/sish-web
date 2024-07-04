export enum tipoContenido {
  Dato = 164,
  Fecha_Lectura = 221,
  Fecha_Hora_Lectura = 223,
  Hora_Lectura = 222,
  Propiedad = 165,
}

export enum tipoDato {
  Fecha = 162,
  Fecha_Hora = 223,
  Hora=244,
  Hora_Lectura = 222,
  Decimal = 241,
  Texto = 160,
  NumeroEntero=161,
  InicioCalculoAforo=160,
}

export enum activo{
  Si="S",
  No="N"
}

export enum aforoArchivo{
  MOLINETE='MOLINETE',
  PUNTO='PUNTO',
  FECHA='FECHA',
  VELOCIDAD='VELOCIDAD',
  CAUDAL='CAUDAL',
  AREA='AREA',
  CAUDAL2='CAUDAL2',
  INICIOABSCISA='INICIOABSCISA',
  INICIOPROFUNDIDAD='INICIOPROFUNDIDAD'
}

export enum tipoAforo{
  LIQUIDO=481,
  OTRO=482
}

export enum tipoMedicion{
  SININFORMACION=263
}