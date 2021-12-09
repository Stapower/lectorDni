import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SplashAnimatedPage } from './splash-animated.page';

describe('SplashAnimatedPage', () => {
  let component: SplashAnimatedPage;
  let fixture: ComponentFixture<SplashAnimatedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplashAnimatedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SplashAnimatedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
