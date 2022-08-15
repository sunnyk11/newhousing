import { Component, OnInit,ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AreaListService } from '../../services/area-list.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router,ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-update-sub-locality',
  templateUrl: './update-sub-locality.component.html',
  styleUrls: ['./update-sub-locality.component.css']
})
export class UpdateSubLocalityComponent implements OnInit {
  
  public submitted: boolean = false;
  public dropdownList:any=[];
  public showLoadingIndicator: boolean =false;
  public p:number=0;
  public disabled:boolean=false;
  public disabled_update_btn:boolean=false;
  public filteredOptions!: Observable<any[]>;
  public sub_locality_id:any;


  update_locality_form= new FormGroup({
    sub_locality_id:  new FormControl('', Validators.required),
    sub_locality:new FormControl('',Validators.required),
    locality:  new FormControl('', Validators.required),
    locality_id:  new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
  });

  constructor(private AreaListService:AreaListService,
    private route:ActivatedRoute,
    private router:Router,
    private toastr: ToastrService) { 
      this.route.queryParams.subscribe((params) => { 
        if(params.sub_locality_id.length>0){
          this.sub_locality_id = params.sub_locality_id;
          this.showLoadingIndicator =true;
          this.sub_locality_details(this.sub_locality_id);
        }else{
          this.redirect_to_locality();
        }
      });
    }

  ngOnInit(): void {
    this.filteredOptions = this.update_locality_form.controls.locality.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }
  sub_locality_details(sub_locality_id:any){
    this.showLoadingIndicator =true;
    let param = { sub_locality_id: sub_locality_id}
    this.AreaListService.sub_locality_get_id(param).subscribe(
      response => {
        let data:any=response;
        if(data.data == null){
          this.redirect_to_locality();
        }else{
          this.update_locality_form.patchValue({
            locality:data.data.locality.locality,
            locality_id:data.data.locality.locality_id,
            status:data.data.status,
            sub_locality_id:data.data.sub_locality_id,
            sub_locality:data.data.sub_locality,
          });
        }
      });
  }
  

get_locality(value:any){
  if(value.length>2){
    this.AreaListService.get_locality_search(value).subscribe(
      response => {
        let data:any=response;
        this.dropdownList=[];
        if(data?.data?.length>0){
          for (let i = 0; i < data.data.length; i++) {
            this.dropdownList = this.dropdownList?.concat({locality_id: data.data[i].locality_id,locality: data.data[i].locality});
          }
          this.filteredOptions = this.update_locality_form.controls.locality.valueChanges
            .pipe(
              startWith(''),
              map((value) => this._filter(value))
            );
        }else{
          this.dropdownList=[];
          this.update_locality_form.patchValue({locality_id:''});
        }
       
      }, err => {   
      }
    );
  }else{
    this.dropdownList=[];
    this.update_locality_form.patchValue({locality_id:''});
  
  }
}

  private _filter(value: any): string[] {
    if (value.locality) {
      const filterValue = value.locality.toLowerCase();
      return this.dropdownList?.filter((option: any) => option.locality.toLowerCase().includes(filterValue));
    }
    else {
      const filterValue = value.toLowerCase();
      return this.dropdownList?.filter((option: any) => option.locality.toLowerCase().includes(filterValue));
    }
  }

  change_selected_locality(data:any){
    this.update_locality_form.patchValue({locality_id:data.locality_id});
  }
  
  
  get f() {
    return this.update_locality_form.controls;
  }
  
  
  Onupdate_data(){
    if(this.update_locality_form.invalid){
      this.submitted = true;
      return;
    }else{
      this.AreaListService.sub_locality_update(this.update_locality_form.value).subscribe(
        response => {
          this.showLoadingIndicator = false;
          this.update_locality_form.patchValue({
            locality_id:"",
            locality:"",
            sub_locality:"",
            sub_locality_id:"",
            status:''
          });
          this.toastr.success('Locality Updated');
          this.router.navigate(['/admin/sub-locality-list']);
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
  
  redirect_to_locality(): void {
    this.router.navigate(['/admin/sub-locality-list']);
  }

}


