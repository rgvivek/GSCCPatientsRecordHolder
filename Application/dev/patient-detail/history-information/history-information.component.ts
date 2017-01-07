import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Patient } from 'app/patient/patient';
import { PatientService } from 'app/patient/patient.service';

@Component({
    selector: 'pd-history-information',
    templateUrl:"app/patient-detail/history-information/history-information.html"
})

export class HistoryInformationComponent implements OnInit{
	@Input() patient:Patient = new Patient();
	goBack(): void {
	  window.history.back();
	}
}