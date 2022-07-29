import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-flat-type',
  templateUrl: './product-flat-type.component.html',
  styleUrls: ['./product-flat-type.component.css']
})
export class ProductFlatTypeComponent implements OnInit {

  public flat_type:any={};
  private amenityArray:any = [];


  constructor(
    private CommonService: CommonService,
    private router:Router
    ) { }

  ngOnInit(): void {
    this.productcategory();
  }
  // fetch productcategory advance tab
  productcategory(){
    this.CommonService.getproductcategory({ param: null }).subscribe(
      response => {
        this.flat_type=response;
      }, err => { 
      }
    );
  } 
  on_search(flat_type:string){
    const url:any = this.router.createUrlTree(['/product-listing'],{queryParams:{'flat_type':flat_type}})
    window.open(url.toString(), '_blank')
  }

}
