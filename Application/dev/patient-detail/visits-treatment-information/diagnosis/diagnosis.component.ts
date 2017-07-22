import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Appointment } from 'app/treatment/appointment';
import { MedicineCombinationIssued } from 'app/treatment/medicine-combination-issued';
import { MedicineIssued } from 'app/treatment/medicine-issued';
import { TreatmentService } from 'app/treatment/treatment.service';
import { Diagnosis } from 'app/treatment/diagnosis';
import { Doctor } from 'app/treatment/doctor';
import { Patient } from 'app/patient/patient';

@Component({
    selector: 'pd-diagnosis',
    templateUrl:"app/patient-detail/visits-treatment-information/diagnosis/diagnosis.html"
})

export class DiagnosisInformationComponent{
	@Input() doctors:Array<Doctor> = new Array<Doctor>();
	@Input() patient:Patient = new Patient();
	private diagnosisList:Array<Diagnosis> = new Array<Diagnosis>();
	private fb: FormBuilder = new FormBuilder();
	
	private newDiagnosis:Diagnosis = new Diagnosis();
	
	private saveButtonClicked:boolean = false;
	private status:string = null;
	private editMode:boolean = false;
	
	constructor(private treatmentService: TreatmentService, private router: Router) {
	};

	getDiagnosisList(patientId:number):void{
		this.treatmentService.getDiagnosis(patientId).subscribe(
	        diagnosisList => {
	        	this.diagnosisList = diagnosisList
	        },
	        error =>  this.errorMessage = <any>error);
	};

	ngOnChanges(changes: any) {
		if(this.patient && this.patient.id){
			this.getDiagnosisList(this.patient.id);
		}
	}

	editDiagnosis(diagnosis:Diagnosis):void{
		this.editMode = true;
		this.diagnosisForm = this.fb.group({
			'id': [diagnosis.id],
			'patientid': [this.patient.id],
			'doctorid': [diagnosis.doctorid, Validators.required],
			'result': [diagnosis.result, Validators.required]
		});
	}

	saveDiagnosis(formData : any): void {
		this.saveButtonClicked = true;
		this.status = null;
		if(this.diagnosisForm.valid && this.diagnosisForm.dirty){
			this.treatmentService.saveDiagnosis(formData).subscribe(
				response => {
			  		var status = response.status;
			  		this.saveButtonClicked = false;
			  		switch(status){
			  			case 2:{
			  				this.status = 'success';
			  				if(this.diagnosisForm){
			  					this.diagnosisForm.markAsPristine();
			  				}
			  				this.newDiagnosis = new Diagnosis();
			  				this.editMode = false;
			  				this.successMessage = 'Diagnosis Saved Successfully';
			  				this.getDiagnosisList(this.patient.id);
			  				break;
			  			}
			  			case 1:{
			  				this.status = 'error';
			  				this.errorMessage = response.message;
			  				break;
			  			}
			  		}
			  	},
			  	error =>  {
			  		this.status = 'error';
			  		this.errorMessage = <any>error;
			  	}
			);
		}
	}
		
	cancel():void{
		this.editMode = false;
	}
}