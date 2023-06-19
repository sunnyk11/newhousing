import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/user/services/jwt.service';
import { LoginPageService } from '../../services/login-page.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { MobileCheckComponent } from 'src/app/user/guest/modals/mobile-check/mobile-check.component';

@Component({
  selector: 'app-listproperty',
  templateUrl: './listproperty.component.html',
  styleUrls: ['./listproperty.component.css']
})
export class ListpropertyComponent implements OnInit {

  public showLoadingIndicator: boolean = false;
  private user_phone_data: any;
  public returnUrl: string = '';

  constructor(private jwtService: JwtService,
    private loginPageService: LoginPageService,
    private router: Router,private titleService: Title,
    private modalService: NgbModal) { }

  ngOnInit(): void {this.titleService.setTitle('List-Property');
  }

  mob_verify_check(page: string) {
    this.showLoadingIndicator = true;
    if (page == 'rent') {
      this.jwtService.saveReturnURL('/agent/list-property-rent');
    }
    else if (page == 'sale') {
      this.jwtService.saveReturnURL('/agent/list-property-sales');
    }
    this.loginPageService.getUserPhoneDetails({ param: null }).subscribe(
      data => {
        this.user_phone_data = data;
        if (this.user_phone_data !== 1) {
          this.showLoadingIndicator = false;
          this.openMobModal();
        }
        else {
          if (page == 'rent') {
            this.router.navigate(['/agent/list-property-rent']);
            // this.showLoadingIndicator = false;
          }
          else if (page == 'sale') {
            this.router.navigate(['/agent/list-property-sales']);
            this.showLoadingIndicator = false;
          }
        }
      },
      err => {
        this.showLoadingIndicator = false;
      }
    );
  }

  openMobModal() {
    const modalRef = this.modalService.open(MobileCheckComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        // keyboard: false,
         backdrop: 'static'
      });

    modalRef.result.then((result) => {
      //console.log(result);
    }, (reason) => {
    });
  }

}
