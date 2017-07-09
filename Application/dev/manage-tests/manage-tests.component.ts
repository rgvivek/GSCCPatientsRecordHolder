import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Test } from 'app/test/test';
import { TestCategory } from 'app/test/test-category';
import { InvestigationCategory } from 'app/test/investigation-category';
import { Router } from '@angular/router';
import { TestService } from 'app/test/test.service';

@Component({
    selector: 'manage-tests',
    templateUrl:"app/manage-tests/manage-tests.html"
})
export class ManageTestsComponent implements OnInit{
	private fb: FormBuilder = new FormBuilder();
	
	private newTestCategory:TestCategory = new TestCategory();
	private newInvestigationCategory = new InvestigationCategory();
	private newTest:Test = new Test();
	
	private saveButtonClicked:boolean = false;
	private status:boolean = false;
	private editMode:boolean = false;

	private saveInvestigationButtonClicked:boolean = false;
	private statusInvestigation:boolean = false;
	private editInvestigationMode:boolean = false;

	private saveTestButtonClicked:boolean = false;
	private editTestMode:boolean = false;
	private statusTest:boolean = false;
	
	constructor(private testService: TestService, private router: Router) {
	};
	getTests():void{
		this.testService.getTests().subscribe(
                    tests => {
                    	this.tests = tests
                    },
                    error =>  this.errorMessage = <any>error);

        this.testService.getTestCategories().subscribe(
                    testCategories => {
                    	this.testCategories = testCategories;
                    },
                    error =>  this.errorMessage = <any>error);
        this.testService.getInvestigationCategories().subscribe(
                    investigationCategories => {
                    	this.investigationCategories = investigationCategories;
                    },
                    error =>  this.errorMessage = <any>error);
	}
	ngOnInit(): void {
		this.getTests();
	}
	editCategory(testCategory:TestCategory):void{
		this.editMode = true;
		this.testCategoryForm = this.fb.group({
			'id':[testCategory.id],
			'code' : [testCategory.code, Validators.required],
		    'name' : [testCategory.name, Validators.required],
		    'description' : [testCategory.description]
		});
	}
	saveCategory(formData : any): void {
		this.saveButtonClicked = true;
		this.status = null;
		if(this.testCategoryForm.valid && this.testCategoryForm.dirty){
			this.testService.saveTestCategory(formData).subscribe(
				response => {
			  		var status = response.status;
			  		this.saveButtonClicked = false;
			  		switch(status){
			  			case 2:{
			  				this.status = 'success';
			  				this.testCategoryForm.markAsPristine();
			  				this.newTestCategory = new TestCategory();
			  				this.editMode = false;
			  				this.getTests();
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
	editInvestigationCategory(investigationCategory:InvestigationCategory):void{
		this.editInvestigationMode = true;
		this.investigationCategoryForm = this.fb.group({
			'id':[investigationCategory.id],
			'code' : [investigationCategory.code, Validators.required],
		    'name' : [investigationCategory.name, Validators.required],
		    'description' : [investigationCategory.description]
		});
	}
	saveInvestigationCategory(formData : any): void {
		this.saveInvestigationButtonClicked = true;
		this.statusInvestigation = null;
		if(this.investigationCategoryForm.valid && this.investigationCategoryForm.dirty){
			this.testService.saveInvestigationCategory(formData).subscribe(
				response => {
			  		var statusInvestigation = response.status;
			  		this.saveInvestigationButtonClicked = false;
			  		switch(statusInvestigation){
			  			case 2:{
			  				this.statusInvestigation = 'success';
			  				this.investigationCategoryForm.markAsPristine();
			  				this.newInvestigationCategory = new InvestigationCategory();
			  				this.editInvestigationMode = false;
			  				this.getTests();
			  				break;
			  			}
			  			case 1:{
			  				this.statusInvestigation = 'error';
			  				this.errorMessage = response.message;
			  				break;
			  			}
			  		}
			  	},
			  	error =>  {
			  		this.statusInvestigation = 'error';
			  		this.errorMessage = <any>error;
			  	}
			);
		}
	}
	editTest(test:Test):void{
		this.editTestMode = true;
		this.testForm = this.fb.group({
			'id':[test.id],
			'testcategory' : [test.testcategory, Validators.required],
			'investigationcategory' : [test.investigationcategory, Validators.required],
		    'name' : [test.name, Validators.required],
		    'description' : [test.description]
		});
	}
	saveTest(formData : any): void {
		this.saveTestButtonClicked = true;
		this.statusTest = null;
		if(this.testForm.valid && this.testForm.dirty){
			this.testService.saveTest(formData).subscribe(
				response => {
			  		var status = response.status;
			  		this.saveButtonClicked = false;
			  		switch(status){
			  			case 2:{
			  				this.statusTest = 'success';
			  				this.testForm.markAsPristine();
			  				this.newTest = new Test();
			  				this.editTestMode = false;
			  				this.getTests();
			  				break;
			  			}
			  			case 1:{
			  				this.statusTest = 'error';
			  				this.errorMessageTest = response.message;
			  				break;
			  			}
			  		}
			  	},
			  	error =>  {
			  		this.statusTest = 'error';
			  		this.errorMessageTest = <any>error;
			  	}
			);
		}
	}
	cancel():void{
		this.editMode = false;
		this.editTestMode = false;
		this.editInvestigationMode = false;
	}
	goBack(): void {
	  window.history.back();
	}
}