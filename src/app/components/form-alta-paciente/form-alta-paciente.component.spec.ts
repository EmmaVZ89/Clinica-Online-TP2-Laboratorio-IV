import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAltaPacienteComponent } from './form-alta-paciente.component';

describe('FormAltaPacienteComponent', () => {
  let component: FormAltaPacienteComponent;
  let fixture: ComponentFixture<FormAltaPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAltaPacienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAltaPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
