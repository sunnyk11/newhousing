import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoicePageService } from 'src/app/user/guest/services/invoice-page.service';
import { ToWords } from 'to-words';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { environment } from 'src/environments/environment';
import { InvoiceDetailsService } from '../../services/invoice-details.service';

const toWords = new ToWords();
@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.css']
})
export class InvoiceDetailsComponent implements OnInit {
  @ViewChild('htmlData') htmlData!: ElementRef;

  public showLoadingIndicator: boolean = false;

  public invoice_id: any;
  private response: any;
  public toll_free=environment.toll_free;
  public inv_response: any;
  public sgst_amount: any;
  public cgst_amount: any;
  public plan_aggrement_price: any;
  public rent_aggrement_price:number=0;
  private order_details: any;
  public total_amount: any;
  public ord_details: any;
  public invoice_data: any;
  public address: any;
  public product_data: any;
  public percentage_amount: any;
  public total_amount_owner: any;
  public amount_words: any;
  public user_name: any;
  public address1: any;
  public address2: any;
  public address3: any;
  public address4: any;

  constructor(
    private route: ActivatedRoute,
    private plansPageService: InvoiceDetailsService,
    private router: Router,
    private invoicePageService: InvoicePageService,) {
      if(this.route.snapshot.queryParams['invoice_no'].length>3){
        this.invoice_id = this.route.snapshot.queryParams['invoice_no'];     
      } else {
        this.redirect_to_previous_page();
      }
  }

  ngOnInit(): void {

    this.showLoadingIndicator = true;
    this.invoice_id = this.route.snapshot.queryParams['invoice_no'];

    this.invoicePageService.getInvoiceData().subscribe(
      data => {
        this.invoice_data = data;
        this.address = this.invoice_data.address.split(",");
        this.address1 = this.address[0];
        this.address2 = this.address[1];
        this.address3 = this.address[2];
        this.address4 = this.address[3];
        this.showLoadingIndicator = false;
      },
      err => {
        this.showLoadingIndicator = false;
        // console.log(err);
      }
    );
    this.showLoadingIndicator = true;
    this.plansPageService.getInvoiceDetails(this.invoice_id).subscribe(
      res => {
        let data:any=res;
        // console.log(data);
        this.response =  data.data;
        if(this.response  != null){
          this.user_name = data.data.user_detail.name;  
          this.inv_response = this.response;
          // console.log(this.response);
                   
         for(let i=0; i< this.response.plan_features?.features.length; i++){
          if(this.response.plan_features?.features[i].feature_name=='Rent Agreement'){
            if(this.response.plan_features?.features[i].feature_value>0){
               this.rent_aggrement_price=this.response.plan_features?.features[i].feature_value;         
            }
          }
        }
          this.plan_aggrement_price= this.inv_response.plan_price + this.rent_aggrement_price;
          this.sgst_amount = Math.round((this.invoice_data?.sgst * this.plan_aggrement_price) / 100);
          this.cgst_amount = Math.round((this.invoice_data?.cgst * this.plan_aggrement_price) / 100);

          if (this.inv_response.plan_type == 'Rent') {

                this.order_details = this.inv_response.order_details;
                this.ord_details = this.order_details;

                
                this.product_data = this.inv_response?.order_details?.product_details;
                this.product_data = this.product_data;

                  if (this.ord_details.maintenance_charge) {
                    this.total_amount_owner = this.ord_details.expected_rent + this.ord_details.security_deposit + this.ord_details.maintenance_charge;
                    if(this.inv_response.book_property){
                      let price:any;
                      price=this.total_amount_owner*this.inv_response.payment_percentage/100;
                      this.percentage_amount=this.total_amount_owner-price;
                      this.amount_words = toWords.convert(this.total_amount_owner-this.percentage_amount);
                       }else{
                      this.total_amount = this.plan_aggrement_price + this.sgst_amount + this.cgst_amount + this.ord_details.expected_rent + this.ord_details.security_deposit + this.ord_details.maintenance_charge;
                      this.amount_words = toWords.convert(this.total_amount);
                    }
                  }
                  else {
                    this.total_amount_owner = this.ord_details.expected_rent + this.ord_details.security_deposit;
                    if(this.inv_response.book_property){
                      let price:any;
                      price=this.total_amount_owner*this.inv_response.payment_percentage/100;
                      this.percentage_amount=this.total_amount_owner-price;
                      this.amount_words = toWords.convert(this.total_amount_owner-this.percentage_amount);
                     }else{
                    this.total_amount = this.plan_aggrement_price + this.sgst_amount + this.cgst_amount + this.ord_details.expected_rent + this.ord_details.security_deposit;
                    this.amount_words = toWords.convert(this.total_amount);
                    }
                  }
          }
          else if (this.inv_response.plan_type == 'Let Out') {
            this.total_amount = this.plan_aggrement_price + this.sgst_amount + this.cgst_amount;
            this.amount_words = toWords.convert(this.total_amount);
          }
          this.showLoadingIndicator = false;
        }else{
          this.redirect_to_previous_page();
        }
      },
      err => {
        this.showLoadingIndicator = false;
      }
    );

  }

  generatePDF() {
    if (screen.width < 1024) {
      document.getElementById("viewport")?.setAttribute("content", "width=1200px");
    }
    // let DATA = this.htmlData?.nativeElement;
    const data = document.getElementById('htmlData')!;
    let html2canvasOptions = {
      allowTaint: true,
      removeContainer: true,
      backgroundColor: null,
      imageTimeout: 15000,
      logging: true,
      scale: 2,
      useCORS: true
    };

    html2canvas(data).then(canvas => {

      const contentDataURL = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let pdf = new jsPDF('p', 'mm', 'a4', true); // A4 size page of PDF
      let position = 0;

      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight, undefined,'FAST');
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight, undefined,'FAST')
        heightLeft -= pageHeight;
      }
      pdf.save('invoice.pdf'); // Generated PDF

      if(screen.width < 1024) {
        document.getElementById('viewport')?.setAttribute("content", "width=device-width, initial-scale=1");
      }

    });

    /*  html2canvas(data).then(canvas => {
 
       let fileWidth = 208;
       let fileHeight = canvas.height * fileWidth / canvas.width;
 
       const FILEURI = canvas.toDataURL('image/png')
       let PDF = new jsPDF('p', 'mm', 'a4');
       let position = 0;
       PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)
 
       PDF.save('invoice.pdf');
     }); */
  }

  redirect_to_previous_page(): void {
    this.router.navigate(['/admin/property-list'])
  }

}
