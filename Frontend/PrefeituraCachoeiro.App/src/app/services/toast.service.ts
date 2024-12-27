import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  _defaultHorizPosition: MatSnackBarHorizontalPosition = 'right';
  _defaultVertPosition: MatSnackBarVerticalPosition = 'top';
  _defaultDuration: number = 3000;

  constructor(private _snackBar: MatSnackBar) { }

  mensagemInfo(
    msg: string,
    duration: number = this._defaultDuration,
    btn: string = '',
    horizontalPosition: MatSnackBarHorizontalPosition = this._defaultHorizPosition,
    verticalPosition: MatSnackBarVerticalPosition = this._defaultVertPosition,
    panelClass: string[] = ['toast-info']
  ): void {
      this._snackBar.open(msg, btn, {
          duration: duration,
          horizontalPosition: horizontalPosition,
          verticalPosition: verticalPosition,
          panelClass: panelClass,
      });
  }

  mensagemSuccess(
    msg: string,
    duration: number = this._defaultDuration,
    btn: string = '',
    horizontalPosition: MatSnackBarHorizontalPosition = this._defaultHorizPosition,
    verticalPosition: MatSnackBarVerticalPosition = this._defaultVertPosition
  ): void {
      this.mensagemInfo(msg, duration, btn, horizontalPosition, verticalPosition, ['toast-success']);
  }

  mensagemError(
    msg: string,
    duration: number = this._defaultDuration,
    btn: string = '',
    horizontalPosition: MatSnackBarHorizontalPosition = this._defaultHorizPosition,
    verticalPosition: MatSnackBarVerticalPosition = this._defaultVertPosition
): void {
    this.mensagemInfo(msg, duration, btn, horizontalPosition, verticalPosition, ['toast-error']);
}
}
