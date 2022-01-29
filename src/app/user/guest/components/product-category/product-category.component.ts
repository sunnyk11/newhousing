import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {
  
  public category:any={};
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
        this.category=response;
      }, err => { 
      }
    );
  } 
  on_search(type:string){
    //console.log(type);
    const url:any = this.router.createUrlTree(['/product-listing'],{queryParams:{'category':type}})
    window.open(url.toString(), '_blank')
  }

}
