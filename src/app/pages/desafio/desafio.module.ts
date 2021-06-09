import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DesafioPageRoutingModule } from './desafio-routing.module';

import { DesafioPage } from './desafio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DesafioPageRoutingModule
  ],
  declarations: [DesafioPage]
})
export class DesafioPageModule {}
