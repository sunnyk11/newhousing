import { Component, OnInit } from '@angular/core';
import { UserReviewsService } from '../../services/user-reviews.service';
import { ToastrService } from 'ngx-toastr';

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
  delete_reviews(id:any){
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
