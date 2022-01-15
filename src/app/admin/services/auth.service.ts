import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private login_check = new Subject<any>();

  constructor() { }

  sendUpdate(message: boolean, token: any) {
    //console.log(message);
    this.login_check.next({ text:message, token: token });
  }

  getUpdate(): Observable<any> {
    return this.login_check.asObservable();
  }
}
