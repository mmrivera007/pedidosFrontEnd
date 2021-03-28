import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Cliente } from '../interfaces/interfaces';
import { catchError, map} from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient) { }

  getClientes(){
	  return this.http.get<Cliente[]>(`${environment.url}/api/obtenerClientes`);
  }

  deleteCliente(id: number){
	  return this.http.delete(`${environment.url}/api/eliminarCliente/${id}`)
		  .pipe(
			  catchError(err => {
				  console.log('Error en la petición.');
				  return of(err.error);
			   	})
			  );
  }

  postCliente(cliente: Cliente){
	return this.http.post(`${environment.url}/api/guardarCliente`, cliente)
		.pipe(
			map((resp: any) => {
				console.log('Proceso:', resp);
				cliente.id = resp.codigo;
				return resp;
			}),
			catchError(err => {
				console.log('Error:', err);
				return of(err.error);
			})
		);
  }
}
