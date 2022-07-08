import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Pagination } from 'src/app/user/components/models/pagination.model';
import { UserReviewsService } from '../../services/user-reviews.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';

import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-visit-user-feedback',
  templateUrl: './visit-user-feedback.component.html',
  styleUrls: ['./visit-user-feedback.component.css']
})
export class VisitUserFeedbackComponent implements OnInit {
  
  public showLoadingIndicator:boolean=false;
  public submitted:boolean=false;
  public disabled:boolean=false;
  pipe = new DatePipe('en-US');
  public Pagination_data: Pagination;
  public user_reviews:any;
  public review_length:any;

  searching_form = new FormGroup({
    star_date: new FormControl('', Validators.required),
    end_date: new FormControl('', Validators.required)
  });

   constructor(private UserReviewsService:UserReviewsService,
    private toastr: ToastrService,) {
      this.Pagination_data = new Pagination();   }

  ngOnInit(): void {
    this.get_reviews();
  }
  
  on_search(){
    if(this.searching_form.invalid){
      this.submitted = true;
      }else{
      this.showLoadingIndicator =true;
      let start_date:any = this.pipe.transform(this.searching_form.value.star_date, 'y-MM-dd')+ " 00:00:00";
      let end_date:any = this.pipe.transform(this.searching_form.value.end_date, 'y-MM-dd')+ " 59:59:59";
       let param = { start_date: this.searching_form.value.star_date,end_date:this.searching_form.value.end_date}
      this.UserReviewsService.get_visit_user_feedback(param).then(
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
  get_reviews(){
    this.showLoadingIndicator= true;
    this.UserReviewsService.get_visit_user_feedback({ param: null }).then(
      Pagination_data => {
        this.user_reviews=Pagination_data;
        console.log(this.user_reviews);
        this.review_length=this.user_reviews.data.total;
        this.showLoadingIndicator=false;
      }, err => {
      }
    );
  }
  
  gotoPage(link_url: any) {
    this.showLoadingIndicator = true;
    this.UserReviewsService.getpagination(link_url).then(Pagination_data => {
      this.showLoadingIndicator= false;
      this.user_reviews=Pagination_data;
      // this.user_list_length=this.user_list.data.data.length;
    });
  } 
  onchange_date(){
    if(this.searching_form.value.star_date>this.searching_form.value.end_date){
      this.disabled = true;
      }else{
        this.disabled=false;
      }

  }
   
  excel_emport(){
    if(this.review_length>0){
      var options = { 
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true, 
        showTitle: true,
        title: 'User feedback data',
        useBom: true,
        noDownload: false,
        headers: ["Star rating","System Ip","Device Type","Message","Created At"]
      };
       new  ngxCsv(this.user_reviews.excel_data, "Feedback data", options);
    }else{
        this.toastr.error('Please Applied  Search form fillter');
    }
  }

}
