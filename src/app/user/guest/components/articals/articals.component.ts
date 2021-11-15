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
  public artical_length:number=0;
  public ftpstring=environment.ftpURL;
  public showLoadingIndicator:boolean= false;

  constructor(
      private indexPageService: IndexPageService
    ) { }

  ngOnInit(): void {
    this.getArtical(); 
  }
  
  // artical tips & data 
  getArtical(){
    this.showLoadingIndicator= true;
    this.indexPageService.getArtical({ param: null }).subscribe(
      response => {
        this.artical_data=response;
        this.artical_length=this.artical_data.length;
        this.showLoadingIndicator= false;
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
