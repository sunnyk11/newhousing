import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserListService } from '../../services/user-list.service';
import { Pagination } from 'src/app/user/components/models/pagination.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  public user_list:any;
  public user_list_length:any;
  
  public Pagination_data: Pagination;

  public p:number=0;
  public showLoadingIndicator:boolean=false;

  constructor(private toastr: ToastrService,
    private UserListService:UserListService) {
      this.Pagination_data = new Pagination();   }

  ngOnInit(): void {
    this.get_userlist();
  }
  // fetch user details 
  get_userlist(){
    this.showLoadingIndicator= true;
    this.UserListService.get_all_user().then(
      Pagination_data => {
        this.user_list=Pagination_data;
        this.user_list_length=this.user_list.data.total;
        this.showLoadingIndicator= false;
      }, err => {
      }
    );
  }
  
  gotoPage(link_url: any) {
    this.showLoadingIndicator = true;
    this.UserListService.getpagination(link_url).then(Pagination_data => {
      this.showLoadingIndicator= false;
      this.user_list=Pagination_data;
      // this.user_list_length=this.user_list.data.data.length;
    });
  } 
    user_status_changes(id:any){
    let param = { user_id: id}
    this.UserListService.user_status_changes(param).subscribe(
      response => {
        this.showLoadingIndicator =false;
        let data:any=response;
        this.toastr.success('Status Updated', 'User', {
          timeOut: 3000,
        });
        this.get_userlist();
      }
    );
  }
  
  delete_user_bank(id:any){
    this.showLoadingIndicator =true;
    let param = { user_id: id}
    this.UserListService.delete_user(param).subscribe(
      response => {
        let data:any=response;
        this.get_userlist();
        this.toastr.error('Delete Successfully', 'User details', {
          timeOut: 3000,
        });
        this.showLoadingIndicator =false;
      }
    );
  }

}
