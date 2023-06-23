import { Component, OnInit } from '@angular/core';
import { MypropertiesPageService } from '../../services/myproperties-page.service';
import { JwtService } from 'src/app/user/services/jwt.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-my-properties',
  templateUrl: './my-properties.component.html',
  styleUrls: ['./my-properties.component.css']
})
export class MyPropertiesComponent implements OnInit {

  public showLoadingIndicator: boolean = false;

  private userEmail: string = '';
  public rent_property_data: any;
  public property_det: any;
  public purchased_property_length:number=0;
  public book_property_length:number=0;

  constructor(
    private propertiesService: MypropertiesPageService,
    private jwtService: JwtService,private titleService: Title,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('My Properties');
    let val = this.jwtService.getToken();
    if (val) {
      this.userEmail = this.jwtService.getUserEmail();
    }
    this.get_rented_properties();
  }

  get_rented_properties() {
    this.showLoadingIndicator = true;
    this.propertiesService.get_rent_properties(this.userEmail).subscribe(
      res => {
        this.showLoadingIndicator = false;
        this.rent_property_data = res;
        if(this.rent_property_data?.book_property){
          this.book_property_length=this.rent_property_data?.book_property?.length;
        }
        this.purchased_property_length=this.rent_property_data?.purchased_property?.length;
      },
      err => {
        this.showLoadingIndicator = false;
        console.log(err);
      }
    );
  }
  
  product_preview(id:number,name:string){
    const url:any = this.router.createUrlTree(['/product-preview'],{queryParams:{'id':id,'name':name}})
      window.open(url.toString(), '_blank')
  }
  
  viewInvoice(invoice_no: any) {
    const url:any = this.router.createUrlTree(['/invoice'],{ queryParams: { 'invoice_no': invoice_no }})
      window.open(url.toString(), '_blank')
  }
  
  book_Invoice(invoice_no: any) {
    const url:any = this.router.createUrlTree(['/book-property'],{ queryParams: { 'invoice_no': invoice_no }})
      window.open(url.toString(), '_blank')
  }
  remaining_payment(invoice_no: any) {
    const url:any = this.router.createUrlTree(['/remaining-payment-summery'],{ queryParams: { 'invoice_no': invoice_no }})
      window.open(url.toString(), '_blank')
  }
  moreDetails(property_details: any) {
    console.log(property_details);
    this.property_det = property_details;
  }

}
