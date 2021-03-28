import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../interfaces/interfaces';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

	clientes: Cliente[] = [];
	editar: boolean = false;

	cliente: Cliente = {
		id:-1,
		nombre:'',
		apellido:''
	};

  	constructor(private clienteService: ClienteService) { }

  	ngOnInit(): void {
		this.obtenerClientes();
  	}

	obtenerClientes(){
		this.clienteService.getClientes()
			.subscribe(clientes => {
				console.log('Clientes:',clientes);
				this.clientes = clientes;
			});
	}

	eliminarCliente(id: number, indice: number){
		this.clienteService.deleteCliente(id)
			.subscribe( (resp: any) => {
				console.log(resp);
				if(resp.error){
 					Swal.fire('Eliminación:',resp.error,'error');
				}else{
					Swal.fire('Eliminación',resp.mensaje,'success');
					this.clientes.splice(indice, 1);
				}
			}				
		);
	}

	guardarCliente(form: NgForm){
		if(form.invalid){
			console.log('Formulario inválido');
			Swal.fire('Guardar:','Verifique que la información este completa y sea válida.','error');
			return;
		}
		console.log('Guardar cliente...', this.cliente);
		if(this.cliente.id == -1){
			this.cliente.id = null;
		}
		this.clienteService.postCliente(this.cliente)
			.subscribe(
				resp =>{
					console.log('Respuesta:',resp);
					if(resp.errors || resp.error){
						let mensaje = resp.error?resp.error:resp.errors;
						Swal.fire({
							text: `Error al guardar el articulo: ${mensaje}`,
							icon: 'error'
						  });
					}else{
					Swal.fire({
						title: this.cliente.nombre,
						text: 'Se actualizó correctamente',
						icon: 'success'
					  });
					  this.obtenerClientes();
					}
				}
			);

		this.cambioPantalla();
	}

	cambioPantalla(){
		this.editar = !this.editar;
		if(!this.editar){
			this.cliente = {
				id:-1,
				nombre:'',
				apellido:''
			};
		}
	}

	editarCliente(cliente: Cliente){
		this.cliente = cliente;
		this.cambioPantalla();
	}

	borrarCliente( cliente: Cliente, i: number ) {

		Swal.fire({
		  title: 'Confirmación',
		  text: `¿Está seguro que desea eliminar a ${ cliente.nombre }?`,
		  icon: 'question',
		  showConfirmButton: true,
		  showCancelButton: true
		}).then( resp => {
	
		  if ( resp.value ) {
			  this.eliminarCliente(cliente.id, i);	
		  }
	
		});
	  }
}
