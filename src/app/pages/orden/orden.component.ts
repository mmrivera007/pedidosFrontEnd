import { Component, OnInit } from '@angular/core';
import { OrdenService } from '../../services/orden.service';
import { Orden, Cliente, Detalle, Articulo } from '../../interfaces/interfaces';
import Swal from 'sweetalert2';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { ArticuloService } from '../../services/articulo.service';
import { DetalleService } from '../../services/detalle.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-orden',
  templateUrl: './orden.component.html',
  styleUrls: ['./orden.component.css'],
  providers: [DatePipe]
})
export class OrdenComponent implements OnInit {

	ordenForm: FormGroup;

	ordenes: Orden[] = [];
	editar: boolean = false;

	orden: Orden = {
		id:-1,
		fecha: new Date(),
		cliente:{
			id:-1,
			nombre:'',
			apellido:''
		}
	};
	detallesAux: Detalle[] = [];
	clientes: Cliente[] = [];
	articulos: Articulo[] = [];

  	constructor(private fb: FormBuilder,
				private datePipe: DatePipe,
		  		private ordenService: OrdenService,
				private clienteService: ClienteService,
				private articuloService: ArticuloService,
				private detalleService: DetalleService) {
		//this.crearForm();
	}

  	ngOnInit(): void {
		this.obtenerOrdenes();
  	}

	get detalles(){
		return this.ordenForm.get('detalles') as FormArray;
	}
	crearForm(){
		console.log('Creando el formulario:');
		this.ordenForm = this.fb.group({
			id: this.orden.id,
			fecha: [this.datePipe.transform(this.orden.fecha,'yyyy-MM-dd'), Validators.required],
			cliente: this.fb.group({
				id:  [this.orden.cliente.id, Validators.required]
			}),
			detalles: this.fb.array([])
		});
		this.agregarDetalleForm();
		console.log('Formulario:', this.ordenForm);
	}

	obtenerOrdenes(){
		this.ordenService.getOrdenes(0)
			.subscribe(ordenes => {
				console.log('Ordenes:',ordenes);
				this.ordenes = ordenes;
			});
	}

	eliminarOrden(id: number, indice: number){
		this.ordenService.deleteOrden(id)
			.subscribe( (resp: any) => {
				console.log(resp);
				if(resp.error){
 					Swal.fire('Eliminación:',resp.error,'error');
				}else{
					Swal.fire('Eliminación',resp.mensaje,'success');
					this.ordenes.splice(indice, 1);
				}
			}				
		);
	}

	agregarDetalle(){
		this.detalles.push(this.anadirDetalle(-1, 1));
	}
	anadirDetalle(idArticulo: number, cantidad: number) {
		return this.fb.group({
		  idArticulo: this.fb.control(idArticulo),
		  cantidad: this.fb.control(cantidad)
		});
	}
	borrarDetalle(i: number){
		this.detalles.removeAt(i);
	}

	agregarDetalleForm(){
		for(let i = 0; i < this.detallesAux.length; i++) {
			this.detalles.push(this.anadirDetalle(this.detallesAux[i].articulo.id, this.detallesAux[i].cantidad));
		}
	}

	guardarOrden(){
		if(this.ordenForm.invalid){
			console.log('Formulario inválido');
			Swal.fire('Guardar:','Verifique que la información este completa y sea válida.','error');
			return;
		}
		this.orden = Object.assign({}, this.ordenForm.value);
		
		console.log('Guardar orden...', {...this.orden});
		
		this.ordenService.postOrden(this.orden)
			.subscribe(
				resp =>{
					console.log('Respuesta:',resp);
					if(resp.errors || resp.error){
						let mensaje = resp.error?resp.error:resp.errors;
						Swal.fire({
							text: `Error al guardar la orden: ${mensaje}`,
							icon: 'error'
						  });
					}else{
						this.guardarDetalles();
					}
				}
			);
	}

	formarDetalles(){
		let detallesAlmacenar = [];
		for(let i = 0; i < this.detalles.length; i++) {
			if(this.detalles.at(i).value === ''){
				this.detalles.removeAt(i);
			}else{				
				detallesAlmacenar.push({
					id:-1,
					articulo:{
						id: this.detalles.at(i).get('idArticulo').value,
						codigo:'',
						nombre:'',
						precio:0,
						stock:0
					},
					cantidad: this.detalles.at(i).get('cantidad').value,
					orden: this.orden
				});
			}
		}
		this.detallesAux = detallesAlmacenar;
	}
	guardarDetalles(){
		this.formarDetalles();
		console.log('guardarDetalles ->',this.detallesAux);
		this.detalleService.postDetalles(this.orden.id, this.detallesAux).subscribe(
			resp =>{
				console.log('Respuesta:',resp);
				if(resp && (resp.errors || resp.error)){
					let mensaje = resp.error?resp.error:resp.errors;
					Swal.fire({
						text: `Error al guardar la orden: ${mensaje}`,
						icon: 'error'
					  });
				}else{
					Swal.fire({
						title: this.orden.fecha,
						text: 'Se actualizó correctamente',
						icon: 'success'
					});
					this.obtenerOrdenes();
					this.cambioPantalla();
				}
			}
		);
	}

	cambioPantalla(){
		console.log('Cambio de pantalla',this.ordenForm);
		this.editar = !this.editar;
		if(!this.editar){
			this.detallesAux = [];
			this.ordenForm.reset();
			this.orden = {
				id:-1,
				fecha: new Date(),
				cliente:{
					id:-1,
					nombre:'',
					apellido:''
				}
			}
		}else{
			this.obtenerClientes();
			this.obtenerArticulos();
			this.crearForm();
		}
	}

	editarOrden(orden: Orden){
		this.orden = orden;
		console.log('orden a editar:', orden);
		this.detalleService.getDetalles(orden.id).subscribe(detalles => {
			console.log('Detalles:',detalles);
			this.detallesAux = detalles;
			this.cambioPantalla();
		});
	}

	obtenerClientes(){
		this.clienteService.getClientes().subscribe(clientes => {
			console.log('Clientes:',clientes);
			this.clientes = clientes;
		});
	}
	obtenerArticulos(){
		this.articuloService.getArticulos()
			.subscribe(articulos => {
				console.log('Articulos:',articulos);
				this.articulos = articulos;
			});
	}

	seleccionaCliente(e) {
		console.log('Cliente seleccionado:',e.target.value)
		this.orden.cliente.id = e.target.value;
	}
	seleccionaArticulo(e, i: number) {
		console.log('Articulo seleccionado:',e.target.value)
		this.detalles[i] = e.target.value;
	}

	borrarOrden( orden: Orden, i: number ) {
		Swal.fire({
		  title: 'Confirmación',
		  text: `¿Está seguro que desea eliminar la orden?`,
		  icon: 'question',
		  showConfirmButton: true,
		  showCancelButton: true
		}).then( resp => {
	
		  if ( resp.value ) {
			  this.eliminarOrden(orden.id, i);	
		  }
	
		});
	}
}
