import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserBankDetailsService } from '../../services/user-bank-details.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { UserPaytmVerifyComponent } from '../../modals/user-paytm-verify/user-paytm-verify.component';
import { BankHistoryComponent } from '../../modals/bank-history/bank-history.component';
import { environment } from 'src/environments/environment';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { Pagination } from 'src/app/user/components/models/pagination.model';

@Component({
  selector: 'app-payment-user-list',
  templateUrl: './payment-user-list.component.html',
  styleUrls: ['./payment-user-list.component.css']
})
export class PaymentUserListComponent implements OnInit {
  public payment_user:any;
  public payment_user_length:any;
  public user_bank_history_data:any;
  public p:number=0;
  public showLoadingIndicator:boolean=false;
  public submitted: boolean = false;
  public Pagination_data: Pagination;
  public ftpstring=environment.ftpURL;
  public transaction_id:any;
  public product:any;
  public product_amount:any;
  public property_owner:any;
  public disabled:boolean=false;
  
  payment_form= new UntypedFormGroup({
    payment_id: new UntypedFormControl('', Validators.required),
    payment_status: new UntypedFormControl('', Validators.required),
  });
  
  searching_form = new UntypedFormGroup({
    admin_payment_type: new UntypedFormControl('', Validators.required),
    star_date: new UntypedFormControl(''),
    end_date: new UntypedFormControl('')
  });

  constructor(private toastr: ToastrService,
       private modalService: NgbModal,
       private router:Router,
       private UserBankDetailsService:UserBankDetailsService) { 
        this.UserBankDetailsService.bank_details_on().subscribe(
          message => {
            if (message == 'true') {
              this.get_payment_user();
            }
          });
          this.Pagination_data = new Pagination();
       }

  ngOnInit(): void {
    this.showLoadingIndicator= true;
    this.get_payment_user();
  }
  // fetch user bank details 
  
  get_payment_user(){
    this.showLoadingIndicator= true;
    this.UserBankDetailsService.get_payment_user({ param: null }).then(
      Pagination_data => {
        this.payment_user=Pagination_data;
        this.payment_user_length=this.payment_user.data.total;
        this.showLoadingIndicator= false;
      }, err => {
      }
    );
  }
  
  product_preview(id:number,name:string){
    const url:any = this.router.createUrlTree(['/admin/product-preview'],{queryParams:{'id':id,'name':name}})
      window.open(url.toString(), '_blank')
  };
  get f() {
    return this.searching_form.controls;
  }
  get g() {
    return this.payment_form.controls;
  }
   
  
  gotoPage(link_url: any) {
    this.showLoadingIndicator = true;
    let param = { admin_payment_type:this.searching_form.value.admin_payment_type,start_date: this.searching_form.value.star_date,end_date:this.searching_form.value.end_date}
    this.UserBankDetailsService.getpagination1(link_url,param).then(Pagination_data => {
      this.showLoadingIndicator= false;
      this.payment_user=Pagination_data;
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
refresh_data(){
  this.searching_form.patchValue({
    admin_payment_type:'',
    star_date:'',
    end_date:''
  });
  this.get_payment_user();
}
on_search(){
  if(this.searching_form.invalid){
    this.submitted = true;
    }else{
      this.payment_user="";
      this.payment_user_length='';
    this.showLoadingIndicator =true;
     let param = { admin_payment_type:this.searching_form.value.admin_payment_type,start_date: this.searching_form.value.star_date,end_date:this.searching_form.value.end_date}
    this.UserBankDetailsService.get_payment_user(param).then(
      Pagination_data => {
        this.payment_user=Pagination_data;
        this.payment_user_length=this.payment_user.data.total;
        this.showLoadingIndicator= false;
      }, err => {
      }
    );
  }
}
onchange_date(){
  if(this.searching_form.value.star_date>this.searching_form.value.end_date){
    this.disabled = true;
    }else{
      this.disabled=false;
    }
}
  viewDetails(data: any) {
    this.transaction_id='';
    this.property_owner='';
    this.product_amount='';
    this.product='';
  this.transaction_id=data.transaction_id;
  this.property_owner=data.pro_owner?.name;
  this.product_amount=data.amount;
  this.product=data.productdetails?.build_name;
  this.payment_form.patchValue({
    payment_status:data.payment_status,
    payment_id:data.id
  })
  }
  
  excel_emport(){
    if(this.payment_user_length>0){
      this.showLoadingIndicator=true;
      let param = { admin_payment_type:this.searching_form.value.admin_payment_type,start_date: this.searching_form.value.star_date,end_date:this.searching_form.value.end_date}
      this.UserBankDetailsService.get_payment_user_excel(param).then(
      Pagination_data => {
        let data:any=Pagination_data;
        if(data.data.length>0){
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            showTitle: true,
            title: 'Payment Data',
            useBom: true,
            noDownload: false,
            headers: ["Transaction id","Payment Type","Amount","Payment Status","Property Name","Owner","Created user","Date"]
          };
           new  ngxCsv(data.data, "Property List", options);
        }else{
          this.toastr.error('Please Applied  Search form fillter');
        }
        this.showLoadingIndicator=false;
      }, err => {
      }
    );
    }else{
        this.toastr.error('Please Applied  Search form fillter');
    }
  }
  
  onSubmit():void{
    if(this.payment_form.invalid){
      this.submitted = true;
      }else{
        this.UserBankDetailsService.payment_user_update(this.payment_form.value).subscribe(
          response => {
            let data:any=response;
            this.showLoadingIndicator = false;
            this.toastr.success('Payment Status Updated');
            this.get_payment_user();
          },
          err => {
            this.showLoadingIndicator = false;
            let errorMessage:any = err.error.errors;
            this.toastr.error(errorMessage, 'Something Error', {
              timeOut: 3000,
            });
          }
        );
      }
    }
}
