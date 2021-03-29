export interface Cliente{
	id: number,
	nombre: string,
	apellido: string
}

export interface Articulo{
	id: number,
	codigo: string,
	nombre: string,
	precio: number,
	stock: number
}

export interface Orden{
	id: number,
	fecha: Date,
	cliente: Cliente
}

export interface Detalle{
	id: number,
	cantidad: number,
	orden: Orden,
	articulo: Articulo
}