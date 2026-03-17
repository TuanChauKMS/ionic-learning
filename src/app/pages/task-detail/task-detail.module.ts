import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TaskDetailPage } from './task-detail.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: TaskDetailPage }]),
  ],
  declarations: [TaskDetailPage],
})
export class TaskDetailPageModule {}
