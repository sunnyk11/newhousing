import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginPageService } from '../services/login-page.service';
import { JwtService } from '../../services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class VerifyMobileGuard implements CanActivate {

  private user_phone_data: any;
  public returnUrl: string = '';

  constructor(private loginPageService: LoginPageService,
    private router: Router,
    private jwtService: JwtService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Observable<boolean>(obs => {
      this.loginPageService.getUserPhoneDetails({ param: null }).subscribe(
        data => {
          this.user_phone_data = data;
          if (this.user_phone_data !== 1) {
            this.returnUrl = state.url;
            console.log(this.returnUrl);
            this.jwtService.saveReturnURL(this.returnUrl);
            this.router.navigateByUrl('verify-mobile');
            obs.next(false);
          }
          else {
            obs.next(true);
          }
        }
      );
    });
  }

}
