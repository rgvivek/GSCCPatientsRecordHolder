import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Test } from 'app/test/test';
import { TestReport } from 'app/test/test-report';
import { Router } from '@angular/router';
import { Patient } from 'app/patient/patient';
import { TestService } from 'app/test/test.service';

@Component({
    selector: 'pd-investigation-information',
    templateUrl:"app/patient-detail/investigation-information/investigation-information.html"
})

export class InvestigationInformationComponent implements OnInit{
	@Input() tests:Array<Test> = new Array<Test>();
	@Input() patient:Patient = new Patient();
	@Input() investigationCategories:Array<string> = new Array<string>();
	private testReports:Array<TestReport> = new Array<TestReport>();
	private clinicalTestReports:Array<TestReport> = new Array<TestReport>();
	private fb: FormBuilder = new FormBuilder();
	private clinicalTests:Array<Test> = new Array<Test>();
	private aggregatedTests:any = {};

	private newTestReport:TestReport = new TestReport();
	private saveButtonClicked:boolean = false;
	private status:boolean = false;
	private mode:string = "default";

	constructor(private testService: TestService, private router: Router) {
		this.todaysDate = this.getDateAsString(new Date());
	};

	ngOnChanges(change): void {
		if(change && change.tests){
			this.clinicalTests = Object.assign([], this.tests).filter(
				item=> (this.investigationCategories.includes(item.investigationcategory));
			);


		}

		if(change && change.patient && this.patient.id){
			this.fetchReports();
		}
	}

	fetchReports():void{
		this.testService.getTestReports(this.patient.id).subscribe(
	                    testReports => {
	                    	let clinicalTestIds = this.clinicalTests.map(item=>item.id);
	                    	this.testReports = testReports.filter(
	                    		report => {
	                    			return clinicalTestIds.includes(report.testid);
	                    		}
	                    	);
	             			this.aggregatedTests = {};
	                    	let aggregatedTestIds = new Array<number>();
	                    	for (let entry of this.testReports) {
	                    		if(!aggregatedTestIds.includes(entry.testid)){
	                    			aggregatedTestIds.push(entry.testid);
	                    		}
	                    		if(!this.aggregatedTests[entry.testid]){
	                    			this.aggregatedTests[entry.testid] = new Array<TestReport>();
	                    		}
							    this.aggregatedTests[entry.testid].push(entry);
							}
							this.clinicalTestReports = new Array<TestReport>();
							for (let entry of aggregatedTestIds) {
								let aggregatedTestsForTest = this.aggregatedTests[entry];
	                    		this.clinicalTestReports.push(aggregatedTestsForTest[aggregatedTestsForTest.length-1]);
							}
	                    },
	                    error =>  this.errorMessage = <any>error);
	};

	editTestReport(testReport:TestReport):void{
		this.mode = "edit";
		this.testReportForm = this.fb.group({
			'id' : [testReport.id],
			'patientid' : [this.patient.id],
			'testid' : [testReport.testid, Validators.required],
			'result' : [testReport.result, Validators.required],
		    'conducteddate' : [testReport.conducteddate, Validators.required],
		    'modifieddate' : [testReport.modifieddate]
		});
	};
	
	viewTest(testId:number):void{
		this.mode = "viewConsolidated";
		this.currentTestId = testId;
	};

	saveReport(formData:any): void {
		this.saveTestButtonClicked = true;
		this.statusTest = null;
		if(this.testReportForm.valid && this.testReportForm.dirty){
		  this.testService.saveTestReport(formData).subscribe(
		  	response => {
		  		var status = response.status;
		  		this.saveButtonClicked = false;
		  		switch(status){
		  			case 2:{
		  				this.status = 'success';
		  				this.testReportForm.markAsPristine();
		  				this.newTestReport = new TestReport();
		  				this.mode = "default";
		  				this.fetchReports();
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
		  	};
		  );
		}
	};

	cancel():void{
		this.mode = "default";
	};

	goBack(): void {
	  window.history.back();
	};

	getDateAsString(inputDate : Date):string{
		let month = inputDate.getMonth() + 1;
	    let day = inputDate.getDate();
	    let year = inputDate.getFullYear();

	    if(month < 10)
	        month = '0' + month.toString();
	    if(day < 10)
	        day = '0' + day.toString();

	    return year + '-' + month + '-' + day;    
	};
}