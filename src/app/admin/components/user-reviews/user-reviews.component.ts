import { Component, OnInit } from '@angular/core';
import { UserReviewsService } from '../../services/user-reviews.service';

@Component({
  selector: 'app-user-reviews',
  templateUrl: './user-reviews.component.html',
  styleUrls: ['./user-reviews.component.css']
})
export class UserReviewsComponent implements OnInit {
  public user_reviews:any;
  public p:number=0;
  public review_length:any;

  constructor(private UserReviewsService:UserReviewsService) { }

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

  }

}
