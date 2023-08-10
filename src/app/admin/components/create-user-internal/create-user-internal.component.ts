import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserInternalService } from '../../services/user-internal.service';

@Component({
  selector: 'app-create-user-internal',
  templateUrl: './create-user-internal.component.html',
  styleUrls: ['./create-user-internal.component.css']
})
export class CreateUserInternalComponent implements OnInit {
  
  public showLoadingIndicator: boolean = false;
  public submitted: boolean = false;
  public errorMessage: any;
  public isSignUpFailed:boolean=false;
    
  UserForm = new UntypedFormGroup({
    userName: new UntypedFormControl('', Validators.required),
    gender: new UntypedFormControl('', Validators.required),
    UserType:new UntypedFormControl('', Validators.required),
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    other_mobile_number: new UntypedFormControl('',[Validators.required, Validators.minLength(10), Validators.maxLength(10)])
  });

  constructor(
    private router: Router,
    private UserInternalService:UserInternalService,
    private toastr: ToastrService,) { }

  ngOnInit(): void {
  }
  
  get f() {
    return this.UserForm.controls;
  }
  onSubmit(){
    this.submitted = true;
    if (this.UserForm.invalid) {
      this.showLoadingIndicator = false;
      return;
    }else{      
      this.UserInternalService.create_user(this.UserForm.value).subscribe(
        response => {
          this.showLoadingIndicator = false;
          console.log(response);
          // this.UserForm.reset();
          this.toastr.success('Successfully created User');
          this.router.navigate(['/admin/user-list-internal']);
        },
        err => {
          this.showLoadingIndicator = false;
          this.errorMessage = err.error;
          this.isSignUpFailed = true;
           if(this.errorMessage.errors.email){
            this.toastr.error('The Email Address has already been taken.');
          }else if(this.errorMessage.errors.other_mobile_number){
            this.toastr.error('The Mobile Number has already been taken.');
          }else{
            this.toastr.error(this.errorMessage.message);
          }
          }
      );
    }
  }

  onPaste(e:any) {
    e.preventDefault();
    return false;
  }
  keyPressNumbers(event: { which: any; keyCode: any; preventDefault: () => void; }) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

}
