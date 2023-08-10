import { Component, OnInit,ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OfferBannerService } from '../../services/offer-banner.service';
import { Pagination } from 'src/app/user/components/models/pagination.model';

@Component({
  selector: 'app-offer-banner',
  templateUrl: './offer-banner.component.html',
  styleUrls: ['./offer-banner.component.css']
})
export class OfferBannerComponent implements OnInit {
  
  @ViewChild('closeModal')modalClose:any;
 
  public submitted: boolean = false;
  public showLoadingIndicator: boolean =false;
  public bannner_data:any={};
  public delete_banner_details:any;
  public p:number=0;
  public banner_length:number=0;
  public Pagination_data: Pagination;
  public banner_details:any;
  public disabled:boolean=false;
  public update_submitted:boolean=false;
  public disabled_update_btn:boolean=false;

  Banner_form = new UntypedFormGroup({
    tittle: new UntypedFormControl(''),
    status: new UntypedFormControl('', Validators.required),
    start_date: new UntypedFormControl(''),
    end_date: new UntypedFormControl(''),
    text: new UntypedFormControl(''),
  });
  update_Banner_form= new UntypedFormGroup({
    banner_id: new UntypedFormControl('', Validators.required),
    tittle: new UntypedFormControl(''),
    status: new UntypedFormControl('', Validators.required),
    start_date: new UntypedFormControl(''),
    end_date: new UntypedFormControl(''),
    text: new UntypedFormControl(''),
  });

  constructor(private OfferBannerService:OfferBannerService,
    private toastr: ToastrService) { 
      this.Pagination_data = new Pagination();
    }

  ngOnInit(): void {
    this.get_data();
  }
  nosubmit(){
    this.toastr.error('At Least One Filed Select');
  }
  onchange(){
    if(this.Banner_form.value.tittle == '' && this.Banner_form.value.text ==''){
      this.disabled = true;
      }else{
        this.disabled=false;
      }

  }

  onSubmit(){
    if((this.Banner_form.value.tittle == '' && this.Banner_form.value.text =='') || this.Banner_form.invalid){
      if(this.Banner_form.invalid){
        this.submitted = true;
      }else{
        this.disabled = true;
        this.toastr.error('At Least One Filed Select');
      }
      return;
      }else{
        this.OfferBannerService.banner_create(this.Banner_form.value).subscribe(
          response => {
            let data:any=response;
            this.showLoadingIndicator = false;
            this.Banner_form.patchValue({
              tittle:"",
              status:"",
              start_date:"",
              end_date:"",
              text:""
            });
            this.get_data();
            this.toastr.success('Banner Create Successfully');
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
  
  onchange_date(){
    if(this.Banner_form.value.start_date>this.Banner_form.value.end_date){
      this.disabled = true;
      }else{
        this.disabled=false;
      }

  }

  // fetch services  
  get_data(){
    this.showLoadingIndicator= true;
    this.disabled_update_btn=false;
    this.disabled=false;
    this.OfferBannerService.get_banner().then(
      Pagination_data => {
        this.bannner_data=Pagination_data;
        //console.log(this.service_data);
        this.banner_length=this.bannner_data.data.total;
        this.showLoadingIndicator=false;
      }, err => {
      }
    );
  }

  gotoPage(link_url: any) {
    this.showLoadingIndicator = true;
    this.OfferBannerService.getpagination(link_url).then(Pagination_data => {
      this.showLoadingIndicator= false;
      this.bannner_data=Pagination_data;
      // this.user_list_length=this.user_list.data.data.length;
    });
  }

  get f() {
    return this.Banner_form.controls;
  }

  delete_banner(banner_id:any){
    //console.log(service_id);
    this.showLoadingIndicator = true;
    let param = { banner_id: banner_id}
    this.OfferBannerService.delete_Banner(param).pipe().subscribe(
      response=> {
        this.showLoadingIndicator =false;;
        let data:any=response;
        let Message =data.message;
        this.toastr.error(Message, 'Banner', {
          timeOut: 3000,
        });
        this.get_data();
      },
      err => {
       this.showLoadingIndicator = false;
      }
    )
  }
  
  banner_status_changes(id:any){
    let param = { banner_id: id}
    this.OfferBannerService.banner_status_changes(param).subscribe(
      response => {
        this.showLoadingIndicator =false;
        let data:any=response;
        this.toastr.success('Status Updated', 'Banner', {
          timeOut: 3000,
        });
        this.get_data();
      }
    );
  }
  
  editDetails(data: any) {
    this.banner_details=data;
    console.log(this.disabled_update_btn);
    this.disabled_update_btn = false;    
    console.log(this.disabled_update_btn);
    this.update_Banner_form.patchValue({
      banner_id:data.id,
      status:data.banner_status,
      start_date:data.start_date,
      end_date:data.end_date,
    });
    if(data.tittle != null){ 
      this.update_Banner_form.patchValue({
        tittle:data.tittle,
      });
    }
    if(data.text != null){    
      this.update_Banner_form.patchValue({
        text:data.text,
      });
    }
  }
  
  onchange_update(){
    if(this.update_Banner_form.value.tittle == '' && this.update_Banner_form.value.text ==''){
      this.disabled_update_btn = true;    
      }else{
        this.disabled_update_btn = false;    
      }

  }
  
  get g() {
    return this.update_Banner_form.controls;
  }
  
  Onupdate_data(){
    if((this.update_Banner_form.value.tittle == '' && this.update_Banner_form.value.text =='') || this.update_Banner_form.invalid){
      if(this.update_Banner_form.invalid){
        this.update_submitted = true;
        this.disabled_update_btn = false;
      }
      else{
        this.disabled_update_btn = true;
        this.toastr.error('At Least One Filed Select');
      }
      return;
    }else{
        this.OfferBannerService.banner_Update(this.update_Banner_form.value).subscribe(
          response => {
            let data:any=response;
            this.showLoadingIndicator = false;
            this.disabled_update_btn = false;
            this.modalClose.nativeElement.click();
            this.update_Banner_form.patchValue({
              tittle:"",
              banner_id:"",
              status:"",
              start_date:"",
              end_date:"",
              text:""
            });
            this.get_data();
            this.toastr.success('Banner Update Successfully');
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

  viewDetails(data: any) {
    this.banner_details=data;
    this.Banner_form.patchValue({
      tittle:data.tittle,
      status:data.banner_status,
      start_date:data.start_date,
      end_date:data.end_date,
      text:data.text,
    });
  }
  
  deletebanner_popup(data: any) {
    this.banner_details = data;
  }

}
