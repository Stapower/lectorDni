import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
})

export class AppComponent {
	constructor(private platform: Platform,
		private splashScreen: SplashScreen,
		private statusBar: StatusBar,
		private route: ActivatedRoute,
		public router: Router) {
		this.initializeApp();

	}

	user = new Array();
	ngOnInit() {
		this.route.queryParams.
			subscribe(params => {
				console.log(params); // { order: "popular" }
				this.user.length = 0;
				this.user.push(params);
			}
			);
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();
			this.router.navigateByUrl('splash-animated');

			//this.changeDarkMode();


			/* let intervalId = setInterval(() => {
			   this.counter = this.counter - 1;
			   console.log(this.counter)
			   if (this.counter === 0) clearInterval(intervalId)
			 }, 3000)*/

		});
	}
}
