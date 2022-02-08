import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlansServiceService } from '../../services/plans-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-plan-apply',
  templateUrl: './plan-apply.component.html',
  styleUrls: ['./plan-apply.component.css']
})
export class PlanApplyComponent implements OnInit {

  public invoice_id: any;
  public product_id: any;
  public response: any;
  public pro_response: any;
  public diff_amount: any;
  public success_property: boolean=false;
  public success_invoice: boolean=false;
  public invoice_price:any;
  public product_price:any;
  public different_price:any;

  constructor(
    private route: ActivatedRoute,
    private PlansServiceService: PlansServiceService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.invoice_id = this.route.snapshot.queryParams['invoice_no'];
    this.product_id = this.route.snapshot.queryParams['product_id'];
    let param={invoiceID:this.invoice_id,productID: this.product_id}
    this.PlansServiceService.product_invoice_Details(param).subscribe(
      response => {
        let res:any=response;
        this.response = res.order_details;
        this.pro_response = res.property_details;
         this.product_price=this.pro_response?.expected_rent;
        this.invoice_price=this.response?.expected_rent;
        this.different_price=this.invoice_price - this.product_price;
      },
      err => {
      }
    );
  }
  property_live(property_price:any) {
    let param={invoice_id:this.invoice_id,product_id: this.product_id,property_price: property_price}
    this.PlansServiceService.updateInvoiceDetails(param).subscribe(
      response => {
        this.success_invoice = true;
        this.toastr.info("CONGRATS!!! Your property is now Live");
        this.router.navigate(['agent/my-properties']);
      },
      err => {
      }
    );
  }

}
