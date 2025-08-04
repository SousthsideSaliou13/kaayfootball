import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
// import { register } from 'module';
@Component({
    selector: 'app-list-login',
    standalone: true, // Composant autonome
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './list-login.component.html',
    styleUrls: ['./list-login.component.scss']
})
export class ListLoginComponent {
    reactiveForm_login_login !: FormGroup;
    submitted: boolean = false
    loading_login_login: boolean = false
    showPassword = false;
    constructor(private formBuilder: FormBuilder, public api: ApiService, private router: Router) { }

    ngOnInit(): void {
        this.init_form()
    }

    init_form() {
        this.reactiveForm_login_login = this.formBuilder.group({
            login: ["", Validators.required],
            pwd: ["", Validators.required]
        });
    }

    // acces facile au champs de votre formulaire
    get f(): any { return this.reactiveForm_login_login.controls; }
    // validation du formulaire
    onSubmit_login_login() {
        this.submitted = true;
        console.log(this.reactiveForm_login_login.value)
        // stop here if form is invalid
        if (this.reactiveForm_login_login.invalid) {
            return;
        }
        var login = this.reactiveForm_login_login.value
        this.login_login(login)
    }
    // vider le formulaire
    onReset_login_login() {
        this.submitted = false;
        this.reactiveForm_login_login.reset();
    }
    login_login(login: any) {
        this.loading_login_login = true;
        this.api.taf_post_login("taf_auth/auth", login, async (reponse: any) => {
            if (reponse.status) {
                console.log("Opération effectuée avec succés sur la table login. Réponse= ", reponse);

                if (reponse) {
                    await this.api.save_on_local_storage("token", reponse.data)
                    // this.api.Swal_success("Opération éffectuée avec succés")

                    this.router.navigate(['/home'])
                    this.onReset_login_login()
                } else {
                    this.api.Swal_error("Votre compte est désactivé, veuillez contacter l'administrateur")
                }

                console.log("user_connected", this.api.token.user_connected)
                console.log("current_entreprise = ", this.api.current_entreprise)
            } else {
                console.log("L'opération sur la table login a échoué. Réponse= ", reponse);
                this.api.Swal_error("L'opération a echoué")
            }
            this.loading_login_login = false;
        }, (error: any) => {
            this.loading_login_login = false;
        })
    }
    rediriger() {
        let id_privilege = this.api.token.user_connected.id_privilege
        switch (id_privilege) {
            case 1:// admin
                this.router.navigate(['/home/utilisateur'])
                break;
            case 2:// Top Manager
                this.router.navigate(['/home/objectif'])
                break;
            case 3:// suoerviseur
                this.router.navigate(['/home/visite'])
                break;
            case 4:// delegue medical
                this.router.navigate(['/home/client'])
                break;
            case 11:// administrateur d'entreprise
                this.router.navigate(['/home/utilisateur'])
                break;
            default:
                this.router.navigate(['/home'])
                break;
        }
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

}
