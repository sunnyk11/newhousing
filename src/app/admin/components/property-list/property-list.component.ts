import { Component, OnInit } from '@angular/core';
import { PropertyListService } from '../../services/property-list.service';
import { ToastrService } from 'ngx-toastr';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Pagination } from 'src/app/user/components/models/pagination.model';

import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent implements OnInit {
  public property_data:any;
  public p:number=0;
  public property_length:any;
  public showLoadingIndicator:boolean=false;
  public submitted:boolean=false;
  public disabled:boolean=false;
  pipe = new DatePipe('en-US');
  public dropdownList_mobile:any=[];
  public Pagination_data: Pagination;
  public filteredOptions!: Observable<any[]>;
  public filteredOptions_mobile!: Observable<any[]>;
  public dropdownList:any=[];
  public search_date_type:boolean=true;
  public search_user_type:boolean=false;
  public search_invoice_no:boolean=false;
  public email_search:boolean=false;
  public mobile_search=false;

  searching_form = new FormGroup({
    admin_property_type: new FormControl('', Validators.required),
    user_type: new FormControl('',),
    user_email: new FormControl(''),
    invoice_no: new FormControl(''),
    user_mobile_no: new FormControl(''),
    star_date: new FormControl(''),
    end_date: new FormControl('')
  });

  constructor(private PropertyListService:PropertyListService,
    private toastr: ToastrService,
    private router:Router,) {
      this.Pagination_data = new Pagination();   }

  ngOnInit(): void {
    this.get_property();
    this.filteredOptions = this.searching_form.controls.user_email.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
    this.filteredOptions_mobile = this.searching_form.controls.user_mobile_no.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter_mobile(value))
    );
  }
  // fetch user reviews advance tab
  
  get_property(){
    this.showLoadingIndicator= true;
    this.PropertyListService.get_property({ param: null }).then(
      Pagination_data => {
        this.property_data=Pagination_data;
        console.log(this.property_data);
        this.property_length=this.property_data.data.total;
        this.showLoadingIndicator=false;
      }, err => {
      }
    );
  }
  
  gotoPage(link_url: any) {
    this.showLoadingIndicator = true;
    let param = {invoice_no:this.searching_form.value.invoice_no,user_mobile_no:this.searching_form.value.user_mobile_no,user_email:this.searching_form.value.user_email, admin_property_type:this.searching_form.value.admin_property_type,start_date: this.searching_form.value.star_date,end_date:this.searching_form.value.end_date}
    this.PropertyListService.getpagination(link_url,param).then(Pagination_data => {
      this.showLoadingIndicator= false;
      this.property_data=Pagination_data;
      console.log(this.property_data);
      // this.user_list_length=this.user_list.data.data.length;
    });
  } 
  get f() {
    return this.searching_form.controls;
  }
  refresh_data(){
    this.searching_form.patchValue({
      admin_property_type:'',
      star_date:'',
      end_date:''
    });
    this.get_property();
  }


  
  get_user(value:any){
    if(value.length>2){
      this.PropertyListService.get_search_user(value).subscribe(
        response => {
          let data:any=response;
          this.dropdownList=[];
          if(data?.data?.length>0){
            for (let i = 0; i < data.data.length; i++) {
              this.dropdownList = this.dropdownList?.concat({user_email: data.data[i].email});
            }
            this.filteredOptions = this.searching_form.controls.user_email.valueChanges
              .pipe(
                startWith(''),
                map((value) => this._filter(value))
              );
          }else{
            this.dropdownList=[];
            this.searching_form.patchValue({payment_user:'',product:'',user_mobile_no:''});
          }
         
        }, err => {   
        }
      );
    }else{
      this.dropdownList=[];
    
    }
  }
  
  mobile_get_user(value:any){
    if(value.length>5){
      this.PropertyListService.mobile_get_search_user(value).subscribe(
        response => {
          let data:any=response;
          this.dropdownList_mobile=[];
          console.log(data);
          if(data?.data?.length>0){
            for (let i = 0; i < data.data.length; i++) {
              this.dropdownList_mobile = this.dropdownList_mobile?.concat({user_mobile:data.data[i].other_mobile_number});
           }
            this.filteredOptions_mobile = this.searching_form.controls.user_mobile_no.valueChanges.pipe(
              startWith(''),
              map((value) => this._filter_mobile(value))
            ); 
          }else{
            this.dropdownList_mobile=[];
           }
         
        }, err => {   
        }
      );
    }else{
      this.dropdownList_mobile=[];
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
    if (value.user_mobile) {
      const filterValue = value.user_mobile.toLowerCase();
      return this.dropdownList_mobile?.filter((option: any) => option.user_mobile.toLowerCase().includes(filterValue));
    }
    else {
      const filterValue = value.toLowerCase();
      return this.dropdownList_mobile?.filter((option: any) => option.user_mobile.toLowerCase().includes(filterValue));
    }
  }
  

  on_search(){
    if(this.searching_form.invalid){
      this.submitted = true;
      }else{
        this.property_data="";
        this.property_length='';
      this.showLoadingIndicator =true;
       let param = {invoice_no:this.searching_form.value.invoice_no,user_mobile_no:this.searching_form.value.user_mobile_no,user_email:this.searching_form.value.user_email, admin_property_type:this.searching_form.value.admin_property_type,start_date: this.searching_form.value.star_date,end_date:this.searching_form.value.end_date}
      this.PropertyListService.get_property(param).then(
        Pagination_data => {
          this.property_data=Pagination_data;
          this.property_length=this.property_data.data.total;
          this.showLoadingIndicator=false;
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
  onchage_type(event:any){
    if (event == 'user') {
      this.search_user_type=true;
      this.search_date_type=false;
      this.search_invoice_no=false;
      this.searching_form.patchValue({user_type:'email',user_mobile_no:'',user_email:'',star_date:'',end_date:'',invoice_no:''});
      
      this.email_search = true;
      this.mobile_search=false;
    } else if(event == 'invoice_no') {
      this.search_user_type=false;
      this.search_date_type=false;
      this.search_invoice_no=true;
      this.searching_form.patchValue({user_type:'',user_mobile_no:'',user_email:'',star_date:'',end_date:'',invoice_no:''});
    }else if(event == 'all_property') {
      this.search_user_type=false;
      this.search_date_type=true;
      this.search_invoice_no=false;
      this.searching_form.patchValue({user_type:'',user_mobile_no:'',user_email:'',star_date:'',end_date:'',invoice_no:''});
    }else if(event == 'rentout_property') {
      this.search_user_type=false;
      this.search_date_type=true;
      this.search_invoice_no=false;
      this.searching_form.patchValue({user_type:'',user_mobile_no:'',user_email:'',star_date:'',end_date:'',invoice_no:''});
    }else if(event == 'letout_property') {
      this.search_user_type=false;
      this.search_date_type=true;
      this.search_invoice_no=false;
      this.searching_form.patchValue({user_type:'',user_mobile_no:'',user_email:'',star_date:'',end_date:'',invoice_no:''});
    }else{
      this.search_user_type=false;
      this.search_date_type=true;
      this.search_invoice_no=false;
      this.searching_form.patchValue({user_type:'',user_mobile_no:'',user_email:'',star_date:'',end_date:'',invoice_no:''});
    }

  }
  onchage_mehtod(event:any){
    this.searching_form.patchValue({user_mobile_no:'',user_email:'',star_date:'',end_date:''});
    if (event == 'email') {
      this.email_search = true;
      this.mobile_search=false;
    } else {
      this.email_search = false;
      this.mobile_search=true;
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
  excel_emport(){
    if(this.property_length>0){
      this.showLoadingIndicator=true;
    let param = {invoice_no:this.searching_form.value.invoice_no,user_mobile_no:this.searching_form.value.user_mobile_no,user_email:this.searching_form.value.user_email, admin_property_type:this.searching_form.value.admin_property_type,start_date: this.searching_form.value.star_date,end_date:this.searching_form.value.end_date}
    this.PropertyListService.get_property_excel(param).then(
      Pagination_data => {
        let data:any=Pagination_data;
        console.log(data);
        if(data.data.length>0){
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            showTitle: true,
            title: 'Property Data',
            useBom: true,
            noDownload: false,
            headers: ["Property","Price","Owner Email","Owner Mobile","Owner Invoice","Customer Email","Customer Mobile","Customer Invoice","Property Location","Property Status"]
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
  product_preview(id:number,name:string){
    const url:any = this.router.createUrlTree(['/admin/product-preview'],{queryParams:{'id':id,'name':name}})
      window.open(url.toString(), '_blank')
  };
  
// invoice_details(invoice:any){
//   console.log(invoice);
//   const modalRef = this.modalService.open(InvoicePopupComponent,
//     {
//       scrollable: true,
//       windowClass: 'myCustomModalClass',
//       // keyboard: false,
//       backdrop: 'static'
//     });
//     let data = {
//       invoice:invoice    
//     }
//     console.log(data);
//     modalRef.componentInstance.data = data;
// }
rentslip(product_id:number){
  const url:any = this.router.createUrlTree(['/admin/rent-slip'],{queryParams:{'product_id':product_id}})
  window.open(url.toString(), '_blank')
}
viewInvoice(invoice_no: any) {
  const url:any = this.router.createUrlTree(['/admin/invoice'],{queryParams:{'invoice_no': invoice_no}})
  window.open(url.toString(), '_blank')
}
}
