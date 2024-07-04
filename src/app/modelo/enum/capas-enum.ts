export enum capasEnum {
  SubZonaHidrografica = 21,
  Microcuenca = 22,
  Subcuenca = 23,
  Cuenca = 24,
  Departamentos = 3,
  Municipios = 4,
  Zonificacion = 5,
  Estaciones = 6,
  Embalses = 42,
  Pozos = 41,
}
export interface ICapasEnum {
  id: string,
  titulo: string
}
export function capasEnumDatos(capa: capasEnum): ICapasEnum {
  switch (capa) {
    case capasEnum.Cuenca:
      return { id: 'cuenca', titulo: 'Cuenta' };
    case capasEnum.Departamentos:
      return { id: 'departamentos', titulo: 'Departamentos' };
    case capasEnum.Estaciones:
      return { id: 'estaciones', titulo: 'Estaciones' };
    case capasEnum.Microcuenca:
      return { id: 'microcuenca', titulo: 'Microcuenca' };
    case capasEnum.Municipios:
      return { id: 'municipios', titulo: 'Municipios' };
    case capasEnum.SubZonaHidrografica:
      return { id: 'subZonaHidrografica', titulo: 'Subzona Hidrográfica' };
    case capasEnum.Subcuenca:
      return { id: 'subcuenca', titulo: 'Subcuenca' };
    case capasEnum.Zonificacion:
      return { id: 'zonificacion', titulo: 'Zonificación' };
    case capasEnum.Embalses:
      return { id: 'embalses', titulo: 'Embalses' };
    case capasEnum.Pozos:
      return { id: 'pozos', titulo: 'Pozos' };
  }
}