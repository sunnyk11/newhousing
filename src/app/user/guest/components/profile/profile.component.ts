import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { environment } from 'src/environments/environment';
import { ProfilePageService } from '../../services/profile-page.service';
import { JwtService } from 'src/app/user/services/jwt.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ConfirmedValidator } from '../../utils/validation';
import { MatDialog } from '@angular/material/dialog';
import { BankDetailsModalComponent } from '../../modals/bank-details-modal/bank-details-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public user_data: any;
  public mobile_verify_status: any;
  public usertype: any;
  public profile_pic: any;
  public imgURL: any;
  public message: any = {};
  public files: any;
  private imagePath: any;
  private id: any;
  private profile_data: any;
  public email: any;
  public phn_no: any;
  ftpstring: string = environment.ftpURL;
  public currentUser: any;
  public user_cat: any;
  public id_created_at: any;
  public alert: boolean = false;
  public alert_phone: boolean = false;
  public phone_submitted: boolean = false;
  public username_submitted: boolean = false;
  public updateFailed: boolean = false;
  public errorMessage: any;
  public otp_visible: boolean = false;
  public phone_number: any;

  public username_response: any;
  public mobile_response: any;
  public otp_response: any;
  public password_response: any;
  public showLoadingIndicator: boolean = false;
  public otp_submitted: boolean = false;
  public isVerified: boolean = false;
  public isFailedVerify: boolean = false;
  public verify: boolean = false;
  public isFailedVerify_otp: boolean = false;
  public returnUrl: string = '';
  public password_submitted: boolean = false;
  private password_message: any;
  public bank_account_no:any=null;
  public ifsc_code:any;
  public bank_account_holder:any;
  public account_status:boolean=false;

  UserNameForm = this.fb.group({
    user_name: ['']
  });

  otpForm = this.fb.group({
    otp_password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  PhoneNumberForm = this.fb.group({
    phone_number: ['']
  });

  PasswordForm = this.fb.group({
    old_password: ['', Validators.required],
    new_password: ['', Validators.required],
    cnf_new_password: ['', Validators.required]
  },
    {
      validators: ConfirmedValidator('new_password', 'cnf_new_password')
    });

  constructor(private userService: UserService,
    private profilePageService: ProfilePageService,
    private jwtService: JwtService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private commonService: CommonService,
    private router: Router) {
     this.commonService.bank_details_on().subscribe(
      message => {
        if (message == 'true') {
          this.user_details();
        }
      });
     }

  get g() {
    return this.otpForm.controls;
  }

  get p() {
    return this.PasswordForm.controls;
  }

  ngOnInit(): void {
    this.showLoadingIndicator = true;
    this.user_details();
  }
  user_details(){
    this.userService.getUserDetails().pipe().subscribe(
      data => {
        this.showLoadingIndicator = false;
        let result:any=data;
        this.user_data = result.data;
        this.mobile_verify_status = this.user_data.phone_number_verification_status;
        this.usertype = this.user_data.usertype;
        this.profile_pic = this.user_data.profile_pic;
        this.id = this.user_data.id;
        this.currentUser = this.user_data.name;
        this.email = this.user_data.email;
        this.phn_no = this.user_data.other_mobile_number;
        this.id_created_at = this.user_data.created_at;
        this.bank_account_no=this.user_data.bank_acount_no;
        this.ifsc_code=this.user_data.ifsc_code;
        this.bank_account_holder=this.user_data.account_holder;
        this.account_status=this.user_data.account_status;

        switch (this.usertype) {
          case 3: {
            this.user_cat = "Agent";
            break;
          }
          case 4: {
            this.user_cat = "Builder";
            break;
          }
          case 5: {
            this.user_cat = "Individual";
            break;
          }
          case 8: {
            this.user_cat = "Internal User";
            break;
          }
          case 11: {
            this.user_cat = "Admin";
            break;
          }
          default: {
            break;
          }
        }
      },
      err => {
        this.showLoadingIndicator = false;
      }
    );
  }

  verify_mob() {
    this.returnUrl = this.router.url;
    this.jwtService.saveReturnURL(this.returnUrl);
  }
  onFileChange(event: any) {
    this.files = event.target.files;
    if (this.files.length === 0)
      return;

    const mimeType = this.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    const reader = new FileReader();
    this.imagePath = this.files;
    reader.readAsDataURL(this.files[0]);
    reader.onload = (event) => {
      this.imgURL = event.target?.result;
    }
  }

  upload_image() {
    this.showLoadingIndicator = true;
    var formData: any = new FormData();
    formData.append('profile_image', this.files[0], this.files[0].name);
    formData.append('id', this.id);
    this.profilePageService.uploadProfileImage(formData).subscribe(
      data => {
        this.profile_data = data;
        this.jwtService.saveProfilePic(this.profile_data.data);
        this.showLoadingIndicator = false;
        setTimeout('window.location.reload()', 2000);
      },
      err => {
        this.showLoadingIndicator = false;
      }
    );
  }
bank_details(){
  const modalRef = this.modalService.open(BankDetailsModalComponent,
    {
      scrollable: true,
      windowClass: 'myCustomModalClass',
      // keyboard: false,
      backdrop: 'static'
    });
    let data = {
      bank_account_no: this.bank_account_no,
      ifsc_code: this.ifsc_code,
      bank_account_holder: this.bank_account_holder,
      user_mobile_no: this.phn_no,
      user_id:this.id
    }
    modalRef.componentInstance.user_bank_details = data;
}
  user_details_name() {
    this.UserNameForm.patchValue({
      user_name: this.currentUser
    });
  }

  user_details_phone() {
    this.PhoneNumberForm.patchValue({
      phone_number: this.phn_no
    });
  }

  onSubmitUserName() {
    this.username_submitted = true;
    if (this.UserNameForm.value.user_name && this.UserNameForm.value.user_name == this.currentUser) {
      this.alert = true;
    }
    else {
      this.alert = false;
      this.showLoadingIndicator = true;
      if (this.UserNameForm.value.user_name) {
        this.profilePageService.username_update(this.id, this.email, this.UserNameForm.value.user_name).subscribe(
          data => {
            this.showLoadingIndicator = false;
            this.username_response = data;
            this.showSuccess(this.username_response.message);
            window.location.reload();
          }
        );
      }
      else {
        this.showLoadingIndicator = false;
        this.toastr.error("Please enter the User Name");
      }
    }
  }

  onSubmitPhoneNumber() {
    this.phone_submitted = true;
    if (this.PhoneNumberForm.value.phone_number) {
      if (this.PhoneNumberForm.value.phone_number == this.phn_no) {
        this.alert_phone = true;
        this.updateFailed = false;
        return;
      }
      else {
        this.showLoadingIndicator = true;
        this.alert_phone = false;
        if (this.PhoneNumberForm.value.phone_number) {
          this.profilePageService.phone_number_update(this.id, this.email, this.PhoneNumberForm.value.phone_number).subscribe(
            data => {
              this.showLoadingIndicator = false;
              this.mobile_response = data;
              this.otp_visible = true;
              this.phone_number = this.PhoneNumberForm.value.phone_number
            },
            err => {
              this.showLoadingIndicator = false;
              this.updateFailed = true;
              this.errorMessage = err.error;
            }
          );
        }
      }
      
    }
    else {
      this.alert_phone = false;
      this.toastr.error("Please enter the Mobile Number");
    }
  }

  showSuccess($text: any) {
    this.toastr.success($text);
  }

  onSubmitotp() {
    this.otp_submitted = true;
    if (this.otpForm.invalid) {
      return;
    }
    this.showLoadingIndicator = true;
    this.profilePageService.verify_profile_mobile(this.phone_number, this.otpForm.value.otp_password, this.id).subscribe(
      data => {
        this.showLoadingIndicator = false;
        this.otp_response = data;
        this.isVerified = true;
        this.verify = false;

        this.showSuccess(this.otp_response.message);
        window.location.reload();
      },
      err => {
        this.showLoadingIndicator = false;
        this.errorMessage = err.error.message;
        this.isFailedVerify_otp = true;
        this.verify = true;
      }
    );
  }

  onSubmitPassword() {
    this.password_submitted = true;
    if (this.PasswordForm.invalid) {
      return;
    }
    this.showLoadingIndicator = true;
    this.profilePageService.password_update(this.PasswordForm.value.old_password, this.PasswordForm.value.new_password, this.PasswordForm.value.cnf_new_password).subscribe(
      data => {
        this.showLoadingIndicator = false;
        this.password_response = data;
        if (this.password_response.status == 200) {
          this.PasswordForm.reset();
          this.password_message = this.password_response.message;
          this.toastr.success(this.password_message, 'Password', {
            timeOut: 3000,
          });
        }
        else {
          this.toastr.error(this.password_message, 'Error', {
            timeOut: 3000,
          });
        }
      },
      err => {
        this.showLoadingIndicator = false;
        this.password_message = err.message;
        this.toastr.error(this.password_message, 'Error', {
          timeOut: 3000,
        });
      }
    );
  }

}
