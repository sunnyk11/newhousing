import { Component, OnInit } from '@angular/core';
import { LocalServiceProviderService } from '../../services/local-service-provider.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-service-user-list',
  templateUrl: './service-user-list.component.html',
  styleUrls: ['./service-user-list.component.css']
})
export class ServiceUserListComponent implements OnInit {
  
  public submitted: boolean = false;
  public showLoadingIndicator: boolean =false;
  public p:number=0;
  public search_data:any={};

 
  constructor(
    private LocalServiceProviderService:LocalServiceProviderService,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {  
    this.getservice_user();
  }
  getservice_user(){
    this.showLoadingIndicator = true;
    this.LocalServiceProviderService.getservice_user({ param: null }).pipe().subscribe(
      response=> {
        console.log(response);
        this.search_data=response;
        this.showLoadingIndicator = false;
      },
      err => {
       this.showLoadingIndicator = false;
      }
    )

  }
    delete_service_user(id:any){
    this.showLoadingIndicator = true;
    let param = { id: id}
    this.LocalServiceProviderService.delete_service_user(param).pipe().subscribe(
      response=> {
        this.showLoadingIndicator =false;;
        let data:any=response;
        let Message =data.message;
        this.toastr.error(Message, 'User', {
          timeOut: 3000,
        });
        this.getservice_user();
      },
      err => {
       this.showLoadingIndicator = false;
      }
    )
  }
}
