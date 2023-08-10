import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserLogsService } from '../../services/user-logs.service';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/user/services/jwt.service';

@Component({
  selector: 'app-user-visit-popup',
  templateUrl: './user-visit-popup.component.html',
  styleUrls: ['./user-visit-popup.component.css']
})
export class UserVisitPopupComponent implements OnInit {
  
  public otp_submitted:boolean=false;
  public show_feedback_form=false;
  public user_star_rating:number=0;
  public ip_address:any;
  public toggle : boolean = false;
  private device_info:any;
  public showLoadingIndicator=false;
  
  feedbackform = this.fb.group({
    star_rating: ['', Validators.required],
    system_ip: ['', Validators.required],
    device_info: ['', Validators.required],
    message: ['', Validators.required]
  });
  
  constructor(
    private fb: UntypedFormBuilder,
    private jwtService: JwtService,
    private router: Router,
    private UserLogsService:UserLogsService,
    public activeModal: NgbActiveModal,) { }

  ngOnInit(): void {
  }
  
  get g() {
    return this.feedbackform.controls;
  }
  
  jqNpsContinue(e:any){
    this.user_star_rating=e;
    this.show_feedback_form=true;
    this.ip_address = this.UserLogsService.getIpAddress();
    this.device_info = this.UserLogsService.getDeviceInfo();
    this.feedbackform.patchValue({
      star_rating:e,
      system_ip:this.ip_address,
      device_info:this.device_info
    });
    this.toggle = true;
  }
  previous(){
    this.show_feedback_form=false;
  }
  closeModal(sendData:any) {
    this.activeModal.close(sendData);
  }
  onsubmit(){
    if(this.feedbackform.invalid){
      this.otp_submitted = true;
      }else{
        this.showLoadingIndicator=true;
        this.jwtService.saveReturnURL(this.router.url);
        this.UserLogsService.visiter_user(this.feedbackform.value).subscribe(
          response => {
            let data:any=response;
            // if(data.status==201){
              this.activeModal.close(' ');
              this.showLoadingIndicator=false;
             this.router.navigate(['/visit-user-thank-you']);
            // }
          });
      }

  }

}
