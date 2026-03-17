import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.css'],
  standalone: false,
})
export class ExploreContainerComponent {

  @Input() name?: string;

}
