import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AreaListService } from '../../services/area-list.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Pagination } from 'src/app/user/components/models/pagination.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-area-group',
  templateUrl: './add-area-group.component.html',
  styleUrls: ['./add-area-group.component.css']
})
export class AddAreaGroupComponent implements OnInit {

  public submitted: boolean = false;
  public search_submitted: boolean = false;
  public dropdownList:any=[];
  public clicked = false;
  public dropdownList_district:any=[];
  public dropdownList1:any=[];
  public showLoadingIndicator: boolean =false;
  public p:number=0;
  public sub_locality_length:number=0;
  public sub_locality_data:any={};
  public Pagination_data: Pagination;
  public details:any;
  public disabled:boolean=false;
  public disabled_update_btn:boolean=false;
  public state_data:any;
  public dropdown_sublocality:any=[];
  // public selectedItems: any = [];
  public selectedItems_data: any = [];
  public selectedItems_data1: any = [];
  public selectedItems_data_length:number=0;
  public filteredOptions!: Observable<any[]>;
  dropdownSettings_sub_locality!: IDropdownSettings;
  public filteredOptions_district!: Observable<any[]>;

  create_area_group = new FormGroup({
    locality:  new FormControl('', Validators.required),
    locality_id:new FormControl('',Validators.required),
    sub_locality:  new FormControl('', Validators.required),
    group_name: new FormControl('', Validators.required),
    state: new FormControl('1', Validators.required),
    district:new FormControl('', Validators.required),
    district_id:new FormControl('', Validators.required),
  });

  constructor(private AreaListService:AreaListService,
    private router:Router,
    private toastr: ToastrService) { 
      this.Pagination_data = new Pagination();
    }

  ngOnInit(): void {     
    this.dropdownSettings_sub_locality = {
      singleSelection: false,
      idField: 'sub_locality_id',
      textField: 'sub_locality_text',
      enableCheckAll: true,
      itemsShowLimit: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection:true,
      noDataAvailablePlaceholderText: "Sub Locality not Availabale",
      maxHeight: 250,
    };
    // this.selectedItems = new Array<string>();
    this.selectedItems_data = new Array<string>(); 
    this.selectedItems_data1 = new Array<string>(); 
    this.get_state_data();
    this.filteredOptions_district = this.create_area_group.controls.district.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter_district(value))
    );
    this.filteredOptions = this.create_area_group.controls.locality.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }
  nosubmit(){
    this.toastr.error('At Least One Filed Select');
  }
  
  onchange_state(){
    this.create_area_group.patchValue({
      locality:'',
      locality_id:'',
      sub_locality:'',
      district:'',
      district_id:''
    });
    this.dropdownList=[];
    this.filteredOptions_district = this.create_area_group.controls.locality.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter_district(value))
    );
  }
  
  get_district(value:any){
    if(value.length>2){
      let param={value:value,state_id:this.create_area_group.value.state}
      this.AreaListService.get_district_search(param).subscribe(
        response => {
          let data:any=response;
          this.dropdownList_district=[];
          if(data?.data?.length>0){
            for (let i = 0; i < data.data.length; i++) {
              this.dropdownList_district = this.dropdownList_district?.concat({district_id: data.data[i].district_id,district: data.data[i].district});
            }
            this.filteredOptions_district = this.create_area_group.controls.district.valueChanges
              .pipe(
                startWith(''),
                map((value) => this._filter_district(value))
              );
          }else{
            this.dropdownList_district=[];
            this.dropdownList=[];
            this.create_area_group.patchValue({district_id:'',locality_id:'',locality:''});
          }
         
        }, err => {   
        }
      );
    }else{
      this.dropdownList_district=[];
      this.dropdownList=[];
      this.create_area_group.patchValue({district_id:'',locality_id:'',locality:''});
    
    }
  }
  private _filter_district(value: any): string[] {
    if (value.district) {
      const filterValue = value.district.toLowerCase();
      return this.dropdownList_district?.filter((option: any) => option.district.toLowerCase().includes(filterValue));
    }
    else {
      const filterValue = value.toLowerCase();
      return this.dropdownList_district?.filter((option: any) => option.district.toLowerCase().includes(filterValue));
    }
  }
  
  
  get_locality(value:any){
    if(value.length>2){
      let param={value:value,district_id:this.create_area_group.value.district_id}
      this.AreaListService.get_locality_search(param).subscribe(
        response => {
          let data:any=response;
          this.dropdownList=[];
          if(data?.data?.length>0){
            for (let i = 0; i < data.data.length; i++) {
              this.dropdownList   = this.dropdownList?.concat({locality_id: data.data[i].locality_id,locality: data.data[i].locality});
            
            }
            this.filteredOptions = this.create_area_group.controls.locality.valueChanges
              .pipe(
                startWith(''),
                map((value) => this._filter(value))
              );
          }else{
            this.dropdownList=[];
            this.create_area_group.patchValue({locality_id:''});
          }
         
        }, err => {   
        }
      );
    }else{
      this.dropdownList=[];
      this.create_area_group.patchValue({locality_id:''});
    
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

  
  change_selected_district(data:any){
    this.create_area_group.patchValue({district_id:data.district_id,locality_id:'',locality:''});
  }
  
onSelectAll(items: any) {
  for (let i = 0; i < items.length; i++) {
    if(this.selectedItems_data1.includes(items[i].sub_locality_id)){
    }else{  
    this.selectedItems_data.push(items[i]);
    this.selectedItems_data1.push(items[i].sub_locality_id);
    this.selectedItems_data_length=this.selectedItems_data1.length;
    }
  }
}
onUnSelectAll() {
  this.selectedItems_data=[];
  this.selectedItems_data1=[];
  this.selectedItems_data_length=this.selectedItems_data1.length;
}
  onItemSelect(item: any) {
    this.showLoadingIndicator=true;
    this.selectedItems_data.push(item);
    this.selectedItems_data1.push(item.sub_locality_id);
    this.selectedItems_data_length=this.selectedItems_data1.length;
    this.showLoadingIndicator=false;
  }
  onItemDeSelect(value: any) {
    this.showLoadingIndicator=true;
    this.selectedItems_data1.splice(this.selectedItems_data1.findIndex((item: { sub_locality_id: any; }) => item.sub_locality_id === value.sub_locality_id), 1);
    this.selectedItems_data.splice(this.selectedItems_data.findIndex((item: { sub_locality_id: any; }) => item.sub_locality_id === value.sub_locality_id), 1);
    this.selectedItems_data_length=this.selectedItems_data1.length;
    this.showLoadingIndicator=false;
  }
  delete(value:any){
    this.showLoadingIndicator=false;           
      this.selectedItems_data1.splice(this.selectedItems_data1.findIndex((item: { sub_locality_id: any; }) => item.sub_locality_id === value.sub_locality_id), 1); 
      this.selectedItems_data.splice(this.selectedItems_data.findIndex((item: { sub_locality_id: any; }) => item.sub_locality_id === value.sub_locality_id), 1);
      this.selectedItems_data_length=this.selectedItems_data1.length;
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
  onSubmit(){
    let param={group_name:this.create_area_group.value.group_name,sub_locality:this.selectedItems_data}
    if(this.create_area_group.invalid){
      this.submitted = true;
      return;
    }else{
      this.AreaListService.area_group_create(param).subscribe(
        response => {
          let data:any=response;
          this.showLoadingIndicator = false;
          this.create_area_group.patchValue({
            sub_locality:'',
            locality:'',
            locality_id:'',
            group_name:'',
            state:'',
            district_id:'',
            district:''
          });          
          this.router.navigate(['/admin/area-group-list']); 
          this.selectedItems_data=[];
          this.selectedItems_data_length=0;
          this.toastr.success('Area Group Create Successfully');
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
  
  change_selected_locality(data:any){
    this.create_area_group.patchValue({locality_id:data.locality_id});
    let param = { Locality_id:data.locality_id}
    this.AreaListService.get_sub_locality(param).subscribe(
      response => {
        let data:any=response;
        this.dropdown_sublocality=[];
        this.create_area_group.patchValue({sub_locality:''});
        if(data.data.length<1){
          this.dropdown_sublocality=[];
          this.create_area_group.patchValue({
            sub_locality:'',
          });
        }else{
          for (let i = 0; i < data.data.length; i++) {
            if(this.selectedItems_data1.includes(data.data[i].sub_locality_id)){

            }else{
              this.dropdown_sublocality = this.dropdown_sublocality?.concat({ sub_locality_id: data.data[i].sub_locality_id, sub_locality_text: data.data[i].sub_locality});
            }
            // this.dropdown_sublocality = this.dropdown_sublocality?.concat({ sub_locality_id: data.data[i].sub_locality_id, sub_locality_text: data.data[i].sub_locality});
          }
        }
      }
    );
  }

 
  get f() {
    return this.create_area_group.controls;
  }

}


