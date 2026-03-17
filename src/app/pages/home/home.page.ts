import { Component, OnInit, inject } from '@angular/core';
import { TaskService } from '../../services/task';
import { Observable } from 'rxjs';
import {
  ROUTE_URL_TASKS,
  ROUTE_PATH_TASKS_NEW,
} from '../../app.routes.constants';

type TaskStats = { total: number; completed: number; active: number };

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.css'],
  standalone: false,
})
export class HomePage implements OnInit {
  private readonly taskService = inject(TaskService);

  public taskStats$: Observable<TaskStats> | null = null;
  public readonly ROUTE_URL_TASKS = ROUTE_URL_TASKS;
  public readonly ROUTE_URL_TASKS_NEW = `/${ROUTE_PATH_TASKS_NEW}`;

  public ngOnInit(): void {
    this.taskStats$ = this.taskService.getTaskStats();
  }
}
