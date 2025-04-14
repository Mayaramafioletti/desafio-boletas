import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosSelecionadosComponent } from './filtros-selecionados.component';

describe('FiltrosSelecionadosComponent', () => {
  let component: FiltrosSelecionadosComponent;
  let fixture: ComponentFixture<FiltrosSelecionadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosSelecionadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrosSelecionadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
