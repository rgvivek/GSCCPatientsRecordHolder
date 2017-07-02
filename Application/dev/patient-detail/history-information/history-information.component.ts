import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Patient } from 'app/patient/patient';
import { PatientHistory } from 'app/patient/patient-history';
import { PatientService } from 'app/patient/patient.service';

@Component({
    selector: 'pd-history-information',
    templateUrl:"app/patient-detail/history-information/history-information.html"
})

export class HistoryInformationComponent implements OnInit{
	@Input() patientHistory:PatientHistory = new PatientHistory();
	goBack(): void {
	  window.history.back();
	}
}