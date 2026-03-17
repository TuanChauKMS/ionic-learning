import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.css'],
  standalone: false,
})
export class AboutPage {
  public appName = 'Ionic Learning App';
  public version = '1.0.0';

  public concepts = [
    {
      title: 'Components',
      description:
        'Building blocks of Angular applications with TypeScript classes, HTML templates, and CSS styles',
      icon: '🧩',
    },
    {
      title: 'Modules',
      description:
        'Containers for organizing related components, services, and other code',
      icon: '📦',
    },
    {
      title: 'Services',
      description:
        'Classes with specific purposes like data access, logging, or business logic',
      icon: '⚙️',
    },
    {
      title: 'Dependency Injection',
      description:
        'Design pattern where Angular provides required dependencies automatically',
      icon: '💉',
    },
    {
      title: 'Routing',
      description: 'Navigation between different views without page reloads',
      icon: '🗺️',
    },
    {
      title: 'Observables & RxJS',
      description: 'Reactive programming for handling asynchronous data streams',
      icon: '🌊',
    },
  ];

  public features = [
    'TypeScript for type safety',
    'Component-based architecture',
    'Reactive state management with RxJS',
    'Template-driven and reactive forms',
    'Client-side routing',
    'Service dependency injection',
    'Ionic UI components',
  ];
}
