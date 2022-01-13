import { Component, OnInit } from '@angular/core';
import { MediaChange } from '@angular/flex-layout';
import { MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit {

  mode: any = 'side';
  isSidenavOpened: boolean = true;
  /* sidenavCloseDisabled: boolean = false; */

  constructor(private media: MediaObserver) {
    this.media.asObservable().subscribe((mediaChange: MediaChange[]) => {
      this.mode = this.getMode(mediaChange);
      this.isSidenavOpened = this.SidenavOpened(mediaChange);
      /* this.sidenavCloseDisabled = this.SidenavCloseDisabled(mediaChange); */
      // this.opened = this.getOpened(mediaChange);
    });
   }

  ngOnInit(): void {
  }

  private getMode(mediaChange: MediaChange[]): string {
    // set mode based on a breakpoint
    if (this.media.isActive('gt-sm')) {
      return 'side';
    } else {
      return 'over';
    }
  }

  private SidenavOpened(mediaChange: MediaChange[]):boolean {
    if (this.media.isActive('gt-sm')) {
      return false;
    } else {
      return true;
    }
  }

  /* private SidenavCloseDisabled(mediaChange: MediaChange[]): boolean {
    if (this.media.isActive('gt-sm')) {
      return true;
    } else {
      return false;
    }
  } */

}
