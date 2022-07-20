import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtService } from 'src/app/user/services/jwt.service';
import { UserListService } from '../services/user-list.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private token: any;
  public returnUrl: string = '';
  private user_role: any;
  private user_type: any;
  public LoggedIn: boolean = false;

  constructor(private jwtService: JwtService,
    private UserListService:UserListService,
    private authService: AuthService,
    private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Observable<boolean>(obs => {
        this.token = this.jwtService.getAdminToken();
        //this.user_role = this.jwtService.getUserRole();
        this.user_type = this.jwtService.getUserType();
        if(this.token && (this.user_type == 8 || this.user_type == 11)) {
          
        this.UserListService.user_block_status().subscribe(
          reponse => {
            let data:any=reponse;
            if(data.data.blocked==1){
              this.jwtService.signOut();
              this.LoggedIn = false;
              this.authService.sendUpdate(this.LoggedIn, "");
              this.router.navigate(['/admin/login']);
            }else{
              obs.next(true);
            }
          });
        }
        else {
          this.returnUrl = state.url;
          //console.log(this.returnUrl);
          this.jwtService.saveReturnURL(this.returnUrl);
          this.router.navigateByUrl('/admin/login');
          obs.next(false);
        }
      })
  }
  
}
