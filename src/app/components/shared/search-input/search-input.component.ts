import { Component, EventEmitter, Output, Input } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html'
})
export class SearchInputComponent {
  /** Placeholder & debounce có thể cấu hình */
  @Input() placeholder = 'Search';
  @Input() debounce = 500;

  @Output() search = new EventEmitter<string>();

  private keyword$ = new Subject<string>();

  constructor() {
    this.keyword$.pipe(debounceTime(this.debounce))
      .subscribe(value => this.search.emit(value));
  }

  onInput(e: Event) {
    this.keyword$.next((e.target as HTMLInputElement).value);
  }
}
