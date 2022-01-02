import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { JwtService } from 'src/app/user/services/jwt.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  public LoggedIn: boolean = false;
  public token: string = '';

  @Output() sidenavClose = new EventEmitter();

  constructor(private jwtService: JwtService,
    private authService: AuthService,
    private router: Router) {
      this.authService.getUpdate().subscribe(
        message => {
          this.LoggedIn = message.text;
          this.token = message.token;
          if (this.token) {
            this.user_details();
          }
        });
     }

  ngOnInit(): void {
    this.user_details();
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
