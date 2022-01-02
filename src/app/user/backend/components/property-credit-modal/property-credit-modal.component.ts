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
  public usertype: any;
  public plan_price: any;
  public step: number = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private PlansServiceService: PlansServiceService,
    private dialogRef: MatDialogRef<PropertyCreditModalComponent>,
    private router: Router,
    private loginPageService: LoginPageService,
    private jwtService: JwtService,
    public matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.showLoadingIndicator = true;
    this.response = this.data;
    console.log(this.response);
    this.step = this.response.dialog_step;
    this.PlansServiceService.getLetOutFeatures({ param: null }).subscribe(
      response => {
        console.log(response);
        this.letout_feat_res = response;
        this.showLoadingIndicator = false;
      },
      err => {
        console.log(err);
        this.showLoadingIndicator = false;
      }
    );
  }

  apply_plan(invoice_no: any) {
    this.dialogRef.close();
    this.router.navigate(['agent/plan-apply'], { queryParams: { 'invoice_no': invoice_no, 'product_id': this.response.product_id } });
  }
  plan_payment(plan_name: any, plan_id: any, payment_type: any, plan_type: any, expected_rent: any, actual_price_days: any, discount_price_days: any, plan_features: any) {
    this.showLoadingIndicator = true;

    this.loginPageService.getUserPhoneDetails({ param: null }).subscribe(
      response => {
        this.user_phone_data = response;
        if (this.user_phone_data !== 1) {
          console.log("Mobile number not verified");
          this.showLoadingIndicator = false;
          this.dialogRef.close();
          this.openModal(plan_name, plan_id, payment_type, plan_type, expected_rent, actual_price_days, discount_price_days, plan_features);
        }
        else {
          this.user_id = this.jwtService.getUserId();
          this.userEmail = this.jwtService.getUserEmail();
          this.usertype = this.jwtService.getUserType();

          const formData: any = new FormData();
          formData.append('user_id', this.user_id);
          formData.append('user_email', this.userEmail);
          formData.append('plan_type', plan_type);
          formData.append('plan_name', plan_name);
          formData.append('expected_rent', expected_rent);
          formData.append('plan_id', plan_id);
          formData.append('payment_type', payment_type);

          if(discount_price_days) {
            this.plan_price = expected_rent / (30 / discount_price_days);
          }
          else {
            this.plan_price = expected_rent / (30 / actual_price_days);
          }
          
          formData.append('plan_price', this.plan_price);
          formData.append('plan_features_data', JSON.stringify(plan_features));
          this.showLoadingIndicator = false;

          this.PlansServiceService.postSelectedPlan(formData).subscribe(
            response => {
              let res: any = response;
              this.dialogRef.close();
              this.router.navigate(['/agent/payment-summary'], { queryParams: { 'orderID': res.data.order_id } });
            },
            err => {
              console.log(err);
              this.showLoadingIndicator = false;
            }
          );
        }
      }
    );
  }
  openModal(plan_name: any, plan_id: any, payment_type: any, plan_type: any, expected_rent: any, price_duration_actual: any, price_duration_discount: any, plan_features: any) {
    const modalDialog = this.matDialog.open(ModalComponent, { 
      data: {
      plan_name: plan_name,
      plan_id: plan_id,
      payment_type: payment_type,
      plan_type: plan_type,
      expected_rent: expected_rent,
      price_duration_actual: price_duration_actual,
      price_duration_discount: price_duration_discount,
      plan_features_data: JSON.stringify(plan_features)
      }
    });
  }

}
