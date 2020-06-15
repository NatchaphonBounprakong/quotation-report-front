import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardContentComponent } from './guard-content.component';

describe('GuardContentComponent', () => {
  let component: GuardContentComponent;
  let fixture: ComponentFixture<GuardContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuardContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
