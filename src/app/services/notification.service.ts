import { Injectable } from '@angular/core';
import {ToastData, ToastOptions, ToastyService} from 'ng2-toasty';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  position = 'bottom-right';
  title: string;
  msg: string;
  showCloseOption = true;
  themeOptions = 'bootstrap'; 
  timeoutOption= 5000;
  closeOther = true;
   

  constructor(private toastyService: ToastyService) { }
  

  addToast(options) {
    
    if (this.closeOther) {
      this.toastyService.clearAll();
    }    
    this.position = options.position ? options.position : this.position;
    const toastOptions: ToastOptions = {
      title: options.title,
      msg: options.msg,
      showClose: this.showCloseOption,
      timeout: this.timeoutOption,
      theme: this.themeOptions,
      onAdd: (toast: ToastData) => {
        /* added */
      },
      onRemove: (toast: ToastData) => {
        /* removed */
      }
    };

    switch (options.type) {
      case 'default': this.toastyService.default(toastOptions); break;
      case 'info': this.toastyService.info(toastOptions); break;
      case 'success': this.toastyService.success(toastOptions); break;
      case 'wait': this.toastyService.wait(toastOptions); break;
      case 'error': this.toastyService.error(toastOptions); break;
      case 'warning': this.toastyService.warning(toastOptions); break;
      case 'default':
      this.toastyService.error(toastOptions); break;
    }
  }
}

