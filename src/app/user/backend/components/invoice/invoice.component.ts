import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlansServiceService } from '../../services/plans-service.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  public invoice_id: any;
  public inv_response: any;
  public gst_amount: any;
  public total_amount: any;
  public ord_details: any;
  
  private response: any;
  private order_details: any;

  constructor(
    private route: ActivatedRoute,
    private PlansServiceService:PlansServiceService
    ) { }

  ngOnInit(): void {
    this.invoice_id = this.route.snapshot.queryParams['invoice_no'];
    this.PlansServiceService.getInvoiceDetails(this.invoice_id).subscribe(
      response => {
        //console.log(response);
        this.response = response;
        this.inv_response = this.response[0];
        this.gst_amount = (18 * this.response[0].plan_price) / 100;
        this.total_amount = this.response[0].plan_price + this.gst_amount;
      }
    );
  }
  generatePDF() {
    
  }

}
