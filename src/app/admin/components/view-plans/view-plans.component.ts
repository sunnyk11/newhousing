import { Component, OnInit, ViewChild } from '@angular/core';
import { PlansService } from '../../services/plans.service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-plans',
  templateUrl: './view-plans.component.html',
  styleUrls: ['./view-plans.component.css']
})
export class ViewPlansComponent implements OnInit {

  @ViewChild('closeModal')modalClose:any;

  public rent_response: any;
  public showLoadingIndicator: boolean = false;
  public letout_response: any;
  public submitted: boolean = false;
  public discount_stat: boolean = false;
  private update_res: any;
  public feature_response: any;
  public EditPlanDetails: any;

  constructor(private plansService: PlansService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router) { 
      this.EditPlanDetails = this.fb.group({
        id: [''],
        plan_type: [''],
        payment_type: [''],
        plan_name: [''],
        plan_actual_price: [''],
        plan_status: [''],
        discount_status: [''],
        discounted_price: [],
        discount_per: [],
        special_tag: [''],
        features: this.fb.group([])
      });
    }

  ngOnInit(): void {
    this.getRentPlans();
    this.getLetOutPlans();
  }

  get g() {
    return this.EditPlanDetails.controls;
  }

  get f() {
    return this.EditPlanDetails.controls.features;
  }

  getRentPlans() {
    this.plansService.getAllRentPlans({ param:null }).subscribe(
      response => {
        this.rent_response = response;
        this.showLoadingIndicator = false;
        //console.log(response);
      },
      err => {
        this.showLoadingIndicator = false;
      }
    );
  }

  getLetOutPlans() {
    this.showLoadingIndicator = true;
    this.plansService.getAllLetOutPlans({ param: null }).subscribe(
      response => {
        this.showLoadingIndicator = false;
        this.letout_response = response;
        console.log(response);
      },
      err => {
        this.showLoadingIndicator = false;
      }
    );
  }

  EditDetails(plan_details: any) {
    //console.log(plan_details);
    if(plan_details.discount == 1) {
      this.discount_stat = true;
    } 
    else if(plan_details.discount == 0) {
      this.discount_stat = false;
    }
    this.EditPlanDetails.patchValue({
      id: plan_details.id,
      plan_type: plan_details.plan_type,
      payment_type: plan_details.payment_type,
      plan_name: plan_details.plan_name,
      plan_actual_price: plan_details.actual_price_days,
      plan_status: plan_details.plan_status,
      discount_status: String(plan_details.discount),
      discounted_price: plan_details.discounted_price_days,
      discount_per: Number(plan_details.discount_percentage),
      special_tag: plan_details.special_tag
    });

    this.plansService.get_plan_features(plan_details.id).subscribe(
      response => {
        console.log(response);
        this.feature_response = response;
        this.feature_response.forEach((feature:any) => {
          if(feature.status == true) {
            if(this.f.controls[feature.id]) {
              this.f.removeControl(feature.id);
              this.f.addControl(feature.id, new FormControl(true));
            }
            else {
              this.f.addControl(feature.id, new FormControl(true));
            }
          }
          else {
            if(this.f.controls[feature.id]) {
              this.f.removeControl(feature.id);
              this.f.addControl(feature.id, new FormControl(false));
            }
            else {
              this.f.addControl(feature.id, new FormControl(false));
            }
          }
        })
        console.log(this.feature_response);
      },
      
      err => {
        console.log(err);
      }
    );

  }

  changeDiscStatus(event: any) {
    //console.log(event);
    if(event.target.value == '1') {
      this.discount_stat = true;
      this.EditPlanDetails.get('discounted_price')?.setValidators(Validators.required);
      this.EditPlanDetails.get('discount_per')?.setValidators(Validators.required);
    }
    else if (event.target.value == '0') {
      this.discount_stat = false;
      this.EditPlanDetails.get('discounted_price')?.clearValidators();
      this.EditPlanDetails.get('discount_per')?.clearValidators();
    }
    this.EditPlanDetails.get('discounted_price')?.updateValueAndValidity();
    this.EditPlanDetails.get('discount_per')?.updateValueAndValidity();
  }

  save_plan_details() {
    this.submitted = true;
    if (this.EditPlanDetails.invalid) {
      //console.log(this.EditPlanDetails);
      return;
    }
    //console.log(this.EditPlanDetails);
    this.plansService.update_property_plans(this.EditPlanDetails.value).subscribe(
      res => {
        //console.log(res);
        this.update_res = res;
        this.modalClose.nativeElement.click();
        this.toastr.success(this.update_res.message);
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([this.router.url]);
      },
      err => {
        console.log(err);
      }
    );
  }


}
