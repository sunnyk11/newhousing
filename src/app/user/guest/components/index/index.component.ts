import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  public amenties:any={};

  constructor(
    private CommonService:CommonService
  ) { }

  ngOnInit(): void {
    this.getAmenities();
  }
  // fetch amenties advance tab
  getAmenities(){
    this.CommonService.getAmenities({ param: null }).subscribe(
      response => {
        console.log(response);
        this.amenties=response;
      }
    );
  }
}
