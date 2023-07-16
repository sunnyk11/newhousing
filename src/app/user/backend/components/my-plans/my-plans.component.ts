import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/user/services/jwt.service';
import { MyPlansPageService } from '../../services/my-plans-page.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-plans',
  templateUrl: './my-plans.component.html',
  styleUrls: ['./my-plans.component.css']
})
export class MyPlansComponent implements OnInit {

  public showLoadingIndicator: boolean = false;
  public userEmail: string = '';
  public response: any;
  public plan_det: any;
  public rent_invoices: any;
  public let_out_invoices: any;
  public let_out_invoices_length:number=0;
  public rent_invoices_length:number=0;

  constructor(private jwtService: JwtService,
    private myPlansService: MyPlansPageService,
    private router: Router) { }

  ngOnInit(): void {
    let val = this.jwtService.getToken();
    
    if(val) {
      this.userEmail = this.jwtService.getUserEmail();
      this.showLoadingIndicator = true;
      this.myPlansService.getAllUserInvoices(this.userEmail).subscribe(
        res => {
          this.showLoadingIndicator = false;
          let data:any=res;
          this.response = data;
          // console.log(this.response);
          this.let_out_invoices=this.response.let_out;
          this.let_out_invoices_length=this.response.let_out.length;
          this.rent_invoices=this.response.rent_out;
          this.rent_invoices_length=this.response.rent_out.length;
        },
        err => {  
          this.showLoadingIndicator = false;
        }
      );
    }
  }

  getRentInvoicesLength() {
    this.rent_invoices = this.response?.filter((item:any) => item.plan_type == 'Rent');
    return this.rent_invoices?.length;
  }

  getRentInvoices() {
    this.rent_invoices = this.response?.filter((item:any) => item.plan_type == 'Rent');
    // console.log(this.rent_invoices);
    return this.rent_invoices;
  }

  getLetOutInvoicesLength() {
    this.let_out_invoices = this.response?.filter((item:any) => item.plan_type == 'Let Out');
    return this.let_out_invoices?.length;
  }

  getLetOutInvoices() {
    this.let_out_invoices = this.response?.filter((item:any) => item.plan_type == 'Let Out');
    // console.log(this.let_out_invoices);
    return this.let_out_invoices;
  }

  viewInvoice(invoice_no: any) {
    const url:any = this.router.createUrlTree(['/invoice'], { queryParams: { 'invoice_no': invoice_no } })
      window.open(url.toString(), '_blank')
  }
  
  book_Invoice(invoice_no: any) {
    const url:any = this.router.createUrlTree(['/book-property'],{ queryParams: { 'invoice_no': invoice_no }})
      window.open(url.toString(), '_blank')
  }

  moreDetails(plan_details: any) {
    this.plan_det = plan_details;
  }
  
  navigate(id:number,name:string){
    const url:any = this.router.createUrlTree(['/product-preview'],{queryParams:{'id':id,'name':name}})
      window.open(url.toString(), '_blank')
  }

}
