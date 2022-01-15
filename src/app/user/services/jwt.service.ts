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

  getAdminToken(): string {
    switch ( this.isAdminTokenAvailable() ){
      case 0:
        return "";
      case 1:
        return JSON.parse(window.localStorage["ADMIN_AUTH_TOKEN"]);
      default:
        return "";
    }
  }

  isAdminTokenAvailable(): number {
    try{
        if(window.localStorage["ADMIN_AUTH_TOKEN"]) {
          const authToken = JSON.parse(window.localStorage["ADMIN_AUTH_TOKEN"]);
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
    //window.localStorage.clear();
    //console.log(data);
    window.localStorage["AUTH_TOKEN"] = JSON.stringify(data.access_token);
    window.localStorage["USER_EMAIL"] = JSON.stringify(data.email);
    window.localStorage["USER_ID"] = JSON.stringify(data.id);
    window.localStorage["USER_NAME"] = data.username;
    window.localStorage["USER_TYPE"] = JSON.stringify(data.usertype);
    window.localStorage["USER_PROFILE_PIC"] = data.misc.profile_pic;
    window.localStorage["USER_ROLE"] = data.misc.user_role;
    //this.router.navigate([""]);
  }

  saveAdminUser(data: any) {
    window.localStorage["ADMIN_AUTH_TOKEN"] = JSON.stringify(data.access_token);
    window.localStorage["ADMIN_EMAIL"] = JSON.stringify(data.email);
    window.localStorage["ADMIN_ID"] = JSON.stringify(data.id);
    window.localStorage["ADMIN_NAME"] = data.username;
    window.localStorage["ADMIN_TYPE"] = JSON.stringify(data.usertype);
    window.localStorage["ADMIN_PROFILE_PIC"] = data.misc.profile_pic;
    window.localStorage["USER_ROLE"] = data.misc.user_role;
    window.localStorage["USER_TYPE"] = data.misc.usertype;
    window.localStorage["USER_ROLES"] = JSON.stringify(data.roles);
    window.localStorage["USER_PERMISSIONS"] = JSON.stringify(data.permissions);
  }

  saveGoogleUser(token: any, data: any) {
    //window.localStorage.clear();
    //console.log(data);
    this.user_data = JSON.parse(data);
    //console.log(this.user_data);
    //console.log(token);
    window.localStorage["AUTH_TOKEN"] = JSON.stringify(token);
    window.localStorage["USER_EMAIL"] = JSON.stringify(this.user_data.email);
    window.localStorage["USER_ID"] = JSON.stringify(this.user_data.id);
    window.localStorage["USER_NAME"] = this.user_data.name;
    window.localStorage["USER_TYPE"] = JSON.stringify(this.user_data.usertype);
    window.localStorage["USER_PROFILE_PIC"] = this.user_data.profile_pic;
    //this.router.navigate([""]);
  }

  savePlansData(data: any) {
    window.localStorage.removeItem("PLANS_DATA");
    window.localStorage["PLANS_DATA"] = JSON.stringify(data);
  }

  // savePlansFeaturesData(data: any) {
  //   window.localStorage.removeItem("PLANS_FEATURES_DATA");
  //   window.localStorage["PLANS_FEATURES_DATA"] = JSON.stringify(data);
  // }

  saveProfilePic(data:any) {
    window.localStorage["USER_PROFILE_PIC"] = data;
  }

  saveReturnURL(url: any) {
    //console.log(url);
   // window.localStorage.removeItem("RETURN_URL");
    window.localStorage["RETURN_URL"] = url;
  }

  getReturnURL() {
    return window.localStorage["RETURN_URL"];
  }

  removeReturnURL() {
    window.localStorage.removeItem("RETURN_URL");
  }

  getPlansData() {
    return window.localStorage["PLANS_DATA"];
  }

  // getPlansFeaturesData() {
  //   return window.localStorage["PLANS_FEATURES_DATA"];
  // }

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

  getUserRole() {
    return window.localStorage["USER_ROLE"];
  }

  getUserRoles() {
    return window.localStorage["USER_ROLES"];
  }

  getUserPermissions() {
    return window.localStorage["USER_PERMISSIONS"];
  }

  getAdminName() {
    return window.localStorage["ADMIN_NAME"];
  }

  getAdminId() {
    return window.localStorage["ADMIN_ID"];
  }
  
  signOut() {
    //console.log("Logout");
    window.localStorage.clear();
  }
}
