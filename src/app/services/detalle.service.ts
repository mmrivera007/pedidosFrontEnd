import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Detalle } from '../interfaces/interfaces';
import { catchError, map} from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetalleService {

  constructor(private http: HttpClient) { }

  getDetalles(id: number){
	  return this.http.get<Detalle[]>(`${environment.url}/api/obtenerDetalles/${id}`);
  }

  deleteDetalle(id: number){
	  return this.http.delete(`${environment.url}/api/eliminarDetalle/${id}`)
		  .pipe(
			  catchError(err => {
				  console.log('Error en la petición.');
				  return of(err.error);
			   	})
			  );
  }

  postDetalle(detalle: Detalle){
	return this.http.post(`${environment.url}/api/guardarDetalle`, detalle)
		.pipe(
			map((resp: any) => {
				console.log('Proceso:', resp);
				detalle.id = resp.codigo;
				return resp;
			}),
			catchError(err => {
				console.log('Error:', err);
				return of(err.error);
			})
		);
  }

  postDetalles(idOrden:number, detalles: Detalle[]){
	const headers = new HttpHeaders().set("idOrden",`${idOrden}`);

	return this.http.post(`${environment.url}/api/guardarDetalles`, detalles, {headers})
		.pipe(
			catchError(err => {
				console.log('Error:', err);
				return of(err.error);
			})
		);
  }
}
