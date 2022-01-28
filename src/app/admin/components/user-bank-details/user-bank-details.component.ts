import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserBankDetailsService } from '../../services/user-bank-details.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserPaytmVerifyComponent } from '../../modals/user-paytm-verify/user-paytm-verify.component';
import { BankHistoryComponent } from '../../modals/bank-history/bank-history.component';
// import { Pagination } from '../../models/pagination.model';
import { Pagination } from 'src/app/user/components/models/pagination.model';
@Component({
  selector: 'app-user-bank-details',
  templateUrl: './user-bank-details.component.html',
  styleUrls: ['./user-bank-details.component.css']
})
export class UserBankDetailsComponent implements OnInit {
  public user_bank_details:any;
  public user_bank_length:any;
  public user_bank_history_data:any;
  public p:number=0;
  public showLoadingIndicator:boolean=false;
  public Pagination_data: Pagination;

  constructor(private toastr: ToastrService,
       private modalService: NgbModal,
       private UserBankDetailsService:UserBankDetailsService) { 
        this.UserBankDetailsService.bank_details_on().subscribe(
          message => {
            if (message == 'true') {
              this.get_userbank_details();
            }
          });
          this.Pagination_data = new Pagination();
       }

  ngOnInit(): void {
    this.showLoadingIndicator= true;
    this.get_userbank_details();
  }
  // fetch user bank details 
  
  get_userbank_details(){
    this.showLoadingIndicator= true;
    this.UserBankDetailsService.get_userbank_details().then(
      Pagination_data => {
        this.user_bank_details=Pagination_data;
        //console.log(this.user_bank_details);
        this.user_bank_length=this.user_bank_details.data.total;
        this.showLoadingIndicator= false;
      }, err => {
      }
    );
  }
  
  gotoPage(link_url: any) {
    this.showLoadingIndicator = true;
    this.UserBankDetailsService.getpagination(link_url).then(Pagination_data => {
      this.showLoadingIndicator= false;
      this.user_bank_details=Pagination_data;
      // this.user_list_length=this.user_list.data.data.length;
    });
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
  user_bank_history(id:any,email:any,mobile:any){
      let param = { user_id: id }
      this.UserBankDetailsService.get_userbank_history_id(param).subscribe(
        response => {
          this.user_bank_history_data=response;
            if(this.user_bank_history_data.data.length){
              const modalRef = this.modalService.open(BankHistoryComponent,
                {
                  scrollable: true,
                  windowClass: 'myCustomModalClass',
                  // keyboard: false,
                  backdrop: 'static'
                });
              let data = {
                data:this.user_bank_history_data,
                email:email,
                mobile:mobile
              }
              modalRef.componentInstance.data = data;
            }else{
              this.toastr.warning('This User Not Bank History', email, {
                timeOut: 3000,
              });
            }
        }, err => { 
          let Message =err.error.message;
        }
      );
    
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
