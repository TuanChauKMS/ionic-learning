import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task';
import { Task, TaskStatus } from '../../models/task.model';
import { Observable } from 'rxjs';
import { ROUTE_PATH_TASKS_NEW } from '../../app.routes.constants';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.css'],
  standalone: false,
})
export class TaskListPage implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);

  public tasks$: Observable<Task[]> | null = null;
  public selectedFilter: TaskStatus = 'all';
  public readonly ROUTE_URL_TASKS_NEW = `/${ROUTE_PATH_TASKS_NEW}`;

  public ngOnInit(): void {
    this.loadTasks();
  }

  public loadTasks(): void {
    this.tasks$ = this.taskService.getTasksByStatus(this.selectedFilter);
  }

  public onFilterChange(filter: TaskStatus): void {
    this.selectedFilter = filter;
    this.loadTasks();
  }

  public onSegmentChange(event: CustomEvent): void {
    const value = event.detail?.value as TaskStatus;
    if (value) {
      this.onFilterChange(value);
    }
  }

  public onToggleComplete(id: number): void {
    this.taskService.toggleTaskComplete(id);
  }

  public onDeleteTask(id: number, title: string): void {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      this.taskService.deleteTask(id);
    }
  }

  public getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }

  public navigateToTask(id: number): void {
    this.router.navigate(['/tasks', id]);
  }
}
