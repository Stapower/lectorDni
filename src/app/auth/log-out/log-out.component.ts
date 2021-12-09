import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, CanActivate } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';


@Component({
  selector: 'app-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.scss'],
})
export class LogOutComponent implements OnInit {

   user;

  constructor(private router: Router) { }
  @Input() user2;

  ngOnInit() {
    this.user = AuthServiceService.usuario;
  }

  logOut(){
    //this.user = null;
    AuthServiceService.usuario.length=0;
    this.router.navigate(["/login"]);
  }

}
