import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Patient } from 'app/patient/patient';
import { Doctor } from 'app/treatment/doctor';
import { Medicine } from 'app/medicine/medicine';
import { PatientService } from 'app/patient/patient.service';

@Component({
    selector: 'pd-visits-treatment-information',
    templateUrl:"app/patient-detail/visits-treatment-information/visits-treatment-information.html"
})

export class VisitsTreatmentInformationComponent implements OnInit{
	@Input() doctors:Array<Doctor> = new Array<Doctor>();
	@Input() medicines:Array<Medicine> = new Array<Medicine>();
	@Input() patient:Patient = new Patient();
	goBack(): void {
	  window.history.back();
	}
}