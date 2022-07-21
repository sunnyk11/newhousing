import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtService } from '../../services/jwt.service';
import { UserLogsService } from '../services/user-logs.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  private token: any;

  constructor(private jwtService: JwtService,
    private UserLogsService:UserLogsService,
    private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Observable<boolean>(obs => {
        this.token = this.jwtService.getToken();
        if(this.token) {
          this.UserLogsService.user_block_status().subscribe(
            reponse => {
              let data:any=reponse;
              if(data.data.blocked==1){
                let Block_Status:any=data.data.blocked;
                this.jwtService.saveUserStatus(Block_Status);
                this.router.navigate(['/logout']);
              }else{
                obs.next(true);
              }
            });
        }
      })
  }
  
}
