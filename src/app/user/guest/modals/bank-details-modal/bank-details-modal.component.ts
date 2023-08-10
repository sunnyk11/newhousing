import { Component, OnInit,Input } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmedValidator } from '../../utils/validation';
import { ProfilePageService } from '../../services/profile-page.service';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bank-details-modal',
  templateUrl: './bank-details-modal.component.html',
  styleUrls: ['./bank-details-modal.component.css']
})
export class BankDetailsModalComponent implements OnInit {
  
  public submitted:boolean=false;
  public otp_visible: boolean = false;
  public bank_account_no:any=null;
  public otp_submitted: boolean = false;
  public upi_no:any=null;
  public isFailedVerify_otp: boolean = false;
  public isVerified:boolean=false;
  public errorMessage: any;
  public mobile_no:any;
  public bank_account: boolean = true;
  public account_upi: boolean = false;
  public upi_error:boolean=false;

  bank_details = this.fb.group({
    account_holder: ['', Validators.required],
    account_no: ['', Validators.required],
    ifsc_code: ['', Validators.required],
    user_mobile_no: ['', Validators.required],
    conf_account_no:['', Validators.required],
    bank_type:['', Validators.required],
    upi_name:['', Validators.required],
    upi_id:['', Validators.required],
    conf_upi_id:['', Validators.required],
    user_id: ['', Validators.required],
  }, {
    validators: ConfirmedValidator('account_no', 'conf_account_no'),
    validator: ConfirmedValidator('upi_id', 'conf_upi_id'),
  });
  
  
  otpForm = this.fb.group({
    otp_password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });
  
  @Input() user_bank_details:any;
  

  constructor(public activeModal: NgbActiveModal,
    private profilePageService: ProfilePageService,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService,
    public CommonService:CommonService
    ) { }

  ngOnInit(): void {
    console.log(this.user_bank_details);
    if(this.user_bank_details.bank_type=='bank_account'){
      this.bank_account=true;
      this.account_upi = false;
      this.bank_account_no=this.user_bank_details.bank_account_no;
      this.bank_details.patchValue({
        upi_name:'xyz',
        upi_id:'xyz',
        conf_upi_id:'xyz',
        account_holder:this.user_bank_details.bank_account_holder,
        account_no:this.user_bank_details.bank_account_no,
        conf_account_no:this.user_bank_details.bank_account_no,
        ifsc_code:this.user_bank_details.ifsc_code,
        bank_type:this.user_bank_details.bank_type,
        user_mobile_no:this.user_bank_details.user_mobile_no,
        user_id:this.user_bank_details.user_id,
      });
    }
    if(this.user_bank_details.bank_type=='account_upi'){
      this.bank_account=false;
      this.account_upi = true;
      this.upi_no=this.user_bank_details.upi_id;
      this.bank_details.patchValue({
        account_no:'12345678',
        ifsc_code:'xyz123',
        conf_account_no:'12345678',
        account_holder:'xyz',
        user_mobile_no:this.user_bank_details.user_mobile_no,
        user_id:this.user_bank_details.user_id,
        upi_name:this.user_bank_details.upi_name,
        upi_id:this.user_bank_details.upi_id,
        conf_upi_id:this.user_bank_details.upi_id,
        bank_type:this.user_bank_details.bank_type,
      });
    }
    this.mobile_no=this.user_bank_details.user_mobile_no;
  }
  
  update_deatils(){  
    console.log(this.bank_details.value);    
      if(this.bank_details.invalid){
        this.submitted = true;
        if(this.bank_details.value.conf_account_no){
          if(this.bank_details.value.account_no !=this.bank_details.value.conf_account_no){
            this.toastr.error('Account Not Match', 'User', {
              timeOut: 3000,
            });
          }
        } 
        }else{  
        if(this.bank_details.value.conf_upi_id){    
          if(this.bank_details.value.upi_id !=this.bank_details.value.conf_upi_id){
            this.upi_error=true;
            this.toastr.error('UPI id Not Match', 'User', {
              timeOut: 3000,
            });
            return;
          }else{
            this.otp_visible = true;
            this.profilePageService.bank_mobile_verification(this.bank_details.value.user_mobile_no).subscribe(
              data => {
                this.otp_visible = true;
              },
              err => {
                this.otp_visible = false;
                this.errorMessage = err.error;
              }
            );
          }
        }
          
        }    
    }
  
  get f() {
    return this.bank_details.controls;
  }
  get g() {
    return this.otpForm.controls;
  }
  onSubmitotp(){
    if(this.otpForm.invalid){
      this.otp_submitted = true;
      }else{
        let param={data:this.bank_details.value,otp:this.otpForm.value.otp_password}
        this.profilePageService.bank_verify_otp(param).subscribe(
          data => {
            this.closeModal('');
            this.otp_visible = false;
            this.isVerified = true;
            this.toastr.success('Bank Details Update', 'User', {
              timeOut: 3000,
            });
            this.bank_details_refresh();
          },
          err => {
            this.errorMessage = err.error;
            this.otp_submitted = true;
            this.isFailedVerify_otp = true;
          }
        );
      }

  }
  
  change_banktype(event:any){
    if (event == 'bank_account') {
      this.bank_account=true;
      this.account_upi = false;
      this.bank_details.patchValue({
        upi_name:'xyz',
        upi_id:'xyz',
        conf_upi_id:'xyz',
        account_holder:this.user_bank_details.bank_account_holder,
        account_no:this.user_bank_details.bank_account_no,
        conf_account_no:this.user_bank_details.bank_account_no,
        ifsc_code:this.user_bank_details.ifsc_code,
      });
    } else {
      this.account_upi = true;
      this.bank_account=false;
      this.bank_details.patchValue({
        account_no:'12345678',
        ifsc_code:'xyz123',
        conf_account_no:'12345678',
        account_holder:'xyz',
        upi_name:this.user_bank_details.upi_name,
        upi_id:this.user_bank_details.upi_id,
        conf_upi_id:this.user_bank_details.upi_id,
      });
    }

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
  
  // wishlist refreh functionalty 
  bank_details_refresh(){
    this.CommonService.bank_details_emit<string>('true');
  } 
  
  closeModal(sendData:any) {
    this.activeModal.close(sendData);
  }

}
