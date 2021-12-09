import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SplashAnimatedPage } from './splash-animated.page';

const routes: Routes = [
  {
    path: '',
    component: SplashAnimatedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SplashAnimatedPageRoutingModule {}
