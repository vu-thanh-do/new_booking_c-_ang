import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptMeComponent } from './accept-me.component';

describe('AcceptMeComponent', () => {
  let component: AcceptMeComponent;
  let fixture: ComponentFixture<AcceptMeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcceptMeComponent]
    });
    fixture = TestBed.createComponent(AcceptMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
