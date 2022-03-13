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
import { ToastrService } from 'ngx-toastr';
// import { MypropertiesPageService } from 'src/app/user/guest/services/myproperties-page.service';
import { MypropertiesService } from '../../services/myproperties.service';

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
  public current_invoice_no:any;
  public plan_expected_price:any;
  public property_price:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private PlansServiceService: PlansServiceService,
    private dialogRef: MatDialogRef<PropertyCreditModalComponent>,
    private router: Router,
    private loginPageService: LoginPageService,
    private jwtService: JwtService,
    private toastr: ToastrService,
    private MypropertiesService:MypropertiesService,
    public matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.showLoadingIndicator = true;
    this.response = this.data;
    this.step = this.response.dialog_step;
    this.PlansServiceService.getLetOutFeatures({ param: null }).subscribe(
      response => {
        this.letout_feat_res = response;
        this.showLoadingIndicator = false;
      },
      err => {
        this.showLoadingIndicator = false;
      }
    );
  }
  confirmation_modal(invoice_no: any){
    this.current_invoice_no=invoice_no;

  }

  // apply_plan(invoice_no: any) {
  //   this.dialogRef.close();
  //   this.router.navigate(['agent/plan-apply'], { queryParams: { 'invoice_no': invoice_no, 'product_id': this.response.product_id } });
  // }
  
  apply_plan(invoice_no:any) {
    let param={invoice_id:invoice_no,product_id: this.response.product_id,product_price:this.response.product_price}
    console.log(param);
    this.PlansServiceService.updateInvoiceDetails(param).subscribe(
      response => {
        // this.success_invoice = true;
        this.toastr.info("CONGRATS!!! Your property is now Live");
        this.dialogRef.close();
        this.router.navigate(['agent/my-properties']);
        this.properties_refresh();
      },
      err => {
      }
    );
  }
  plan_payment(plan_name: any, plan_id: any, payment_type: any, plan_type: any, expected_rent: any, actual_price_days: any, discount_price_days: any, plan_features: any) {
    this.showLoadingIndicator = true;

    this.loginPageService.getUserPhoneDetails({ param: null }).subscribe(
      response => {
        this.user_phone_data = response;
        if (this.user_phone_data !== 1) {
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
              this.showLoadingIndicator = false;
            }
          );
        }
      }
    );
  }
  openModal(plan_name: any, plan_id: any, payment_type: any, plan_type: any, expected_rent: any, price_duration_actual: any, price_duration_discount: any, plan_features: any) {
    // console.log(plan_features);
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
  properties_refresh(){
    this.MypropertiesService.myproperty_emit<string>('true');
  } 
  plan_not_use(plan_expected_price:any,property_price:any){
     this.plan_expected_price=plan_expected_price;
     this.property_price=property_price;
  }

}
