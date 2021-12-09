import { Component } from '@angular/core';
import { AuthServiceService } from './../services/auth-service.service';
import { FirebaseAuth } from './../class/firebase-auth';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public fireAuth: FirebaseAuth) {}

  usuarios =[];

  ngOnInit(): void {
    this.fireAuth.justBringEntity2('/users', this.usuarios);
  }



}
