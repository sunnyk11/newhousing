import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { PlansServiceService } from '../../services/plans-service.service';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

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
        console.log(response);
        this.response = response;
        this.inv_response = this.response[0];
        this.gst_amount = (18 * this.response[0].plan_price) / 100;
        this.total_amount = this.response[0].plan_price + this.gst_amount;
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
              ['Plan Name: ', this.inv_response.plan_name],
              ['GST@18%: ', this.gst_amount],
              ['Total Amount: ', this.total_amount]
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
