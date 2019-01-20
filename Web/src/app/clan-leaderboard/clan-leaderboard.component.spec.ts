import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClanLeaderboardComponent } from './clan-leaderboard.component';

describe('ClanLeaderboardComponent', () => {
  let component: ClanLeaderboardComponent;
  let fixture: ComponentFixture<ClanLeaderboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClanLeaderboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClanLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
