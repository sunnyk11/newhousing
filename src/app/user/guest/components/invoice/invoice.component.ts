import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlansPageService } from '../../services/plans-page.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  public invoice_id: any;
  private response: any;
  public inv_response: any;
  public gst_amount: any;
  private order_details: any;
  public total_amount: any;
  public ord_details: any;

  constructor(
    private route: ActivatedRoute,
    private plansPageService: PlansPageService) { }

  ngOnInit(): void {

    this.invoice_id = this.route.snapshot.queryParams['invoice_no'];
    this.plansPageService.getInvoiceDetails(this.invoice_id).subscribe(
      res => {
        //console.log(res);
        this.response = res;
        this.inv_response = this.response[0];
        this.gst_amount = (18 * this.response[0].plan_price) / 100;

        if (this.inv_response.plan_type == 'rent') {
          this.plansPageService.getRentOrderDetails(this.inv_response.order_id).subscribe(
            res => {
              this.order_details = res;
              this.ord_details = this.order_details[0];
              //console.log(this.order_details);

              if (this.ord_details.maintenance_charge) {
                this.total_amount = this.inv_response.plan_price + this.gst_amount + this.ord_details.expected_rent + this.ord_details.security_deposit + this.ord_details.maintenance_charge;
              }
              else {
                this.total_amount = this.inv_response.plan_price + this.gst_amount + this.ord_details.expected_rent + this.ord_details.security_deposit;
              }
            },
            err => {

            }
          );
        }
      }
    );
  }

  generatePDF() {
    var docDefinition = {
      content: [
        {
          text: 'Invoice',
          style: 'header'
        },
        {
          style: 'tableExample',
          table: {
            body: [
              ['Invoice No: ', this.invoice_id],
              ['Order ID: ', this.inv_response.order_id],
              ['Payment Status: ', this.inv_response.payment_status],
              ['Plan Price: ', this.inv_response.plan_price],
              ['User Email: ', this.inv_response.user_email],
              ['Plan Name: ', this.inv_response.plan_name]
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true
        }
      },
    };

    pdfMake.createPdf(docDefinition).open();
  }

}
