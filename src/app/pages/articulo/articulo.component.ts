import { Component, OnInit } from '@angular/core';
import { ArticuloService } from '../../services/articulo.service';
import { Articulo } from '../../interfaces/interfaces';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.css']
})
export class ArticuloComponent implements OnInit {

	articulos: Articulo[] = [];
	editar: boolean = false;

	articulo: Articulo = {
		id:-1,
		codigo:'',
		nombre:'',
		precio:0
	};

  	constructor(private articuloService: ArticuloService) { }

  	ngOnInit(): void {
		this.obtenerArticulos();
  	}

	obtenerArticulos(){
		this.articuloService.getArticulos()
			.subscribe(articulos => {
				console.log('Articulos:',articulos);
				this.articulos = articulos;
			});
	}

	eliminarArticulo(id: number, indice: number){
		this.articuloService.deleteArticulo(id)
			.subscribe( (resp: any) => {
				console.log(resp);
				if(resp.error){
 					Swal.fire('Eliminación:',resp.error,'error');
				}else{
					Swal.fire('Eliminación',resp.mensaje,'success');
					this.articulos.splice(indice, 1);
				}
			}				
		);
	}
	
	guardarArticulo(form: NgForm){
		if(form.invalid){
			console.log('Formulario inválido');
			Swal.fire('Guardar:','Verifique que la información este completa y sea válida.','error');
			return;
		}
		console.log('Guardar articulo...', this.articulo);
		if(this.articulo.id == -1){
			this.articulo.id = null;
		}
		this.articuloService.postArticulo(this.articulo)
			.subscribe(
				resp =>{
					console.log('Respuesta:',resp);
					if(resp.errors || resp.error){
						let mensaje = resp.error?resp.error:resp.errors;
						Swal.fire({
							text: `Error al guardar el cliente: ${mensaje}`,
							icon: 'error'
						  });
					}else{
						Swal.fire({
							title: this.articulo.nombre,
							text: 'Se actualizó correctamente',
							icon: 'success'
						  });
						  this.obtenerArticulos();
					}
				}
			);

		this.cambioPantalla();
	}

	cambioPantalla(){
		this.editar = !this.editar;
		if(!this.editar){
			this.articulo = {
				id:-1,
				codigo:'',
				nombre:'',
				precio:0
			};
		}
	}

	editarArticulo(articulo: Articulo){
		this.articulo = articulo;
		this.cambioPantalla();
	}

	borrarArticulo( articulo: Articulo, i: number ) {

		Swal.fire({
		  title: 'Confirmación',
		  text: `¿Está seguro que desea eliminar a ${ articulo.nombre }?`,
		  icon: 'question',
		  showConfirmButton: true,
		  showCancelButton: true
		}).then( resp => {
	
		  if ( resp.value ) {
			  this.eliminarArticulo(articulo.id, i);	
		  }
	
		});
	  }
}
