import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CropperPage } from './cropper.page';

describe('CropperPage', () => {
  let component: CropperPage;
  let fixture: ComponentFixture<CropperPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropperPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CropperPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
