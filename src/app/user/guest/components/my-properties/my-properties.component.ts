import { Component, OnInit } from '@angular/core';
import { MypropertiesPageService } from '../../services/myproperties-page.service';
import { JwtService } from 'src/app/user/services/jwt.service';
import { Router } from '@angular/router';

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

  constructor(
    private propertiesService: MypropertiesPageService,
    private jwtService: JwtService,
    private router: Router
  ) { }

  ngOnInit(): void {
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
        console.log(res);
        this.rent_property_data = res;
      },
      err => {
        this.showLoadingIndicator = false;
        console.log(err);
      }
    );
  }
  
  viewInvoice(invoice_no: any) {
    this.router.navigate(['/invoice'], { queryParams: { 'invoice_no': invoice_no } });
  }

  moreDetails(property_details: any) {
    //console.log(property_details);
    this.property_det = property_details;
  }

}
