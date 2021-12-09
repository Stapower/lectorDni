import { Component } from '@angular/core';
import { AuthServiceService } from './../services/auth-service.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor() {}

  user = AuthServiceService.fullUser;

}
