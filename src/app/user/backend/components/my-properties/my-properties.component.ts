import { Component, OnInit } from '@angular/core';
import { MypropertiesService } from '../../services/myproperties.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { PlansServiceService } from '../../services/plans-service.service';
import { JwtService } from 'src/app/user/services/jwt.service';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PropertyCreditModalComponent } from './../property-credit-modal/property-credit-modal.component';
import { Pagination } from 'src/app/user/components/models/pagination.model';
import { ConfirmationmodalComponent } from '../../modals/confirmationmodal/confirmationmodal.component';

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
  public showLoadingIndicator_draft:boolean=false;
  public userEmail:any= null;
  public response_data: any;
  public Pagination_data: Pagination;

  private e:any;

  constructor(
    private MypropertiesService:MypropertiesService,
    private toastr: ToastrService,
    private PlansServiceService:PlansServiceService,
    private jwtService: JwtService,
    private dialog: MatDialog,
    private modalService: NgbModal,
    private router:Router
    ) {
      this.Pagination_data = new Pagination(); 
      this.MypropertiesService.myproperty_on().subscribe(
        message => {
          if (message == 'true') {
            this.agent_properties();
          }
        });
        this.MypropertiesService.draftproperty_on().subscribe(
          message => {
            if (message == 'true') {
              this.draft_properties();
            }
          });
      }

  ngOnInit(): void {
    this.agent_properties();
    this.draft_properties();
    this.userEmail = this.jwtService.getUserEmail();
  }
  // fetch agent_properties   
  agent_properties(){
    this.showLoadingIndicator= true;
    this.MypropertiesService.agent_properties().then(
      Pagination_data => {
        this.agentproperty=Pagination_data;
        this.product_length=this.agentproperty.data.total;
        this.showLoadingIndicator=false;
      }, err => {
      }
    );
  }
  // fetch draft_properties 
  draft_properties(){
    this.showLoadingIndicator= true;
    this.MypropertiesService.draft_properties().then(
      Pagination_data => {
        this.draftproperty=Pagination_data;
        this.draft_pro_length=this.draftproperty.data.total;
        this.showLoadingIndicator=false;
      }, err => {
      }
    );
  }
  
  gotoPage(link_url: any) {
    this.showLoadingIndicator = true;
    this.MypropertiesService.getpagination(link_url).then(Pagination_data => {
      this.showLoadingIndicator= false;
      this.agentproperty=Pagination_data;
      // this.user_list_length=this.user_list.data.data.length;
    });
  } 
  gotoPage_draft(link_url: any) {
    this.showLoadingIndicator_draft = true;
    this.MypropertiesService.getpagination(link_url).then(Pagination_data => {
      this.showLoadingIndicator_draft= false;
      this.draftproperty=Pagination_data;
      // this.user_list_length=this.user_list.data.data.length;
    });
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
    const modalRef = this.modalService.open(ConfirmationmodalComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        // keyboard: false,
        backdrop: 'static'
      });
      let data = {
        property_id:id,
        data_mode:'Property'
      }
      modalRef.componentInstance.data = data;
  }
  delete_draft(id:number){
   
    this.showLoadingIndicator = true;
    const modalRef = this.modalService.open(ConfirmationmodalComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        // keyboard: false,
        backdrop: 'static'
      });
      let data = {
        property_id:id,
        data_mode:'Property-draft'
      }
      modalRef.componentInstance.data = data;
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
