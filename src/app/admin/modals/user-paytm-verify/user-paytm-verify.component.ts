import { Component, OnInit,Input } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserBankDetailsService } from '../../services/user-bank-details.service';


@Component({
  selector: 'app-user-paytm-verify',
  templateUrl: './user-paytm-verify.component.html',
  styleUrls: ['./user-paytm-verify.component.css']
})
export class UserPaytmVerifyComponent implements OnInit {
  public submitted:boolean=false;
  public errorMessage:any;

  
  bank_details = this.fb.group({
    account_holder: ['', Validators.required],
    account_no: ['', Validators.required],
    ifsc_code: ['', Validators.required],
    user_mobile_no: ['', Validators.required],
    Paytm_unique_id:['',Validators.required],
    user_id: ['', Validators.required],
  });

  @Input() user_bank_details:any;

  constructor(public activeModal: NgbActiveModal,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService,
    private UserBankDetailsService:UserBankDetailsService) { }

  ngOnInit(): void {
    this.bank_details.patchValue({
      account_holder:this.user_bank_details.bank_account_holder,
      account_no:this.user_bank_details.bank_account_no,
      ifsc_code:this.user_bank_details.ifsc_code,
      user_mobile_no:this.user_bank_details.user_mobile_no,
      user_id:this.user_bank_details.user_id,
      Paytm_unique_id:this.user_bank_details.paytm_verify_id
    });
  }

  get f() {
    return this.bank_details.controls;
  }
  update_deatils(){
    if(this.bank_details.invalid){
      this.submitted = true;
      }else{
        //console.log(this.bank_details.value);
        this.UserBankDetailsService.update_bank_paytm_id(this.bank_details.value).subscribe(
          response => {
            this.closeModal('');
            this.toastr.success('Bank Verification Success ', 'User', {
              timeOut: 3000,
            });
            this.bank_details_refresh();
          },
          err => {
            this.errorMessage = err.error;
          }
        );
      }
    }

  // bank_details_refresh functionalty 
  bank_details_refresh(){
    this.UserBankDetailsService.bank_details_emit<string>('true');
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
  closeModal(sendData:any) {
    this.activeModal.close(sendData);
  }
}
