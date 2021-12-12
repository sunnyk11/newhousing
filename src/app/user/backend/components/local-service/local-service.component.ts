import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalServiceProviderService } from '../../services/local-service-provider.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-local-service',
  templateUrl: './local-service.component.html',
  styleUrls: ['./local-service.component.css']
})
export class LocalServiceComponent implements OnInit {

  public showLoadingIndicator: boolean =false;
  public ftpstring=environment.ftpURL;
  public search_data:any={};
  public p:number=0;
  public d:number=0;
  public result:any;
  public star_rating: number=0;
  public rating_data: any;
  public local_area_data:any;
  public area_service_data:any;
  public review_details: any;
  public UserDeatils:any;
  public review_data:any;
  
  Service_form = new FormGroup({
    Area: new FormControl('', Validators.required),
    LocalArea: new FormControl('', Validators.required),
    service: new FormControl('', Validators.required)
  });
  review_form = new FormGroup({
    stars: new FormControl('', Validators.required),
    user_id:new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
    s_user_id: new FormControl('', Validators.required)
  });
  

  constructor(
    private LocalServiceProviderService:LocalServiceProviderService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.on_search();
  }
  
  on_search(){
    this.showLoadingIndicator = true;
    this.LocalServiceProviderService.searching_area(this.Service_form.value).subscribe(
      response => {
        console.log(response);
        this.search_data = response;
        this.showLoadingIndicator = false;
      },
      err => {
        this.showLoadingIndicator = false;
      }
    );
  } 
  submit_review():void{
    let param={data:this.review_form.value}
    console.log(this.review_form.value);
    if (this.review_form.value.stars) {
      if(this.review_form.value.content){
        this.LocalServiceProviderService.service_user_reviews(param).subscribe(
          response => {
            let data:any=response;
            this.showLoadingIndicator = false;
            this.toastr.success('Successfuly Reviews For Service');
            console.log(data.data);
            this.user_details(data.data);
          },
          err => {
            this.showLoadingIndicator = false;
            let errorMessage:any = err.error.errors;
            this.toastr.error(errorMessage, 'Something Error', {
              timeOut: 3000,
            });
          }
        );
      }else{
        this.toastr.error("Please Enter Review description.");
      }
    }else{
      this.toastr.error("Please Select Stars Rating.");
    }

  }
  // fetch local area 
  local_area():void{
    this.showLoadingIndicator = true;
    this.LocalServiceProviderService.getlocalArea({ param: null }).pipe().subscribe(
      response=> {
        this.local_area_data=response;
        this.showLoadingIndicator = false;
      },
      err => {
       this.showLoadingIndicator = false;
      }
    )
  }
  // fetch area service
  area_service():void{
    this.showLoadingIndicator = true;
    this.LocalServiceProviderService.getarea_service({ param: null }).pipe().subscribe(
      response => {
        console.log(response);
        this.area_service_data=response;
        this.showLoadingIndicator = false;
      },
      err => {
       this.showLoadingIndicator = false;
      }
    )
  }
  // user details fetch 
  user_details(id:any):void{
    let param = { user_id: id }
    this.review_form.reset();
    this.LocalServiceProviderService.getarea_user_details(param).pipe().subscribe(
      response => {
        console.log(response);
        let data:any=response;
        this.UserDeatils=data.user_data;
        
        this.review_details= data.avg_reviews;
        this.review_data= data.review_data;
        
        this.showLoadingIndicator = false; 
        this.review_form.patchValue({
          s_user_id:data.user_data.user_id,
        });
        if(data.user_review != null){
          this.review_form.patchValue({
            s_user_id:data.user_review.s_user_id,
            content:data.user_review.content,
            user_id:data.user_review.user_id,
            stars:data.user_review.stars,
          });
        }
        this.on_search();
      },
      err => {
       this.showLoadingIndicator = false;
      }
    )
  } 
  rating_details(stars:any,service_id:any){
    let param = { star:stars,service_id: service_id }
    this.star_rating=stars;
    this.LocalServiceProviderService.star_ratingbyId(param).pipe().subscribe(
      (data: any) => {
        this.rating_data= data.rating_data;
      },
      err => {
       this.showLoadingIndicator = false;
      }
    )
  }
  onchange_area(id: any) {
    let param = { id: id }
    this.LocalServiceProviderService.get_localareaby_id(param).subscribe(
      response => {
        this.local_area_data=response;
        this.Service_form.patchValue({
          LocalArea:'',
        });
        this.Service_form.patchValue({
          service:'',
        });
      },
      err => {
      }
    );
  }
  onchange_local_area(id: any) {
      let param = { id: id }
      this.LocalServiceProviderService.get_service_id(param).subscribe(
        response => {
          console.log(response);
          this.area_service_data=response;
          this.Service_form.patchValue({
            service:'',
          });
        },
        err => {
        }
    );
  }
  

}
function id(id: any) {
  throw new Error('Function not implemented.');
}

