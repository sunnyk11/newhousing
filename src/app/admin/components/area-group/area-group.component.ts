import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AreaListService } from '../../services/area-list.service';
import { Pagination } from 'src/app/user/components/models/pagination.model';

@Component({
  selector: 'app-area-group',
  templateUrl: './area-group.component.html',
  styleUrls: ['./area-group.component.css']
})
export class AreaGroupComponent implements OnInit {

  public showLoadingIndicator: boolean = false;
  public Pagination_data: Pagination;
  public group_data:any;
  public group_data_length:number=0;
  public group_details:any
  

  constructor(private AreaListService:AreaListService,
    private toastr: ToastrService) { 
      this.Pagination_data = new Pagination();
    }

  ngOnInit(): void {  
    this.get_group_list();   
   
  }
  get_group_list(){
    this.showLoadingIndicator= true;
    this.AreaListService.get_group_list({ param: null }).then(
      Pagination_data => {
        this.group_data=Pagination_data;
        this.group_data_length=this.group_data.data.total;
        this.showLoadingIndicator= false;
      }, err => {
      }
    );
  }
  
  viewDetails(data: any) {
    this.group_details=data;
   
  }
  
  delete_popup(data: any) {
    this.group_details=data;
  }
  
  delete_group(id:any){
    this.showLoadingIndicator = true;
    let param = { group_id: id}
    this.AreaListService.delete_group(param).pipe().subscribe(
      response=> {
        this.showLoadingIndicator =false;;
        let data:any=response;
        let Message =data.message;
        this.toastr.error(Message, 'Group', {
          timeOut: 3000,
        });
        this.get_group_list();
      },
      err => {
       this.showLoadingIndicator = false;
      }
    )
  }

}


