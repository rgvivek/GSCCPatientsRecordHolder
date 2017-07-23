import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Patient } from 'app/patient/patient';
import { Doctor } from 'app/treatment/doctor';
import { Medicine } from 'app/medicine/medicine';
import { PatientService } from 'app/patient/patient.service';
import { Appointment } from 'app/treatment/appointment';

@Component({
    selector: 'pd-visits-treatment-information',
    templateUrl:"app/patient-detail/visits-treatment-information/visits-treatment-information.html"
})

export class VisitsTreatmentInformationComponent implements OnInit{
	@Input() doctors:Array<Doctor> = new Array<Doctor>();
	@Input() medicines:Array<Medicine> = new Array<Medicine>();
	@Input() patient:Patient = new Patient();
	private appointment : Appointment = null;

	setActiveVisit(visits:Array<Appointment>):void{
		this.appointment = null;
		for(let visit of visits){
			let appointmentDate = new Date(visit.dateofappointment);
			appointmentDate.setHours(0,0,0);
			let currentDate = new Date();
			currentDate.setHours(0,0,0);
			if(visit.isactive && appointmentDate>=currentDate){
				this.appointment = visit;
			}
		}
	}
	
	goBack(): void {
	  window.history.back();
	}
}