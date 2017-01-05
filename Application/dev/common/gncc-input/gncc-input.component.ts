import {Component, Input} from '@angular/core';

@Component({
    selector: 'gncc-input',
    templateUrl:"app/common/gncc-input/gncc-input.html"
})
export class GnccInputComponent {
	@Input() inputType: string = 'text';
	@Input() labelText: string = '';
	@Input() inputControl: AbstractControl;
}