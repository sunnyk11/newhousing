import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { JwtService } from 'src/app/user/services/jwt.service';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-user-reviews',
  templateUrl: './user-reviews.component.html',
  styleUrls: ['./user-reviews.component.css']
})
export class UserReviewsComponent implements OnInit {

  public submitted:boolean=false;
  public showLoadingIndicator:boolean=false;
  public product_id:any;
  
  reviews_form = this.fb.group({
    stars: ['', Validators.required],
    subject: ['', Validators.required],
    content: ['', Validators.required],
    product_id: [''],
    user_id: ['', Validators.required],
  });


  constructor(public CommonService: CommonService,
    private toastr: ToastrService,
    private jwtService: JwtService,
    private router:Router,
    private route:ActivatedRoute,
    private fb: FormBuilder) {
      this.route.queryParams.subscribe((params) => {
        if(params.product_id != null){
          this.product_id=params.product_id;
          this.reviews_form.patchValue({
            product_id:this.product_id
        });
        }
      });
     }

  ngOnInit(): void {
  }
  get f() {
    return this.reviews_form.controls;
  }
  onsubmit(){
    let user_id:any= this.jwtService.getUserId();
    this.reviews_form.patchValue({
          user_id:user_id
      });
      console.log(this.reviews_form.value);
    if(this.reviews_form.invalid){
      this.submitted = true;
      }else{
        this.CommonService.user_reviews(this.reviews_form.value).subscribe(
          data => {
            this.toastr.success('Review Successfuly', 'Property', {
              timeOut: 3000,
            });
            this.router.navigate(['/'])
          },
          err => {
            let errorMessage:any = err.error;
          }
        );
      }
  }

}
