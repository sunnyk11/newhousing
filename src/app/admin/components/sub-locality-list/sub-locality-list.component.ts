import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AreaListService } from '../../services/area-list.service';
import { Pagination } from 'src/app/user/components/models/pagination.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-sub-locality-list',
  templateUrl: './sub-locality-list.component.html',
  styleUrls: ['./sub-locality-list.component.css']
})
export class SubLocalityListComponent implements OnInit {

 
  public submitted: boolean = false;
  public search_submitted: boolean = false;
  public dropdownList:any=[];
  public dropdownList_district:any=[];
  public dropdownList_district1:any=[];
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
  public filteredOptions!: Observable<any[]>;
  public filteredOptions1!: Observable<any[]>;
  public filteredOptions_district!: Observable<any[]>;
  public filteredOptions_district1!: Observable<any[]>;

  locality_form = new FormGroup({
    locality:  new FormControl('', Validators.required),
    locality_id:new FormControl('',Validators.required),
    sub_locality:  new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    state: new FormControl('1', Validators.required),
    district:new FormControl('', Validators.required),
    district_id:new FormControl('', Validators.required),
  });
  searching_form = new FormGroup({
    search_locality: new FormControl('', Validators.required),
    search_locality_id: new FormControl('', Validators.required),
    search_state: new FormControl('1', Validators.required),
    search_district: new FormControl('', Validators.required),
    search_district_id: new FormControl('', Validators.required),
    search_sub_locality: new FormControl('')
  });

  constructor(private AreaListService:AreaListService,
    private toastr: ToastrService) { 
      this.Pagination_data = new Pagination();
    }

  ngOnInit(): void { 
    this.get_state_data();
    this.filteredOptions_district = this.locality_form.controls.district.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter_district(value))
    );
    this.filteredOptions_district1 = this.locality_form.controls.district.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter_district1(value))
    );
    this.filteredOptions = this.locality_form.controls.locality.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
    this.filteredOptions1 = this.searching_form.controls.search_locality.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter1(value))
    );
  }
  nosubmit(){
    this.toastr.error('At Least One Filed Select');
  }
  
  onchange_state(){
    this.locality_form.patchValue({
      locality:'',
      locality_id:'',
      sub_locality:'',
      district:'',
      district_id:''
    });
    this.dropdownList=[];
    this.filteredOptions_district = this.locality_form.controls.locality.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter_district(value))
    );
  }
  
  get_district(value:any){
    if(value.length>2){
      let param={value:value,state_id:this.locality_form.value.state}
      this.AreaListService.get_district_search(param).subscribe(
        response => {
          let data:any=response;
          this.dropdownList_district=[];
          if(data?.data?.length>0){
            for (let i = 0; i < data.data.length; i++) {
              this.dropdownList_district = this.dropdownList_district?.concat({district_id: data.data[i].district_id,district: data.data[i].district});
            }
            this.filteredOptions_district = this.locality_form.controls.district.valueChanges
              .pipe(
                startWith(''),
                map((value) => this._filter_district(value))
              );
          }else{
            this.dropdownList_district=[];
            this.dropdownList=[];
            this.locality_form.patchValue({district_id:'',locality_id:'',locality:''});
          }
         
        }, err => {   
        }
      );
    }else{
      this.dropdownList_district=[];
      this.dropdownList=[];
      this.locality_form.patchValue({district_id:'',locality_id:'',locality:''});
    
    }
  }
  get_district1(value:any){
    if(value.length>2){
      let param={value:value,state_id:this.searching_form.value.search_state}
      this.AreaListService.get_district_search(param).subscribe(
        response => {
          let data:any=response;
          this.dropdownList_district1=[];
          if(data?.data?.length>0){
            for (let i = 0; i < data.data.length; i++) {
              this.dropdownList_district1 = this.dropdownList_district1?.concat({serach_district_id: data.data[i].district_id,search_district: data.data[i].district});
            }
            this.filteredOptions_district1 = this.searching_form.controls.search_district.valueChanges
              .pipe(
                startWith(''),
                map((value) => this._filter_district1(value))
              );
          }else{
            this.dropdownList_district1=[];
            this.dropdownList1=[];
            this.searching_form.patchValue({search_district_id:'',search_locality_id:'',search_locality:''});
          }
         
        }, err => {   
        }
      );
    }else{
      this.dropdownList_district1=[];
      this.dropdownList1=[];
     this.searching_form.patchValue({search_district_id:'',search_locality_id:'',search_locality:''});
         
    
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
  
  private _filter_district1(value: any): string[] {
    if (value.search_district) {
      const filterValue = value.search_district.toLowerCase();
      return this.dropdownList_district1?.filter((option: any) => option.search_district.toLowerCase().includes(filterValue));
    }
    else {
      const filterValue = value.toLowerCase();
      return this.dropdownList_district1?.filter((option: any) => option.search_district.toLowerCase().includes(filterValue));
    }
  }

  
  get_locality(value:any){
    if(value.length>2){
      let param={value:value,district_id:this.locality_form.value.district_id}
      this.AreaListService.get_locality_search(param).subscribe(
        response => {
          let data:any=response;
          this.dropdownList=[];
          if(data?.data?.length>0){
            for (let i = 0; i < data.data.length; i++) {
              this.dropdownList = this.dropdownList?.concat({locality_id: data.data[i].locality_id,locality: data.data[i].locality});
            }
            this.filteredOptions = this.locality_form.controls.locality.valueChanges
              .pipe(
                startWith(''),
                map((value) => this._filter(value))
              );
          }else{
            this.dropdownList=[];
            this.locality_form.patchValue({locality_id:''});
          }
         
        }, err => {   
        }
      );
    }else{
      this.dropdownList=[];
      this.locality_form.patchValue({locality_id:''});
    
    }
  }
 
  get_locality1(value:any){
    if(value.length>2){
      let param={value:value,district_id:this.searching_form.value.search_district_id}
      this.AreaListService.get_locality_search(param).subscribe(
        response => {
          let data:any=response;
          this.dropdownList1=[];
          if(data?.data?.length>0){
            for (let i = 0; i < data.data.length; i++) {
              this.dropdownList1 = this.dropdownList1?.concat({search_locality_id: data.data[i].locality_id,search_locality: data.data[i].locality});
            }
            this.filteredOptions1 = this.searching_form.controls.search_locality.valueChanges
              .pipe(
                startWith(''),
                map((value) => this._filter1(value))
              );
          }else{
            this.dropdownList1=[];
            this.searching_form.patchValue({search_locality_id:''});
          }
         
        }, err => {   
        }
      );
    }else{
      this.dropdownList=[];
      this.searching_form.patchValue({search_locality_id:''});
    
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

  private _filter1(value: any): string[] {
    if (value.search_locality) {
      const filterValue = value.search_locality.toLowerCase();
      return this.dropdownList1?.filter((option: any) => option.search_locality.toLowerCase().includes(filterValue));
    }
    else {
      const filterValue = value.toLowerCase();
      return this.dropdownList1?.filter((option: any) => option.search_locality.toLowerCase().includes(filterValue));
    }
  }
  
  change_selected_district(data:any){
    this.locality_form.patchValue({district_id:data.district_id});
  }
  
  change_selected_district1(data:any){
    this.searching_form.patchValue({search_district_id:data.serach_district_id});
  }
  
  onchange_state_search(){
    this.searching_form.patchValue({
      search_district:'',
      search_district_id:'',
      search_locality:'',
      search_locality_id:'',
    }); 
    this.dropdownList1=[];
    this.dropdownList_district1=[];
    this.filteredOptions_district1 = this.searching_form.controls.search_district.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter_district1(value))
    );
  }

  searching(value:any){
    if(value.length>2){
      let param={value:value,search_locality_id:this.searching_form.value.search_locality_id}
      this.AreaListService.get_sub_locality_searching(param).then(
        Pagination_data => {
          this.sub_locality_data=Pagination_data;
          this.sub_locality_length=this.sub_locality_data.data.total;
          this.showLoadingIndicator=false;
        }, err => {
        }
      );
    } 
    else if(value.length==0){
      this.Onsearch();
     }
  }
  Onsearch(){
    if(this.searching_form.invalid){
      this.search_submitted = true;
      return;
    }else{
    let param = { locality_id: this.searching_form.value.search_locality_id}
      this.AreaListService.get_sub_locality_byid(param).then(
        Pagination_data => {
          this.sub_locality_data=Pagination_data;
          this.sub_locality_length=this.sub_locality_data.data.total;
          this.showLoadingIndicator=false;
        }, err => {
        }
      );
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
    if(this.locality_form.invalid){
      this.submitted = true;
      return;
    }else{
      this.AreaListService.sub_locality_create(this.locality_form.value).subscribe(
        response => {
          let data:any=response;
          this.showLoadingIndicator = false;
          this.locality_form.patchValue({
            sub_locality:'',
            locality:'',
            locality_id:'',
            status:'',
            state:'',
            district_id:'',
            district:''
          });
          this.toastr.success('Sub-Locality Create Successfully');
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
    this.locality_form.patchValue({locality_id:data.locality_id});
  }
  change_selected_locality1(data:any){
    this.searching_form.patchValue({search_locality_id:data.search_locality_id});
  }

  gotoPage(link_url: any) {
    this.showLoadingIndicator = true;
    let param = { locality_id: this.searching_form.value.search_locality_id}
    this.AreaListService.getpagination1(link_url,param).then(Pagination_data => {
      this.showLoadingIndicator= false;
      this.sub_locality_data=Pagination_data;
      // this.user_list_length=this.user_list.data.data.length;
    });
  }

  get f() {
    return this.locality_form.controls;
  }
  get s() {
    return this.searching_form.controls;
  }
  delete_sub_locality(id:any){
    this.showLoadingIndicator = true;
    let param = { sub_locality_id: id}
    this.AreaListService.delete_sub_locality(param).pipe().subscribe(
      response=> {
        this.showLoadingIndicator =false;
        let data:any=response;
        let Message =data.message;
        this.toastr.error(Message, 'Sub-locality', {
          timeOut: 3000,
        });
        this.Onsearch();
      },
      err => {
       this.showLoadingIndicator = false;
      }
    )
  }
  
  sub_locality_status_changes(id:any){
    let param = { sub_locality_id: id}
    this.AreaListService.sub_locality_status_changes(param).subscribe(
      response => {
        this.showLoadingIndicator =false;
        let data:any=response;
        this.toastr.success('Status Updated', 'Sub-locality', {
          timeOut: 3000,
        });
        this.Onsearch();
      }
    );
  }
  
  delete_popup(data: any) {
    this.details = data;
  }
  refresh_data(){
    this.searching_form.patchValue({
    search_district:'',
    search_district_id:'',
    search_locality:'',
    search_locality_id:'',
    search_state:'',
    search_sub_locality:'',
  });
    this.sub_locality_length=0;
    this.sub_locality_data='';
  }

}

