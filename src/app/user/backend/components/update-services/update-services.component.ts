import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalServiceProviderService } from '../../services/local-service-provider.service';
import { ToastrService } from 'ngx-toastr';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-services',
  templateUrl: './update-services.component.html',
  styleUrls: ['./update-services.component.css']
})
export class UpdateServicesComponent implements OnInit {
  
  public showLoadingIndicator:boolean=true;
  public submitted: boolean = false;
  public service_id:any={};

  Service_form = new FormGroup({
    id: new FormControl('', Validators.required),
    service: new FormControl('', Validators.required),
    service_id: new FormControl('', Validators.required)
  });
  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private LocalServiceProviderService:LocalServiceProviderService,
    private toastr: ToastrService) { 
      this.route.queryParams.subscribe((params) => { 
        if(params.id.length>0){
          this.service_id = params.id;
          this.showLoadingIndicator =true;
          this.service_details(this.service_id);
        }else{
          this.redirect_to_service();
        }
      });
    }

  ngOnInit(): void {
  }
  
  get f() {
    return this.Service_form.controls;
  }
  service_details(service_id:any){
    this.showLoadingIndicator =true;
    let param = { service_id: service_id }
    this.LocalServiceProviderService.sevice_get_id(param).subscribe(
      response => {
        let data:any=response;
        if(data.data == null){
          this.redirect_to_service();
        }else{
          this.Service_form.patchValue({
            id:data.data.id,
            service:data.data.service_name,
            service_id:data.data.service_id,
          });
        }
      });
  }
  onSubmit(){
    if(this.Service_form.invalid){
      this.submitted = true;
      }else{
        let param={data:this.Service_form.value}
        this.LocalServiceProviderService.service_update(param).subscribe(
          response => {
            let data:any=response;
            this.showLoadingIndicator = false;
            this.toastr.success('Services Updated');
            this.router.navigate(['/agent/services-list']);   
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
    redirect_to_service(): void {
      this.router.navigate(['/agent/services-list'])
    }

}
