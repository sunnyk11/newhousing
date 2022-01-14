import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
  public isFailedVerify_otp: boolean = false;
  public isVerified:boolean=false;
  public errorMessage: any;
  public mobile_no:any;

  bank_details = this.fb.group({
    account_holder: ['', Validators.required],
    account_no: ['', Validators.required],
    ifsc_code: ['', Validators.required],
    user_mobile_no: ['', Validators.required],
    user_id: ['', Validators.required],
  });
  
  otpForm = this.fb.group({
    otp_password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });
  
  @Input() user_bank_details:any;
  

  constructor(public activeModal: NgbActiveModal,
    private profilePageService: ProfilePageService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public CommonService:CommonService
    ) { }

  ngOnInit(): void {
    this.bank_account_no=this.user_bank_details.bank_account_no;
    this.mobile_no=this.user_bank_details.user_mobile_no;
    this.bank_details.patchValue({
      account_holder:this.user_bank_details.bank_account_holder,
      account_no:this.user_bank_details.bank_account_no,
      ifsc_code:this.user_bank_details.ifsc_code,
      user_mobile_no:this.user_bank_details.user_mobile_no,
      user_id:this.user_bank_details.user_id,
    });
  }
  
  update_deatils(){
    if(this.bank_details.invalid){
      this.submitted = true;
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
