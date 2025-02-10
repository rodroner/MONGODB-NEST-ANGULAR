import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPrivateComponent } from './chat-private.component';

describe('ChatPrivateComponent', () => {
  let component: ChatPrivateComponent;
  let fixture: ComponentFixture<ChatPrivateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatPrivateComponent]
    });
    fixture = TestBed.createComponent(ChatPrivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
