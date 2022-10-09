import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AreaListService } from '../../services/area-list.service';
import { Pagination } from 'src/app/user/components/models/pagination.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-locality-list',
  templateUrl: './locality-list.component.html',
  styleUrls: ['./locality-list.component.css']
})
export class LocalityListComponent implements OnInit {

  public submitted: boolean = false;
  public search_submitted: boolean = false;
  public dropdownList:any=[];
  public clicked = false;
  public dropdownList1:any=[];
  public showLoadingIndicator: boolean =false;
  public p:number=0;
  public locality_length:number=0;
  public locality_data:any={};
  public Pagination_data: Pagination;
  public details:any;
  public state_data:any;
  public disabled:boolean=false;
  public disabled_update_btn:boolean=false;
  public filteredOptions!: Observable<any[]>;
  public filteredOptions1!: Observable<any[]>;

  locality_form = new FormGroup({
    district:  new FormControl('', Validators.required),
    district_id:new FormControl('',Validators.required),
    locality:  new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    state: new FormControl('1', Validators.required),
  });
  searching_form = new FormGroup({
    search_state: new FormControl('1', Validators.required),
    search_district: new FormControl('', Validators.required),
    search_district_id: new FormControl('', Validators.required),
    search_locality: new FormControl(''),
  });

  constructor(private AreaListService:AreaListService,
    private toastr: ToastrService) { 
      this.Pagination_data = new Pagination();
    }

  ngOnInit(): void { 
    this.get_state_data();
    this.filteredOptions = this.locality_form.controls.district.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
    this.filteredOptions1 = this.searching_form.controls.search_district.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter1(value))
    );
  }
  nosubmit(){
    this.toastr.error('At Least One Filed Select');
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
  onchange_state(){
    this.locality_form.patchValue({
      locality:'',
      district_id:'',
      district:''
    });
    this.dropdownList=[];
    this.filteredOptions = this.locality_form.controls.district.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }
  
  get_district(value:any){
    if(value.length>2){
      let param={value:value,state_id:this.locality_form.value.state}
      this.AreaListService.get_district_search(param).subscribe(
        response => {
          let data:any=response;
          this.dropdownList=[];
          if(data?.data?.length>0){
            for (let i = 0; i < data.data.length; i++) {
              this.dropdownList = this.dropdownList?.concat({district_id: data.data[i].district_id,district: data.data[i].district});
            }
            this.filteredOptions = this.locality_form.controls.district.valueChanges
              .pipe(
                startWith(''),
                map((value) => this._filter(value))
              );
          }else{
            this.dropdownList=[];
            this.locality_form.patchValue({district_id:''});
          }
         
        }, err => {   
        }
      );
    }else{
      this.dropdownList=[];
      this.locality_form.patchValue({district_id:''});
    
    }
  }
  onchange_state_search(){
    this.searching_form.patchValue({
      search_district:'',
      search_district_id:''
    });
    this.dropdownList1=[];
    this.filteredOptions1 = this.searching_form.controls.search_district.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter1(value))
    );
  }
  get_district1(value:any){
    if(value.length>2){
      let param={value:value,state_id:this.searching_form.value.search_state}
      this.AreaListService.get_district_search(param).subscribe(
        response => {
          let data:any=response;
          this.dropdownList1=[];
          if(data?.data?.length>0){
            for (let i = 0; i < data.data.length; i++) {
              this.dropdownList1 = this.dropdownList1?.concat({serach_district_id: data.data[i].district_id,search_district: data.data[i].district});
            }
            this.filteredOptions1 = this.searching_form.controls.search_district.valueChanges
              .pipe(
                startWith(''),
                map((value) => this._filter1(value))
              );
          }else{
            this.dropdownList1=[];
            this.searching_form.patchValue({search_district_id:''});
          }
         
        }, err => {   
        }
      );
    }else{
      this.dropdownList=[];
      this.searching_form.patchValue({search_district_id:''});
    
    }
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

  private _filter1(value: any): string[] {
    if (value.search_district) {
      const filterValue = value.search_district.toLowerCase();
      return this.dropdownList1?.filter((option: any) => option.search_district.toLowerCase().includes(filterValue));
    }
    else {
      const filterValue = value.toLowerCase();
      return this.dropdownList1?.filter((option: any) => option.search_district.toLowerCase().includes(filterValue));
    }
  }
  Onsearch(){
    if(this.searching_form.invalid){
      this.search_submitted = true;
      return;
    }else{
    let param = { district_id: this.searching_form.value.search_district_id}
      this.AreaListService.get_locality_byid(param).then(
        Pagination_data => {
          this.locality_data=Pagination_data;
          this.locality_length=this.locality_data.data.total;
          this.showLoadingIndicator=false;
        }, err => {
        }
      );
    }
  }
  
  searching(value:any){
    if(value.length>2){
      let param={value:value,search_district_id:this.searching_form.value.search_district_id}
      this.AreaListService.get_locality_searching(param).then(
        Pagination_data => {
          this.locality_data=Pagination_data;
          this.locality_length=this.locality_data.data.total;
          this.showLoadingIndicator=false;
        }, err => {
        }
      );
    } 
    else if(value.length==0){
      this.Onsearch();
     }
  }
  onSubmit(){
    if(this.locality_form.invalid){
      this.submitted = true;
      return;
    }else{
      this.AreaListService.locality_create(this.locality_form.value).subscribe(
        response => {
          let data:any=response;
          this.showLoadingIndicator = false;
          this.locality_form.patchValue({
            district:"",
            district_id:'',
            locality:'',
            locality_id:'',
            status:'',
          });
          this.toastr.success('Locality Create Successfully');
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
  
  change_selected_district(data:any){
    this.locality_form.patchValue({district_id:data.district_id});
  }
  change_selected_district1(data:any){
    this.searching_form.patchValue({search_district_id:data.serach_district_id});
  }

  gotoPage(link_url: any) {
    this.showLoadingIndicator = true;
    let param = { district_id: this.searching_form.value.search_district_id}
    this.AreaListService.getpagination1(link_url,param).then(Pagination_data => {
      this.showLoadingIndicator= false;
      this.locality_data=Pagination_data;
      // this.user_list_length=this.user_list.data.data.length;
    });
  }

  get f() {
    return this.locality_form.controls;
  }
  get s() {
    return this.searching_form.controls;
  }


  delete_locality(id:any){
    this.showLoadingIndicator = true;
    let param = { locality_id: id}
    this.AreaListService.delete_locality(param).pipe().subscribe(
      response=> {
        this.showLoadingIndicator =false;;
        let data:any=response;
        let Message =data.message;
        this.toastr.error(Message, 'Locality', {
          timeOut: 3000,
        });
        this.Onsearch();
      },
      err => {
       this.showLoadingIndicator = false;
      }
    )
  }
  
  locality_status_changes(id:any){
    let param = { locality_id: id}
    this.AreaListService.locality_status_changes(param).subscribe(
      response => {
        this.showLoadingIndicator =false;
        let data:any=response;
        this.toastr.success('Status Updated', 'Locality', {
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
    this.searching_form.patchValue({search_locality:'',search_state:'',search_district_id:'',search_district:''});
    this.locality_length=0;
    this.locality_data='';
  }

}

