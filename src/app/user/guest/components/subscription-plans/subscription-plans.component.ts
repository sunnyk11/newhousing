import { Component, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { PlansPageService } from '../../services/plans-page.service';

@Component({
  selector: 'app-subscription-plans',
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.css']
})
export class SubscriptionPlansComponent implements OnInit {

  value: number = 10000;
  options: Options = {
    floor: 5000,
    ceil: 50000,
    step: 100,
    animate: true,
    showSelectionBar: true,
    translate: (value: number, label): string => {
      return this.commaSeperated(value);
    }
  };

  expected_rent_value: number = 5000;
  exp_rent_options: Options = {
    floor: 5000,
    ceil: 50000,
    step: 500,
    animate: true,
    showSelectionBar: true,
    translate: (value: number, label): string => {
      return this.commaSeperated(value);
    }
  };

  public rent_response: any;
  public rent_feat_res: any;
  public myArray: any = [];
  public letout_response: any;
  public letout_feat_res: any;
  public myArray_lo: any = [];

  constructor(
    private plansPageService: PlansPageService
  ) { }

  ngOnInit(): void {
    this.getRentPlans();
    this.getRentFeatures();
    this.getLetOutPlans();
    this.getLetOutFeatures();
  }

  getRentPlans() {
    this.plansPageService.getRentPlans({ param: null }).subscribe(
      response => {
        this.rent_response = response;
        //console.log(response);
      }
    );
  }

  getRentFeatures() {
    this.plansPageService.getRentFeatures({ param: null }).subscribe(
      response => {
        this.rent_feat_res = response;
        //console.log(response);
        for (let feat_res in this.rent_feat_res) {
          //console.log(this.rent_feat_res[feat_res].feature_details);
          this.myArray = this.rent_feat_res[feat_res].feature_details.split(',');
          //console.log(this.myArray);
          this.rent_feat_res[feat_res].feature_details = this.myArray;
        }
        //console.log(this.rent_feat_res);
      }
    );
  }

  getLetOutPlans() {
    this.plansPageService.getLetOutPlans({ param: null }).subscribe(
      response => {
        this.letout_response = response;
        //console.log(response);
      }
    );
  }

  getLetOutFeatures() {
    this.plansPageService.getLetOutFeatures({ param: null }).subscribe(
      res => {
        this.letout_feat_res = res;
        for (let feat_res_lo in this.letout_feat_res) {
          //console.log(this.letout_feat_res[feat_res_lo].feature_details);
          this.myArray_lo = this.letout_feat_res[feat_res_lo].feature_details.split(',');
          //console.log(this.myArray_lo);
          this.letout_feat_res[feat_res_lo].feature_details = this.myArray_lo;
        }
        //console.log(this.letout_feat_res);
      },
      err => {
        console.log(err);
      }
    );
  }

  commaSeperated(e: any) {
    var t = (e = e ? e.toString() : "").substring(e.length - 3)
      , n = e.substring(0, e.length - 3);
    return "" !== n && (t = "," + t),
      n.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + t
  }

}
