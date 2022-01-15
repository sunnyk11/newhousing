import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { JwtService } from 'src/app/user/services/jwt.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  public LoggedIn: boolean = false;
  public token: string = '';
  public user_permissions: any;
  public permission: any;
  public access_all_users: boolean = false;
  public access_reviews: boolean = false;
  public access_la_service_provider: boolean = false;
  public access_manage_blog: boolean = false;
  public access_manage_plans: boolean = false;
  public access_manage_roles: boolean = false;
  public access_user_creator: boolean = false;
  private user_id: any;
  public permissions_response: any;
  public roles_response: any;
  public response: any;
  private user_type: any;

  @Output() sidenavClose = new EventEmitter();

  constructor(private jwtService: JwtService,
    private authService: AuthService,
    private router: Router,
    private rolesService: RolesService) {

    this.authService.getUpdate().subscribe(
      message => {
        this.LoggedIn = message.text;
        this.token = message.token;
        if (this.token) {
          this.user_details();
          this.get_user_permissions();
        }
      });
  }

  ngOnInit(): void {
    this.get_user_permissions();
    this.user_details();
  }

  view_plans() {
    this.router.navigate(['/admin/view-plans']);
  }

  add_plan() {
    this.router.navigate(['/admin/add-plan']);
  }

  create_user() {
    this.router.navigate(['/admin/create-user']);
  }

  create_role() {
    this.router.navigate(['/admin/create-role'])
  }

  view_role() {
    this.router.navigate(['/admin/view-role']);
  }

  get_user_permissions() {
    this.access_manage_plans = false;
      this.access_manage_roles = false;
      this.access_user_creator = false;

      this.access_all_users = false;
      this.access_reviews = false;
      this.access_la_service_provider = false;
      this.access_manage_blog = false;

    this.user_id = this.jwtService.getAdminId();
    //console.log(this.user_id);
    this.user_type = this.jwtService.getUserType();
    if(this.user_type == 11) {
      this.access_manage_plans = true;
      this.access_manage_roles = true;
      this.access_user_creator = true;

      this.access_all_users = true;
      this.access_reviews = true;
      this.access_la_service_provider = true;
      this.access_manage_blog = true;

    }
    if(this.user_id) {
      this.rolesService.getUserPermissions(this.user_id).subscribe(
        response => {
          //console.log(response);
          this.response = response;
          this.permissions_response = this.response.permissions;
          this.roles_response = this.response.roles.roles;
          //console.log(this.roles_response);
          this.access_manage_plans = this.permissions_response.includes('access_manage_plans');
          this.access_manage_roles = this.permissions_response.includes('access_manage_roles');
          this.access_user_creator = this.permissions_response.includes('access_user_creator');
  
          this.access_all_users = this.permissions_response.includes('access_all_users');
          this.access_reviews = this.permissions_response.includes('access_reviews');
          this.access_la_service_provider = this.permissions_response.includes('access_local_area_service_provider');
          this.access_manage_blog = this.permissions_response.includes('access_manage_blog');
  
        },
        err => {
          console.log(err);
        }
      );
    }
    
  }

  user_details() {
    if (this.jwtService.isAdminTokenAvailable()) {
      this.LoggedIn = true;
    }
    else {
      this.LoggedIn = false;
    }
  }

  public logout = () => {
    this.sidenavClose.emit();
    this.jwtService.signOut();
    this.LoggedIn = false;
    this.authService.sendUpdate(this.LoggedIn, "");
    this.router.navigate(['/admin/login']);
  }

}
