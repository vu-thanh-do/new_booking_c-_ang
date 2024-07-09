import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeInvitComponent } from './me-invit.component';

describe('MeInvitComponent', () => {
  let component: MeInvitComponent;
  let fixture: ComponentFixture<MeInvitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeInvitComponent]
    });
    fixture = TestBed.createComponent(MeInvitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
