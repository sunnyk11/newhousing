import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtService } from 'src/app/user/services/jwt.service';
import { RolesService } from '../services/roles.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  private token: any;
  private user_permissions: any;
  public permission: any;
  private user_id: any;
  public permissions_response: any;
  public response: any;
  
  constructor(private jwtService: JwtService,
    private rolesService: RolesService,
    private toastr: ToastrService,
    private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      this.permission = route.data.permission;
      console.log(this.permission);

    return new Observable<boolean>(obs => {
      this.token = this.jwtService.getAdminToken();
      this.user_id = this.jwtService.getAdminId();
      this.rolesService.getUserPermissions(this.user_id).subscribe(
        response => {
          console.log(response);
          this.response = response;
          this.user_permissions = this.response.permissions;
          console.log(this.user_permissions);
          if(this.user_permissions.includes(this.permission[0])) {
            console.log("exists");
            obs.next(true);
          }
          else {
            this.toastr.error('Access Denied');
            console.log("does not exist");
            this.router.navigate(['/']);
            obs.next(false);
          }
        },
        err => {
          console.log(err);
        }
      );
      /* this.user_permissions = this.jwtService.getUserPermissions();
      console.log(this.user_permissions);
      console.log(this.user_permissions.indexOf(this.permission)); */
    })
  }

}
