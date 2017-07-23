import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Medicine } from 'app/medicine/medicine';
import { MedicinePurchase } from 'app/medicine/medicine-purchase';
import { Router } from '@angular/router';
import { MedicineService } from 'app/medicine/medicine.service';

@Component({
    selector: 'manage-medicines',
    templateUrl:"app/manage-medicines/manage-medicines.html"
})

export class ManageMedicinesComponent implements OnInit{
	private fb: FormBuilder = new FormBuilder();
	
	private newMedicine:Medicine = new Medicine();
	private newMedicinePurchase = new MedicinePurchase();
	
	private saveButtonClicked:boolean = false;
	private savePurchaseButtonClicked:boolean = false;
	private status:string = null;
	private purchaseStatus:string = null;
	private editMode:boolean = false;
	private purchaseMode:boolean = false;

	constructor(private medicineService: MedicineService, private router: Router) {
	};

	getMedicines():void{
		this.medicineService.getMedicines().subscribe(
                    medicines => {
                    	this.medicines = medicines
                    },
                    error =>  this.errorMessage = <any>error);
	};

	ngOnInit(): void {
		this.getMedicines();
	};

	editMedicine(medicine:Medicine):void{
		this.editMode = true;
		this.medicineForm = this.fb.group({
			'id': [medicine.id],
			'company' : [medicine.company, Validators.required],
		    'name' : [medicine.name, Validators.required],
		    'price' : [medicine.price, Validators.required],
		    'weightinmg' : [medicine.weightinmg, Validators.required],
		    'description' : [medicine.description],
		    'dietaryrestriction' : [medicine.dietaryrestriction]
		});
	}

	addPurchase(medicine:Medicine):void{
		this.editMode = false;
		this.purchaseMode = true;
		this.saveButtonClicked = false;
		this.stockToBePurchased = medicine;
		this.purchaseForm = this.fb.group({
			'medicineid': [medicine.id],
			'totalweightinmgs' : [null, Validators.required],
		    'price' : [null, Validators.required],
		    'comments' : null
		});
	}

	saveMedicine(formData : any): void {
		this.saveButtonClicked = true;
		this.status = null;
		if(this.medicineForm.valid && this.medicineForm.dirty){
			this.medicineService.saveMedicine(formData).subscribe(
				response => {
			  		var status = response.status;
			  		this.saveButtonClicked = false;
			  		switch(status){
			  			case 2:{
			  				this.status = 'success';
			  				this.medicineForm.markAsPristine();
			  				this.newMedicine = new Medicine();
			  				this.editMode = false;
			  				this.successMessage = 'Medicine Saved Successfully';
			  				this.getMedicines();
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

	savePurchase(formData : any): void {
		this.savePurchaseButtonClicked = true;
		this.purchaseStatus = null;
		if(this.purchaseForm.valid && this.purchaseForm.dirty){
			this.medicineService.saveMedicinePurchase(formData).subscribe(
				response => {
			  		var status = response.status;
			  		this.savePurchaseButtonClicked = false;
			  		switch(status){
			  			case 2:{
			  				this.successMessage = 'Stocks Added Successfully for ' + this.stockToBePurchased.name + ' - ' + this.stockToBePurchased.company;
			  				this.purchaseMode = false;
			  				this.purchaseForm.markAsPristine();
			  				this.newMedicine = new Medicine();
			  				this.editMode = false;
			  				this.getMedicines();
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
		this.purchaseMode = false;
	}

	goBack(): void {
	  window.history.back();
	}
}