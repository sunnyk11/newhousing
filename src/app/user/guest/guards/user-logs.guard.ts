import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree,Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtService } from '../../services/jwt.service';
import { UserLogsService } from '../services/user-logs.service';

@Injectable({
  providedIn: 'root'
})
export class UserLogsGuard implements CanActivate {

  public userEmail:any;
  private usertype: any;
  public userDetails: any;
  public ip_address: any;
  public pro_id: any = null;
  public type: any;
  public device_info: any;
  public  browser_info: any;
  public url_info: string = '';
  public url: any;
  public input_info: any = null;
  public user_cart: any = null;

  constructor(
    private jwtService: JwtService,
    private UserLogsService:UserLogsService,
    private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.url_info = state.url;
      if(route.routeConfig?.path?.length){
        this.type=route.routeConfig?.path +'-Page';
      }else{
        this.type='home-page';
      }
      return this.checkLogin();
  }
  
  checkLogin() {
    if (this.jwtService.getToken()) {
      this.userEmail =  this.jwtService.getUserEmail();
      this.usertype = this.jwtService.getUserType();
      this.device_info = this.UserLogsService.getDeviceInfo();
      this.browser_info = this.UserLogsService.getbrowserInfo();
      this.ip_address = this.UserLogsService.getIpAddress();
      let param={'userEmail':this.userEmail,'user_type':this.usertype,'device_info':this.device_info,'browser_info':this.browser_info,'ip_address':this.ip_address,'url_info':this.url_info,'type':this.type,'user_cart':this.user_cart,'input_info':this.input_info}
      this.UserLogsService.user_logs(param).subscribe(
        reponse => {
          // console.log(data.status);
        });
      return true;
    }
    else {
      return true;
    }
  }
  
}
