import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as JWT from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  private user_data: any;

  constructor(private router: Router) { }

  getToken(): string {
    switch ( this.isTokenAvailable() ){
      case 0:
        return "";
      case 1:
        return JSON.parse(window.localStorage["AUTH_TOKEN"]);
      default:
        return "";
    }
  }

  /*saveToken(data: any) {
    window.localStorage.removeItem("AUTH_TOKEN");
    window.localStorage["AUTH_TOKEN"] = JSON.stringify(data);
    this.router.navigate([""]);
  } */

  isTokenAvailable(): number {
    try{
        if(window.localStorage["AUTH_TOKEN"]) {
          const authToken = JSON.parse(window.localStorage["AUTH_TOKEN"]);
          if(authToken) {
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

  saveUser(data: any) {
    window.localStorage.clear();
    //console.log(data);
    window.localStorage["AUTH_TOKEN"] = JSON.stringify(data.access_token);
    window.localStorage["USER_EMAIL"] = JSON.stringify(data.email);
    window.localStorage["USER_ID"] = JSON.stringify(data.id);
    window.localStorage["USER_NAME"] = JSON.stringify(data.username);
    window.localStorage["USER_TYPE"] = JSON.stringify(data.usertype);
    window.localStorage["USER_PROFILE_PIC"] = JSON.stringify(data.misc.profile_pic);
    this.router.navigate([""]);
  }

  getUserEmail() {
    return window.localStorage["USER_EMAIL"];
  }

  getUserId() {
    return window.localStorage["USER_ID"];
  }

  getUserName() {
    return window.localStorage["USER_NAME"];
  }  

  getUserType() {
    return window.localStorage["USER_TYPE"];
  }  

  getProfilePic() {
    return window.localStorage["USER_PROFILE_PIC"];
  }
  
  signOut() {
    window.localStorage.clear();
  }
}
