import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserBankDetailsService } from '../../services/user-bank-details.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserPaytmVerifyComponent } from '../../modals/user-paytm-verify/user-paytm-verify.component';

@Component({
  selector: 'app-user-bank-details',
  templateUrl: './user-bank-details.component.html',
  styleUrls: ['./user-bank-details.component.css']
})
export class UserBankDetailsComponent implements OnInit {
  public user_bank_details:any;
  public user_bank_length:any;
  public p:number=0;
  public showLoadingIndicator:boolean=false;

  constructor(private toastr: ToastrService,
       private modalService: NgbModal,
       private UserBankDetailsService:UserBankDetailsService) { 
        this.UserBankDetailsService.bank_details_on().subscribe(
          message => {
            if (message == 'true') {
              this.get_userbank_details();
            }
          });
       }

  ngOnInit(): void {
    this.get_userbank_details();
  }
  // fetch user bank details 
  get_userbank_details(){
    this.UserBankDetailsService.get_userbank_details({ param: null }).subscribe(
      response => {
        console.log(response);
        this.user_bank_details=response;
        this.user_bank_length=this.user_bank_details.data.length;
      }, err => { 
        let Message =err.error.message;
      }
    );
  }
  
update_bank_details(account_holder:any,bank_acount_no:any,ifsc_code:any,paytm_verify_id:any,mobile:any,user_id:any){
   const modalRef = this.modalService.open(UserPaytmVerifyComponent,
    {
      scrollable: true,
      windowClass: 'myCustomModalClass',
      // keyboard: false,
      backdrop: 'static'
    });
    let data = {
      bank_account_no:bank_acount_no,
      ifsc_code: ifsc_code,
      bank_account_holder: account_holder,
      user_mobile_no:mobile,
      user_id:user_id,
      paytm_verify_id:paytm_verify_id
    }
    modalRef.componentInstance.user_bank_details = data;
}
  
  delete_user_bank(id:any){
    this.showLoadingIndicator =true;
    let param = { user_id: id}
    this.UserBankDetailsService.delete_user_bank(param).subscribe(
      response => {
        this.showLoadingIndicator =false;
        let data:any=response;
        this.toastr.error('Delete Successfully', 'User Bank details', {
          timeOut: 3000,
        });
        this.get_userbank_details();
      }
    );
  }

}
