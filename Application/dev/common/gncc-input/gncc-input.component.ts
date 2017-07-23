import {Component, Input} from '@angular/core';

@Component({
    selector: 'gncc-input',
    templateUrl:"app/common/gncc-input/gncc-input.html"
})
export class GnccInputComponent {
	@Input() inputType: string = 'text';
	@Input() rows: number = 3;
	@Input() labelText: string = '';
	@Input() groupName: string = '';
	@Input() inputControl: AbstractControl;
	@Input() placeholderText: string = '';
	@Input() optionList:List = [];
	@Input() minDate:string = '';
	@Input() maxDate:string = '';
	@Input() disabled:string = '';
	@Input() optionDisplayField: string = 'name';
	@Input() optionValueField: string = 'code';
	@Input() defaultHeading: string = 'Select';
	@Input() labelWidth: number = 2;
	@Input() fieldWidth: number = 10;
}