import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from 'src/environments/environment';
import { IndexPageService } from '../../services/index-page.service';

@Component({
  selector: 'app-articals',
  templateUrl: './articals.component.html',
  styleUrls: ['./articals.component.css']
})
export class ArticalsComponent implements OnInit {

  public artical_data:any;
  public ftpstring=environment.ftpURL;

  constructor(
      private indexPageService: IndexPageService
    ) { }

  ngOnInit(): void {
    this.getArtical(); 
  }
  
  // artical tips & data 
  getArtical(){
    this.indexPageService.getArtical({ param: null }).subscribe(
      response => {
        console.log(response);
        this.artical_data=response;
      }
    );
  }

  articals: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: true,
    dots: true,
    navSpeed: 700,
    navText: ['&#8249', '&#8250;'],
    responsive: {
      0: {
        items: 1 
      },
      480: {
        items: 1
      },
      667: {
        items: 2
      },
      1024: {
        items: 3
      }
    },
    nav: true
  }

}
