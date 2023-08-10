import { Component, OnInit } from '@angular/core';
import { UserReviewsService } from '../../services/user-reviews.service';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Pagination } from 'src/app/user/components/models/pagination.model';

import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-reviews',
  templateUrl: './user-reviews.component.html',
  styleUrls: ['./user-reviews.component.css']
})
export class UserReviewsComponent implements OnInit {
  public user_reviews:any;
  public p:number=0;
  public review_length:any;
  public showLoadingIndicator:boolean=false;
  public submitted:boolean=false;
  public disabled:boolean=false;
  pipe = new DatePipe('en-US');
  public Pagination_data: Pagination;

  searching_form = new UntypedFormGroup({
    star_date: new UntypedFormControl('', Validators.required),
    end_date: new UntypedFormControl('', Validators.required)
  });

  constructor(private UserReviewsService:UserReviewsService,
    private toastr: ToastrService,) {
      this.Pagination_data = new Pagination();   }

  ngOnInit(): void {
    this.get_reviews();
  }
  // fetch user reviews advance tab
  
  get_reviews(){
    this.showLoadingIndicator= true;
    this.UserReviewsService.get_reviews({ param: null }).then(
      Pagination_data => {
        this.user_reviews=Pagination_data;
        //console.log(this.user_reviews);
        this.review_length=this.user_reviews.data.total;
        this.showLoadingIndicator=false;
      }, err => {
      }
    );
  }
  
  gotoPage(link_url: any) {
    this.showLoadingIndicator = true;
    let param = { start_date: this.searching_form.value.star_date,end_date:this.searching_form.value.end_date}
    this.UserReviewsService.getpagination(link_url,param).then(Pagination_data => {
      this.showLoadingIndicator= false;
      this.user_reviews=Pagination_data;
      // this.user_list_length=this.user_list.data.data.length;
    });
  } 
  get f() {
    return this.searching_form.controls;
  }
  refresh_data(){
    this.searching_form.patchValue({
      star_date:'',
      end_date:''
    });
    this.get_reviews();
  }
  on_search(){
    if(this.searching_form.invalid){
      this.submitted = true;
      }else{
      this.showLoadingIndicator =true;
       let param = { start_date: this.searching_form.value.star_date,end_date:this.searching_form.value.end_date}
      this.UserReviewsService.get_reviews(param).then(
        Pagination_data => {
          this.user_reviews=Pagination_data;
          //console.log(this.user_reviews);
          this.review_length=this.user_reviews.data.total;
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
  delete_reviews(id:any){
    this.showLoadingIndicator =true;
    let param = { user_id: id}
    this.UserReviewsService.user_reviews_delete(param).subscribe(
      response => {
        this.showLoadingIndicator =false;
        let data:any=response;
        this.toastr.error('Delete Successfully', 'User Reviews', {
          timeOut: 3000,
        });
        this.get_reviews();
      }
    );
  }
  reviews_status(id:any){
    let param = { user_id: id}
    this.UserReviewsService.reviews_status_changes(param).subscribe(
      response => {
        this.showLoadingIndicator =false;
        let data:any=response;
        this.toastr.success('Status Updated', 'User Reviews', {
          timeOut: 3000,
        });
        this.get_reviews();
      }
    );
  }


}
