import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { User } from './user';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()

export class UserService {
	constructor () {}
    getLoggedInUser() : User{
    	this.user = new User();
    	this.user.username = "GS"
    	this.user.name = "Geethasudheer Rajasekar"
		return this.user;
	}

	setLoggedInUser(user : User) : void{
		this.user = user;
	}
}