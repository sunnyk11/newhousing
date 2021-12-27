import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { ElementRef, Input, NgZone, ViewChild } from '@angular/core';
import { Options, LabelType } from '@angular-slider/ngx-slider';
import { ToastrService } from 'ngx-toastr';
import { RentPropertyService } from '../../services/rent-property.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-listproperty-rent',
  templateUrl: './listproperty-rent.component.html',
  styleUrls: ['./listproperty-rent.component.css']
})
export class ListpropertyRentComponent implements OnInit {

  public dropdownList: any = [];
  public dropdown_sublocality:any=[];
  options: Options = {
    step: 500,
    floor: 5000,
    ceil: 500000,
    translate: (value: number, label: LabelType): string => {
      return '₹' + value.toLocaleString('en');
    },
  };

  addition_room: addition_room = [
    { id: 1, name: "Pooja  Room" },
    { id: 2, name: "Study Room" },
    { id: 3, name: "Servant  Room" },
    { id: 4, name: "Other Room" }
  ];

  @ViewChild("search")
  searchElementRef!: ElementRef;
  @ViewChild(AgmMap, { static: true })
  public agmMap!: AgmMap;
  zoom!: number;
  location: any = '';
  geoCoder: any;
  public latCus: any;
  public longCus: any;
  public address_concated:any;
  public locality_data: any = [];
  public Expected_PriceEroor: boolean = false;
  public add_room_tab: boolean = false;
  public parking_row: boolean = false;
  public maintenance_row: boolean = false;
  public price_negotiable_row: boolean = false;
  public furnish_row: boolean = false;
  public showLoadingIndicator: boolean = false;
  public amenties: any = [];
  public amenityArray: any = [];
  public additional_room_array: any = [];
  public selectedItems: any = [];
  public submitted1: boolean = false;
  public submitted2: boolean = false;
  public submitted3: boolean = false;
  public submitted4: boolean = false;
  dropdownSettings!: IDropdownSettings;
  dropdownSettings1!: IDropdownSettings;
  public dropdown_locality:any=[];
  public filteredOptions!: Observable<any[]>;

  private product_img: any = [];
  private selected_room: any = [];

  image1: string | ArrayBuffer | null | undefined;
  image2: string | ArrayBuffer | null | undefined;
  image3: string | ArrayBuffer | null | undefined;
  image4: string | ArrayBuffer | null | undefined;
  image5: string | ArrayBuffer | null | undefined;

  form_step1: FormGroup = new FormGroup({});
  form_step2: FormGroup = new FormGroup({});
  form_step3: FormGroup = new FormGroup({});
  form_step4: FormGroup = new FormGroup({});
  update_room_array: any = [];

  public submitted: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private toastr: ToastrService,
    private RentPropertyService: RentPropertyService,
    private router: Router,
    private CommonService: CommonService,
  ) {
  }

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'locality_id',
      textField: 'locality_text',
      enableCheckAll: false,
      itemsShowLimit: 1, 
      allowSearchFilter: true,
      closeDropDownOnSelection:true,
      noDataAvailablePlaceholderText: "Locality not Availabale",
      maxHeight: 250,
      clearSearchFilter:true,
      showSelectedItemsAtTop:true,
    };
    
    this.dropdownSettings1 = {
      singleSelection: true,
      idField: 'sub_locality_id',
      textField: 'sub_locality_text',
      enableCheckAll: false,
      itemsShowLimit: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection:true,
      noDataAvailablePlaceholderText: "Sub Locality not Availabale",
      maxHeight: 250,
    };
    this.getAmenities();
    this.google_map();
    this.form_step1 = this._formBuilder.group({
      property_name: ['', Validators.required],
      draft_form_id: ['0'],
      property_type: ['', Validators.required],
      area_unit: ['', Validators.required],
      property_area: ['', Validators.required],
      bedrooms: ['', Validators.required],
      bathrooms: ['', Validators.required],
      balconies: ['', Validators.required],
      property_desc: ['', Validators.required]
    });

    this.form_step2 = this._formBuilder.group({
      address: ['', Validators.required],
      address_details: ['', Validators.required],
      city: ['1', Validators.required],
      district_id: ['', Validators.required],
      locality: ['', Validators.required],
      locality_data: ['', Validators.required],
      sub_locality: ['', Validators.required],
      map_latitude: ['', Validators.required],
      map_longitude: ['', Validators.required]
    });

    this.form_step3 = this._formBuilder.group({
      additional_rooms: ['0', Validators.required],
      facing_towards: ['', Validators.required],
      year_built: ['', Validators.required],
      furnishings: ['0', Validators.required],
      willing_to_rent: ['', Validators.required],
      agreement_type: ['', Validators.required],
      reserved_parking: ['0', Validators.required],
      parking_open_count: [''],
      parking_covered_count: [''],
      available_date: ['', Validators.required],
      notice_month: ['', Validators.required],
      agreement_duration: ['', Validators.required],
      property_floor: ['', Validators.required],
      // availability_condition: ['', Validators.required],
      total_floors: ['', Validators.required]
    });

    this.form_step4 = this._formBuilder.group({
      security_deposit: ['', Validators.required],
      expected_rent: ['5000', Validators.required],
      electricity_water: ['0', Validators.required],
      price_negotiable_status: ['0', Validators.required],
      price_negotiable: [''],
      // tax_govt_charge: ['0', Validators.required],
      maintenance_charge_status: ['0', Validators.required],
      maintenance_charge: [''],
      maintenance_charge_condition: [''],
      images: [''],
      video_link: [''],
      sliderControl: [[5000]]
    });
    this.selectedItems = new Array<string>();
    this.product_img = new Array<string>();
    this.selected_room = new Array<string>();
    this.filteredOptions = this.form_step2.controls.locality_data.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
    
  }
   
  selected_locality(data:any){
    this.form_step2.patchValue({locality:data.item_id});
    this.address_concated= data.item_text + ', Delhi';
    this.form_step2.patchValue({
      address:this.address_concated
    });
    let param = { Locality_id:data.item_id}
    this.CommonService.get_sub_locality(param).subscribe(
      response => {
        let data:any=response;
        this.dropdown_sublocality=[];
        this.form_step2.patchValue({sub_locality:''});
        if(data.data.length<1){
          this.dropdown_sublocality=[];
          this.form_step2.patchValue({
            sub_locality:'',
            district_id:''
          });
        }else{
          this.form_step2.patchValue({
            district_id:data.district.district.district_id
          });
          for (let i = 1; i < data.data.length; i++) {
            this.dropdown_sublocality = this.dropdown_sublocality?.concat({ sub_locality_id: data.data[i].sub_locality_id, sub_locality_text: data.data[i].sub_locality});
          }
        }
      }
    );
    
  }
  get_locality(value:any){
    if(value.length>2){
      this.CommonService.get_search_locality(value).subscribe(
        response => {
          let data:any=response;
          this.dropdownList=[];
          if(data?.data[0]?.length>0){
            for (let i = 0; i < data.data[0].length; i++) {
              this.dropdownList = this.dropdownList?.concat({ item_id: data.data[0][i].locality_id, item_text: data.data[0][i].locality});
            }
            this.filteredOptions = this.form_step2.controls.locality_data.valueChanges
              .pipe(
                startWith(''),
                map((value) => this._filter(value))
              );
          }else{
            this.dropdownList=[];
            this.dropdown_sublocality=[];
            this.form_step2.patchValue({locality:'',sub_locality:''});
          }
         
        }, err => {   
        }
      );
    }else{
      this.dropdownList=[];
      this.dropdown_sublocality=[];
      this.form_step2.patchValue({locality:'',sub_locality:'',address:''});
    }
  }

  private _filter(value: any): string[] {
    if (value.item_text) {
      const filterValue = value.item_text.toLowerCase();
      return this.dropdownList?.filter((option: any) => option.item_text.toLowerCase().includes(filterValue));
    }
    else {
      const filterValue = value.toLowerCase();
      return this.dropdownList?.filter((option: any) => option.item_text.toLowerCase().includes(filterValue));
    }
  }

  get step1() {
    return this.form_step1.controls;
  }
  get step2() {
    return this.form_step2.controls;
    
  }
  get step3() {
    return this.form_step3.controls;
  }
  get step4() {
    return this.form_step4.controls;
  }
  step1_next() {
    this.submitted1 = true;
  }
  step2_next() {
    this.submitted2 = true;
  }
  step3_next() {
    this.submitted3 = true;
  }

  get_locality1() {
    this.CommonService.get_locality({ param: null }).subscribe(
      response => {
        let data:any=response;
        if(data.data.length<1){
          this.dropdown_sublocality=[];
          this.form_step2.patchValue({sub_locality:''});
        }else{
          for (let i = 1; i < data.data.length; i++) {
            this.dropdown_locality = this.dropdown_locality.concat({locality_id: data.data[i].locality_id, locality_text:  data.data[i].locality}); 
          }
        }
      },
      (err: any) => {
      }
    );
  }
  onchange_locality(id: any) {
    this.address_concated= id.locality_text + ', Delhi';
    this.form_step2.patchValue({
      address:this.address_concated
    });
    let param = { Locality_id:id.locality_id}
    this.CommonService.get_sub_locality(param).subscribe(
      response => {
        let data:any=response;
        this.dropdown_sublocality=[];
        this.form_step2.patchValue({sub_locality:''});
        if(data.data.length<1){
          this.dropdown_sublocality=[];
          this.form_step2.patchValue({
            sub_locality:'',
            district_id:''
          });
        }else{
          this.form_step2.patchValue({
            district_id:data.district.district.district_id
          });
          for (let i = 1; i < data.data.length; i++) {
            this.dropdown_sublocality = this.dropdown_sublocality?.concat({ sub_locality_id: data.data[i].sub_locality_id, sub_locality_text: data.data[i].sub_locality});
          }
        }
      }
    );
  }
  google_map() {
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
    });
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.location = place.formatted_address;
          this.latCus = place.geometry?.location.lat();
          this.longCus = place.geometry?.location.lng();
          this.zoom = 15;
          this.form_step2.patchValue({
            address: this.location,
            map_latitude: this.latCus,
            map_longitude: this.longCus,
          });
        });
      });
    });
  }
  getLocation() {
    this.CommonService.getLocationService().then(resp => {
      this.longCus = parseFloat(resp.lng);
      this.latCus = parseFloat(resp.lat);
      this.form_step2.patchValue({
        address: this.location,
        map_latitude: this.latCus,
        map_longitude: this.longCus,
      });
    })
  }
  markerDragEnd($event: google.maps.MouseEvent) {
    this.latCus = $event.latLng.lat();
    this.longCus = $event.latLng.lng();
    this.geoCoder.geocode({ 'location': { lat: this.latCus, lng: this.longCus } }, (results: any, status: any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.form_step2.patchValue({
            address: results[0].formatted_address,
            map_latitude: this.latCus,
            map_longitude: this.longCus,
          });
        }
      }
    });
  }
  // fetch amenties advance tab
  getAmenities() {
    this.CommonService.getAmenities({ param: null }).subscribe(
      response => {
        this.amenties = response;
      }
    );
  }
  submit_rent() {
    this.showLoadingIndicator = true;
    if (this.form_step4.invalid) {
      this.submitted4 = true;
      this.showLoadingIndicator = false;
      return;
    } else {
      this.form_step4.value.draft_form_id='0';
      if(this.form_step2.value.locality.length>0){
        this.form_step2.value.locality=this.form_step2.value.locality[0].locality_id;
      }
      if(this.form_step2.value.sub_locality.length>0){
        this.form_step2.value.sub_locality=this.form_step2.value.sub_locality[0].sub_locality_id;
      }
      let param = {form_step1: this.form_step1.value, form_step2: this.form_step2.value, form_step3: this.form_step3.value, form_step4: this.form_step4.value, rooms: this.additional_room_array, amenties: this.amenityArray, images: this.product_img }
      if (this.form_step4.value.expected_rent >= 5000 && this.form_step4.value.expected_rent <= 500000) {
        this.RentPropertyService.product_insert_rent(param).subscribe(
          response => {
            let data: any = response;
            this.form_step1.patchValue({
              draft_form_id: data.last_id,
            });
            this.showLoadingIndicator = false;
            this.toastr.success('Successfuly Saved', 'Property Rental', {
              timeOut: 3000,
            });
            this.router.navigate(['/agent/my-properties']);
            this.showLoadingIndicator = false;
          }, err => {
            this.showLoadingIndicator = false;
            let Message = err.error.message;
            this.toastr.error(Message, 'Something Error', {
              timeOut: 3000,
            });
          }
        );
      } else {
        this.toastr.error("Expected Price Between 5k to 5 5Lakhs", 'Price Invalid..!!', {
          timeOut: 2000,
        }
        );
      };
    }
  }
  // draft property 
  save_draft() {
   if(this.form_step2.value.locality.length>0){
      this.form_step2.value.locality=this.form_step2.value.locality[0].locality_id;
    }
    if(this.form_step2.value.sub_locality.length>0){
      this.form_step2.value.sub_locality=this.form_step2.value.sub_locality[0].sub_locality_id;
    }
    this.form_step4.value.draft_form_id='1';
    let param = { form_step1: this.form_step1.value, form_step2: this.form_step2.value, form_step3: this.form_step3.value, form_step4: this.form_step4.value, rooms: this.additional_room_array, amenties: this.amenityArray, images: this.product_img }
    if (this.form_step4.value.expected_rent >= 5000 && this.form_step4.value.expected_rent <= 500000) {
      this.RentPropertyService.product_insert_rent(param).subscribe(
        response => {
          let data: any = response;
          this.form_step1.patchValue({
            draft_form_id: data.last_id,
          });
          let Message = data.message;
          this.toastr.info(Message, 'Draft Property', {
            timeOut: 3000,
          });
          this.showLoadingIndicator = false;
        }, err => {
          this.showLoadingIndicator = false;
          let Message = err.error.message;
          this.toastr.error(Message, 'Something Error', {
            timeOut: 3000,
          });
        }
      );
    } else {
      this.showLoadingIndicator = false;
      this.toastr.error("Expected Price Between 5k to 5Lakhs", 'Price Invalid..!!', {
        timeOut: 2000,
      }
      );
    }
  }

  keyPressNumbers(event: { which: any; keyCode: any; preventDefault: () => void; }) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
  onchange_add_room(event: number) {
    if (event == 1) {
      this.add_room_tab = true;
    } else {
      this.add_room_tab = false;
      this.additional_room_array = [];
      this.selected_room = [];
    }
  }
  furnishStatus(event: any): void {
    if (event == '1') {
      this.furnish_row = true;
    }
    else {
      this.furnish_row = false;
      this.amenityArray = [];
      this.selectedItems = [];
    }
  }
  parkingStatus(event: number): void {
    if (event == 1) {
      this.parking_row = true;
    }
    else {
      this.parking_row = false;
      this.price_negotiable_row = false;
      this.form_step3.patchValue({
        parking_covered_count: '',
        parking_open_count: '',
      });
    }
  }
  price_negotiable_status(event: number): void {
    if (event == 1) {
      this.price_negotiable_row = true;
    }
    else {
      this.price_negotiable_row = false;
      this.form_step4.patchValue({
        price_negotiable: '',
      });
    }
  }
  rangeInput_Price(event: number) {
    if (event < 5000 || event > 500000) {
      this.Expected_PriceEroor = true;
    } else {
      this.Expected_PriceEroor = false;
      this.form_step4.patchValue({
        sliderControl: [event],
      });
    }
  }
  RangeSlider_Price(event: number) {
    if (event < 5000 || event > 500000) {
      this.Expected_PriceEroor = true;
    } else {
      this.Expected_PriceEroor = false;
      this.form_step4.patchValue({
        expected_rent: event,
      });
    }
  }
  maintenanceStatus(event: number): void {
    if (event == 1) {
      this.maintenance_row = true;
    }
    else {
      this.maintenance_row = false;
      this.form_step4.patchValue({
        maintenance_charge: '',
        maintenance_charge_condition: '',
      });
    }
  }
  onchange_rooms(e: any, id: string) {
    if (e.target.checked) {
      this.selected_room.push(id);
    } else {
      this.selected_room = this.selected_room.filter((m: any) => m != id);
    }
    this.additional_room_array = this.selected_room;
  }

  onchangeAmenties(e: any, id: string) {
    if (e.target.checked) {
      this.selectedItems.push(id);
    } else {
      this.selectedItems = this.selectedItems.filter((m: any) => m != id);
    }
    this.amenityArray = this.selectedItems;
  }
  insert_image(event: any) {
    let files: any = event.target.files;
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.toastr.error("Only Image Supported");
      return;
    }
    this.product_img = [];
    if (event.target.files.length <= 5) {
      for (let i = 0; i < event.target.files.length; i++) {
        if (i == 0) {
          this.readThis1(event.target.files[0]);
        }
        if (i == 1) {
          this.readThis2(event.target.files[1]);
        }
        if (i == 2) {
          this.readThis3(event.target.files[2]);
        }
        if (i == 3) {
          this.readThis4(event.target.files[3]);
        }
        if (i == 4) {
          this.readThis5(event.target.files[4]);
        }
      }
    } else {
      this.toastr.error("Maximum 5 Images Selected", 'Image Upload Error!!!...', {
        timeOut: 1500,
      });
    }
  }

  readThis1(inputValue: any): void {
    var file: File = inputValue;
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.image1 = myReader.result;
      if (this.image1 != null) {
        this.product_img.push(this.image1);
      }
    }
    myReader.readAsDataURL(file);
  }

  insert_image2(event: any) {
    this.readThis2(event.target)
  }

  readThis2(inputValue: any): void {
    var file: File = inputValue;
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.image2 = myReader.result;
      if (this.image2 != null) {
        this.product_img.push(this.image2);
      }
    }
    myReader.readAsDataURL(file);
  }

  insert_image3(event: any) {
    this.readThis3(event.target)
  }

  readThis3(inputValue: any): void {
    var file: File = inputValue;
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.image3 = myReader.result;
      if (this.image3 != null) {
        this.product_img.push(this.image3);
      }
    }
    myReader.readAsDataURL(file);
  }

  insert_image4(event: any) {
    this.readThis4(event.target)
  }

  readThis4(inputValue: any): void {
    var file: File = inputValue;
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.image4 = myReader.result;
      if (this.image4 != null) {
        this.product_img.push(this.image4);
      }
    }
    myReader.readAsDataURL(file);
  }

  insert_image5(event: any) {
    this.readThis5(event.target)
  }

  readThis5(inputValue: any): void {
    var file: File = inputValue;
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.image5 = myReader.result;
      if (this.image5 != null) {
        this.product_img.push(this.image5);
      }
    }
    myReader.readAsDataURL(file);
  }

  delete_pic1(id: any) {
    this.image1 = null;
    this.product_img = this.product_img.filter((m: any) => m != id);
  }
  delete_pic2(id: any) {
    this.image2 = null;
    this.product_img = this.product_img.filter((m: any) => m != id);
  }
  delete_pic3(id: any) {
    this.image3 = null;
    this.product_img = this.product_img.filter((m: any) => m != id);
  }
  delete_pic4(id: any) {
    this.image4 = null;
    this.product_img = this.product_img.filter((m: any) => m != id);
  }
  delete_pic5(id: any) {
    this.image5 = null;
    this.product_img = this.product_img.filter((m: any) => m != id);
  }
}
type addition_room = Array<{ id: number; name: string }>;
