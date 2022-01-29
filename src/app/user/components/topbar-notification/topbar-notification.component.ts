import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../guest/services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BankDetailsModalComponent } from '../../guest/modals/bank-details-modal/bank-details-modal.component';
import { JwtService } from '../../services/jwt.service';

@Component({
  selector: 'app-topbar-notification',
  templateUrl: './topbar-notification.component.html',
  styleUrls: ['./topbar-notification.component.css']
})
export class TopbarNotificationComponent implements OnInit {
  
  public bank_account_no:any=null;
  public ifsc_code:any;
  public bank_account_holder:any;
  public account_status:boolean=false;
  public phn_no: any;
  private id: any;
  public show_topbar:boolean=false;
  public user_data: any;
  public LoggedIn: boolean = false;
  public token: string = '';

  constructor(
    private commonService: CommonService,
    private jwtService: JwtService,
    private modalService: NgbModal) 
    { 
    this.commonService.getUpdate().subscribe(
      message => {
        this.LoggedIn = message.text;
        this.token = message.token;
        if (this.token.length>5) {
          this.user_details();
        }
      });
    }

  ngOnInit(): void {
    this.user_details();
  }
  
  user_details(){
    this.show_topbar=false;
    if (this.jwtService.getToken()) {
      this.LoggedIn = true;
      this.commonService.getUserDetails().pipe().subscribe(
        data => {
          let result:any=data;
          this.user_data = result.data;
          if(this.user_data.bank_acount_no == null && this.user_data.productdetails.length>0 ){
            this.show_topbar=true;
          this.id = this.user_data.id;
          this.phn_no = this.user_data.other_mobile_number;
          this.bank_account_no=this.user_data.bank_acount_no;
          this.ifsc_code=this.user_data.ifsc_code;
          this.bank_account_holder=this.user_data.account_holder;
          this.account_status=this.user_data.account_status;
          }else{
            this.show_topbar=false;
          }
        },err => {
            // this.showLoadingIndicator = false;
            console.log(err);
          }
        );
      }
      else {
        this.LoggedIn = false;
      }
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

}
