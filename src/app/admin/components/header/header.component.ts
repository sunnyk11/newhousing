import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { JwtService } from 'src/app/user/services/jwt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public LoggedIn: boolean = false;
  public token: string = '';

  @Output() public sidenavToggle = new EventEmitter();

  constructor(private authService: AuthService,
    private jwtService: JwtService,
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
    console.log(this.LoggedIn);
  }

  user_details() {
    if (this.jwtService.isAdminTokenAvailable()) {
      this.LoggedIn = true;
    }
    else {
      this.LoggedIn = false;
    }
  }

  public onToggleSidenav = () => { 
    this.sidenavToggle.emit();
  }

  logout() {
    this.jwtService.signOut();
    this.LoggedIn = false;
    this.authService.sendUpdate(this.LoggedIn, "");
    this.router.navigate(['/admin/login']);
  }

}
