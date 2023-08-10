import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AreaListService } from '../../services/area-list.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Pagination } from 'src/app/user/components/models/pagination.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router,ActivatedRoute } from '@angular/router';
import { data } from 'jquery';

@Component({
  selector: 'app-update-area-group',
  templateUrl: './update-area-group.component.html',
  styleUrls: ['./update-area-group.component.css']
})
export class UpdateAreaGroupComponent implements OnInit {

 
  public submitted: boolean = false;
  public submitted_name:boolean=false;
  public search_submitted: boolean = false;
  public dropdownList:any=[];
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
  public group_id: any;
  public selectedItems_data1: any = [];
  public selectedItems_data_db: any = [];
  public selectedItems_data: any = [];
  public selectedItems_data_length:number=0;
  public filteredOptions!: Observable<any[]>;
  dropdownSettings_sub_locality!: IDropdownSettings;
  public filteredOptions_district!: Observable<any[]>;

  update_area_group = new UntypedFormGroup({
    locality:  new UntypedFormControl(''),
    locality_id:new UntypedFormControl(''),
    sub_locality:  new UntypedFormControl(''),
    group_name: new UntypedFormControl('', Validators.required),
    state: new UntypedFormControl('1'),
    district:new UntypedFormControl(''),
    district_id:new UntypedFormControl(''),
    group_id:new UntypedFormControl('', Validators.required),
  });
  
  update_area_group_name= new UntypedFormGroup({
    group_name: new UntypedFormControl('', Validators.required),
    group_id:new UntypedFormControl('', Validators.required),
  });

  constructor(private AreaListService:AreaListService,
    private router:Router,
    private route:ActivatedRoute,
    private toastr: ToastrService) {
       this.route.queryParams.subscribe((params) => { 
      if(params.group_id.length>0){
        this.group_id = params.group_id;
        this.showLoadingIndicator =true;
        this.group_details_id(this.group_id);
      }else{
        this.router.navigate(['/admin/area-group-list']); 
      }
    });
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
    this.selectedItems_data_db = new Array<string>(); 
    this.get_state_data();
    this.filteredOptions_district = this.update_area_group.controls.district.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter_district(value))
    );
    this.filteredOptions = this.update_area_group.controls.locality.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }
  nosubmit(){
    this.toastr.error('At Least One Filed Select');
  }
  group_details_id(group_id:any){
    this.showLoadingIndicator =true;
    let param = { group_id: group_id}
    this.AreaListService.group_details_id(param).subscribe(
      response => {
        let data:any=response;
        // console.log(data);
        for (let i = 0; i < data.data.pivot_data?.length; i++) {
        this.selectedItems_data.push({sub_locality_id: data?.data?.pivot_data[i]?.sub_locality?.sub_locality_id, sub_locality_text: data?.data?.pivot_data[i]?.sub_locality?.sub_locality});
        this.selectedItems_data_db.push({sub_locality_id: data?.data?.pivot_data[i]?.sub_locality?.sub_locality_id, sub_locality_text: data?.data?.pivot_data[i]?.sub_locality?.sub_locality});
        this.selectedItems_data1.push(data?.data?.pivot_data[i]?.sub_locality?.sub_locality_id);
        }
        this.selectedItems_data_length=this.selectedItems_data1.length;
        this.update_area_group.patchValue({group_id:data.data.id,group_name:data.data.group_name});
        this.update_area_group_name.patchValue({group_id:data.data.id,group_name:data.data.group_name});
      });

  }
  onchange_state(){
    this.update_area_group.patchValue({
      locality:'',
      locality_id:'',
      sub_locality:'',
      district:'',
      district_id:''
    });
    this.dropdownList=[];
    this.filteredOptions_district = this.update_area_group.controls.locality.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter_district(value))
    );
  }
  
  get_district(value:any){
    if(value.length>2){
      let param={value:value,state_id:this.update_area_group.value.state}
      this.AreaListService.get_district_search(param).subscribe(
        response => {
          let data:any=response;
          this.dropdownList_district=[];
          if(data?.data?.length>0){
            for (let i = 0; i < data.data.length; i++) {
              this.dropdownList_district = this.dropdownList_district?.concat({district_id: data.data[i].district_id,district: data.data[i].district});
            }
            this.filteredOptions_district = this.update_area_group.controls.district.valueChanges
              .pipe(
                startWith(''),
                map((value) => this._filter_district(value))
              );
          }else{
            this.dropdownList_district=[];
            this.dropdownList=[];
            this.update_area_group.patchValue({district_id:'',locality_id:'',locality:''});
          }
         
        }, err => {   
        }
      );
    }else{
      this.dropdownList_district=[];
      this.dropdownList=[];
      this.update_area_group.patchValue({district_id:'',locality_id:'',locality:''});
    
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
      let param={value:value,district_id:this.update_area_group.value.district_id}
      this.AreaListService.get_locality_search(param).subscribe(
        response => {
          let data:any=response;
          this.dropdownList=[];
          if(data?.data?.length>0){
            for (let i = 0; i < data.data.length; i++) {
              this.dropdownList = this.dropdownList?.concat({locality_id: data.data[i].locality_id,locality: data.data[i].locality});
            }
            this.filteredOptions = this.update_area_group.controls.locality.valueChanges
              .pipe(
                startWith(''),
                map((value) => this._filter(value))
              );
          }else{
            this.dropdownList=[];
            this.update_area_group.patchValue({locality_id:''});
          }
         
        }, err => {   
        }
      );
    }else{
      this.dropdownList=[];
      this.update_area_group.patchValue({locality_id:''});
    
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
    this.update_area_group.patchValue({district_id:data.district_id,locality_id:'',locality:''});
  }
  

  onItemSelect(item: any) {
    this.showLoadingIndicator=true;
    this.selectedItems_data.push(item);
    this.selectedItems_data_db.push(item);
    this.selectedItems_data1.push(item.sub_locality_id);
    this.selectedItems_data_length=this.selectedItems_data1.length;
    this.showLoadingIndicator=false;
  }
  onItemDeSelect(value: any) {
    this.showLoadingIndicator=true;
    if(this.selectedItems_data1.includes(value.sub_locality_id)){
      this.showLoadingIndicator=false;           
      this.selectedItems_data1.splice(this.selectedItems_data1.findIndex((item: { sub_locality_id: any; }) => item.sub_locality_id === value.sub_locality_id), 1); 
      this.selectedItems_data.splice(this.selectedItems_data.findIndex((item: { sub_locality_id: any; }) => item.sub_locality_id === value.sub_locality_id), 1);
      this.selectedItems_data_db.splice(this.selectedItems_data.findIndex((item: { sub_locality_id: any; }) => item.sub_locality_id === value.sub_locality_id), 1);
      this.selectedItems_data_length=this.selectedItems_data1.length;
      // this.dropdown_sublocality = this.dropdown_sublocality?.concat({ sub_locality_id:value.sub_locality_id, sub_locality_text:value.sub_locality_text});
    }else{
      this.selectedItems_data1.splice(this.selectedItems_data1.findIndex((item: { sub_locality_id: any; }) => item.sub_locality_id === value.sub_locality_id), 1); 
      this.selectedItems_data.splice(this.selectedItems_data.findIndex((item: { sub_locality_id: any; }) => item.sub_locality_id === value.sub_locality_id), 1);
      this.selectedItems_data_db.splice(this.selectedItems_data.findIndex((item: { sub_locality_id: any; }) => item.sub_locality_id === value.sub_locality_id), 1);
      this.selectedItems_data_length=this.selectedItems_data1.length;
      // this.locality_form.patchValue({sub_locality:this.selectedItems_data});
      this.showLoadingIndicator=false;           
     }
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
  this.selectedItems_data= this.selectedItems_data_db;
  this.selectedItems_data_length=this.selectedItems_data.length;
  
}
  delete(value:any){
    this.showLoadingIndicator=true;
    if(this.selectedItems_data1.includes(value.sub_locality_id)){
      this.showLoadingIndicator=false;           
      this.selectedItems_data1.splice(this.selectedItems_data1.findIndex((item: { sub_locality_id: any; }) => item.sub_locality_id === value.sub_locality_id), 1); 
      this.selectedItems_data.splice(this.selectedItems_data.findIndex((item: { sub_locality_id: any; }) => item.sub_locality_id === value.sub_locality_id), 1);
      this.selectedItems_data_db.splice(this.selectedItems_data.findIndex((item: { sub_locality_id: any; }) => item.sub_locality_id === value.sub_locality_id), 1);
      this.selectedItems_data_length=this.selectedItems_data1.length;
      // this.dropdown_sublocality = this.dropdown_sublocality?.concat({ sub_locality_id:value.sub_locality_id, sub_locality_text:value.sub_locality_text});
    }else{
      this.selectedItems_data1.splice(this.selectedItems_data1.findIndex((item: { sub_locality_id: any; }) => item.sub_locality_id === value.sub_locality_id), 1); 
      this.selectedItems_data.splice(this.selectedItems_data.findIndex((item: { sub_locality_id: any; }) => item.sub_locality_id === value.sub_locality_id), 1);
      this.selectedItems_data_db.splice(this.selectedItems_data.findIndex((item: { sub_locality_id: any; }) => item.sub_locality_id === value.sub_locality_id), 1);
      this.selectedItems_data_length=this.selectedItems_data1.length;
      // this.locality_form.patchValue({sub_locality:this.selectedItems_data});
      this.showLoadingIndicator=false;           
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
  onSubmit(){
    let param={group_id:this.update_area_group.value.group_id,group_name:this.update_area_group.value.group_name,sub_locality:this.selectedItems_data}
    if(this.update_area_group.invalid){
      this.submitted = true;
      return;
    }else{
      if(this.selectedItems_data_length>0){
        this.AreaListService.area_group_update(param).subscribe(
          response => {
            let data:any=response;
            this.showLoadingIndicator = false;
            this.update_area_group.patchValue({
              sub_locality:'',
              locality:'',
              locality_id:'',
              group_name:'',
              state:'',
              district_id:'',
              district:'',
              group_id:''
            });          
            this.router.navigate(['/admin/area-group-list']); 
            this.selectedItems_data=[];
            this.selectedItems_data_length=0;
            this.toastr.success('Area Group Updates Successfully');
          },
          err => {
            this.showLoadingIndicator = false;
            let errorMessage:any = err.error.errors;
            if(errorMessage.group_name){
              this.toastr.error(errorMessage.group_name, 'Something Error', {
                timeOut: 3000,
              });
            }else{
              this.toastr.error(errorMessage, 'Something Error', {
                timeOut: 3000,
              });
            }
          }
        );

      }else{
        this.toastr.info('Please Any Sublocality Selected ');
      }
    }
  }
  
  onSubmit_name(){
    let param={group_id:this.update_area_group_name.value.group_id,group_name:this.update_area_group_name.value.group_name}
    if(this.update_area_group_name.invalid){
      this.submitted = true;
      return;
    }else{
      if(this.update_area_group_name.value.group_name == this.update_area_group.value.group_name){
        this.toastr.error('You cannot enter the same Name', 'Something Error', {
          timeOut: 3000,
        });
      }else{
        this.AreaListService.area_group_name_update(param).subscribe(
          response => {
            let data:any=response;
            this.showLoadingIndicator = false;
            this.update_area_group_name.patchValue({
              group_name:'',
              group_id:''
            });          
            this.router.navigate(['/admin/area-group-list']);
            this.toastr.success('Area Group Updates Successfully');
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
  }
  
  change_selected_locality(data:any){
    this.update_area_group.patchValue({locality_id:data.locality_id});
    let param = { Locality_id:data.locality_id}
    this.AreaListService.get_sub_locality(param).subscribe(
      response => {
        let data:any=response;
        this.dropdown_sublocality=[];
        this.update_area_group.patchValue({sub_locality:''});
        if(data.data.length<1){
          this.dropdown_sublocality=[];
          this.update_area_group.patchValue({
            sub_locality:'',
          });
        }else{
          for (let i = 0; i < data.data.length; i++) {
            if(this.selectedItems_data1.includes(data.data[i].sub_locality_id)){

            }else{
              this.dropdown_sublocality = this.dropdown_sublocality?.concat({ sub_locality_id: data.data[i].sub_locality_id, sub_locality_text: data.data[i].sub_locality});
            }
          }
        }
      }
    );
  }

 
  get f() {
    return this.update_area_group.controls;
  }
  get g() {
    return this.update_area_group_name.controls;
  }

}


