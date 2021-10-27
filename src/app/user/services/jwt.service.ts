import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as JWT from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(private router: Router) { }

  getToken(): string {
    switch ( this.isTokenAvailable() ){
      case 0:
        return "";
      case 1:
        return JSON.parse(window.localStorage["AUTH_TOKEN"]).Token;
      default:
        return "";
    }
  }

  saveToken(data: any) {
    window.localStorage.clear();
    window.localStorage["AUTH_TOKEN"] = JSON.stringify(data);
    this.router.navigate([""]);
  }

  isTokenAvailable(): number {
    try{
        if(window.localStorage["AUTH_TOKEN"]) {
          const authToken = JSON.parse(window.localStorage["AUTH_TOKEN"]);
          if(authToken.Token) {
            return 1;
          } else {
            return 0;
          }
        } 
        else{
          return 0;
        }
        
    }
    catch(error){
      return 0;
    }
  }
}
