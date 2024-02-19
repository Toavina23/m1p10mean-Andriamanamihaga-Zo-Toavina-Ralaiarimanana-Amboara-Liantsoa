import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const validateAppointmentDate: ValidatorFn = (
  control: AbstractControl<any, Date>
): ValidationErrors | null => {
  const now = new Date();
  const customerAppointmentDate = new Date(control.value.appointmentDate);
  return now.getTime() >= customerAppointmentDate.getTime()
    ? { PastDate: true }
    : null;
};
