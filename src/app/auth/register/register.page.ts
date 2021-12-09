import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import {FirebaseAuth} from '../../class/firebase-auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(public alertController: AlertController, public fireAuth : FirebaseAuth, private router: Router) { }

  
	private user = {
		email: "",
    password: "",
    password2: ""
    
	}

  ngOnInit() {
    
  }

  signIn(event){
    if(this.user.email === ""){
      this.presentAlert("Completar email");
      return;
    }
    if(this.user.password === ""){
      this.presentAlert("Completar contraseña");
      return;
    }
    if(this.user.password2 === ""){
      this.presentAlert("Completar contraseña");
      return;
    }

    if(this.user.password !== this.user.password2){
      this.presentAlert("Ambas contraseñas deben ser iguales");
      return;
    }

    console.info("SignIn");
    this.fireAuth.signIn(this.user);
    
    this.router.navigate(['/tabs/tab1']);


  }

  async presentAlert(error) {
    const alert = await this.alertController.create({
      //header: 'Alert',
      //subHeader: 'Subtitle',
      message: error,
      buttons: ['Ok']
    });

    await alert.present();
  }

}
