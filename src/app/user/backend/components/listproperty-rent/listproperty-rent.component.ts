import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-listproperty-rent',
  templateUrl: './listproperty-rent.component.html',
  styleUrls: ['./listproperty-rent.component.css']
})
export class ListpropertyRentComponent implements OnInit {
  form_step1: FormGroup = new FormGroup({});
  form_step2: FormGroup = new FormGroup({});
  form_step3: FormGroup = new FormGroup({});
  form_step4: FormGroup = new FormGroup({});

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form_step1 = this._formBuilder.group({
      property_name: ['', Validators.required],
      property_type: ['', Validators.required],
      area_unit: ['', Validators.required],
      property_area: ['', Validators.required],
      bedrooms: ['', Validators.required],
      bathrooms: ['', Validators.required],
      balconies: ['', Validators.required],
      property_desc: ['', Validators.required]
    });

    this.form_step2 = this._formBuilder.group({
      address: ['', Validators.required],
      city: ['', Validators.required],
      locality: ['', Validators.required],
      pincode: ['', Validators.required],
      nearest_place: ['', Validators.required]
    });

    this.form_step3 = this._formBuilder.group({
      additional_rooms: ['', Validators.required],
      facing_towards: ['', Validators.required],
      year_built: ['', Validators.required],
      furnishings: ['', Validators.required],
      reserved_parking: ['', Validators.required],
      willing_to_rent: ['', Validators.required],
      agreement_type: ['', Validators.required],
      available_date: ['', Validators.required],
      notice_month: ['', Validators.required],
      agreement_duration: ['', Validators.required],
      property_floor: ['', Validators.required],
      total_floors: ['', Validators.required]
    });

    this.form_step4 = this._formBuilder.group({
      security_deposit: ['', Validators.required],
      expected_rent: ['', Validators.required],
      electricity_water: ['', Validators.required],
      price_negotiable: ['', Validators.required],
      tax_govt_charge: ['', Validators.required],
      maintenance_charge_status: ['', Validators.required],
      images: [''],
      video_link: ['']
    });
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      //return Math.round(value / 1000) + 'k';
      return value / 1000 + 'k';
    }
    return value;
  }
}
