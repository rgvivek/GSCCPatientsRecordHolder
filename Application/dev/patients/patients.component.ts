import { Component } from '@angular/core';
import { Patient } from 'app/patient/patient';
import { Router } from '@angular/router';
import { PatientService } from 'app/patient/patient.service';

@Component({
    selector: 'nsf-patients',
    templateUrl:"app/patients/patients.html"
})
export class PatientsComponent implements OnInit{
	constructor(private patientService: PatientService, private router: Router) {
		this.columnDefs = [
	        { headerName: "ID", field: "id", sortingOrder: ["asc", "desc"], editable: false, width: 100 },
	        { headerName: "First Name", field: "firstname", sortingOrder: ["asc", "desc"], editable: false, hide: false },
	        { headerName: "Last Name", field: "lastname", sortingOrder: ["asc", "desc"], editable: false, hide: false },
	        { headerName: "Sex", field: "sex", sortingOrder: ["asc", "desc"], editable: false, hide: false },
	        { headerName: "Date Of Birth", field: "dateofbirth", sortingOrder: ["asc", "desc"], editable: false, hide: false },
	        { headerName: "Contact No.", field: "mobilenumber", sortingOrder: ["asc", "desc"], editable: false, hide: false },
	        { headerName: "Father's Name", field: "fathersname", sortingOrder: ["asc", "desc"], editable: false, hide: false }
	    ];
	    this.patientService.getPatients().subscribe(
                    patients => this.patients = patients,
                    error =>  this.errorMessage = <any>error);
	    this.gridOptions = {
	        enableSorting: true,
	        rowData: this.patients,
	        columnDefs: this.columnDefs,
	        onGridReady: function(event) {
    	        event.api.sizeColumnsToFit();
	        }
		}
	};
	getPatients():void{
		this.patientService.getPatients().subscribe(
                    patients => this.patients = patients,
                    error =>  this.errorMessage = <any>error);
	}
	ngOnInit(): void {
		this.getPatients();
	}
	gotoDetail(event): void {
	  let link = ['/detail', event.data.id];
	  this.router.navigate(link);
	}
	goBack(): void {
	  window.history.back();
	}
}