import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-employee',
  standalone: true,
  imports: [],
  template: `
    <div class="alert alert-light mb-2 flex justify-between">
      <span>{{ employee.firstname }} {{ employee.lastname }}</span>
      <a disabled>{{ employee.commission }}%</a>
    </div>
  `,
  styles: ``
})
export class CardEmployeeComponent {
  @Input('employee') employee: any

}
