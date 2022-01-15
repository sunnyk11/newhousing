import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/user/services/jwt.service';
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public username: any;
  private user_id: any;
  public permissions_response: any;
  public response: any;
  public roles_response: any;

  constructor(private router: Router,
    private jwtService: JwtService,
    private rolesService: RolesService) { }

  ngOnInit(): void {
    this.username = this.jwtService.getAdminName();
    this.user_id = this.jwtService.getAdminId();
    this.rolesService.getUserPermissions(this.user_id).subscribe(
      response => {
        console.log(response);
        this.response = response;
        this.permissions_response = this.response.permissions;
        this.roles_response = this.response.roles.roles;
        console.log(this.roles_response);
      },
      err => {
        console.log(err);
      }
    );
  }
}
