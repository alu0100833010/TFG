import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesafioPage } from './desafio.page';

const routes: Routes = [
  {
    path: '',
    component: DesafioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesafioPageRoutingModule {}
