import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalServiceProviderService } from '../../services/local-service-provider.service';
import { ToastrService } from 'ngx-toastr';
import { Pagination } from 'src/app/user/components/models/pagination.model';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {

  public submitted: boolean = false;
  public showLoadingIndicator: boolean =false;
  public service_data:any={};
  public p:number=0;
  public service_length:number=0;
  public Pagination_data: Pagination;

  Service_form = new FormGroup({
    service: new FormControl('', Validators.required)
  });

  constructor(
    private LocalServiceProviderService:LocalServiceProviderService,
    private toastr: ToastrService
    ) {
      this.Pagination_data = new Pagination(); }

  ngOnInit(): void {
    this.get_services();
  }
  onSubmit(){
    if(this.Service_form.invalid){
      this.submitted = true;
      }else{
        let param={data:this.Service_form.value}
        this.LocalServiceProviderService.service_create(param).subscribe(
          response => {
            let data:any=response;
            this.showLoadingIndicator = false;
            this.Service_form.reset();
            this.get_services();
            this.toastr.success('Service Create Successfully');
          },
          err => {
            this.showLoadingIndicator = false;
            let errorMessage:any = err.error.errors;
            this.toastr.error(errorMessage, 'Something Error', {
              timeOut: 3000,
            });
          }
        );
      }
  }
  // fetch services  
  get_services(){
    this.showLoadingIndicator= true;
    this.LocalServiceProviderService.getarea_service1().then(
      Pagination_data => {
        this.service_data=Pagination_data;
        console.log(this.service_data);
        this.service_length=this.service_data.data.total;
        this.showLoadingIndicator=false;
      }, err => {
      }
    );
  }
  
  gotoPage(link_url: any) {
    this.showLoadingIndicator = true;
    this.LocalServiceProviderService.getpagination(link_url).then(Pagination_data => {
      this.showLoadingIndicator= false;
      this.service_data=Pagination_data;
      // this.user_list_length=this.user_list.data.data.length;
    });
  }
  get f() {
    return this.Service_form.controls;
  }
  
  delete_service(service_id:any){
    console.log(service_id);
    this.showLoadingIndicator = true;
    let param = { service_id: service_id}
    this.LocalServiceProviderService.delete_service(param).pipe().subscribe(
      response=> {
        this.showLoadingIndicator =false;;
        let data:any=response;
        let Message =data.message;
        this.toastr.error(Message, 'Services', {
          timeOut: 3000,
        });
        this.get_services();
      },
      err => {
       this.showLoadingIndicator = false;
      }
    )
  }

}
