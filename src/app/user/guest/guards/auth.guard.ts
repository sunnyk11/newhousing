import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtService } from '../../services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private token: any;
  public returnUrl: string = '';

  constructor(private jwtService: JwtService,
    private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Observable<boolean>(obs => {
      this.token = this.jwtService.getToken();
      if(this.token) {
        obs.next(true);
      }
      else {
        this.returnUrl = state.url;
        //console.log(this.returnUrl);
        this.jwtService.saveReturnURL(this.returnUrl);
        this.router.navigateByUrl('login');
        obs.next(false);
      }
    })
  }
  
}
