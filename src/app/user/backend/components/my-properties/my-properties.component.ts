import { Component, OnInit } from '@angular/core';
import { MypropertiesService } from '../../services/myproperties.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { PlansServiceService } from '../../services/plans-service.service';
import { JwtService } from 'src/app/user/services/jwt.service';
import { MatDialog } from '@angular/material/dialog';
import { PropertyCreditModalComponent } from './../property-credit-modal/property-credit-modal.component';

@Component({
  selector: 'app-my-properties',
  templateUrl: './my-properties.component.html',
  styleUrls: ['./my-properties.component.css']
})
export class MyPropertiesComponent implements OnInit {
  public ftpstring=environment.ftpURL;
  public p:number=0;
  public d:number=0;
  public agentproperty:any=[];
  public product_length:number=0;
  public draftproperty:any=[];
  public draft_pro_length:number=0;
  public showLoadingIndicator:boolean=false;
  public userEmail:any= null;
  public response_data: any;

  private e:any;

  constructor(
    private MypropertiesService:MypropertiesService,
    private toastr: ToastrService,
    private PlansServiceService:PlansServiceService,
    private jwtService: JwtService,
    private dialog: MatDialog,
    private router:Router
    ) { }

  ngOnInit(): void {
    this.agent_properties();
    this.draft_properties();
    this.userEmail = this.jwtService.getUserEmail();
  }
  // fetch agent_properties 
  agent_properties(){
    this.showLoadingIndicator =true;
    this.MypropertiesService.agent_properties({ param: null }).subscribe(
      response => {
        this.agentproperty=response;
        this.product_length=this.agentproperty.data.length;
        this.showLoadingIndicator =false;
      }
    );
  }
  // fetch draft_properties 
  draft_properties(){
    this.showLoadingIndicator =true;
    this.MypropertiesService.draft_properties({ param: null }).subscribe(
      response => {
        this.draftproperty=response;
        this.showLoadingIndicator =false;
        this.draft_pro_length=this.draftproperty.data.length;
      }
    );
  }
  price_comma(value:number):void{
    this.e=value;
    var t = (this.e = this.e ? this.e.toString() : "").substring(this.e.length - 3)
    , n = this.e.substring(0, this.e.length - 3);
  return "" !== n && (t = "," + t),
    n.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + t
  }
  delete_property(id:number){
    this.showLoadingIndicator = true;
    let param = { product_id: id}
    this.MypropertiesService.property_delete(param).subscribe(
      response => {
        this.showLoadingIndicator =false;
        let data:any=response;
        let Message =data.message;
        this.toastr.error(Message, 'Property', {
          timeOut: 3000,
        });
        this.agent_properties();
      }
    );
  }
  delete_draft(id:number){
    this.showLoadingIndicator = true;
    let param = { product_id: id}
    this.MypropertiesService.property_delete(param).subscribe(
      response => {
        this.showLoadingIndicator =false;;
        let data:any=response;
        let Message =data.message;
        this.toastr.error(Message, 'Draft Property', {
          timeOut: 3000,
        });
        this.draft_properties();
      }
    );
  }
  checkCredits(product_id:any, product_price:any){
     this.showLoadingIndicator = true;
     this.PlansServiceService.getUserInvoices(this.userEmail).subscribe(
      response => {
        this.response_data=response;
        const dialogRef = this.dialog.open(PropertyCreditModalComponent, {
          data: {
            response: this.response_data,
            product_id: product_id,
            product_price: product_price
          }
        }); 
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        this.showLoadingIndicator = false;
      }
     );
  }
  navigate_sales(id:any){
    this.router.navigate(['/update-property-sales'],{queryParams:{id:id}})
  }
  navigate_rent(id:any){
    this.router.navigate(['/update-property-rent'],{queryParams:{id:id}})
  }
  
  sub_navigate(id:number,name:string,city:string){
    const url:any = this.router.createUrlTree(['/product-details'],{queryParams:{'id':id,'name':name,'city':city}})
    window.open(url.toString(), '_blank')
  }
  live_navigate(){
    this.toastr.warning('Your Property is not live', 'Property', {
      timeOut: 3000,
    });

  }

}
