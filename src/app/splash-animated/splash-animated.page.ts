import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash-animated',
  templateUrl: './splash-animated.page.html',
  styleUrls: ['./splash-animated.page.scss'],
})
export class SplashAnimatedPage implements OnInit {

  constructor(public router:Router) { 
    setTimeout(()=> {
      this.router.navigateByUrl('login');
    }, 2000);
  }

  ngOnInit() {
  }

}
