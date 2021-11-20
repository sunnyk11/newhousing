import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {
  
  public category:any={};
  private amenityArray:any = [];

  searchForm = this.formBuilder.group({
    bathrooms: [''],
    bedrooms: [''],
    years: [''],
    area_unit: [''],
    search_type: ['Select Availability'],
    build_name: [''],
    type: [''],
    location: [''],
    city:[''],
    sliderControl: [[5000,50000000]]
  });

  constructor(
    private CommonService: CommonService,
    private formBuilder: FormBuilder,
    private router:Router
    ) { }

  ngOnInit(): void {
    this.productcategory();
  }
  // fetch productcategory advance tab
  productcategory(){
    this.CommonService.getproductcategory({ param: null }).subscribe(
      response => {
        this.category=response;
      }
    );
  } 
  on_search(type:string){
    this.searchForm.controls['type'].setValue(type);
    let data:any=this.searchForm.value;
    console.log(this.searchForm.value);
    const url:any = this.router.createUrlTree(['/product-listing'],{queryParams:{'category':type}})
    window.open(url.toString(), '_blank')
  }

}
