import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task';
import { Task, TaskPriority } from '../../models/task.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.page.html',
  styleUrls: ['./task-detail.page.css'],
  standalone: false,
})
export class TaskDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly taskService = inject(TaskService);

  public task$: Observable<Task | undefined> | null = null;
  public taskId = 0;
  public readonly priorityClassMap: Record<TaskPriority, string> = {
    [TaskPriority.LOW]: 'priority-low',
    [TaskPriority.MEDIUM]: 'priority-medium',
    [TaskPriority.HIGH]: 'priority-high',
  };

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.taskId = parseInt(id, 10);
      this.task$ = this.taskService.getTaskById(this.taskId);
    } else {
      this.router.navigate(['/tasks']);
    }
  }

  public onToggleComplete(): void {
    this.taskService.toggleTaskComplete(this.taskId);
  }

  public onDelete(title: string): void {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      this.taskService.deleteTask(this.taskId);
      this.router.navigate(['/tasks']);
    }
  }

  public onBack(): void {
    this.router.navigate(['/tasks']);
  }
}
