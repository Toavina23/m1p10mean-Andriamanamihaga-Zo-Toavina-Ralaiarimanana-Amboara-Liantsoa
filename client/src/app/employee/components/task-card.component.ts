import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [],
  template: `
    <div class="flex items-center justify-between border-b shadow-xs transition-all duration-300 ease-in-out py-3 px-6 hover:shadow-md">
      <div class="flex flex-col">
        <p class="text-lg text-teal-500">{{ serviceTitle }}</p>
        <p class="flex-1 text-xs">
          <span class="font-semibold text-gray-600">{{ price }}</span> (commission à {{ commission }}%)
        </p>
      </div>   
      <!-- <p class="ml-6 flex-1 text-xs">page when looking at its layout looking at its layout The point of using Lorem...</p>     -->
      <p class="font-bold text-gray-900">{{ startDate }} {{ startTime }}</p>
    </div>
  `,
  styles: ``
})
export class TaskCardComponent {
  @Input('task') task: any

  get serviceTitle() {
    return this.task.service.title
  }
  get price() {
    return new Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'MGA' }).format(this.task.servicePrice)
  }
  get commission() {
    return this.task.employeeComission
  }
  get startDate() {
    return new Date(this.task.startTime).toLocaleDateString('fr-FR')
  }
  get startTime() {
    return new Date(this.task.startTime).toLocaleTimeString('fr-FR')
  }
}
