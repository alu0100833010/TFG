import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComentsPageRoutingModule } from './coments-routing.module';

import { ComentsPage } from './coments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComentsPageRoutingModule
  ],
  declarations: [ComentsPage]
})
export class ComentsPageModule {}
