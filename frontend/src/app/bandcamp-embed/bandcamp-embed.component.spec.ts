import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandcampEmbedComponent } from './bandcamp-embed.component';

describe('BandcampEmbedComponent', () => {
  let component: BandcampEmbedComponent;
  let fixture: ComponentFixture<BandcampEmbedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandcampEmbedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandcampEmbedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
