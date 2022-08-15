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
  public access_bank_details: boolean = false;
  public property_preview: boolean = false;
  public data_export:boolean=false;
  public visit_user_feedback:boolean=false;
  public access_create_userbyinternal:boolean=false;
  public access_view_userByinternal:boolean=false;
  public access_update_userByinternal:boolean=false;
  public access_delete_userByinternal:boolean=false;
  public property_access:boolean=false;
  public access_web_Banner:boolean=false;
  public access_locality_area:boolean=false;

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
    this.sidenavClose.emit();
    this.router.navigate(['/admin/view-plans']);
  }

  add_plan() {
    this.sidenavClose.emit();
    this.router.navigate(['/admin/add-plan']);
  }

  create_user() {
    this.sidenavClose.emit();
    this.router.navigate(['/admin/create-user']);
  }

  view_edit_user() {
    this.sidenavClose.emit();
    this.router.navigate(['/admin/view-internal-user']);
  }

  create_role() {
    this.sidenavClose.emit();
    this.router.navigate(['/admin/create-role'])
  }

  view_role() {
    this.sidenavClose.emit();
    this.router.navigate(['/admin/view-role']);
  }
  data_export_url(){
    this.sidenavClose.emit();
    this.router.navigate(['/admin/data-export']);

  }
  visit_user_feedback_url(){
    this.sidenavClose.emit();
    this.router.navigate(['/admin/visit-user-feedback']);

  }
  
   user_list() {
    this.sidenavClose.emit();
    this.router.navigate(['/admin/services-user-list']);
  }

  create_service_user() {
    this.sidenavClose.emit();
    this.router.navigate(['/admin/create-services-user']);
  }
  
  create_useryByInternal() {
    this.sidenavClose.emit();
    this.router.navigate(['/admin/create-user-internal']);
  }
  
  user_list_byInternal() {
    this.sidenavClose.emit();
    this.router.navigate(['/admin/user-list-internal']);
  }

  view_all_users() {
    this.sidenavClose.emit();
    this.router.navigate(['/admin/user-list']);
  }

  view_all_reviews() {
    this.sidenavClose.emit();
    this.router.navigate(['/admin/user-reviews']);
  }
  
  access_Banner() {
    this.sidenavClose.emit();
    this.router.navigate(['/admin/offer-banner']);
  }

  bank_details() {
    this.sidenavClose.emit();
    this.router.navigate(['/admin/user-bank-details']);
  }
  payment_list() {
    this.sidenavClose.emit();
    this.router.navigate(['/admin/payment-user-list']);
  }
  property_list() {
    this.sidenavClose.emit();
    this.router.navigate(['/admin/property-list']);
  }
  sub_locality_list() {
    this.sidenavClose.emit();
    this.router.navigate(['/admin/sub-locality-list']);
  }
  
  locality_list() {
    this.sidenavClose.emit();
    this.router.navigate(['/admin/locality-list']);
  }
  
  district_list() {
    this.sidenavClose.emit();
    this.router.navigate(['/admin/district-list']);
  }
  state_list() {
    this.sidenavClose.emit();
    this.router.navigate(['/admin/state-list']);
  }
  
  payment_create() {
    this.sidenavClose.emit();
    this.router.navigate(['/admin/payment-user']);
  }

  service_list() {
    this.sidenavClose.emit();
    this.router.navigate(['/admin/services-list']);
  }

  create_post() {
    this.sidenavClose.emit();
    this.router.navigate(['/admin/create-blog-post']);
  }

  view_posts() {
    this.sidenavClose.emit();
    this.router.navigate(['/admin/view-blog-posts']);
  }

  /* update_service_user() {
    this.router.navigate(['/admin/update-services-user']);
  } */			   
  get_user_permissions() {
    this.access_manage_plans = false;
      this.access_manage_roles = false;
      this.access_user_creator = false;

      this.access_all_users = false;
      this.access_reviews = false;
      this.access_la_service_provider = false;
      this.access_manage_blog = false;
      this.access_bank_details = false;
      this.property_preview = false;
      this.data_export=false;
      this.visit_user_feedback=false;
      this.access_web_Banner=false;
      this.access_locality_area=false;
      
      this.access_create_userbyinternal=false;
      this.access_view_userByinternal=false;
      this.access_update_userByinternal=false;
      this.access_delete_userByinternal=false;
      this.property_access=false;

    this.user_id = this.jwtService.getAdminId();
    //console.log(this.user_id);
    this.user_type = this.jwtService.getUserType();
    if(this.user_type == 11) {
      this.access_manage_plans = true;
      this.access_manage_roles = true;
      this.access_user_creator = true;

      this.access_all_users = true;
      this.access_web_Banner=true;
      this.access_locality_area=true;
      this.access_reviews = true;
      this.access_la_service_provider = true;
      this.access_manage_blog = true;
      this.access_bank_details = true;
      this.data_export=true;
      this.visit_user_feedback=true;
      this.access_create_userbyinternal=true;
      this.access_view_userByinternal=true;
      this.access_update_userByinternal=true;
      this.access_delete_userByinternal=true;
      this.property_access=true;
      this.property_preview=true;

    }
    else if(this.user_id) {
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
          this.access_bank_details = this.permissions_response.includes('access_bank_details');
          this.access_web_Banner = this.permissions_response.includes('access_web_Banner');
          this.access_locality_area = this.permissions_response.includes('access_locality_area');
          

          this.property_access = this.permissions_response.includes('property_access');
          
          this.access_create_userbyinternal = this.permissions_response.includes('access_create_userbyinternal');
          this.access_view_userByinternal = this.permissions_response.includes('access_view_userByinternal');
          this.access_update_userByinternal = this.permissions_response.includes('access_update_userByinternal');
          this.access_delete_userByinternal = this.permissions_response.includes('access_delete_userByinternal');
          if(this.access_update_userByinternal || this.access_delete_userByinternal){
            this.access_view_userByinternal=true;
          }
          if(this.access_bank_details || this.property_access){
            this.property_preview=true;
          }

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
