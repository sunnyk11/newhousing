import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MypropertiesService } from '../../services/myproperties.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-confirmationmodal',
  templateUrl: './confirmationmodal.component.html',
  styleUrls: ['./confirmationmodal.component.css']
})
export class ConfirmationmodalComponent implements OnInit {

  public data_mode:any;
  public property_id:number=0;

  @Input() data:any;
  constructor(public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private MypropertiesService: MypropertiesService) { }

  ngOnInit(): void {
    this.data_mode=this.data.data_mode;
    this.property_id=this.data.property_id;
  }
  delete(id:number){
    let param = { product_id: id}
    this.MypropertiesService.property_delete(param).subscribe(
      response => {
        this.closeModal('');
        let data:any=response;
        let Message =data.message;
        this.toastr.error(Message, this.data.data_mode, {
          timeOut: 3000,
        });
        if(this.data.data_mode=='Property'){
          this.propety_refresh();
        }
        if(this.data.data_mode=='Property-draft'){
          this.draftpropety_refresh();
        }
      }
    );
  }
  propety_refresh(){
    this.MypropertiesService.myproperty_emit<string>('true');
  } 
  draftpropety_refresh(){
    this.MypropertiesService.myproperty_emit<string>('true');
  } 

  closeModal(sendData:any) {
    this.activeModal.close(sendData);
  }

}
