import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserInternalService } from '../../services/user-internal.service';
import { Router } from '@angular/router';
import { InternalUsersService } from '../../services/internal-users.service';

@Component({
  selector: 'app-user-mobile-update',
  templateUrl: './user-mobile-update.component.html',
  styleUrls: ['./user-mobile-update.component.css']
})
export class UserMobileUpdateComponent implements OnInit {
  
public submitted:boolean=false;
public showLoadingIndicator:boolean=false;
public mobile_no:any;
public user_name:any;
public errorMessage:any;
public phone_submitted: boolean = false;
public alert_phone:boolean=false;
public updateFailed:boolean=false;

PhoneNumberForm = new FormGroup({
  user_id:new FormControl('', Validators.required),
  other_mobile_number: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
});

  @Input() data:any;
  constructor(public activeModal: NgbActiveModal,private toastr: ToastrService,
    private UserInternalService:UserInternalService,
    private internalUserService: InternalUsersService,
    public router:Router ) { }


  ngOnInit(): void {
    this.user_name='';
    this.mobile_no='';
    this.mobile_no=this.data.other_mobile_number;
    this.PhoneNumberForm.reset();
      this.PhoneNumberForm.patchValue({
        email:this.data.email,
        user_id:this.data.user_id,
        other_mobile_number:this.data.other_mobile_number
      });
      this.user_name=this.data.userName;
      
  }
  closeModal(sendData:any) {
    this.activeModal.close(sendData);
  }
  get f() {
    return this.PhoneNumberForm.controls;
  } 
  
  onUpdateSubmit(){
    this.phone_submitted = true;
    if (this.PhoneNumberForm.value.other_mobile_number) {
      if (this.PhoneNumberForm.value.other_mobile_number == this.data.other_mobile_number) {
        this.alert_phone = true;
        this.updateFailed = false;
        return;
      }
      else {
    this.UserInternalService.update_mobile_no(this.PhoneNumberForm.value).subscribe(
      response => {
        this.showLoadingIndicator = false;
        this.activeModal.close(' ');
        this.PhoneNumberForm.reset();
        this.toastr.success('Successfully Mobile No Update');
        this.user_refresh();
        this.user_details_refresh();
      },
      err => {
        this.showLoadingIndicator = false;
        this.errorMessage = err.error;
        if(this.errorMessage.errors.other_mobile_number){
          this.alert_phone = false;
        this.updateFailed = true;
        }else{
          this.toastr.error(this.errorMessage.message);
          this.alert_phone = true;
        this.updateFailed = false;
        }
        }
    );
     }
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

  // user_details_refresh functionalty 
  user_refresh(){
    this.UserInternalService.user_details_emit<string>('true');
  } 
  // user_details_refresh functionalty 
  user_details_refresh(){
    this.internalUserService.user_details_emit<string>('true');
  }

}
