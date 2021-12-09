import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import {FirebaseAuth} from '../../class/firebase-auth';
import { Router } from  "@angular/router";
import { AuthServiceService } from '../../services/auth-service.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
	
	constructor(public fireAuth : FirebaseAuth, private router: Router) {
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
		this.darkMode = prefersDark.matches;
		document.body.classList.toggle('dark');
	 }
	darkMode: boolean = true;
	mails = ["tomas@gmail.com", "asd@gmail.com", "test123@gmail.com", "admin@gmail.com"];

	public user = {
		email: "admin@gmail.com",
		password: "123456",
		rol:""
	}

	users = [];

	ngOnInit() {
		this.loggingIn  = false;
		this.fireAuth.bringEntitySnapshot('/users', this.users);
	}

	loggingIn = false;
	logIn(event){
		console.info(this.user);
		localStorage.setItem("email", this.user.email);
		this.loggingIn = true;
		this.fireAuth.login(this.user).then(success =>{
			this.loggingIn = false;
			AuthServiceService.usuario.length = 0;
			AuthServiceService.usuario.push(this.user.email);

			AuthServiceService.fullUser.length = 0;
			AuthServiceService.fullUser.push(this.user);

			this.router.navigate(['/tabs/tab2']);
			
			//this.router.navigate(['/component', this.user.email]);
			//localStorage.setItem("nombre", );
		}).catch(err=>{
			//this.router.navigate(['/tabs/tab1']);
		});
		
	}



	usuario(event){
		console.log(event);
		//alert(event.detail.value);
		this.user.email = event;
	}

	usuario2(userInput){
		console.log(userInput);
		//alert(event.detail.value);
		this.user.email = userInput.email;
		this.user.password = userInput.password;
		this.user.rol = userInput.rol;
		//this.user.email = userInput.email;
		//this.user.password = userInput.password;
	}

}
