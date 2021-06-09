import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComentsPage } from './coments.page';

const routes: Routes = [
  {
    path: '',
    component: ComentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComentsPageRoutingModule {}
