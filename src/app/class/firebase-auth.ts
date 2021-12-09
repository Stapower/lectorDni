import { Injectable, NgModule } from "@angular/core";

import * as firebase from 'firebase/app';
import 'firebase/storage';
import { HttpClientModule } from '@angular/common/http';


//import { FirebaseService } from './firebase.service';
//import { AngularFireAuth } from 'angularfire2/auth';
//import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';



import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

import firebaseConfig from '../../environments/environment';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { ERROR_COMPONENT_TYPE } from '@angular/compiler';
import { ErrorStateMatcher } from '@angular/material';

//import {AngularFirestore} from 'angularfire2/firestore';
//import { auth } from 'firebase/app';

//import { AngularFireAuth } from '@angular/fire/auth';


/*@NgModule({
	imports: [	AngularFireModule.initializeApp(firebaseConfig.firebase),
				AngularFireAuthModule
			],
	providers: [ AngularFireAuth]
})*/

@Injectable({
	providedIn: 'root'
})

export class FirebaseAuth {
	//firebase = require('firebase');

	constructor(public afAuth: AngularFireAuth,
		public afs: AngularFirestore,
		public afDatabase: AngularFireDatabase
		//private firebaseService: FirebaseService,
		//public afAuth: AngularFireAuth
	) { }

	basePicturesPath = "pictures/";
	cosasLindasPath = "cosasLindas";
	cosasFeasPath = "cosasLindas";
	image = "/image";

	async login(user) {
		try {
			const res = await this.afAuth.signInWithEmailAndPassword(user.email, user.password);
		}
		catch (err) {
			console.dir(err);
		}
	}

	async signIn(user) {
		try {
			const res = await this.afAuth.createUserWithEmailAndPassword(user.email, user.password);
		}
		catch (err) {
			console.dir(err);
		}
	}

	async insertPic(pic: String) {

	}

	addUser(value) {
		return new Promise<any>((resolve, reject) => {
			this.afs.collection('/users').add({
				name: value.name,
				surname: value.surname,
				age: parseInt(value.age)
			})
				.then(
					(res) => {
						resolve(res)
					},
					err => reject(err)
				)
		})
	}

	async addImage(value, relativePath) {

		const selfieRef = firebase.storage().ref(this.basePicturesPath + "users/" + relativePath);
		await selfieRef.putString(value, 'base64', { contentType: 'image/png' });

		var download = "";

		await selfieRef.getDownloadURL().then(succ => {
			download = succ;
		});


		console.log("download", download);
		return download;

		/*{
			type: type,
			image: download,
			user: user,
			voto: new Array(),//,
			fecha: new Date()
			//date: firebase.database.ServerValue.TIMESTAMP
		};*/

		/*this.afs.collection('/image').add({
			type: type,
			image: download,
			user: user,
			voto: new Array(),//,
			fecha: new Date()
		}).then(succ => {
			console.log("Update on database succeded")
		}).catch(err => {
			throw err;
		});*/
	}

	updateImagesRef(returnObject, snapshot) {

	}

	async getImages(returnObject, email) {

		console.log("getImages");
		var array = new Array(); 
		this.bringEntity("/image", returnObject, email);
		return;
		/*returnObject = await firebase.firestore().collection('image').get().then(response => 
			console.log("await resposne", response));
		console.log("returnObject", returnObject);
		return returnObject;

		var collection = await this.afs.collection('image').get().then((querySnapshot =>{
			querySnapshot.forEach((doc) => {
				console.log(`${doc.id} => ${doc.data()}`);
			});
		}));
		//, ref => 
		//ref.orderBy("voto", "desc"));

		returnObject = this.afDatabase.list('/image');
		console.log("returnObject", returnObject);
		return returnObject;
	
		await collection.snapshotChanges().forEach(changes => {
			console.log("changes", changes);
			changes.forEach(a => {
				console.log("a", a);
				var data = a.payload.doc.data();
				console.log("data", data);
				var id = a.payload.doc.id;
				data.id = id;
				array.push(data);

		  });
		  returnObject = array;

		});
		
		  return returnObject;
		return;
*/
		var imageRef = await this.afs.collection('/image').ref;
		await imageRef.get().then(function (querySnapshot) {
			console.log("querySnapshot", querySnapshot);

			querySnapshot.forEach(function (doc) {
				var postData = doc.data().postData;
				console.log("Doc" + doc.data().postData);
				console.log(doc.id, " => ", postData);
				postData.id = doc.id;
				array.push(postData);

			});

			returnObject = array;
			console.log("returnObject" , returnObject);
		});
	
		console.log("leaveGetImages");

		return returnObject;
		

	}

	votar(foto, user){
		console.log("foto.isLikedByThisUser", foto.isLikedByThisUser);
		//es el estado previo, si no estaba likeada, hay que likearla, se agrega a la lista
		if(!foto.isLikedByThisUser){
			foto.voto.push(user);	
		}
		else{
			//Si no esta likeada, se saca
			var index =  foto.voto.findIndex(x => x == user);
			console.log("index", index);

			if (index > -1) {
				foto.voto.splice(index, 1);
			}
		}
		
		
		console.log("updating foto vote", foto);
		var imageRef = this.afs.collection('/image').doc("/"+foto.id).set(foto);
		console.log("imageRef", imageRef);

		/*const d = this.afDatabase.list('/image');
		d.update(foto.id, foto);*/

	}

	async saveExistingEntity(path, newObject, id) {
		//console.log("saveExistingEntity");
		var imageRef = await this.afs.collection(path).ref;
		await imageRef.doc("/" + id).set(newObject).then(succ => { console.log("update completed"); });
	}

	bringEntity(path, returnObject, loggedUserEmail) {
		console.log("bringEntity");
		console.log("loggedUserEmail", loggedUserEmail);
		//var returnObject = new Array(); 


		var imageRef = this.afs.collection<any>(path);

		imageRef.snapshotChanges().forEach(snapshot => {
			var array = new Array();
			console.log("before snapshto foreach");
			returnObject.length = 0;
			
			var postData = snapshot.forEach(doc => {
				console.log("inside snapshto foreach");

				var postData = doc.payload.doc.data();
				console.log(doc.payload.doc['id'], " => ", postData);
				postData.id = doc.payload.doc['id'];

				var flag = false;
				if(postData != null && postData != undefined){
					  	if(postData.voto != null){
							postData.voto.forEach(email => {
								if(email == loggedUserEmail){
									postData.isLikedByThisUser = true;
									flag = true;
									return;
								}
							});
						  }
						  else{
							  postData.voto = new Array();
						  }
					  if(!flag)
					  	postData.isLikedByThisUser = false;
				  }
				  
				returnObject.push(postData);


			});
			console.log("after snapshto foreach");

			//returnObject = array;
			console.log(returnObject);
			return returnObject;
		});
	}

	async bringEntityWithEventEmmiter(path, returnObject) {
		console.log("bringEntity");
		//var returnObject = new Array(); 


		var imageRef = await this.afs.collection<any>(path);

		await imageRef.get().forEach(snapshot => {
			var array = new Array();
			//console.log("before snapshto foreach");
			returnObject.length = 0;

			var postData = snapshot.forEach(doc => {
				//console.log("inside snapshto foreach");

				var postData = doc.data();
				console.log(doc.id, " => ", postData);
				postData.id = doc.id;
				//returnObject.next(postData);
				returnObject.push(postData);
			})
	
		});

		return returnObject;
	}

	bringEntityWithFilterString2(path, turnos, filterWord){
		console.log("bringEntityWithFilterString");

		var imageRef = this.afs.collection<any>(path);

		imageRef.get().forEach((snapshot => {
		//imageRef.snapshotChanges().forEach(snapshot => {
			//console.log("before snapshto foreach");
			turnos.length = 0;
			var postData = snapshot.forEach(doc => {
				//console.log("inside snapshto foreach");

				var postData = doc.data();
				//console.log(doc.id, " => ", postData);
				postData.id = doc.id;
				
				var jsonString = JSON.stringify(postData);
				
				if(jsonString.includes(filterWord))
					turnos.push(postData);
				else if(filterWord == null || filterWord == undefined)
					turnos.push(postData);
			});
			//console.log("after snapshto foreach");
			//console.log(turnos);
			return turnos;
		}));
	}

	justBringEntity(path, turnos){
		console.log("justBringEntity");

		var imageRef = this.afs.collection<any>(path);

		imageRef.get().forEach((snapshot => {
		//imageRef.snapshotChanges().forEach(snapshot => {
			console.log("before snapshto foreach");
			turnos.length = 0;
			var postData = snapshot.forEach(doc => {
				console.log("inside snapshto foreach");

				var postData = doc.data();
				//console.log(doc.id, " => ", postData);
				postData.id = doc.id;
								
				turnos.push(postData);
			});
			console.log("after snapshto foreach");
			console.log(turnos);
			return turnos;
		}));
	}

	justBringEntity2(path, turnos){
		var imageRef = this.afs.collection<any>(path);

		imageRef.snapshotChanges().forEach(snapshot => {
			var array = new Array();
			//console.log("before snapshto foreach");
			turnos.length = 0;
			
			var postData = snapshot.forEach(doc => {

				var postData = doc.payload.doc.data();
				console.log(doc.payload.doc['id'], " => ", postData);
				postData.id = doc.payload.doc['id'];

				var flag = false;
				
				  
				turnos.push(postData);
				turnos.sort(this.compareName);



			});
			//console.log("after snapshto foreach");

			//returnObject = array;
			console.log(turnos);
			return turnos;
		});
	}


	compareName(a, b) {
	
		if (a.apellido < b.apellido) {
		  return -1;
		}
		if (a.apellido > b.apellido) {
		  return 1;
		}
		
		return 0;
	
	  }

	compareFecha(a, b) {
		console.log("fecga A", a.time.seconds);
		console.log("fecga B", b.time.seconds);
	
		if (a.time.seconds < b.time.seconds) {
		  return -1;
		}
		if (a.time.seconds > b.time.seconds) {
		  return 1;
		}
		return 0;
	
	  }

	addChat(path, value, mail) {
		return new Promise<any>((resolve, reject) => {
			this.afs.collection(path).add({
				message: value,
				email: mail,
				time: new Date()
			})
				.then(
					(res) => {
						resolve(res)
					},
					err => reject(err)
				)
		})
	}

	saveEntity(path, newObject, returnId) {

		return new Promise<any> ( (resolve, reject) => {
			this.afs.collection(path).add(newObject).then(
			(res) => {
				console.log("saveEntity", res);
				returnId = res.id;
			}
		).catch(error => {
			console.log("saveEntity", error);
		});

		});

	}


	async saveEntity20(path, newObject){
		console.log(path);
		console.log(newObject);

		this.afs.collection(path).add(
			newObject
		).then(succ => {
			console.log("Update on database succeded");
		}).catch(err => {
			throw err;
		});
	}


	addChatEntity(path, value) {
		return new Promise<any>((resolve, reject) => {
			this.afs.collection(path).add(value)
				.then(
					(res) => {
						console.log("saveEntity", res);
					},
					err => {
						console.log("saveEntity", err);
					}
				)
		});
	}



	bringEntitySnapshot(path, returnObject) {
		//var returnObject = new Array(); 


		var imageRef = this.afs.collection<any>(path);

		imageRef.snapshotChanges().forEach(snapshot => {
			var array = new Array();
			returnObject.length = 0;
			
			var postData = snapshot.forEach(doc => {

				var postData = doc.payload.doc.data();
				console.log(doc.payload.doc['id'], " => ", postData);
				postData.id = doc.payload.doc['id'];
				
				returnObject.push(postData);
			});

			//returnObject = array;
			console.log(returnObject);
			return returnObject;
		});
	}


	addChat20(path, value) {
		return new Promise<any>((resolve, reject) => {
			this.afs.collection(path).add({
				apellido: value.apellido,
				dni: value.dni,
				email: value.email,
				foto: value.foto,
				nombre: value.nombre,
				password: value.password,
				rol: value.rol,
				sexo: value.sexo
			})
				.then(
					(res) => {
						resolve(res)
					},
					err => reject(err)
				)
		})
	}


}