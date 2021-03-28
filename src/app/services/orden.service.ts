import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Orden } from '../interfaces/interfaces';
import { catchError, map} from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {

  constructor(private http: HttpClient) { }

  getOrdenes(id: number){
	  return this.http.get<Orden[]>(`${environment.url}/api/obtenerOrdenes/${id}`);
  }

  deleteOrden(id: number){
	  return this.http.delete(`${environment.url}/api/eliminarOrden/${id}`)
		  .pipe(
			  catchError(err => {
				  console.log('Error en la petición.');
				  return of(err.error);
			   	})
			  );
  }

  postOrden(orden: Orden){
	return this.http.post(`${environment.url}/api/guardarOrden`, orden)
		.pipe(
			map((resp: any) => {
				console.log('Proceso:', resp);
				orden.id = resp.codigo;
				return resp;
			}),
			catchError(err => {
				console.log('Error:', err);
				return of(err.error);
			})
		);
  }
}
