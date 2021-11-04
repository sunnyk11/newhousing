import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { LoginPageService } from '../../services/login-page.service';
import { JwtService } from 'src/app/user/services/jwt.service';
import { CommonService } from '../../services/common.service';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = this.fb.group({
    email_address: ['', Validators.required],
    password: ['', Validators.required]
  });

  public submitted: boolean = false;
  public errorMessage: string = "";
  public LoginFailed: boolean = false;
  private access_token: any;
  public response_data: any;
  public LoggedIn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loginPageService: LoginPageService,
    private jwtService: JwtService,
    private commonService: CommonService
    ) { }

  ngOnInit(): void {
  }

  get LoginFormControl() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      let loginData = {
        email: this.loginForm.value.email_address,
        password: this.loginForm.value.password,
        rememberme: 1
      }
      this.loginPageService.login(loginData).subscribe(
        response => {
          //console.log(response);
          this.LoginFailed = false;
          this.LoggedIn = true;
          this.commonService.sendUpdate(this.LoggedIn);
          this.response_data = response;
          //console.log(this.response_data.data.access_token);
          //this.jwtService.saveToken(this.response_data.data.access_token);
          this.jwtService.saveUser(this.response_data.data);
        },
        err => {
          this.errorMessage = err.error.message;
          this.LoginFailed = true;
          //console.log(err);
        }
      );
    }
    else {
      //console.log("Invalid");
    }

  }

}
