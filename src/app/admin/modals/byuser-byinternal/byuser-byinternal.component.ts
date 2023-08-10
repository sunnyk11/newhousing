import { Component, OnInit,Input } from '@angular/core';
import { UntypedFormGroup,UntypedFormControl,Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserInternalService } from '../../services/user-internal.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserEmailUpdateComponent } from '../user-email-update/user-email-update.component';
import { UserMobileUpdateComponent } from '../user-mobile-update/user-mobile-update.component';

@Component({
  selector: 'app-byuser-byinternal',
  templateUrl: './byuser-byinternal.component.html',
  styleUrls: ['./byuser-byinternal.component.css']
})
export class ByuserByinternalComponent implements OnInit {
  

public submitted:boolean=false;
public showLoadingIndicator:boolean=false;
public errorMessage:any;
public isSignUpFailed:boolean=false;
public user_name:any;
public phone_submitted: boolean = false;
public alert: boolean = false;
public alert_phone: boolean = false;
public updateFailed: boolean = false;
public user_id:any;
  

UserForm = new UntypedFormGroup({
  userName: new UntypedFormControl('', Validators.required),
  gender: new UntypedFormControl('', Validators.required),
  UserType:new UntypedFormControl('', Validators.required),
  user_id:new UntypedFormControl('', Validators.required),
  email: new UntypedFormControl('', [Validators.required, Validators.email]),
  other_mobile_number: new UntypedFormControl('',[Validators.required, Validators.minLength(10), Validators.maxLength(10)])
});


  constructor(public activeModal: NgbActiveModal,private toastr: ToastrService,
    private UserInternalService:UserInternalService,
    private modalService: NgbModal,
    public router:Router ) { }

    @Input() data:any;
  ngOnInit(): void {
    this.user_name='';
    this.UserForm.reset();
      this.UserForm.patchValue({
        gender:this.data.gender,
        UserType:this.data.usertype,
        email:this.data.email,
        user_id:this.data.id,
        other_mobile_number:this.data.other_mobile_number
      });
      if(this.data.last_name !=null){
        this.UserForm.patchValue({
          userName:this.data.name+ " "+this.data.last_name,
        });
        this.user_name=this.data.name+" "+ this.data.last_name;
  
      }else{
        this.UserForm.patchValue({
        userName:this.data.name,
      });
      this.user_name=this.data.name;
      }
  }
  user_details_phone(){
    const modalRef = this.modalService.open(UserMobileUpdateComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        // keyboard: true,
        backdrop: 'static'
      });
      this.activeModal.close(' ');    
    modalRef.componentInstance.data = this.UserForm.value;

  }
  onUpdateSubmit(){
    this.submitted = true;
    if (this.UserForm.invalid) {
      this.showLoadingIndicator = false;
      return;
    }else{   
      this.UserInternalService.update_user_byinternal(this.UserForm.value).subscribe(
        response => {
          this.showLoadingIndicator = false;
          this.UserForm.reset();
          this.activeModal.close(' ');
          this.toastr.success('Successfully details Update');
          this.user_refresh();
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
  
  keyPressNumbers1(event: { which: any; keyCode: any; preventDefault: () => void; }) {
    var charCode = (event.which) ? event.which : event.keyCode;
    event.preventDefault();
      return false;
    
  }
  
  onPaste(e:any) {
    e.preventDefault();
    return false;
  }
  get f() {
    return this.UserForm.controls;
  } 
  
  user_details_email(){
    const modalRef = this.modalService.open(UserEmailUpdateComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        // keyboard: true,
        backdrop: 'static'
      });
      this.activeModal.close(' ');  
    modalRef.componentInstance.data = this.UserForm.value;

  }
  
  // user_details_refresh functionalty 
  user_refresh(){
    this.UserInternalService.user_details_emit<string>('true');
  } 
  closeModal(sendData:any) {
    this.activeModal.close(sendData);
  }

}
