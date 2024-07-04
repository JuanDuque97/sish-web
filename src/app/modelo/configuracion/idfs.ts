export interface Idfs{
    ID_ESPACIAL : number,
	OBJECTID : number,
	ID : string,
	ESTE : number,
	NORTE : number,
	TR3_C1 : number,
	TR3_XO : number,
	TR3_C2 : number,
	TR5_C1 : number,
	TR5_XO : number,
	TR5_C2 : number,
	TR10_C1 : number,
	TR10_XO : number,
	TR10_C2 : number,
	TR25_C1 : number,
	TR25_XO : number,
	TR25_C2 : number,
	TR50_C1 : number,
	TR50_XO : number,
	TR50_C2 : number,
	TR100_C1 : number,
	TR100_XO : number,
	TR100_C2 : number
}



export interface IGuardarIdfs {
	consulta:string,
	nombre: string,
	correo: string,
	identificacion: number,
}
