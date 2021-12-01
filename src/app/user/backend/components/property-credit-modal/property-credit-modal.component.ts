import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { PlansServiceService } from '../../services/plans-service.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginPageService } from '../../services/login-page.service';
import { JwtService } from 'src/app/user/services/jwt.service';

@Component({
  selector: 'app-property-credit-modal',
  templateUrl: './property-credit-modal.component.html',
  styleUrls: ['./property-credit-modal.component.css']
})
export class PropertyCreditModalComponent implements OnInit {
  
  public response: any;
  public letout_response: any;
  public letout_feat_res: any;
  public myArray_lo: any = [];
  public showLoadingIndicator: boolean = false;
  private user_phone_data: any;
  public userEmail: any;
  public user_id: any;
  public usertype:any;
  public plan_price: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private PlansServiceService:PlansServiceService,
    private dialogRef: MatDialogRef<PropertyCreditModalComponent>,
    private router: Router,
    private loginPageService: LoginPageService,
    private jwtService: JwtService,
    public matDialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.response = this.data;    
    this.PlansServiceService.getLetOutPlans_Features({ param: null }).subscribe(
      response => {
        let result:any=response;
        this.letout_response = result.letout_plans;
        this.letout_feat_res = result.letout_features;
        for (let feat_res_lo in this.letout_feat_res) {
          this.myArray_lo = this.letout_feat_res[feat_res_lo].feature_details.split(',');
          this.letout_feat_res[feat_res_lo].feature_details = this.myArray_lo;
          //this.showLoadingIndicator = false;
        }
      },
      err => {
        // console.log(err);
      }
    );
  }
  
  apply_plan(invoice_no:any) {
    this.dialogRef.close();
    this.router.navigate(['agent/plan-apply'], { queryParams: { 'invoice_no': invoice_no, 'product_id': this.response.product_id } });
  }
  plan_payment(plan_name:any, plan_id:any, payment_type:any, plan_type:any, expected_rent:any, price_duration:any) {
    this.showLoadingIndicator = true;
    let val = this.jwtService.getToken();
    if (val) {
      this.user_id = this.jwtService.getUserId();
      this.userEmail = this.jwtService.getUserEmail();
      this.usertype = this.jwtService.getUserType();
    this.loginPageService.getUserPhoneDetails({ param: null }).subscribe(
        response => {
          this.user_phone_data = response;
          if(this.user_phone_data !== 1) {
            // console.log("Mobile number not verified");
            this.showLoadingIndicator = false;
            this.openModal();
          }
          else {
            const formData: any = new FormData();
            formData.append('user_id', this.user_id);
            formData.append('user_email', this.userEmail);
            formData.append('plan_type', plan_type);
            formData.append('plan_name', plan_name);
            formData.append('expected_rent', expected_rent);
            formData.append('plan_id', plan_id);
            formData.append('payment_type', payment_type);

            this.plan_price = expected_rent / (30 / price_duration);
            formData.append('plan_price', this.plan_price);
            this.showLoadingIndicator = false;
            this.PlansServiceService.postSelectedPlan(formData).subscribe(
              response => {
                let res:any=response;
                this.dialogRef.close();
                this.router.navigate(['/agent/payment-summary'], { queryParams: { 'orderID': res.data.order_id } });
              },
              err => {
              }
            );
          }
        }
      );
    }else {
      //console.log("Not logged in: " + val);
      this.openModal();
    }
  }
  openModal() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "250px";
    dialogConfig.width = "600px";
    const modalDialog = this.matDialog.open(ModalComponent, dialogConfig);
  }

}
