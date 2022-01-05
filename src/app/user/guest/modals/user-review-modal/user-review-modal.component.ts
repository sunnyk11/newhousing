import { Component, OnInit,Input} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-review-modal',
  templateUrl: './user-review-modal.component.html',
  styleUrls: ['./user-review-modal.component.css']
})
export class UserReviewModalComponent implements OnInit {
  
  public submitted:boolean=false;

  reviews_form = this.fb.group({
    stars: ['', Validators.required],
    subject: ['', Validators.required],
    content: ['', Validators.required],
    product_id: ['', Validators.required],
    user_id: ['', Validators.required],
  });

  @Input() data:any;

  constructor(public activeModal: NgbActiveModal,
    public CommonService: CommonService,
    private toastr: ToastrService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.reviews_form.patchValue({
      product_id:this.data.product_id,
      user_id:this.data.userid,
    });
  }
  get f() {
    return this.reviews_form.controls;
  }
  onsubmit(){
    if(this.reviews_form.invalid){
      this.submitted = true;
      }else{
        this.CommonService.user_reviews(this.reviews_form.value).subscribe(
          data => {
            this.closeModal('');
            this.toastr.success('Review Successfuly', 'Property', {
              timeOut: 3000,
            });
          },
          err => {
            let errorMessage:any = err.error;
          }
        );
      }
  }
  closeModal(sendData:any) {
    this.activeModal.close(sendData);
  }

}
