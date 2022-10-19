import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  showSuccess(message: string, title: string, config?: any) {
    if (!config) {
      this.toastr.success(message, title, { timeOut: 2000 });
    } else {
      this.toastr.success(message, title, config);
    }
  } // end of showSuccess

  showError(message: string, title: string, config?: any) {
    if (!config) {
      this.toastr.error(message, title, {
        timeOut: 2000,
        positionClass: 'toast-top-center',
      });
    } else {
      this.toastr.error(message, title, config);
    }
  } // end of showError

  showInfo(message: string, title: string, config?: any) {
    if (!config) {
      this.toastr.info(message, title, {
        timeOut: 2000,
        positionClass: 'toast-bottom-right',
      });
    } else {
      this.toastr.info(message, title, config);
    }
  } // end of showInfo

  showWarning(message: string, title: string, config?: any) {
    if (!config) {
      this.toastr.warning(message, title, {
        timeOut: 2000,
        positionClass: 'toast-bottom-left',
      });
    } else {
      this.toastr.warning(message, title, config);
    }
  } // end of showWarning
}
