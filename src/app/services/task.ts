import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task, TaskPriority, TaskStatus } from '../models/task.model';
import { Logger } from './logger';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private static readonly INITIAL_NEXT_ID = 4;

  private tasksSubject = new BehaviorSubject<Task[]>(this.getInitialTasks());
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();
  private nextId = TaskService.INITIAL_NEXT_ID;
  private readonly logger = inject(Logger);

  public constructor() {
    this.logger.log('TaskService initialized');
  }

  public getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  public getTasksByStatus(status: TaskStatus): Observable<Task[]> {
    return this.tasks$.pipe(
      map((tasks) => {
        switch (status) {
          case 'active':
            return tasks.filter((task) => !task.completed);
          case 'completed':
            return tasks.filter((task) => task.completed);
          default:
            return tasks;
        }
      })
    );
  }

  public getTaskById(id: number): Observable<Task | undefined> {
    return this.tasks$.pipe(
      map((tasks) => tasks.find((task) => task.id === id))
    );
  }

  public addTask(
    title: string,
    description: string,
    priority: TaskPriority,
    dueDate?: Date
  ): void {
    const newTask: Task = {
      id: this.nextId++,
      title,
      description,
      completed: false,
      priority,
      createdAt: new Date(),
      dueDate,
    };

    const currentTasks = this.tasksSubject.value;
    this.tasksSubject.next([...currentTasks, newTask]);
    this.logger.log(`Task added: ${title}`);
  }

  public updateTask(updatedTask: Task): void {
    const currentTasks = this.tasksSubject.value;
    const index = currentTasks.findIndex((task) => task.id === updatedTask.id);

    if (index !== -1) {
      const newTasks = [...currentTasks];
      newTasks[index] = updatedTask;
      this.tasksSubject.next(newTasks);
      this.logger.log(`Task updated: ${updatedTask.title}`);
    } else {
      this.logger.error(`Task not found: ${updatedTask.id}`);
    }
  }

  public toggleTaskComplete(id: number): void {
    const currentTasks = this.tasksSubject.value;
    const taskIndex = currentTasks.findIndex((task) => task.id === id);

    if (taskIndex !== -1) {
      const newTasks = [...currentTasks];
      newTasks[taskIndex] = {
        ...newTasks[taskIndex],
        completed: !newTasks[taskIndex].completed,
      };
      this.tasksSubject.next(newTasks);
      this.logger.log(`Task toggled: ${newTasks[taskIndex].title}`);
    }
  }

  public deleteTask(id: number): void {
    const currentTasks = this.tasksSubject.value;
    const filteredTasks = currentTasks.filter((task) => task.id !== id);
    this.tasksSubject.next(filteredTasks);
    this.logger.log(`Task deleted: ID ${id}`);
  }

  public getTaskStats(): Observable<{
    total: number;
    completed: number;
    active: number;
  }> {
    return this.tasks$.pipe(
      map((tasks) => ({
        total: tasks.length,
        completed: tasks.filter((t) => t.completed).length,
        active: tasks.filter((t) => !t.completed).length,
      }))
    );
  }

  private getInitialTasks(): Task[] {
    return [
      {
        id: 1,
        title: 'Learn Angular Components',
        description: 'Understand how to create and use Angular components',
        completed: true,
        priority: TaskPriority.HIGH,
        createdAt: new Date('2026-03-08'),
        dueDate: new Date('2026-03-15'),
      },
      {
        id: 2,
        title: 'Study Angular Services',
        description: 'Learn about dependency injection and services',
        completed: false,
        priority: TaskPriority.MEDIUM,
        createdAt: new Date('2026-03-09'),
        dueDate: new Date('2026-03-16'),
      },
      {
        id: 3,
        title: 'Practice Angular Routing',
        description: 'Implement navigation between different views',
        completed: false,
        priority: TaskPriority.LOW,
        createdAt: new Date('2026-03-10'),
      },
    ];
  }
}
