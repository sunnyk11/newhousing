import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlansPageService } from '../../services/plans-page.service';
import { InvoicePageService } from '../../services/invoice-page.service';
import { ProductPageService } from '../../services/product-page.service';
import { ToWords } from 'to-words';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { JwtService } from 'src/app/user/services/jwt.service';
import { environment } from 'src/environments/environment';
import { GtmserviceService } from '../../services/gtmservice.service';
import { UserLogsService } from '../../services/user-logs.service';


const toWords = new ToWords();

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

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
  public invoice_name:any;
  public usertype_data:any; 
   public user_id_data:any;

  constructor(
    private route: ActivatedRoute,
    private plansPageService: PlansPageService,
    private router: Router,
    private jwtService: JwtService,
    private UserLogsService:UserLogsService,
    private gtmService: GtmserviceService,
    private invoicePageService: InvoicePageService,
    private productService: ProductPageService) {
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
                  this.sendDataToGTM();
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

  sendDataToGTM()  {
    if(this.jwtService.getToken()){
      this.user_id_data=this.jwtService.getUserId();
      if(this.jwtService.getUserType()==5){
        this.usertype_data='Renter';
      }else if(this.jwtService.getUserType()==4){
        this.usertype_data='Property Owner';
      }else if(this.jwtService.getUserType()==11){
        this.usertype_data='Admin';
      }else if(this.jwtService.getUserType()==8){
        this.usertype_data='Internal User';
      }else{
        this.usertype_data='External User';
      }
    }else{
      this.usertype_data='Guest user';
      this.user_id_data='Guest User'
    }

    const encodedUrl = this.router.url.toString().replace(/ /g, '%20');
    const finalUrl = encodedUrl.toString().replace(/&/g, '%26'); 
    if(this.inv_response?.book_property == null && this.inv_response?.plan_type =='Rent'){
      this.invoice_name='Tax INVOICE';
    }else if(this.inv_response?.book_property == null && this.inv_response?.plan_type =='Rent'){
      this.invoice_name='Remaining Amount';
    }
   
    const data = {
      event: 'dataLayer',
        property_id:this.inv_response?.order_details?.property_id,
        property_price:this.inv_response?.order_details?.expected_rent,
        property_security:this.inv_response?.order_details?.security_deposit,
        property_maintenance:this.inv_response?.order_details?.maintenance_charge,
        invoice_type:this.inv_response?.plan_type,
        invoice_number:this.inv_response?.invoice_no,
        invoice_name:this.invoice_name,
        invoice_status:this.inv_response?.payment_status,
        total_amount:this.total_amount,
        // property_url: finalUrl,
        // page_name:'Invoice Page',
      action: 'Onload Action',
      label: 'Invoice page',
      page_name:'Invoice Page',
      user_id: this.user_id_data,
      user_type:this.usertype_data,
      page_url:finalUrl,
      site_type:this.UserLogsService.getDeviceInfo(),
      // Additional data properties as needed
    };

    this.gtmService.pushToDataLayer(data);
    console.log(data);
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

  navigate_plans() {
    this.router.navigate(['/agent/my-plans'])
  }
  redirect_to_previous_page(): void {
    this.router.navigate(['/plans'])
  }

}
