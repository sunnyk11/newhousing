import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bank-history',
  templateUrl: './bank-history.component.html',
  styleUrls: ['./bank-history.component.css']
})
export class BankHistoryComponent implements OnInit {
  public user_bank_details:any;
  public email:any;
  public mobile:any;

  @Input() data:any;
  
  constructor(public activeModal: NgbActiveModal) { 
    }

  ngOnInit(): void {
    this.user_bank_details=this.data.data;
    this.email=this.data.email;
    this.mobile=this.data.mobile;

    // this.get_userbank_history(this.user_id.user_id);
  }  
  closeModal(sendData:any) {
    this.activeModal.close(sendData);
  }

}
