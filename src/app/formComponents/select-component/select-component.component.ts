import { Component, Input, Output, EventEmitter, ViewContainerRef, NgZone, TemplateRef } from '@angular/core';
import { debounceTime } from 'rxjs/operators'; 
import { FormControl } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import Popper from 'popper.js';

@Component({
  selector: 'app-select-component',
  templateUrl: './select-component.component.html',
  styleUrls: ['./select-component.component.scss']
})
export class SelectComponentComponent {

  /*@Input() labelKey = 'label';
  @Input() idKey = 'id';
  @Input() options = [];
  @Input() model;

  @Output() selectChange = new EventEmitter();

  searchControl = new FormControl();

  originalOptions: any;

  constructor(private vcr: ViewContainerRef, private zone: NgZone) {}

  ngOnInit() {
    this.originalOptions = [...this.options];
    if (this.model !== undefined) {
      this.model = this.options.find(
        currentOption => currentOption[this.idKey] === this.model
      );
    }

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        untilDestroyed(this)
      )
      .subscribe(term => this.search(term));
  }

  get label() {
    return this.model ? this.model[this.labelKey] : 'Select...';
  }

  search(value: string) {
    this.options = this.originalOptions.filter(
      option => option[this.labelKey].includes(value)
    );
  }

  select(option) {
    this.model = option;
    this.selectChange.emit(option[this.idKey]);
  }

  isActive(option) {
    if (!this.model) {
      return false;
    }

    return option[this.idKey] === this.model[this.idKey];
  }

  open(dropdownTpl: TemplateRef<any>, origin: HTMLElement) {
    this.view = this.vcr.createEmbeddedView(dropdownTpl);
    const dropdown = this.view.rootNodes[0];
 
    document.body.appendChild(dropdown);
    dropdown.style.width = `${origin.offsetWidth}px`;
 
    this.zone.runOutsideAngular(() => {
      this.popperRef = new Popper(origin, dropdown, {
        removeOnDestroy: true
      });
    });
  }*/

}
