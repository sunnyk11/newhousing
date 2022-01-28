import { Component, OnInit } from '@angular/core';
import { LocalServiceProviderService } from 'src/app/user/backend/services/local-service-provider.service';
import { ToastrService } from 'ngx-toastr';
import { Pagination } from 'src/app/user/components/models/pagination.model';

@Component({
  selector: 'app-services-user-list',
  templateUrl: './services-user-list.component.html',
  styleUrls: ['./services-user-list.component.css']
})
export class ServicesUserListComponent implements OnInit {

  public submitted: boolean = false;
  public showLoadingIndicator: boolean =false;
  public p:number=0;
  public user_data:any={};
  public Pagination_data: Pagination;
  public user_length:number=0;

  constructor(private LocalServiceProviderService:LocalServiceProviderService,
    private toastr: ToastrService) { 
      this.Pagination_data = new Pagination();
    }

  ngOnInit(): void {
    this.getservice_user();
  }

  getservice_user(){
    this.showLoadingIndicator= true;
    this.LocalServiceProviderService.getservice_user().then(
      Pagination_data => {
        this.user_data=Pagination_data;
        //console.log(this.user_data);
        this.user_length=this.user_data.data.total;
        this.showLoadingIndicator=false;
      }, err => {
      }
    );
  }

  gotoPage(link_url: any) {
    this.showLoadingIndicator = true;
    this.LocalServiceProviderService.getpagination(link_url).then(Pagination_data => {
      this.showLoadingIndicator= false;
      this.user_data=Pagination_data;
      // this.user_list_length=this.user_list.data.data.length;
    });
  }

  delete_service_user(id: any) {
    this.showLoadingIndicator = true;
    let param = { id: id }
    this.LocalServiceProviderService.delete_service_user(param).pipe().subscribe(
      response => {
        this.showLoadingIndicator = false;;
        let data: any = response;
        let Message = data.message;
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
