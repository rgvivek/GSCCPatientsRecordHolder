import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Appointment } from 'app/treatment/appointment';
import { MedicineCombinationIssued } from 'app/treatment/medicine-combination-issued';
import { MedicineIssued } from 'app/treatment/medicine-issued';
import { TreatmentService } from 'app/treatment/treatment.service';
import { MedicineService } from 'app/medicine/medicine.service';
import { Medicine } from 'app/medicine/medicine';
import { Doctor } from 'app/treatment/doctor';
import { Patient } from 'app/patient/patient';

@Component({
    selector: 'pd-medications',
    templateUrl:"app/patient-detail/visits-treatment-information/medications/medications.html"
})

export class MedicationsInformationComponent{
	@Input() medicines:Array<Medicine> = new Array<Medicine>();
	@Input() patient:Patient = new Patient();
	@Input() appointment:Appointment = null;
	@Input() viewOnly:boolean = false;
	private combinations:Array<MedicineCombinationIssued> = new Array<MedicineCombinationIssued>();
	private medicineCombinationForm:ControlGroup;
	private saveButtonClicked:boolean = false;
	private newMedicineCombinationIssued:MedicineCombinationIssued = new MedicineCombinationIssued();
	private currentMedicineCombinationIssued:MedicineCombinationIssued = new MedicineCombinationIssued();
	private status:string;
	private fb: FormBuilder = new FormBuilder();
	private editMode:boolean = false;
	private grandTotal:number = 0;
	
	constructor(private treatmentService: TreatmentService, private medicineService: MedicineService, private router: Router) { };

	ngOnChanges(changes: any) {
		if(this.patient && this.patient.id && this.appointment && this.appointment.id){
			this.getMedications(this.patient.id);
		}
	};

	getMedications(patientId:number):void{
		this.treatmentService.getMedicationsByAppointmentId(patientId, this.appointment.id).subscribe(
	        combinations => {
	        	this.combinations = combinations;
	        	this.grandTotal = combinations.map(c => c.totalprice).reduce((sum, current) => parseFloat(sum) + parseFloat(current));
	        },
	        error =>  this.errorMessage = <any>error);
	};

	editCombimation(medicineCombinationIssued:MedicineCombinationIssued):void{
		this.status = null;
		this.editMode = true;
		this.currentMedicineCombinationIssued = medicineCombinationIssued;
		let medicinesFormArray = this.fb.array([]);
		if(!medicineCombinationIssued.medicines){
			medicineCombinationIssued.medicines = new Array<MedicineIssued>();
		}
		
		for(let medicine of medicineCombinationIssued.medicines){
			medicinesFormArray.push(this.initMedicines(medicine));
		}
		

		this.medicineCombinationForm = this.fb.group({
			'id':[medicineCombinationIssued.id],
			'medicines': medicinesFormArray,
			'appointmentid' : [this.appointment.id],
		    'dietaryrestrictions' : [medicineCombinationIssued.dietaryrestrictions, Validators.required],
		    'consumptionmode' : [medicineCombinationIssued.consumptionmode, Validators.required],
		    'timeofmedication' : [medicineCombinationIssued.timeofmedication, Validators.required],
		    'stateformedication' : [medicineCombinationIssued.stateformedication, Validators.required],
		    'priceperdose' : [medicineCombinationIssued.priceperdose, Validators.required],
		    'totaldoses' : [medicineCombinationIssued.totaldoses, Validators.required ],
		    'discount' : [medicineCombinationIssued.discount, Validators.required],
		    'additionalcomments' : [medicineCombinationIssued.additionalcomments],
		    'totaldays' : [medicineCombinationIssued.totaldays, Validators.required]
		    'totalprice' : [medicineCombinationIssued.totalprice]
		});
		this.medicineCombinationForm.controls.medicines.valueChanges.subscribe(
			data => {
	      		this.setDietaryRestrictionsAndPricePerDose(data);
	      	}
	    );

	}

	deleteCombination(medicineCombinationIssued:MedicineCombinationIssued):void{
		this.status = null;
		this.treatmentService.deleteMedication(medicineCombinationIssued.id).subscribe(
				response => {
			  		var status = response.status;
			  		this.saveButtonClicked = false;
			  		switch(status){
			  			case 2:{
			  				this.status = 'success';
			  				this.editMode = false;
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

	initMedicines(medicine : MedicineIssued): void {
        return this.fb.group({
            combinationid: [medicine.combinationid],
            medicineid: [medicine.medicineid, Validators.required],
            weightinmg: [medicine.weightinmg, Validators.required],
            price:[medicine.price]
        });
    };

    setDietaryRestrictionsAndPricePerDose(medicines:Array<MedicineIssued>):void{
    	let dieteryRestrictions:string = ""; 
    	let pricePerDose:number = 0; 
    	for(let medicine of medicines){
    		let medicineDetails = this.getMedicineById(medicine.medicineid);
    		if(medicineDetails && medicine.weightinmg){
    			dieteryRestrictions = dieteryRestrictions +" "+medicineDetails.dietaryrestriction;
    			let medicinePrice = (medicineDetails.price/medicineDetails.weightinmg)*medicine.weightinmg;
    			pricePerDose = pricePerDose + medicinePrice;
    			medicine.price = medicinePrice;
    		}
    	}
    	this.medicineCombinationForm.controls.priceperdose.setValue(pricePerDose);
    	this.medicineCombinationForm.controls.dietaryrestrictions.setValue(dieteryRestrictions);
    }

    getMedicineById(medicineId:number):void{
    	let result:Medicine;
    	for(let medicine of this.medicines){
    		if(medicine.id == medicineId){
    			result = medicine;
    		}
    	}
    	return result;
    }

    setTotalPricePerDose(discount:number):void{
    	alert("total"+discount);
    }

    addMedicine() {
	    const control = <FormArray>this.medicineCombinationForm.controls['medicines'];
	    control.push(this.initMedicines(new MedicineIssued()));
	}

	removeMedicine(i: number) {
	    const control = <FormArray>this.medicineCombinationForm.controls['medicines'];
	    control.removeAt(i);
	}

	saveMedication(formData : any): void {
		this.saveButtonClicked = true;
		this.status = null;
		formData.totalprice = (this.medicineCombinationForm.value.totaldoses * this.medicineCombinationForm.value.priceperdose)-this.medicineCombinationForm.value.discount;
		if(this.medicineCombinationForm.valid && this.medicineCombinationForm.dirty){
			this.treatmentService.saveMedication(formData).subscribe(
				response => {
			  		var status = response.status;
			  		this.saveButtonClicked = false;
			  		switch(status){
			  			case 2:{
			  				this.status = 'success';
			  				this.medicineCombinationForm.markAsPristine();
			  				this.newMedicineCombinationIssued = new MedicineCombinationIssued();
			  				this.getMedications(this.patient.id);
			  				this.editMode = false;
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

	print():void{
		window.print();
	}
}