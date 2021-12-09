import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { trigger, transition, animate, style } from '@angular/animations'
import { AuthServiceService } from './../services/auth-service.service';
import { FirebaseAuth } from './../class/firebase-auth';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { File } from '@ionic-native/file/ngx';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import Swal from 'sweetalert2';
import { Router } from  "@angular/router";
/*import{ init } from 'emailjs-com';
init("user_eIfLVqa4g2wGEeak0ItF0");*/
//import * as Emailjs from './emailjs';



@Component({
	selector: 'app-tab1',
	templateUrl: 'tab1.page.html',
	styleUrls: ['tab1.page.scss'],
	animations: [
		trigger(
			'inOutAnimation',
			[
				transition(
					':enter',
					[style({ width: 0, opacity: 0 }),
					animate('1s ease-in',
						style({ width: 2000, opacity: 1 }))

					]
				),
				transition(
					':leave',
					[
						style({ height: 0, opacity: 0 }),
						animate('1s ease-out',
							style({ height: 300, opacity: 1 }))
					]
				)
			]
		)
	]
})
export class Tab1Page {

	usuarioLoggeado = AuthServiceService.usuario;
	
	roles = ["admin", "usuario"];


	//https://firebasestorage.googleapis.com/v0/b/pps1-251a8.appspot.com/o/pictures%2Fusuarios?alt=media&token=3ca5c1c9-a834-4306-af88-3b4058f816c3
	usuario = {
		"password": "",
		"email": "",
		"foto": "",
		"sexo": "",
		"password2": "",
		"rol": this.roles[1],
		"nombre": "",
		"apellido": "",
		"dni": ""
	};

	@Input() leng;

	@Output() usuarioGuardado = new EventEmitter();


	constructor(public fireAuth: FirebaseAuth,private barcodeScanner: BarcodeScanner, private file: File
		, private photoLibrary: PhotoLibrary,
		private camera : Camera,
		private router: Router) { }



	async guardar() {
		var EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

		if( (this.usuario.password == null || this.usuario.password == undefined || this.usuario.password == '' ) || (this.usuario.password2 == null || this.usuario.password2 == undefined || this.usuario.password2 == '')){
			this.MostarMensaje("Completar contraseñas");
			return;
		}

		if (this.usuario.sexo == '') {
			this.MostarMensaje("Seleccione su sexo.");
			return;
		}

		if (this.usuario.nombre == '') {
			this.MostarMensaje("Ingrese su nombre.");
			return;
		}

		if (this.usuario.dni == '') {
			this.MostarMensaje("Ingrese su número de documento.");
			return;
		}


		if (this.usuario.apellido == '') {
			this.MostarMensaje("Ingrese su apellido.");
			return;
		}

		if (this.usuario.password != this.usuario.password2) {
			this.MostarMensaje("Las contraseñas no coinciden");
			return;
		}
		else if (this.usuario.foto == "") {
			this.MostarMensaje("Subir foto");
			return;
		}
		else if (!this.usuario.email.match(EMAIL_REGEX)) {
			this.MostarMensaje("Formato de mail inválido");
			return;
		}

		var error;

		this.spinner = true;

		console.log("sign in user");

		await this.fireAuth.signIn(this.usuario);

		if (error == null || error == undefined) {
			var x;

			var user2 = {
				"nombre": this.usuario.nombre,
				"apellido": this.usuario.apellido,
				"dni": this.usuario.dni,
				"email": this.usuario.email,
				"foto": this.usuario.foto,
				"rol": this.usuario.rol,
				"password": this.usuario.password,
				"sexo": this.usuario.sexo
			};

			console.log("Save /user");

			this.fireAuth.addChat20("/users", user2).then(result => {
				console.log(" After Save /user", result);

				this.spinner = false;
				this.presentSwal();
			}).catch(error => {
				console.log(" After Save /user ERROR", error);
				this.spinner = false;
			});
			

		}
	}


	Mensajes: string;
	MostarMensaje(mensaje: string = "este es el mensaje", ganador: boolean = false) {
		this.Mensajes = mensaje;
		var x = document.getElementById("snackbar");
		if (ganador) {
			x.className = "show Ganador";
		} else {
			x.className = "show Perdedor";
		}
		var modelo = this;
		setTimeout(function () {
			x.className = x.className.replace("show", "");
		}, 3000);
		console.info("objeto", x);
	}



	isMen = false;
	isGirl = false;
	sexo(evento, sex){
		this.usuario.sexo = sex;
		if(sex == "M")
			this.isGirl = false;
			this.isMen = true;
		if(sex == 'F'){
			this.isMen = false;
			this.isGirl = true;
		}
	}
	barcode;
	    //0        //1      //2           //3  //4   //5   /6       /7         /8
	//"00516633702@ARGAARAS@SEBASTIAN TOMS@M@38127739@B@05/05/1996@28/09/2017@239"
	barScanneroptions : BarcodeScannerOptions = {
		formats: "PDF_417" 
	}; //PDF_417
	escanear() {
		this.barcodeScanner.scan(this.barScanneroptions).then(barcodeData => {
			console.log('Barcode data', barcodeData);
			var auxBarCode = barcodeData.text.split('@');
			this.usuario.nombre = auxBarCode[2];
			this.usuario.apellido = auxBarCode[1];
			this.usuario.dni = auxBarCode[4];
			this.usuario.sexo = auxBarCode[3];
			this.usuario.nombre = auxBarCode[2];
			
			this.sexo('', this.usuario.sexo);
			
			//05/05/1996

			this.barcode = barcodeData;
		}).catch(err => {
			console.log('Error', err);
		});
	}


	options: CameraOptions  = {
		destinationType   : this.camera.DestinationType.DATA_URL,
		sourceType        : this.camera.PictureSourceType.PHOTOLIBRARY
	};


	spinner = false;
	subirArchivo() {

		let random = Math.random().toString(36).substr(2, 9) + '.jpg';

		this.spinner = true;

		this.camera.getPicture(this.options).then((imageData) => {

			this.fireAuth.addImage(imageData, random).then(response => {
				this.usuario.foto = response;
				this.spinner = false;
			}).catch(error => { this.spinner = false; });

			
		}).then(result => {this.spinner = false;}).catch(error=>{this.spinner = false;});
			
/*
		this.photoLibrary.getLibrary(
			function (result) {

				console.log(result);

				var library = result.library;
				// Here we have the library as array

				library.forEach(function (libraryItem) {
					console.log(libraryItem);
					console.log(libraryItem.id);          // ID of the photo
					console.log(libraryItem.photoURL);    // Cross-platform access to photo
					console.log(libraryItem.thumbnailURL);// Cross-platform access to thumbnail
					console.log(libraryItem.fileName);
					console.log(libraryItem.width);
					console.log(libraryItem.height);
					console.log(libraryItem.creationDate);
					console.log(libraryItem.latitude);
					console.log(libraryItem.longitude);
					console.log(libraryItem.albumIds);    // array of ids of appropriate AlbumItem, only of includeAlbumsData was used

					this.photoLibrary.getPhoto(
						libraryItem,
						function (fullPhotoBlob) {
							var reader = new FileReader();
							reader.readAsArrayBuffer(this.fileData);

							const formData = new FormData();
							formData.append('file', this.fileData);

							var x = this.fireAuth.addImage(fullPhotoBlob, libraryItem.fileName).then(result =>{
								this.url = result;
							});

							

						}
					);
				});

			},
			function (err) {
				console.log('Error occured');
			},
			{ // optional options
				thumbnailWidth: 512,
				thumbnailHeight: 384,
				quality: 0.8,
				includeAlbumData: false // default
			}
		);*/
	}


	spinnear(){
		this.spinner = true;
	}


	presentSwal(){
		Swal.fire(
			{
			title: 'Usuario Registrado!',
			text: 'Será redirigido al listado.',
			icon: 'success',
			}
		  );

		this.router.navigate(['/tabs/tab2']);
	}


/*
User ID
user_eIfLVqa4g2wGEeak0ItF0
Access Token
6f64952c3037505798d170d260dae35f
*/

//{{from_name}}
//to_name
//message
//{{reply_to}}
	sendEmail(){
		/*Emailjs.send("service_2v2ijwt", "template_civylmc", {
			from_name: "UsuariosApp",
			to_name: "user.apellido + " + " + user.nombre",
			message: "Gracias por usar nuestra app.",
			reply_to: "user.email",
			}, "user_eIfLVqa4g2wGEeak0ItF0");*/
	}
}
