import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitMeComponent } from './invit-me.component';

describe('InvitMeComponent', () => {
  let component: InvitMeComponent;
  let fixture: ComponentFixture<InvitMeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvitMeComponent]
    });
    fixture = TestBed.createComponent(InvitMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
