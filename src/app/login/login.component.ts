import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
	selector: 'dah-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	loginForm: FormGroup;
	usernameCtrl : FormControl;
	passwordCtrl : FormControl;

	returnUrl: string;
	loading = false;
	error = '';

	constructor(private router: Router,
				private route: ActivatedRoute,
				private authService: AuthService,
				fb: FormBuilder) {
		this.usernameCtrl = fb.control('',
									   [Validators.required]);

		this.passwordCtrl = fb.control('',
									   [Validators.required]);

		this.loginForm = fb.group({
			username: this.usernameCtrl,
			password: this.passwordCtrl
		});
	}

	ngOnInit(): void {
		// get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/patients';
	}


	onSubmit() {
		if ( this.loginForm.invalid ) {
			return;
		}

		this.loading=true;
		this.authService.login(this.usernameCtrl.value,
							   this.passwordCtrl.value)
			.pipe(first())
			.subscribe(
				data => {
					this.router.navigate([this.returnUrl]);
				},
				error => {
					this.error = error.error.message;
					this.loading = false;
				});
	}

}
