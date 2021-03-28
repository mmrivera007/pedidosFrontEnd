import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Articulo } from '../interfaces/interfaces';
import { catchError, map} from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {

  constructor(private http: HttpClient) { }

  getArticulos(){
	  return this.http.get<Articulo[]>(`${environment.url}/api/obtenerArticulos`);
  }

  deleteArticulo(id: number){
	  return this.http.delete(`${environment.url}/api/eliminarArticulo/${id}`)
		  .pipe(
			  catchError(err => {
				  console.log('Error en la petición.');
				  return of(err.error);
			   	})
			  );
  }

  postArticulo(articulo: Articulo){
	return this.http.post(`${environment.url}/api/guardarArticulo`, articulo)
		.pipe(
			map((resp: any) => {
				console.log('Proceso:', resp);
				articulo.id = resp.codigo;
				return resp;
			}),
			catchError(err => {
				console.log('Error:', err);
				return of(err.error);
			})
		);
  }
}
