import { Component, OnInit } from '@angular/core';
import { IndexPageService } from '../../services/index-page.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(
    private indexPageService: IndexPageService
  ) { }

  ngOnInit(): void {
    this.getAmenities()
  }



  getAmenities(){
    this.indexPageService.getAmenities({ param: null }).subscribe(
      response => {
        console.log(response);
      }
    );
  }

}
