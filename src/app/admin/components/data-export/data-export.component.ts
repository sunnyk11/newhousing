import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataExportService } from '../../services/data-export.service'; 
import { ToastrService } from 'ngx-toastr';
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
  selector: 'app-data-export',
  templateUrl: './data-export.component.html',
  styleUrls: ['./data-export.component.css']
})
export class DataExportComponent implements OnInit {
  
  public disabled:boolean=false;
  public submitted:boolean=false;
  public showLoadingIndicator:boolean=false;
  public invoice_data:any;
  public invoice_data_length:number=0;
  public plan_det:any;


  searching_form = new FormGroup({
    invoice_type: new FormControl(''),
    plan_type: new FormControl(''),
    delivery_status: new FormControl(''),
    start_date: new FormControl(''),
    end_date: new FormControl('')
  });

  constructor(
    private toastr: ToastrService,
    private DataExportService:DataExportService
  ) { }

  ngOnInit(): void {
  }
  get f() {
    return this.searching_form.controls;
  }
  onchange_date(){
    if(this.searching_form.value.start_date>this.searching_form.value.end_date){
      this.disabled = true;
      }else if(this.searching_form.value.start_date.length<1 && this.searching_form.value.end_date.length<1){
        this.disabled=false;
      }
      else if(this.searching_form.value.start_date && this.searching_form.value.end_date){
        this.disabled=false;
      }else{
        this.disabled=true;
      }

  }
  on_search_notify(){
    if(this.searching_form.value.start_date>this.searching_form.value.end_date){
      this.toastr.info('Start date greater than End date');
      }      else if(this.searching_form.value.start_date.length<1){
        this.toastr.error('Please Select Start date');
      }else if(this.searching_form.value.end_date.length<1){
        this.toastr.error('Please Select End date');
      }
  }
  
  on_search(){
    if(this.searching_form.invalid){
      this.submitted = true;
      }else{
      this.showLoadingIndicator =true;
      this.DataExportService.get_invoice_data(this.searching_form.value).then(
        Pagination_data => {
          this.invoice_data=Pagination_data;
          this.invoice_data_length=this.invoice_data.meta.total;
          this.showLoadingIndicator=false;
        }, err => {
        }
      );
      }
  }
  
  
  moreDetails(plan_details: any) {
    this.plan_det = plan_details;
  }
  gotoPage(link_url: any) {
    this.showLoadingIndicator = true;
    this.DataExportService.getpagination(link_url,this.searching_form.value).then(Pagination_data => {
      this.showLoadingIndicator= false;
      this.invoice_data=Pagination_data;
    });
  } 
  excel_emport(){
    if(this.invoice_data_length>0){
      var options = { 
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true, 
        showTitle: true,
        title: 'Invoice data ',
        useBom: true,
        noDownload: false,
        headers: ["User Email", "Order ID", "Invoice No","Plan Type","Plan Name","Plan Availablty","Payment Type","Plan Price","Payment Status","payment_mode","payment_received","Product price","gst_amount","sgst_amount","total amount","service status","service deliver date","Invoice_Generate_date","Invoice_Paid_Date","created_at"]
      };
       new  ngxCsv(this.invoice_data.data, "Invoice data", options);
    }else{
        this.toastr.error('Please Applied  Search form fillter');
    }
  }
  refresh_data(){
    this.searching_form.patchValue({
      invoice_type:'',
      plan_type:'',
      delivery_status:'',
      start_date:'',
      end_date:''
    });
    this.disabled=false;
  }
}
