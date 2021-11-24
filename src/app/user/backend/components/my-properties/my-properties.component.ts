import { Component, OnInit } from '@angular/core';
import { MypropertiesService } from '../../services/myproperties.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

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

  private e:any;

  constructor(
    private MypropertiesService:MypropertiesService,
    private toastr: ToastrService,
    private router:Router
    ) { }

  ngOnInit(): void {
    this.agent_properties();
    this.draft_properties();
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

  navigate(id:string){
    this.router.navigate(['/update-property-rent'],{queryParams:{id:id}})
  }

}
