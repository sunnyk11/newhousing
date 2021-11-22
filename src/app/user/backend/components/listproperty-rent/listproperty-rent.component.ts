import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapsAPILoader, AgmMap } from '@agm/core';
// import { google } from "google-maps";
import { ElementRef, Input, NgZone, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Options,LabelType } from '@angular-slider/ngx-slider';
import { ToastrService } from 'ngx-toastr';
import { RentPropertyService } from '../../services/rent-property.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listproperty-rent',
  templateUrl: './listproperty-rent.component.html',
  styleUrls: ['./listproperty-rent.component.css']
})
export class ListpropertyRentComponent implements OnInit {
  
  options: Options = {
    step:500,
    floor: 5000,
    ceil: 500000,
    translate: (value: number, label: LabelType): string => {
      return '₹' + value.toLocaleString('en');
    },
  };

  addition_room: addition_room= [
    { id: 1, name: "Pooja  Room"},
    { id: 2, name: "Study Room"},
    { id: 3, name: "Servant  Room"},
    { id: 4, name: "Other Room"}
  ];

  @ViewChild("search")
  searchElementRef!: ElementRef;
  @ViewChild(AgmMap, { static: true })
  public agmMap!: AgmMap;
  zoom!: number;
  location:any='';
  geoCoder:any;
  public latCus:any=78.89;
  public longCus:any=76.897;
  public locality_data:any=[];
  public Expected_PriceEroor: boolean = false;
  public add_room_tab:boolean=false;
  public parking_row: boolean = false;
  public maintenance_row:boolean=false;
  public price_negotiable_row:boolean=false;
  public furnish_row:boolean=false;
  public showLoadingIndicator:boolean=false;
  public amenties:any=[];
  public  amenityArray:any= [];
  public  additional_room_array:any=[];
  public  selectedItems: any=[];

  private product_img: any = [];
  private selected_room:any=[];
  
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


  constructor(
    private _formBuilder: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private toastr: ToastrService,
    private RentPropertyService:RentPropertyService,
    private router:Router,
    private CommonService:CommonService
    ) {
      this.getLocation();
     }

  ngOnInit(): void {
   this.google_map();
   this.get_locality();
   this.getAmenities();

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
      address: [' ', Validators.required],
      city: ['Delhi', Validators.required],
      locality: ['', Validators.required],
      pincode: ['', Validators.required],
      map_latitude:['',Validators.required],
      map_longitude:['',Validators.required],
      nearest_place: ['', Validators.required]
    });

    this.form_step3 = this._formBuilder.group({
      additional_rooms: ['0', Validators.required],
      facing_towards: ['', Validators.required],
      year_built: ['', Validators.required],
      furnishings: ['0', Validators.required],
      willing_to_rent: ['', Validators.required],
      agreement_type: ['', Validators.required],
      reserved_parking:['0',Validators.required],
      parking_open_count:[''],
      parking_covered_count:[''],
      available_date: ['', Validators.required],
      notice_month: ['', Validators.required],
      agreement_duration: ['', Validators.required],
      property_floor: ['', Validators.required],
      availability_condition: ['', Validators.required],
      total_floors: ['', Validators.required]
    });

    this.form_step4 = this._formBuilder.group({
      security_deposit: ['', Validators.required],
      expected_rent: ['5000', Validators.required],
      electricity_water: ['', Validators.required],
      price_negotiable_status: ['0', Validators.required],
      price_negotiable: [''],
      tax_govt_charge: ['0', Validators.required],
      maintenance_charge_status: ['0', Validators.required],
      maintenance_charge: ['', Validators.required],
      maintenance_charge_condition: ['', Validators.required],
      images: [''],
      video_link: [''],
      sliderControl: [[5000]]
    });
    this.selectedItems = new Array<string>();
    this.product_img = new Array<string>();
    this.selected_room = new Array<string>();
  }
  google_map(){
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
    this.geoCoder.geocode({ 'location': { lat: this.latCus, lng: this.longCus } }, (results:any, status:any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.form_step2.patchValue({
            address:results[0].formatted_address,
            map_latitude: this.latCus,
            map_longitude: this.longCus,
          });
        }
      }
    });
  }
  // fetch amenties advance tab
  getAmenities(){
    this.CommonService.getAmenities({ param: null }).subscribe(
      response => {
        this.amenties=response;
      }
    );
  }
  get_locality():void{
    this.CommonService.get_locality({ param: null }).subscribe(
      response => {
        this.locality_data=response;
      }
    );
  }
  onchange_locality(id:any){
    let param = { id: id }
    this.CommonService.get_pincodebyid(param).subscribe(
      response => {
        let pincode_data:any=response;
        this.form_step2.patchValue({
          pincode: pincode_data.data.pincode
        });
      }
    );
  }  
  submit_rent(){    
    this.form_step4.value.draft_form_id='0';
    let param={form_step1:this.form_step1.value,form_step2:this.form_step2.value,form_step3:this.form_step3.value,form_step4:this.form_step4.value,rooms:this.additional_room_array,amenties:this.amenityArray,images:this.product_img}
    if(this.form_step4.value.expected_rent >=5000 && this.form_step4.value.expected_rent <=500000){
    this.RentPropertyService.product_insert_rent(param).subscribe(
      response => {
        let data:any=response;
        this.form_step1.patchValue({
          draft_form_id: data.last_id,
        });
        this.showLoadingIndicator = false;
        this.toastr.success('Successfuly Saved', 'Property Rental', {
          timeOut: 3000,
        });
        this.router.navigate(['/list-property']); 
      }, err => { 
        this.showLoadingIndicator = false;
        let Message =err.error.message;
        this.toastr.error(Message, 'Something Error', {
          timeOut: 3000,
        });
      }
    );
  }else {
    this.toastr.error("Expected Price Between 5k to 5 5Lakhs", 'Price Invalid..!!', {
      timeOut: 2000,
    }
    );
  };
  }
  // draft property 
  save_draft(){
    this.form_step4.value.draft_form_id='1';
    let param={form_step1:this.form_step1.value,form_step2:this.form_step2.value,form_step3:this.form_step3.value,form_step4:this.form_step4.value,rooms:this.additional_room_array,amenties:this.amenityArray,images:this.product_img}
    console.log(param);  
    if(this.form_step4.value.expected_rent >=5000 && this.form_step4.value.expected_rent <=500000){
      this.RentPropertyService.product_insert_rent(param).subscribe(
        response => {
          let data:any=response;
          this.form_step1.patchValue({
            draft_form_id: data.last_id,
          }); 
          let Message =data.message;
          this.toastr.info(Message, 'Draft Property', {
            timeOut: 3000,
          });
          this.showLoadingIndicator = false;
        }, err => { 
          this.showLoadingIndicator = false;
          let Message =err.error.message;
          this.toastr.error(Message, 'Something Error', {
            timeOut: 3000,
          });
        }
      );
    }else {
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
  onchange_add_room(event:number){
    if(event==1){
      this.add_room_tab=true;
    }else{
      this.add_room_tab=false;
      this.additional_room_array=[];
      this.selected_room=[];
    }
    console.log(this.additional_room_array);
  }
  furnishStatus(event:any): void {
    if (event == '1') {
      this.furnish_row=true;
    }
    else {
      this.furnish_row=false;
      this.amenityArray=[];
      this.selectedItems=[];
    }
  }
  parkingStatus(event:number): void {
    if (event == 1) {
      this.parking_row = true;
    }
    else {
      this.parking_row = false;
    }
   }
   price_negotiable_status(event:number): void {
     if (event == 1) {
       this.price_negotiable_row = true;
     }
     else {
       this.price_negotiable_row = false;
     }
   }
  rangeInput_Price(event: number) {
    if(event<5000 || event>500000){
      this.Expected_PriceEroor=true;
    }else{
      this.Expected_PriceEroor=false;
      this.form_step4.patchValue({
        sliderControl: [event],
      });
    }
  }
  RangeSlider_Price(event: number) {
    if (event <5000 || event >500000) {
      this.Expected_PriceEroor = true;
    } else {
      this.Expected_PriceEroor = false;
      this.form_step4.patchValue({
        expected_rent: event,
      });      
    }
  }
  maintenanceStatus(event:number): void {
    if (event == 1) {
      this.maintenance_row = true;
    }
    else {
      this.maintenance_row = false;
    }
  }
  onchange_rooms(e: any, id: string){
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
  insert_image(event:any) {
    this.product_img=[];
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

  insert_image2(event:any) {
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

  insert_image3(event:any) {
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

  insert_image4(event:any) {
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

  insert_image5(event:any) {
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
  
  delete_pic1(id:any) {
    this.image1 = null;
    this.product_img = this.product_img.filter((m: any) => m != id);
    console.log(this.product_img);
  }
  delete_pic2(id:any) {
    this.image2 = null;
    this.product_img = this.product_img.filter((m: any) => m != id);
    console.log(this.product_img);
  }
  delete_pic3(id:any){
    this.image3 = null;
    this.product_img = this.product_img.filter((m: any) => m != id);
    console.log(this.product_img);
  }
  delete_pic4(id:any){
    this.image4 = null;
    this.product_img = this.product_img.filter((m: any) => m != id);
    console.log(this.product_img);
  }
  delete_pic5(id:any) {
    this.image5 = null;
    this.product_img = this.product_img.filter((m: any) => m != id);
    console.log(this.product_img);
  }

}
type addition_room = Array<{ id: number; name: string }>;
