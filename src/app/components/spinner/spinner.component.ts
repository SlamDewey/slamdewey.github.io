import { Component, Input } from '@angular/core';

@Component({
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone: true,
})
export class SpinnerComponent {
  @Input() shouldDisplaySpinner: boolean;
}
