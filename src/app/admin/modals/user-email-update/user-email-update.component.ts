import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserInternalService } from '../../services/user-internal.service';
import { Router } from '@angular/router';
import { InternalUsersService } from '../../services/internal-users.service';

@Component({
  selector: 'app-user-email-update',
  templateUrl: './user-email-update.component.html',
  styleUrls: ['./user-email-update.component.css']
})
export class UserEmailUpdateComponent implements OnInit {

   
public submitted:boolean=false;
public showLoadingIndicator:boolean=false;
public email:any;
public user_name:any;
public errorMessage:any;
public phone_submitted: boolean = false;
public alert_phone:boolean=false;
public updateFailed:boolean=false;

EmailForm = new FormGroup({
  user_id:new FormControl('', Validators.required),
  email: new FormControl('', [Validators.required, Validators.email])
});

  @Input() data:any;
  constructor(public activeModal: NgbActiveModal,private toastr: ToastrService,
    private UserInternalService:UserInternalService,
    private internalUserService: InternalUsersService,
    public router:Router ) { }


  ngOnInit(): void {
    this.user_name='';
    this.email='';
    this.email=this.data.email;
    this.EmailForm.reset();
      this.EmailForm.patchValue({
        email:this.data.email,
        user_id:this.data.user_id,
      });
      this.user_name=this.data.userName;
      
  }
  closeModal(sendData:any) {
    this.activeModal.close(sendData);
  }
  get f() {
    return this.EmailForm.controls;
  } 
  
  onUpdateSubmit(){
    this.phone_submitted = true;
    if (this.EmailForm.value.email) {
      if (this.EmailForm.value.email == this.data.email) {
        this.alert_phone = true;
        this.updateFailed = false;
        return;
      }
      else {
    this.UserInternalService.update_email(this.EmailForm.value).subscribe(
      response => {
        this.showLoadingIndicator = false;
        this.activeModal.close(' ');
        this.EmailForm.reset();
        this.toastr.success('Successfully Email Update');
        this.user_refresh();
        this.user_details_refresh();
      },
      err => {
        this.showLoadingIndicator = false;
        this.errorMessage = err.error;
        if(this.errorMessage.errors.email){
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

  // user_details_refresh functionalty 
  user_refresh(){
    this.UserInternalService.user_details_emit<string>('true');
  } 
  // user_details_refresh functionalty 
  user_details_refresh(){
    this.internalUserService.user_details_emit<string>('true');
  } 
}
