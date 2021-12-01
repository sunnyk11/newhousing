import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-fix-appointment',
  templateUrl: './fix-appointment.component.html',
  styleUrls: ['./fix-appointment.component.css']
})
export class FixAppointmentComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  closeModal(sendData:any) {
    this.activeModal.close(sendData);
  }

}
