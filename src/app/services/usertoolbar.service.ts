import {Injectable} from '@angular/core';
import {ConnectionService} from 'ng-connection-service';
import {FormControl} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class UsertoolbarService {

  status = 'ONLINE';
  isConnected = true;

  constructor(private connectionService: ConnectionService) {
    document.onfullscreenchange = () => {
      this.full = !this.full;
    };

    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = 'ONLINE';
      } else {
        this.status = 'OFFLINE';
      }
    });
  }

  public account = false;
  public unlock = false;
  public help = false;
  public share = false;
  public edit = false;
  public babble = false;
  public full = false;
  public setting = false;
  public search = false;
  public popup = false;

  public position = new FormControl('left');

  public title = 'Title';

  public helpInfo = "Active ou désactive l'aide \n survolez un élément pour obtenir des informations"

  fullScreen() {
    if (document.fullscreen || (document as any).webkitIsFullScreen || (document as any).mozFullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      }
    } else {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if ((document.documentElement as any).webkitRequestFullscreen) {
        (document.documentElement as any).webkitRequestFullscreen();
      } else if ((document.documentElement as any).mozRequestFullScreen) {
        (document.documentElement as any).mozRequestFullScreen();
      }
    }
  }

  switchEditValue() {
    this.edit = !this.edit;
  }

}
