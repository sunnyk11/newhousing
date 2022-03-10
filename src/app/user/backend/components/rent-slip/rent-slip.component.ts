import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { ToWords } from 'to-words';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { PlansServiceService } from '../../services/plans-service.service';


const toWords = new ToWords();

@Component({
  selector: 'app-rent-slip',
  templateUrl: './rent-slip.component.html',
  styleUrls: ['./rent-slip.component.css']
})
export class RentSlipComponent implements OnInit {
  public product_id:any;
  public property_details:any;
  public security_dep_amount:any;
  public total_amount_owner:any;

  @ViewChild('htmlData') htmlData!: ElementRef;

  public showLoadingIndicator: boolean = false;

  constructor(
    private PlansServiceService:PlansServiceService,
    private route:ActivatedRoute,
    private router:Router) { 
    this.route.queryParams.subscribe((params) => {
      this.showLoadingIndicator=true;
      if(params.product_id && params.product_id != null){
        this.product_id=params.product_id;
        this.property_rent_slip(this.product_id);
      } else {
        this.router.navigate(['/agent/my-properties']);
      }
    });
  }

  ngOnInit(): void {
    this.showLoadingIndicator=true;
  }
  
property_rent_slip(property_id:any){
  // console.log(property_id)
  let param={property_id: property_id}
  this.PlansServiceService.property_rent_slip(param).subscribe(
    response => {
      let data:any=response;
      if(data.data ==null){
        this.router.navigate(['/agent/my-properties']);
      }else{
        this.property_details=data.data;
        this.security_dep_amount = Number(this.property_details.expected_rent) * Number(this.property_details.security_deposit);
        this.total_amount_owner =  Number(this.security_dep_amount) + Number(this.property_details.maintenance_charge);
        this.showLoadingIndicator=false;
      }
 
    },
    err => {
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
      pdf.save('Rent_slip.pdf'); // Generated PDF

      if(screen.width < 1024) {
        document.getElementById('viewport')?.setAttribute("content", "width=device-width, initial-scale=1");
      }

    });
  }
  
  viewInvoice(invoice_no: any) {
    const url:any = this.router.createUrlTree(['/invoice'],{queryParams:{'invoice_no': invoice_no}})
    window.open(url.toString(), '_blank')
  }
  
  my_property() {
    this.router.navigate(['/agent/my-properties']);
  }

}
