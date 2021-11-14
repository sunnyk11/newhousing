import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/user/services/jwt.service';

@Component({
  selector: 'app-login-check',
  templateUrl: './login-check.component.html',
  styleUrls: ['./login-check.component.css']
})
export class LoginCheckComponent implements OnInit {

  public returnUrl: string = '';

  @Input() fromParent:any;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private jwtService: JwtService
    ) { }

  ngOnInit(): void {
    //console.log(this.fromParent);
  }

  actionFunction() {
    this.closeModal("");
    this.returnUrl = this.router.url;
    //console.log(this.returnUrl);
    this.jwtService.saveReturnURL(this.returnUrl);
    this.jwtService.savePlansData(this.fromParent);
    this.router.navigate(['login']);
  }

  closeModal(sendData:any) {
    this.activeModal.close(sendData);
  }

}
