import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SplashAnimatedPageRoutingModule } from './splash-animated-routing.module';

import { SplashAnimatedPage } from './splash-animated.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SplashAnimatedPageRoutingModule
  ],
  declarations: [SplashAnimatedPage]
})
export class SplashAnimatedPageModule {}
