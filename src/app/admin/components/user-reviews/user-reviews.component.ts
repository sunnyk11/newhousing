import { Component, OnInit } from '@angular/core';
import { UserReviewsService } from '../../services/user-reviews.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  searching_form = new FormGroup({
    star_date: new FormControl('', Validators.required),
    end_date: new FormControl('', Validators.required)
  });

  constructor(private UserReviewsService:UserReviewsService,
    private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.get_reviews();
  }
  // fetch user reviews advance tab
  get_reviews(){
    this.UserReviewsService.get_reviews({ param: null }).subscribe(
      response => {
        console.log(response);
        this.user_reviews=response;
        this.review_length=this.user_reviews.data.length;
      }, err => { 
        let Message =err.error.message;
      }
    );
  }
  get f() {
    return this.searching_form.controls;
  }
  on_search(){
    if(this.searching_form.invalid){
      this.submitted = true;
      }else{
      this.showLoadingIndicator =true;
      let start_date:any = this.pipe.transform(this.searching_form.value.star_date, 'y-MM-dd')+ " 00:00:00";
      let end_date:any = this.pipe.transform(this.searching_form.value.end_date, 'y-MM-dd')+ " 59:59:59";
       let param = { start_date: start_date,end_date:end_date}
       console.log(param);
       this.UserReviewsService.get_reviews(param).subscribe(
        response => {
          console.log(response);
          this.user_reviews=response;
          this.review_length=this.user_reviews.data.length;
          this.showLoadingIndicator =false;
        }, err => { 
          let Message =err.error.message;
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
