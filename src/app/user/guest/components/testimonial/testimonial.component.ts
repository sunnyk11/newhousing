import { Component, OnInit } from '@angular/core';
import { IndexPageService } from '../../services/index-page.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.css']
})
export class TestimonialComponent implements OnInit {

  public testimonial_data:any={};

  constructor(
    private indexPageService: IndexPageService
    ) { }

  ngOnInit(): void {
    this.gettestimonial();
  }
  // gettestimonial data
  gettestimonial(){
    this.indexPageService.gettestimonial({ param: null }).subscribe(
      response => {
        this.testimonial_data=response;
      }
    );
  }
  
   // carosule image
   testimonial: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    autoplay:true,
    autoplayHoverPause:true,
    dots: true,
    navSpeed: 500,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      },
      1050: {
        items: 1
      }
    },
    nav: true
  }

}
