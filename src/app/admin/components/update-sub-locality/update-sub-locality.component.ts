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
  public dropdownList_district:any=[];
  public showLoadingIndicator: boolean =false;
  public p:number=0;
  public disabled:boolean=false;
  public disabled_update_btn:boolean=false;
  public filteredOptions!: Observable<any[]>;
  public filteredOptions_district!: Observable<any[]>;
  public sub_locality_id:any;
  public state_data:any;
  public state_id:any;
  public district_id:any;
  public district:any;
  public locality:any;
  public locality_id:any;


  update_locality_form= new FormGroup({
    sub_locality_id:  new FormControl('', Validators.required),
    sub_locality:new FormControl('',Validators.required),
    locality:  new FormControl('', Validators.required),
    locality_id:  new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    district: new FormControl('', Validators.required),
    district_id: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
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
    this.get_state_data();
    this.filteredOptions = this.update_locality_form.controls.locality.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
    this.filteredOptions_district = this.update_locality_form.controls.district.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter_district(value))
    );
  }
  
  onchange_state(event:any){
   if( this.update_locality_form.value.state == ''){
    this.update_locality_form.patchValue({
      locality:'',
      district_id:'',
      district:''
    });
    this.dropdownList=[];
    this.dropdownList_district=[];
    this.filteredOptions_district = this.update_locality_form.controls.district.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
    this.filteredOptions = this.update_locality_form.controls.locality.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
   }else if(this.update_locality_form.value.state == this.state_id){
    this.update_locality_form.patchValue({
      locality:this.locality,
      locality_id:this.locality_id,
      district:this.district,
      district_id:this.district_id,
      state:this.state_id
    });
  }
    else if( this.update_locality_form.value.state != this.state_id){
      this.update_locality_form.patchValue({
        locality:'',
        district_id:'',
        district:''
      });
      this.dropdownList=[];
      this.dropdownList_district=[];
      this.filteredOptions_district = this.update_locality_form.controls.district.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value))
      );
      this.filteredOptions = this.update_locality_form.controls.locality.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value))
      );
     }

  }
  sub_locality_details(sub_locality_id:any){
    this.showLoadingIndicator =true;
    let param = { sub_locality_id: sub_locality_id}
    this.AreaListService.sub_locality_get_id(param).subscribe(
      response => {
        let data:any=response;
        this.state_id=data.data.locality.district.state.state_id;
        this.district_id=data.data.locality.district.district_id;
        this.district=data.data.locality.district.district;
        this.locality_id=data.data.locality.locality_id;
        this.locality=data.data.locality.locality;
        if(data.data == null){
          this.redirect_to_locality();
        }else{
          this.update_locality_form.patchValue({
            locality:data.data.locality.locality,
            locality_id:data.data.locality.locality_id,
            status:data.data.status,
            sub_locality_id:data.data.sub_locality_id,
            sub_locality:data.data.sub_locality,
            district:data.data.locality.district.district,
            district_id:data.data.locality.district.district_id,
            state:data.data.locality.district.state.state_id
          });
        }
      });
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
get_locality(value:any){
  if(value.length>2){
    let param={value:value,district_id:this.district_id}
    this.AreaListService.get_locality_search(param).subscribe(
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
  
get_district(value:any){
  if(value.length>2){
    let param={value:value,state_id:this.state_id}
    this.AreaListService.get_district_search(param).subscribe(
      response => {
        let data:any=response;
        this.dropdownList_district=[];
        if(data?.data?.length>0){
          for (let i = 0; i < data.data.length; i++) {
            this.dropdownList_district = this.dropdownList_district?.concat({district_id: data.data[i].district_id,district: data.data[i].district});
          }
          this.filteredOptions_district = this.update_locality_form.controls.district.valueChanges
            .pipe(
              startWith(''),
              map((value) => this._filter_district(value))
            );
        }else{
          this.dropdownList_district=[];
          this.update_locality_form.patchValue({district_id:'',locality_id:'',locality:''});
        }
       
      }, err => {   
      }
    );
  }else{
    this.dropdownList_district=[];
    this.update_locality_form.patchValue({district_id:'',locality_id:'',locality:''});
  
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
  private _filter_district(value: any): string[] {
    if (value.locality) {
      const filterValue = value.district.toLowerCase();
      return this.dropdownList_district?.filter((option: any) => option.district.toLowerCase().includes(filterValue));
    }
    else {
      const filterValue = value.toLowerCase();
      return this.dropdownList_district?.filter((option: any) => option.district.toLowerCase().includes(filterValue));
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
            district:"",
            district_id:"",
            status:''
          });
          this.toastr.success('Sub-Locality Updated');
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
  
  change_selected_district(data:any){
    this.update_locality_form.patchValue({district_id:data.district_id});
  }

}


