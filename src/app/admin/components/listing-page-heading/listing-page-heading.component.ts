import { Component, OnInit,ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OfferBannerService } from '../../services/offer-banner.service';
import { Pagination } from 'src/app/user/components/models/pagination.model';

@Component({
  selector: 'app-listing-page-heading',
  templateUrl: './listing-page-heading.component.html',
  styleUrls: ['./listing-page-heading.component.css']
})
export class ListingPageHeadingComponent implements OnInit {

 
  @ViewChild('closeModal')modalClose:any;
 
  public submitted: boolean = false;
  public showLoadingIndicator: boolean =false;
  public text_data:any={};
  public delete_banner_details:any;
  public text_length:number=0;
  public Pagination_data: Pagination;
  public banner_details:any;  
  public clicked = false;
  public update_submitted:boolean=false;

  content_form = new FormGroup({
    status: new FormControl('', Validators.required),
    text: new FormControl('', Validators.required),
  });
  update_content_form= new FormGroup({
    text_id: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    text: new FormControl('', Validators.required),
  });

  constructor(private OfferBannerService:OfferBannerService,
    private toastr: ToastrService) { 
      this.Pagination_data = new Pagination();
    }

  ngOnInit(): void {
    this.get_data();
  }

  onSubmit(){
    if(this.content_form.invalid){
      this.submitted = true;
      return;
      }else{
        console.log(this.content_form.value);
        this.OfferBannerService.listing_page_heading_create(this.content_form.value).subscribe(
          response => {
            let data:any=response;
            this.showLoadingIndicator = false;
            this.content_form.patchValue({
              status:"",
              text:""
            });
            this.get_data();
            this.toastr.success('Heading Create Successfully');
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
  

  // fetch services  
  get_data(){
    this.showLoadingIndicator= true;
    this.OfferBannerService.get_listing_heading().then(
      Pagination_data => {
        this.text_data=Pagination_data;
        console.log(this.text_data);
        this.text_length=this.text_data.data.total;
        this.showLoadingIndicator=false;
      }, err => {
      }
    );
  }

  gotoPage(link_url: any) {
    this.showLoadingIndicator = true;
    this.OfferBannerService.getpagination(link_url).then(Pagination_data => {
      this.showLoadingIndicator= false;
      this.text_data=Pagination_data;
      // this.user_list_length=this.user_list.data.data.length;
    });
  }

  get f() {
    return this.content_form.controls;
  }

  delete_heading(id:any){
    //console.log(service_id);
    this.showLoadingIndicator = true;
    let param = { id: id}
    this.OfferBannerService.delete_heading(param).pipe().subscribe(
      response=> {
        this.showLoadingIndicator =false;;
        let data:any=response;
        let Message =data.message;
        this.toastr.error(Message, 'heading', {
          timeOut: 3000,
        });
        this.get_data();
      },
      err => {
       this.showLoadingIndicator = false;
      }
    )
  }
  
  status_changes(id:any){
    let param = { text_id: id}
    this.OfferBannerService.heading_status_changes(param).subscribe(
      response => {
        this.showLoadingIndicator =false;
        let data:any=response;
        this.toastr.success('Status Updated', 'heading', {
          timeOut: 3000,
        });
        this.get_data();
      }
    );
  }
  
  editDetails(data: any) {
    this.banner_details=data;
    this.update_content_form.patchValue({
      text_id:data.id,
      status:data.content_status,
      text:data.content,
    });
  }
  
  
  get g() {
    return this.update_content_form.controls;
  }
  
  Onupdate_data(){
    if(this.update_content_form.invalid){
      this.update_submitted = true;
      return;
    }else{
        this.OfferBannerService.listing_page_heading_Update(this.update_content_form.value).subscribe(
          response => {
            let data:any=response;
            this.showLoadingIndicator = false;
            this.modalClose.nativeElement.click();
            this.update_content_form.patchValue({
              text_id:"",
              status:"",
              text:""
            });
            this.get_data();
            this.toastr.success('heading Update Successfully');
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
    this.update_content_form.patchValue({
      status:data.content_status,
      text:data.content,
    });
  }
  
  deletebanner_popup(data: any) {
    this.banner_details = data;
  }

}
