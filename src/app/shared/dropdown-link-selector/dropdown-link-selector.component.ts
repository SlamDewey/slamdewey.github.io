import { Component, ElementRef, Input, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';

export class DropdownLinkData {
  public text: string;
  public url: string;
}

@Component({
  selector: 'x-dropdown-link-selector',
  templateUrl: './dropdown-link-selector.component.html',
  styleUrls: ['./dropdown-link-selector.component.scss']
})
export class DropdownLinkSelectorComponent implements AfterViewInit {
  @Input('dropdownText') dropdownText: string;
  @Input('items') items: DropdownLinkData[];

  @ViewChild('container') container: ElementRef;

  constructor(private ref: ChangeDetectorRef) { }

  public isOverflowing: boolean = false;

  ngAfterViewInit() {
    this.checkForOverflow();

    const resizeObserver = new ResizeObserver(() => {
      this.checkForOverflow();
    });
    resizeObserver.observe(document.documentElement);
  }

  checkForOverflow() {
    if (this.container) {
      const element = this.container.nativeElement;
      const box = element.getBoundingClientRect();
      const contentSpaceReq = 4 * parseFloat(getComputedStyle(document.documentElement).fontSize) * this.items.length;
      this.isOverflowing = contentSpaceReq + box.bottom > (window.innerHeight || document.documentElement.clientHeight);
      this.ref.detectChanges();
    }
  }
}
