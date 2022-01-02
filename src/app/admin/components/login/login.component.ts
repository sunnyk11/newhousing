import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginPageService } from '../../services/login-page.service';
import { JwtService } from 'src/app/user/services/jwt.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public showLoadingIndicator: boolean = false;

  loginForm = this.fb.group({
    email_address: ['', Validators.required],
    password: ['', Validators.required]
  });

  public submitted: boolean = false;
  public errorMessage: string = "";
  public LoginFailed: boolean = false;
  public LoggedIn: boolean = false;
  public response_data: any;
  public token: string = '';

  constructor(private fb: FormBuilder,
    private loginPageService: LoginPageService,
    private jwtService: JwtService,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
  }

  get LoginFormControl() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.showLoadingIndicator = true;
    this.submitted = true;
    if (this.loginForm.valid) {
      let loginData = {
        email: this.loginForm.value.email_address,
        password: this.loginForm.value.password
      }

      this.loginPageService.login(loginData).subscribe(
        response => {
          this.showLoadingIndicator = false;
          this.LoginFailed = false;
          this.LoggedIn = true;
          this.response_data = response;
          console.log(this.response_data);
          this.jwtService.saveAdminUser(this.response_data);
          this.token = this.jwtService.getAdminToken();
          this.authService.sendUpdate(this.LoggedIn, this.token);
          this.router.navigate(['/admin/dashboard']);
        },
        err => {
          this.showLoadingIndicator = false;
          this.errorMessage = err.error.message;
          this.LoginFailed = true;
        }
      );
    }
    else {
      this.showLoadingIndicator = false;
    }
  }

}
