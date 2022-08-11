import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalServiceProviderService } from 'src/app/user/backend/services/local-service-provider.service';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonService } from 'src/app/user/backend/services/common.service';
import { Router,ActivatedRoute } from '@angular/router';
import { UserBankDetailsService } from '../../services/user-bank-details.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-payment-user',
  templateUrl: './payment-user.component.html',
  styleUrls: ['./payment-user.component.css']
})
export class PaymentUserComponent implements OnInit {

  public submitted: boolean = false;
  public showLoadingIndicator: boolean =false;
  public p:number=0;
  public dropdownList:any=[];
  public dropdownList_mobile:any=[];
  public dropdown_product:any=[];
  public fetch_user_data:any;
  public search_data:any={};
  private files: any;
  private imagePath: any;
  public payment_user_data:any={};
  public bank_account:boolean=false;
  public account_upi:boolean=false;
  dropdownSettings_product!: IDropdownSettings;
  dropdownSettings_user!: IDropdownSettings;
  dropdownSettings_mobile!: IDropdownSettings;
  public filteredOptions!: Observable<any[]>;
  public filteredOptions_mobile!: Observable<any[]>;
  public imgURL: any;
  private selectedFile: any;
  public bank_account_no:any;
  public ifsc_code:any;
  public bank_account_holder:any;
  public upi_name:any;
  public upi_id:any;
  public mobile_search:boolean=true;
  public email_search:boolean=false;
  public property_payment:boolean=true;
  public other_payment:boolean=false;

  
  
  selectedItems = [];

  Payment_user_form = new FormGroup({
    user_type: new FormControl('mobile', Validators.required),
    payment_status: new FormControl('Under Process', Validators.required),
    amount: new FormControl('', Validators.required),
    payment_user: new FormControl('', Validators.required),
    payment_user_data: new FormControl('', Validators.required),
    product: new FormControl(''),
    message: new FormControl('', Validators.required),
    payment_image:new FormControl(''),
    user_mobile_no: new FormControl('', Validators.required),
    transaction_id: new FormControl('', Validators.required),
    payment_type: new FormControl('Property Payment', Validators.required),
    bank_details_json: new FormControl('', Validators.required),
  });
  

  constructor( private LocalServiceProviderService:LocalServiceProviderService,
    private toastr: ToastrService,
    private router:Router,
    private UserBankDetailsService:UserBankDetailsService,
    private CommonService:CommonService) { }

  ngOnInit(): void {
    this.dropdownSettings_user = {
      singleSelection: true,
      idField: 'user_id',
      textField: 'user_email',
      enableCheckAll: false,
      itemsShowLimit: 1, 
      allowSearchFilter: true,
      closeDropDownOnSelection:true,
      noDataAvailablePlaceholderText: "user not Availabale",
      maxHeight: 250,
      clearSearchFilter:true,
      showSelectedItemsAtTop:true,
    };
    this.dropdownSettings_mobile = {
      singleSelection: true,
      idField: 'user_id',
      textField: 'user_mobile',
      enableCheckAll: false,
      itemsShowLimit: 1, 
      allowSearchFilter: true,
      closeDropDownOnSelection:true,
      noDataAvailablePlaceholderText: "user not Availabale",
      maxHeight: 250,
      clearSearchFilter:true,
      showSelectedItemsAtTop:true,
    };    
    this.dropdownSettings_product = {
      singleSelection: true,
      idField: 'product_id',
      textField: 'product_text',
      enableCheckAll: true,
      itemsShowLimit: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection:true,
      noDataAvailablePlaceholderText: "Property not Availabale",
      maxHeight: 250,
    };
    this.filteredOptions = this.Payment_user_form.controls.payment_user_data.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
    this.filteredOptions_mobile = this.Payment_user_form.controls.user_mobile_no.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter_mobile(value))
    );
    
  }

  change_selected_user(data:any){
    this.Payment_user_form.patchValue({payment_user:data.user_id});
    let param = { user_id:data.user_id}
    this.UserBankDetailsService.get_property(param).subscribe(
      response => {
        let data:any=response;
         this.fetch_user_data=data.user;
         this.Payment_user_form.patchValue({
          user_mobile_no:data.user.other_mobile_number
        });
         if(this.fetch_user_data.bank_type=='bank_account'){
            this.bank_account=true;
            this.account_upi=false;
            let bank_details_json={mobile_no:data.user.other_mobile_number,bank_type:data.user.bank_type,bank_account_no:data.user.bank_acount_no,ifsc_code:data.user.ifsc_code,bank_account_holder:data.user.account_holder,date:data.user.updated_at};
            this.Payment_user_form.patchValue({
              bank_details_json:bank_details_json
            });
            this.bank_account_holder=data.user.account_holder;
            this.ifsc_code=data.user.ifsc_code;
            this.bank_account_no=data.user.bank_acount_no;
         }else if(this.fetch_user_data.bank_type=='account_upi'){
          this.bank_account=false;
          this.account_upi=true;
          let bank_details_json={mobile_no:data.user.other_mobile_number,bank_type:data.user.bank_type,upi_name:data.user.upi_name,upi_id:data.user.upi_id,date:data.user.updated_at};
          this.Payment_user_form.patchValue({
            bank_details_json:bank_details_json
          });
          this.upi_name=data.user.upi_name;
          this.upi_id=data.user.upi_id;
         }else{}
        this.dropdown_product=[];
        this.Payment_user_form.patchValue({product:''});
        if(data.data.length<1){
          this.dropdown_product=[];
          this.Payment_user_form.patchValue({
            product:'',
            user_mobile_no:''
          });
        }else{
          for (let i = 0; i < data.data.length; i++) {
            this.dropdown_product = this.dropdown_product?.concat({ product_id: data.data[i].id, product_text: data.data[i].build_name});
          }
        }
      }
    );
    
  }
  
  onchange_payment_type(event:any){
    if (event == 'Any other Payment') {
      this.property_payment = false;
      this.other_payment=true;
      this.Payment_user_form.patchValue({product:''});
    } else {
      this.property_payment = true;
      this.other_payment=false;
    }

  }
  
  mobile_change_selected_user(data:any){
    this.Payment_user_form.patchValue({user_mobile_no:data.user_mobile});
    let param = { user_mobile:data.user_mobile}
    this.UserBankDetailsService.get_property(param).subscribe(
      response => {
        let data:any=response;
         this.fetch_user_data=data.user;
         this.Payment_user_form.patchValue({
          payment_user_data:data.user.email,
          payment_user:data.user.id
        });
         if(this.fetch_user_data.bank_type=='bank_account'){
            this.bank_account=true;
            this.account_upi=false;
            let bank_details_json={mobile_no:data.user.other_mobile_number,bank_type:data.user.bank_type,bank_account_no:data.user.bank_acount_no,ifsc_code:data.user.ifsc_code,bank_account_holder:data.user.account_holder,date:data.user.updated_at};
            this.Payment_user_form.patchValue({
              bank_details_json:bank_details_json
            });
            this.bank_account_holder=data.user.account_holder;
            this.ifsc_code=data.user.ifsc_code;
            this.bank_account_no=data.user.bank_acount_no;
         }else if(this.fetch_user_data.bank_type=='account_upi'){
          this.bank_account=false;
          this.account_upi=true;
          let bank_details_json={mobile_no:data.user.other_mobile_number,bank_type:data.user.bank_type,upi_name:data.user.upi_name,upi_id:data.user.upi_id,date:data.user.updated_at};
          this.Payment_user_form.patchValue({
            bank_details_json:bank_details_json
          });
          this.upi_name=data.user.upi_name;
          this.upi_id=data.user.upi_id;
         }else{}
        this.dropdown_product=[];
        this.Payment_user_form.patchValue({product:''});
        if(data.data.length<1){
          this.dropdown_product=[];
          this.Payment_user_form.patchValue({
            product:'',
            payment_user_data:''
          });
        }else{
          for (let i = 0; i < data.data.length; i++) {
            this.dropdown_product = this.dropdown_product?.concat({ product_id: data.data[i].id, product_text: data.data[i].build_name});
          }
        }
      }
    );
    
  }

  onchage_mehtod(event:any){
    if (event == 'email') {
      this.email_search = true;
      this.mobile_search=false;
    } else {
      this.email_search = false;
      this.mobile_search=true;
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
  get_user(value:any){
    if(value.length>2){
      this.UserBankDetailsService.get_search_user(value).subscribe(
        response => {
          let data:any=response;
          this.dropdownList=[];
          if(data?.data?.length>0){
            for (let i = 0; i < data.data.length; i++) {
              this.dropdownList = this.dropdownList?.concat({ user_id: data.data[i].id, user_email: data.data[i].email});
            }
            this.filteredOptions = this.Payment_user_form.controls.payment_user_data.valueChanges
              .pipe(
                startWith(''),
                map((value) => this._filter(value))
              );
          }else{
            this.dropdownList=[];
            this.dropdown_product=[];
            this.bank_account=false;
            this.account_upi=false;
            this.Payment_user_form.patchValue({payment_user:'',product:'',user_mobile_no:''});
          }
         
        }, err => {   
        }
      );
    }else{
      this.dropdownList=[];
      this.dropdown_product=[];
      this.bank_account=false;
      this.account_upi=false;
      this.Payment_user_form.patchValue({payment_user:'',product:'',user_mobile_no:''});
    }
  }
  
  mobile_get_user(value:any){
    if(value.length>5){
      this.UserBankDetailsService.mobile_get_search_user(value).subscribe(
        response => {
          let data:any=response;
          this.dropdownList_mobile=[];
          if(data?.data?.length>0){
            for (let i = 0; i < data.data.length; i++) {
              this.dropdownList_mobile = this.dropdownList_mobile?.concat({ user:data.data[i].email, user_mobile:data.data[i].other_mobile_number});
           }
            this.filteredOptions_mobile = this.Payment_user_form.controls.user_mobile_no.valueChanges.pipe(
              startWith(''),
              map((value) => this._filter_mobile(value))
            ); 
          }else{
            this.dropdownList_mobile=[];
            this.dropdown_product=[];
            this.bank_account=false;
            this.account_upi=false;
            this.Payment_user_form.patchValue({dropdownList_mobile:'',product:'',payment_user:''});
          }
         
        }, err => {   
        }
      );
    }else{
      this.dropdownList_mobile=[];
      this.dropdown_product=[];
      this.bank_account=false;
      this.account_upi=false;
      this.Payment_user_form.patchValue({dropdownList_mobile:'',product:'',payment_user:''});
    }
  }

  private _filter(value: any): string[] {
    if (value.user_email) {
      const filterValue = value.user_email.toLowerCase();
      return this.dropdownList?.filter((option: any) => option.user_email.toLowerCase().includes(filterValue));
    }
    else {
      const filterValue = value.toLowerCase();
      return this.dropdownList?.filter((option: any) => option.user_email.toLowerCase().includes(filterValue));
    }
  }
  private _filter_mobile(value: any): string[] {
    if (value.user) {
      const filterValue = value.user.toLowerCase();
      return this.dropdownList_mobile?.filter((option: any) => option.user.toLowerCase().includes(filterValue));
    }
    else {
      const filterValue = value.toLowerCase();
      return this.dropdownList_mobile?.filter((option: any) => option.user.toLowerCase().includes(filterValue));
    }
  }


  onSubmit():void{
    if(this.Payment_user_form.invalid){
      this.submitted = true;
      }else{
        if(this.property_payment ==true &&  this.other_payment ==false ){
          if(this.Payment_user_form.value.product.length==0){
            this.toastr.warning('Please Select Any Property');
            return;
          }else{
            if(this.Payment_user_form.value.product.length>0){
              this.Payment_user_form.value.product=this.Payment_user_form.value.product[0].product_id;
            }
            this.UserBankDetailsService.payment_user_create(this.Payment_user_form.value).subscribe(
              response => {
                let data:any=response;
                this.showLoadingIndicator = false;
                this.toastr.success('User Payment  Successfully');
                this.router.navigate(['/admin/payment-user-list']); 
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
        }else{
        if(this.Payment_user_form.value.product.length>0){
          this.Payment_user_form.value.product=this.Payment_user_form.value.product[0].product_id;
        }
        this.UserBankDetailsService.payment_user_create(this.Payment_user_form.value).subscribe(
          response => {
            let data:any=response;
            this.showLoadingIndicator = false;
            this.toastr.success('User Payment  Successfully');
            this.router.navigate(['/admin/payment-user-list']); 
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

  get f() {
    return this.Payment_user_form.controls;
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
  
  onFileChange(event:any) {
    let files:any = event.target.files;
    this.imgURL=null;
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.toastr.error("Only Image (jpg,jpeg,png) Supported");
      this.Payment_user_form.patchValue({ payment_image:''});
      return;
    }
    this.selectedFile = event.target.files[0];
    this.files = event.target.files;
    /*if (event.target.files && event.target.files.length > 0) {
      const file = (event.target.files[0] as File);
      console.log(file);
      this.blogForm.get('post_image').patchValue(file);
      console.log(this.blogForm.get('post_image').value);*/
    const reader = new FileReader();
    //console.log(reader);
    this.imagePath = this.files;
    reader.readAsDataURL(this.files[0]);
    reader.onload = (event) => {
      this.imgURL = event.target?.result;
      this.Payment_user_form.patchValue({payment_image:this.imgURL});
    }
  }

}

