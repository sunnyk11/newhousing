import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapsAPILoader, AgmMap } from '@agm/core';
// import { google } from "google-maps";
import { ElementRef, Input, NgZone, ViewChild } from '@angular/core';
import { Options,LabelType } from '@angular-slider/ngx-slider';
import { ToastrService } from 'ngx-toastr';
import { Router,ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonService } from '../../services/common.service';
import { RentPropertyService } from '../../services/rent-property.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-updateproperty-rent',
  templateUrl: './updateproperty-rent.component.html',
  styleUrls: ['./updateproperty-rent.component.css']
})
export class UpdatepropertyRentComponent implements OnInit {
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
  public latCus:any;
  public longCus:any;
  public locality_data:any=[];
  public Expected_PriceEroor: boolean = false;
  public add_room_tab:boolean=false;
  public parking_row: boolean = false;
  public maintenance_row:boolean=false;
  public price_negotiable_row:boolean=false;
  public furnish_row:boolean=false;
  public showLoadingIndicator:boolean=false;
  public show_draft_btn: boolean = false;
  public amenties:any=[];
  public videolink:number=0;
  public youtube_url: any;
  public safeURL: any;
  public  amenityArray:any= [];
  public  additional_room_array:any=[];
  public  selectedItems: any=[];
  public prod_id:any=null;
  public product_img_length: number = 0;
  public siteURL=environment.siteURL;
  public ftpstring=environment.ftpURL;
  public selected_product_img:any=[];
  public property_length:number=0;
  public property_show:boolean=false;
  public submitted1: boolean = false;
  public submitted2: boolean = false;
  public submitted3: boolean = false;
  public submitted4: boolean = false;

  private update_room_array: any = [];
  private unique_room_array: any = [];
  private add_room_string: any = [];
  private product_img: any = [];
  private selected_room:any=[];
  private product_amenties:any=[];
  private unique_amentites:any=[];
  private search_amenties_convert:any=[];
  private p_images: number = 5;
  
  image1: string | ArrayBuffer | null | undefined;
  image2: string | ArrayBuffer | null | undefined;
  image3: string | ArrayBuffer | null | undefined;
  image4: string | ArrayBuffer | null | undefined;
  image5: string | ArrayBuffer | null | undefined;
  
  form_step1: FormGroup = new FormGroup({});
  form_step2: FormGroup = new FormGroup({});
  form_step3: FormGroup = new FormGroup({});
  form_step4: FormGroup = new FormGroup({});

  constructor(
    private _formBuilder: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private toastr: ToastrService,
    private CommonService:CommonService,
    private router:Router,
    private _sanitizer: DomSanitizer,
    private RentPropertyService:RentPropertyService,
    private route:ActivatedRoute
    ) { 
      this.route.queryParams.subscribe((params) => {
        if(params.id.length>0){
          this.prod_id = params.id;
          this.property_details(this.prod_id);
        }else{
          this.redirect_to_myproperty();
        }
      });
      this.get_locality();
    }

 
  ngOnInit(): void {
   this.getLocation();
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
      maintenance_charge: [''],
      maintenance_charge_condition: [''],
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
  getLocation() {
    this.CommonService.getLocationService().then(resp => {
      this.longCus = parseFloat(resp.lng);
      this.latCus = parseFloat(resp.lat);
      this.form_step2.patchValue({
        map_latitude: this.latCus,
        map_longitude: this.longCus,
      });
    })
  }  
  
  property_details(prod_id:number): void {
    this.showLoadingIndicator =true;
    this.property_show=false;
    let param = { id: prod_id }
    this.RentPropertyService.property_get_id(param).subscribe(
      response => {
        let data:any =response;
        if(data.data == null){
          this.redirect_to_myproperty();
        }else{
          this.property_show=true;
          this.google_map();
          if(data.data.additional_rooms_status == 1){
            this.add_room_string = data.data.additional_rooms;
            this.update_room_array = this.add_room_string.split(',');
            this.additional_room_array = this.update_room_array;
            this.form_step3.patchValue({
              additional_rooms: data.data.additional_rooms_status
            });
            this.add_room_tab=true;
          }
          // amenties details fetch 
          this.product_amenties = data.data.amenities;
          this.selected_product_img = data.data.product_img;
          this.product_img_length = this.selected_product_img?.length;
          if(this.product_amenties.length>0){
            for (let i = 0; i < this.product_amenties.length; i++) {
              this.search_amenties_convert.push(this.product_amenties[i].amenties.id);
            }
            this.amenityArray=this.search_amenties_convert;
          }
          this.latCus=parseFloat(data.data.map_latitude);
          this.longCus=parseFloat(data.data.map_longitude);
          this.form_step2.patchValue({
            map_latitude: data.data.map_latitude,
            map_longitude: data.data.map_longitude
          });
          if (data.data.draft == 1) {
            this.show_draft_btn = true;
          }
          if(data.data.build_name != null){
            this.form_step1.patchValue({
              property_name:  data.data.build_name
            });
          }
          if(data.data.type != null){
            this.form_step1.patchValue({
              property_type:  data.data.type
            });
          }
          if(data.data.area_unit != null){
            this.form_step1.patchValue({
              area_unit:  data.data.area_unit
            });
          }
          if(data.data.area != null){
            this.form_step1.patchValue({
              property_area:  data.data.area
            });
          }
          if(data.data.bedroom != null){
            this.form_step1.patchValue({
              bedrooms:  data.data.bedroom
            });
          }
          if(data.data.bathroom != null){
            this.form_step1.patchValue({
              bathrooms:  data.data.bathroom
            });
          }
          if(data.data.balconies != null){
            this.form_step1.patchValue({
              balconies:  data.data.balconies
            });
          }
          if(data.data.property_detail != null){
            this.form_step1.patchValue({
              property_desc:  data.data.property_detail
            });
          }
          // step 2 
          if(data.data.address != null){
            this.form_step2.patchValue({
              address:  data.data.address
            });
          }
          if(data.data.city != null){
            this.form_step2.patchValue({
              city:  data.data.city
            });
          }
          if(data.data.locality != null){
            this.form_step2.patchValue({
              locality:  data.data.locality
            });
          }
          if(data.data.pincode != null){
            this.form_step2.patchValue({
              pincode:  data.data.pincode
            });
          }
          if(data.data.nearest_landmark != null){
            this.form_step2.patchValue({
              nearest_place:  data.data.nearest_landmark
            });
          }
          // step 3 
          if(data.data.facing_towards != null){
            this.form_step3.patchValue({
              facing_towards:  data.data.facing_towards
            });
          }
          if(data.data.buildyear != null){
            this.form_step3.patchValue({
              year_built:  data.data.buildyear
            });
          }
          if(data.data.furnishing_status == 1){
            this.form_step3.patchValue({
              furnishings:  data.data.furnishing_status
            });
            this.furnish_row=true;
          }
          if(data.data.willing_to_rent_out_to != null){
            this.form_step3.patchValue({
              willing_to_rent:  data.data.willing_to_rent_out_to
            });
          }
          if(data.data.agreement_type != null){
            this.form_step3.patchValue({
              agreement_type:  data.data.agreement_type
            });
          }
          if(data.data.additional_parking_status==1){
            this.form_step3.patchValue({
              reserved_parking:  data.data.additional_parking_status
            });
            this.parking_row=true;
          }
          if(data.data.parking_open_count != null){
            this.form_step3.patchValue({
              parking_open_count:  data.data.parking_open_count
            });
          }
          if(data.data.parking_covered_count != null){
            this.form_step3.patchValue({
              parking_covered_count:  data.data.parking_covered_count
            });
          }
          if(data.data.available_for != null){
            this.form_step3.patchValue({
              available_date:  data.data.available_for
            });
          }
          if(data.data.month_of_notice != null){
            this.form_step3.patchValue({
              notice_month:  data.data.month_of_notice
            });
          }
          if(data.data.duration_of_rent_aggreement != null){
            this.form_step3.patchValue({
              agreement_duration:  data.data.duration_of_rent_aggreement
            });
          }
          if(data.data.property_on_floor != null){
            this.form_step3.patchValue({
              property_floor:  data.data.property_on_floor
            });
          }
          if(data.data.availability_condition != null){
            this.form_step3.patchValue({
              availability_condition:  data.data.availability_condition
            });
          }
          if(data.data.total_floors != null){
            this.form_step3.patchValue({
              total_floors:  data.data.total_floors
            });
          }
          // step 4
          if(data.data.security_deposit != null){
            this.form_step4.patchValue({
              security_deposit:  data.data.security_deposit
            });
          }
          if(data.data.expected_rent != null){
            this.form_step4.patchValue({
              sliderControl:  data.data.expected_rent
            });
          }
          if(data.data.inc_electricity_and_water_bill != null){
            this.form_step4.patchValue({
              electricity_water:  data.data.inc_electricity_and_water_bill
            });
          }
          if(data.data.negotiable_status != null){
            this.form_step4.patchValue({
              electricity_water:  data.data.negotiable_status
            });
          }
          if(data.data.inc_electricity_and_water_bill != null){
            this.form_step4.patchValue({
              electricity_water:  data.data.inc_electricity_and_water_bill
            });
          }
          if(data.data.negotiable_status ==1){
            this.form_step4.patchValue({
              price_negotiable_status:  data.data.negotiable_status
            });
            this.price_negotiable_row=true;
          }
          if(data.data.price_negotiable != null){
            this.form_step4.patchValue({
              price_negotiable:  data.data.price_negotiable
            });
          }
          if(data.data.tax_govt_charge != null){
            this.form_step4.patchValue({
              tax_govt_charge:  data.data.tax_govt_charge
            });
          }
          if(data.data.maintenance_charge_status == 1){
            this.form_step4.patchValue({
              maintenance_charge_status:  data.data.maintenance_charge_status
            });
            this.maintenance_row= true;
          }
          if(data.data.maintenance_charge != null){
            this.form_step4.patchValue({
              maintenance_charge:  data.data.maintenance_charge
            });
          }
          if(data.data.maintenance_charge_condition != null){
            this.form_step4.patchValue({
              maintenance_charge_condition:  data.data.maintenance_charge_condition
            });
          }
          if(data.data.video_link.length>1){
            this.form_step4.patchValue({
              video_link:  "https://www.youtube.com/watch?v=" +data.data.video_link
            });     
            this.youtube_url = "https://www.youtube-nocookie.com/embed/" +data.data.video_link+"?playlist="+data.data.video_link+"&loop=1&mute=1";          
            this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(this.youtube_url);
            this.videolink=data.data.video_link.length;       
          }
          this.showLoadingIndicator =false;
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
  submit_rent(){
    if(this.form_step4.invalid){
      this.submitted4 = true;
    }else{
      this.form_step4.value.draft_form_id='0';
      let param={id:this.prod_id,form_step1:this.form_step1.value,form_step2:this.form_step2.value,form_step3:this.form_step3.value,form_step4:this.form_step4.value,rooms:this.additional_room_array,amenties:this.amenityArray,images:this.product_img}
     if(this.form_step4.value.expected_rent >=5000 && this.form_step4.value.expected_rent <=500000){
        this.RentPropertyService.product_rent_update(param).subscribe(
          response => {
            let data:any=response;
            this.form_step1.patchValue({
              draft_form_id: data.last_id,
            }); 
            let Message =data.message;
            this.toastr.info(Message, 'Rent Property', {
              timeOut: 3000,
            });
            this.showLoadingIndicator = false;
            this.router.navigate(['/agent/my-properties']);
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
  }
   // draft property 
   save_draft(){
    this.form_step4.value.draft_form_id='1';
    let param={id:this.prod_id,form_step1:this.form_step1.value,form_step2:this.form_step2.value,form_step3:this.form_step3.value,form_step4:this.form_step4.value,rooms:this.additional_room_array,amenties:this.amenityArray,images:this.product_img} 
    if(this.form_step4.value.expected_rent >=5000 && this.form_step4.value.expected_rent <=500000){
      this.RentPropertyService.product_rent_update(param).subscribe(
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
  onchange_locality(id:any){
    let param = { id: id }
    this.CommonService.get_pincodebyid(param).subscribe(
      response => {
        let pincode_data:any=response;
        if(pincode_data.data != null){
          this.form_step2.patchValue({
            pincode: pincode_data.data.pincode
          });
        }
      }
    );
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
  }
  onchange_rooms(e: any, room: string) {
    if (e.target.checked) {
      this.update_room_array.push(room);
      const expected = new Set();
      const unique = this.update_room_array.filter((item: any) => !expected.has(JSON.stringify(item)) ? expected.add(JSON.stringify(item)) : false);
      this.unique_room_array = unique;
      this.additional_room_array = this.unique_room_array;
    } else {
      // arr.pop();
      const index: number = this.update_room_array.indexOf(room);
      if (index !== -1) {
        this.update_room_array.splice(index, 1);
        this.additional_room_array = this.update_room_array;
      }
    }
  }
  add_room_check(room: any) {
    if (this.update_room_array.length != null) {
      for (let i = 0; i < this.update_room_array.length; i++) {
        if (room == this.update_room_array[i]) {
          return true;
        }
      }
    }
    return false;
  }
  onchangeAmenties(e: any, id: string) {
    if(e.target.checked){
      this.search_amenties_convert.push(id);
      const expected = new Set();
      const unique = this.search_amenties_convert.filter((item: any) => !expected.has(JSON.stringify(item)) ? expected.add(JSON.stringify(item)) : true);
      this.unique_amentites=unique;
      this.amenityArray=this.unique_amentites;
    }else{
      const index: number = this.search_amenties_convert.indexOf(id);
        this.search_amenties_convert.splice(index, 1);
        this.amenityArray=this.search_amenties_convert;
    }
  }
  amenties_funtion(Amenties_id: any) {
    if (this.product_amenties.length != null) {
      for (let i = 0; i < this.product_amenties.length; i++) {
        if (Amenties_id == this.product_amenties[i].amenties.id) {
          return true;
        }
      }
    }
    return false;
  }
  furnishStatus(event:any): void {
    if (event == '1') {
      this.furnish_row=true;
    }
    else {
      this.furnish_row=false;
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
   insert_image(event:any) {
    let files:any = event.target.files;
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.toastr.error("Only Image Supported");
      return;
    }
    let files_length:any = this.p_images - this.product_img_length;
    if (event.target.files.length <=files_length) {
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
    }else {
      this.toastr.error("Maximum (" + files_length + ") Images Selected", 'Image Upload Error!!!...', {
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
   }
   delete_pic2(id:any) {
     this.image2 = null;
     this.product_img = this.product_img.filter((m: any) => m != id);
   }
   delete_pic3(id:any){
     this.image3 = null;
     this.product_img = this.product_img.filter((m: any) => m != id);
   }
   delete_pic4(id:any){
     this.image4 = null;
     this.product_img = this.product_img.filter((m: any) => m != id);
   }
   delete_pic5(id:any) {
     this.image5 = null;
     this.product_img = this.product_img.filter((m: any) => m != id);
   }
   delete_Pro_img(id:number){
     let param = {product_id: id}
     this.RentPropertyService.delete_pro_img(param).subscribe(
      response => {
        let data:any=response;
        let Message =data.message;
        this.toastr.success(Message, 'Rent property', {
          timeOut: 3000,
        });
        this.property_details(this.prod_id);
      }, err => { 
        }
    );
   }
   delete_video(product_id:any,video:any){  
    let param = { product_id: product_id,video:video }
    this.RentPropertyService.delete_video(param).subscribe(
      response => {
        let data:any=response;
        let Message =data.message;
        this.form_step4.patchValue({
          video_link: ''
        });   
        this.videolink=0;
        this.toastr.success(Message, 'Sales property', {
          timeOut: 3000,
        });
      },err => { 
      }
    );
   }
   redirect_to_myproperty(): void {
     this.router.navigate(['/agent/my-properties'])
   }
}
type addition_room = Array<{ id: number; name: string }>;
