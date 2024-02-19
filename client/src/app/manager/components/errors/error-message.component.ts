import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { getValidatorErrorMessage } from './validators-utils';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p *ngIf="errorMessage !== null" class="text-red-600 font-semibold text-xs">
      {{ errorMessage }}
    </p>
  `,
  styles: ``
})
export class ErrorMessageComponent {
  @Input() control!: AbstractControl

  get errorMessage() {    
    for (const validatorName in this.control?.errors) {
        if(this.control.touched)
          return getValidatorErrorMessage(validatorName, this.control.errors[validatorName])
    }
    return null
  }
}
