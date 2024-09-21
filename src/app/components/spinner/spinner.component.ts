import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone: true,
})
export class SpinnerComponent implements OnInit {
  @Input() shouldDisplaySpinner: boolean;

  constructor() {}

  ngOnInit(): void {}
}
