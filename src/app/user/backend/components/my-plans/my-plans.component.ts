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
          this.response = res;
          //console.log(this.response);
        },
        err => {  
          this.showLoadingIndicator = false;
          console.log(err);
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
    return this.rent_invoices;
  }

  getLetOutInvoicesLength() {
    this.let_out_invoices = this.response?.filter((item:any) => item.plan_type == 'Let Out');
    return this.let_out_invoices?.length;
  }

  getLetOutInvoices() {
    this.let_out_invoices = this.response?.filter((item:any) => item.plan_type == 'Let Out');
    return this.let_out_invoices;
  }

  viewInvoice(invoice_no: any) {
    this.router.navigate(['/invoice'], { queryParams: { 'invoice_no': invoice_no } });
  }

  moreDetails(plan_details: any) {
    //console.log(plan_details);
    this.plan_det = plan_details;
  }

}
