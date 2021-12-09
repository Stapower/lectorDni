import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  static usuario = new Array();
  static fullUser = new Array();

  constructor() { }
}
