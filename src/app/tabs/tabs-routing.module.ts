import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import {
  ROUTE_PATH_TASKS,
  ROUTE_PATH_TASKS_NEW,
  ROUTE_PATH_DASHBOARD,

  ROUTE_PATH_API_DEMO,
  ROUTE_PATH_CAMERA,
  ROUTE_PATH_FILES,
} from '../app.routes.constants';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () =>
          import('../pages/home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: ROUTE_PATH_DASHBOARD,
        loadChildren: () =>
          import('../pages/dashboard/dashboard.module').then(
            (m) => m.DashboardPageModule
          ),
      },
      {
        path: ROUTE_PATH_TASKS,
        loadChildren: () =>
          import('../pages/task-list/task-list.module').then(
            (m) => m.TaskListPageModule
          ),
      },
      {
        path: ROUTE_PATH_TASKS_NEW,
        loadChildren: () =>
          import('../pages/task-form/task-form.module').then(
            (m) => m.TaskFormPageModule
          ),
      },
      {
        path: `${ROUTE_PATH_TASKS}/:id`,
        loadChildren: () =>
          import('../pages/task-detail/task-detail.module').then(
            (m) => m.TaskDetailPageModule
          ),
      },

      {
        path: ROUTE_PATH_API_DEMO,
        loadChildren: () =>
          import('../pages/api-demo/api-demo.module').then(
            (m) => m.ApiDemoPageModule
          ),
      },
      {
        path: ROUTE_PATH_CAMERA,
        loadChildren: () =>
          import('../pages/camera/camera.module').then(
            (m) => m.CameraPageModule
          ),
      },
      {
        path: ROUTE_PATH_FILES,
        loadChildren: () =>
          import('../pages/files/files.module').then(
            (m) => m.FilesPageModule
          ),
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
