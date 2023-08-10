import { Component, OnInit,ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AreaListService } from '../../services/area-list.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-locality',
  templateUrl: './update-locality.component.html',
  styleUrls: ['./update-locality.component.css']
})
export class UpdateLocalityComponent implements OnInit {
  
  public submitted: boolean = false;
  public dropdownList:any=[];
  public showLoadingIndicator: boolean =false;
  public p:number=0;
  public disabled:boolean=false;
  public disabled_update_btn:boolean=false;
  public filteredOptions!: Observable<any[]>;
  public locality_id:any;
  public state_data:any;
  public state_id:any;


  update_locality_form= new UntypedFormGroup({
    district:  new UntypedFormControl('', Validators.required),
    district_id:new UntypedFormControl('',Validators.required),
    locality:  new UntypedFormControl('', Validators.required),
    locality_id:  new UntypedFormControl('', Validators.required),
    status: new UntypedFormControl('', Validators.required),
    state: new UntypedFormControl('', Validators.required)
  });

  constructor(private AreaListService:AreaListService,
    private route:ActivatedRoute,
    private router:Router,
    private toastr: ToastrService) { 
      this.route.queryParams.subscribe((params) => { 
        if(params.locality_id.length>0){
          this.locality_id = params.locality_id;
          this.showLoadingIndicator =true;
          this.locality_details(this.locality_id);
        }else{
          this.redirect_to_locality();
        }
      });
    }

  ngOnInit(): void { 
    this.get_state_data();
    this.filteredOptions = this.update_locality_form.controls.district.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }
  
  onchange_state(){
    this.update_locality_form.patchValue({
      locality:'',
      district_id:'',
      district:''
    });
    this.dropdownList=[];
    this.filteredOptions = this.update_locality_form.controls.district.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }
  locality_details(locality_id:any){
    this.showLoadingIndicator =true;
    let param = { locality_id: locality_id}
    this.AreaListService.locality_get_id(param).subscribe(
      response => {
        let data:any=response;
        this.state_id=data.data.status;
        if(data.data == null){
          this.redirect_to_locality();
        }else{
          this.update_locality_form.patchValue({
            state:data.data.district.state.state_id,
            locality:data.data.locality,
            locality_id:data.data.locality_id,
            status:data.data.status,
            district:data.data.district.district,
            district_id:data.data.district.district_id
          });
        }
      });
  }  
  get_district(value:any){
    if(value.length>2){
      let param={value:value,state_id:this.state_id}
      this.AreaListService.get_district_search(param).subscribe(
        response => {
          let data:any=response;
          this.dropdownList=[];
          if(data?.data?.length>0){
            for (let i = 0; i < data.data.length; i++) {
              this.dropdownList = this.dropdownList?.concat({district_id: data.data[i].district_id,district: data.data[i].district});
            }
            this.filteredOptions = this.update_locality_form.controls.district.valueChanges
              .pipe(
                startWith(''),
                map((value) => this._filter(value))
              );
          }else{
            this.dropdownList=[];
            this.update_locality_form.patchValue({district_id:''});
          }
         
        }, err => {   
        }
      );
    }else{
      this.dropdownList=[];
      this.update_locality_form.patchValue({district_id:''});
    
    }
  }
  
  get_state_data(){
    this.showLoadingIndicator= true;
    this.AreaListService.get_state_data().subscribe(
      response => {
        this.state_data=response;
        this.showLoadingIndicator= false;
      }, err => {
      }
    );
  } 
 
  private _filter(value: any): string[] {
    if (value.district) {
      const filterValue = value.district.toLowerCase();
      return this.dropdownList?.filter((option: any) => option.district.toLowerCase().includes(filterValue));
    }
    else {
      const filterValue = value.toLowerCase();
      return this.dropdownList?.filter((option: any) => option.district.toLowerCase().includes(filterValue));
    }
  }

  change_selected_district(data:any){
    this.update_locality_form.patchValue({district_id:data.district_id});
  }
  
  
  get f() {
    return this.update_locality_form.controls;
  }
  
  
  Onupdate_data(){
    if(this.update_locality_form.invalid){
      this.submitted = true;
      return;
    }else{
      this.AreaListService.locality_update(this.update_locality_form.value).subscribe(
        response => {
          this.showLoadingIndicator = false;
          this.update_locality_form.patchValue({
            district:"",
            district_id:"",
            locality:"",
            locality_id:"",
            status:''
          });
          this.toastr.success('Locality Updated');
          this.router.navigate(['/admin/locality-list']);
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
    this.router.navigate(['/admin/locality-list']);
  }

}

