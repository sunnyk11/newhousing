import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { PlansService } from '../../services/plans.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-plan',
  templateUrl: './add-plan.component.html',
  styleUrls: ['./add-plan.component.css']
})
export class AddPlanComponent implements OnInit {

  public submitted: boolean = false;
  public discount_stat: boolean = false;
  public feature_response: any;
  public PlanForm: any;  
  public clicked = false;

  constructor(private fb: UntypedFormBuilder,
    private router: Router,
    private plansService: PlansService,
    private toastr: ToastrService) {
      this.PlanForm = this.fb.group({
        plan_type: ['', Validators.required],
        planName: ['', Validators.required],
        actualPrice: ['', Validators.required],
        payment_type: ['', Validators.required],
        plan_status: ['', Validators.required],
        special_tag: ['', Validators.required],
        discount_status: ['', Validators.required],
        discountPrice: [],
        discount_per: [],
        features: this.fb.group([])
      });
     }

  ngOnInit(): void {
    this.plansService.get_all_features({ param:null }).subscribe(
      response => {
        //console.log(response);
        this.feature_response = response;
        this.feature_response.features.forEach((obj:any,index:any) => {
          this.f.addControl(obj.id, new UntypedFormControl(false));
        })
      },
      err => {
        console.log(err);
      }
    );
  }

  get g() {
    return this.PlanForm.controls;
  }

  get f() {
    return this.PlanForm.controls.features;
  }

  onSubmit() {
    this.submitted = true;
    if (this.PlanForm.invalid) {
      return;
    }
    //console.log(this.PlanForm);
    this.plansService.add_property_plan(this.PlanForm.value).subscribe(
      res => {
        //console.log(res);
        this.PlanForm.reset();
        this.toastr.success('Successfully created Plan');
        this.router.navigate(['/admin/view-plans']);
      },
      err => {
        console.log(err);
        this.PlanForm.reset();
      }
    );
  }

  changeDiscStatus(event: any) {
    //console.log(event);
    if(event.target.value == '1') {
      this.discount_stat = true;
      this.PlanForm.get('discountPrice')?.setValidators(Validators.required);
      this.PlanForm.get('discount_per')?.setValidators(Validators.required);
    }
    else if (event.target.value == '0') {
      this.discount_stat = false;
      this.PlanForm.get('discountPrice')?.clearValidators();
      this.PlanForm.get('discount_per')?.clearValidators();
    }
    this.PlanForm.get('discountPrice')?.updateValueAndValidity();
    this.PlanForm.get('discount_per')?.updateValueAndValidity();
  }

}
