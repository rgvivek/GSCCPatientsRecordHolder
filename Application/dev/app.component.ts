import {Component, OnInit } from '@angular/core';
import { Header } from './common/header/header';

@Component({
    selector: 'nsf-app',
    templateUrl:"app/app.html"
})

export class AppComponent {
	public header : Header = { title : "Gunam Siddha Cure Center",
						subTitle : "Patients Record Holder"
						};
}