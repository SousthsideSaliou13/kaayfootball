import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IdbService } from '../idb/idb.service';
import Swal from 'sweetalert2';
import moment from 'moment';
import 'moment/locale/fr';
import { Location } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  local_storage_prefixe = "kaayfootball";
  taf_base_url = "http://localhost/kaayfootball/";

  infos: any = {
    utilisateur: {},
    les_entreprises: []
  }
  current_entreprise: any = {}
  loading_get_utilisateur = false
  menu: any[] = []
  color1 = "#1555A6"
  color2 = "#D92010"

  full_menu: any[] = [
    {
      menu_header: "Accueil",
      items: [
        {
          name: "Terrain",
          path: "/home/terrain",
          icon: "bi bi-border",
          children: [],
          les_actions: [
            { menu: "Terrain", ongle: "Terrain", id: "list_Terrain", action: "Lister les Terrains" },
            { menu: "Terrain", ongle: "Terrain", id: "edit_Terrain", action: "Editer un Terrain" },
            { menu: "Terrain", ongle: "Terrain", id: "add_Terrain", action: "Ajouter un Terrain" },
            { menu: "Terrain", ongle: "Terrain", id: "delete_Terrain", action: "Supprimer un Terrain" },

          ],
        },
        {
          name: "Reservation",
          path: "/home/reservation",
          icon: "bi bi-bell",
          children: [],
          les_actions: [
            { menu: "Reservation", ongle: "Reservation", id: "list_Reservation", action: "Lister les Reservations" },
            { menu: "Reservation", ongle: "Reservation", id: "edit_Reservation", action: "Editer un Reservation" },
            { menu: "Reservation", ongle: "Reservation", id: "add_Reservation", action: "Ajouter un Reservation" },
            { menu: "Reservation", ongle: "Reservation", id: "delete_Reservation", action: "Supprimer un Reservation" },

          ],
        },
        {
          name: "Abonnement",
          path: "/home/abonnement",
          icon: "bi bi-person-vcard-fill",
          children: [],
          les_actions: [
            { menu: "Abonnement", ongle: "Abonnement", id: "list_Abonnement", action: "Lister les Abonnements" },
            { menu: "Abonnement", ongle: "Abonnement", id: "edit_Abonnement", action: "Editer un Abonnement" },
            { menu: "Abonnement", ongle: "Abonnement", id: "add_Abonnement", action: "Ajouter un Abonnement" },
            { menu: "Abonnement", ongle: "Abonnement", id: "delete_Abonnement", action: "Supprimer un Abonnement" },

          ],
        },

      ]
    },
    // {
    //   menu_header: "Commerciale",
    //   items: [
    //     {
    //       name: "Approvisionnement",
    //       path: "/home/approvisionnement",// A modifier
    //       icon: "bi bi-box-seam-fill",
    //       children: [


    //       ],
    //       les_actions: [
    //         { menu: "Approvisionnement", ongle: "Approvisionnement", id: "list_approvisionnement", action: "Lister les approvisionnements" },
    //         { menu: "Approvisionnement", ongle: "Approvisionnement", id: "add_approvisionnement", action: "Ajouter un approvisionnement" },
    //       ]
    //     },
    //     {
    //       name: "Produit",
    //       path: "/home/produit",
    //       icon: "bi bi-basket",
    //       children: [],
    //       les_actions: [
    //         { menu: "Produit", ongle: "Produit", id: "list_produit", action: "Lister les produits" },
    //         { menu: "Produit", ongle: "Produit", id: "edit_produit", action: "Editer un produit" },
    //         { menu: "Produit", ongle: "Produit", id: "add_produit", action: "Ajouter un produit" },
    //         { menu: "Produit", ongle: "Produit", id: "delete_produit", action: "Supprimer un produit" },

    //       ],
    //     },
    //     {
    //       name: "Gamme",
    //       path: "/home/gamme",
    //       icon: "bi bi-file-post-fill",
    //       children: [],
    //       les_actions: [
    //         { menu: "Gamme", ongle: "Gamme", id: "list_gamme", action: "Lister les gammes" },
    //         { menu: "Gamme", ongle: "Gamme", id: "edit_gamme", action: "Editer une gamme" },
    //         { menu: "Gamme", ongle: "Gamme", id: "add_gamme", action: "Ajouter une gamme" },
    //         { menu: "Gamme", ongle: "Gamme", id: "delete_gamme", action: "Supprimer une gamme" },

    //       ],
    //     },

    //     {
    //       name: "Vente",
    //       path: "/home/vente",// A modifier
    //       icon: "bi bi-cart",
    //       children: [],
    //       les_actions: [
    //         { menu: "Vente", ongle: "Vente", id: "list_vente", action: "Lister les ventes" },
    //         { menu: "Vente", ongle: "Vente", id: "edit_vente", action: "Editer une vente" },
    //         { menu: "Vente", ongle: "Vente", id: "add_vente", action: "Ajouter une vente" },
    //         { menu: "Vente", ongle: "Vente", id: "delete_vente", action: "Supprimer une vente" },

    //       ],

    //     },
    //   ]
    // },

    // {
    //   menu_header: "Suivie client",
    //   items: [
    //     {
    //       name: "Client",
    //       path: "/home/client",// A modifier
    //       icon: "bi bi-person",
    //       children: [
    //         {
    //           name: "Potentiel",
    //           path: "/home/potentiel",
    //           icon: "bi bi-pen",
    //           children: [],
    //           les_actions: [
    //             { menu: "Potentiel", ongle: "Potentiel", id: "list_potentiel", action: "Lister les potentiels" },
    //             { menu: "Potentiel", ongle: "Potentiel", id: "edit_potentiel", action: "Editer un potentiel" },
    //             { menu: "Potentiel", ongle: "Potentiel", id: "add_potentiel", action: "Ajouter un potentiel" },
    //             { menu: "Potentiel", ongle: "Potentiel", id: "delete_potentiel", action: "Supprimer un potentiel" },

    //             { menu: "Potentiel", ongle: "Client", id: "list_client", action: "Lister les clients" },
    //             { menu: "Potentiel", ongle: "Client", id: "add_client", action: "Ajouter une client" },
    //             { menu: "Potentiel", ongle: "Client", id: "delete_client", action: "Supprimer une client" },
    //             { menu: "Potentiel", ongle: "Client", id: "edit_client", action: "Editer une client" },

    //             { menu: "Potentiel", ongle: "Type potentiel", id: "list_type_potentiel", action: "Lister les types de potentiel" },
    //             { menu: "Potentiel", ongle: "Type potentiel", id: "add_type_potentiel", action: "Ajouter une type potentiel" },
    //             { menu: "Potentiel", ongle: "Type potentiel", id: "delete_type_potentiel", action: "Supprimer un type potentiel" },
    //             { menu: "Potentiel", ongle: "Type potentiel", id: "edit_type_potentiel", action: "Editer une type potentiel" },
    //           ],
    //         },
    //         // {
    //         //   name: "Zone Ugv",
    //         //   path: "/home/zone_ugv",
    //         //   icon: "bi bi-postage",
    //         //   children: [],
    //         //   les_actions: [
    //         //     { menu: "Zone ugv", ongle: "Zone ugv", id: "list_zone ugv", action: "Lister les zone ugvs" },
    //         //     { menu: "Zone ugv", ongle: "Zone ugv", id: "edit_zone ugv", action: "Editer une zone ugv" },
    //         //     { menu: "Zone ugv", ongle: "Zone ugv", id: "add_zone ugv", action: "Ajouter une zone ugv" },
    //         //     { menu: "Zone ugv", ongle: "Zone ugv", id: "delete_zone ugv", action: "Supprimer une zone ugv" },

    //         //     { menu: "Zone ugv", ongle: "Zone", id: "list_zone", action: "Lister les zones" },
    //         //     { menu: "Zone ugv", ongle: "Zone", id: "edit_zone", action: "Editer une zone" },
    //         //     { menu: "Zone ugv", ongle: "Zone", id: "add_zone", action: "Ajouter une zone" },
    //         //     { menu: "Zone ugv", ongle: "Zone", id: "delete_zone", action: "Supprimer une zone" },

    //         //   ],
    //         // },
    //       ],
    //       les_actions: [
    //         { menu: "Client", ongle: "Client", id: "list_client", action: "Lister les clients" },
    //         { menu: "Client", ongle: "Client", id: "edit_client", action: "Editer un client" },
    //         { menu: "Client", ongle: "Client", id: "add_client", action: "Ajouter un client" },
    //         { menu: "Client", ongle: "Client", id: "delete_client", action: "Supprimer un client" },

    //         { menu: "Client", ongle: "Structure", id: "list_structure", action: "Lister les structures" },
    //         { menu: "Client", ongle: "Structure", id: "add_structure", action: "Ajouter une structure" },
    //         { menu: "Client", ongle: "Structure", id: "delete_structure", action: "Supprimer une structure" },
    //         { menu: "Client", ongle: "Structure", id: "edit_structure", action: "Editer une structure" },

    //         { menu: "Client", ongle: "Specialite", id: "list_specialite", action: "Lister les specialités" },
    //         { menu: "Client", ongle: "Specialite", id: "add_specialite", action: "Ajouter une Specialite" },
    //         { menu: "Client", ongle: "Specialite", id: "delete_specialite", action: "Supprimer une Specialite" },
    //         { menu: "Client", ongle: "Specialite", id: "edit_specialite", action: "Editer une Specialite" },
    //       ],
    //     },
    //     {
    //       name: "Zone Ugv",
    //       path: "/home/zone_ugv",
    //       icon: "bi bi-postage",
    //       children: [],
    //       les_actions: [
    //         { menu: "Zone ugv", ongle: "Zone ugv", id: "list_zone ugv", action: "Lister les zone ugvs" },
    //         { menu: "Zone ugv", ongle: "Zone ugv", id: "edit_zone ugv", action: "Editer une zone ugv" },
    //         { menu: "Zone ugv", ongle: "Zone ugv", id: "add_zone ugv", action: "Ajouter une zone ugv" },
    //         { menu: "Zone ugv", ongle: "Zone ugv", id: "delete_zone ugv", action: "Supprimer une zone ugv" },

    //         { menu: "Zone ugv", ongle: "Zone", id: "list_zone", action: "Lister les zones" },
    //         { menu: "Zone ugv", ongle: "Zone", id: "edit_zone", action: "Editer une zone" },
    //         { menu: "Zone ugv", ongle: "Zone", id: "add_zone", action: "Ajouter une zone" },
    //         { menu: "Zone ugv", ongle: "Zone", id: "delete_zone", action: "Supprimer une zone" },

    //       ],
    //     },

    //   ]
    // },

    {
      menu_header: "Parametrage",
      items: [
        {
          name: "Utilisateur",
          path: "/home/utilisateur",// A modifier
          icon: "bi bi-person",
          children: [],
          les_actions: [
            { menu: "Utilisateur", ongle: "Utilisateur", id: "list_utilisateur", action: "Lister les utilisateurs" },
            { menu: "Utilisateur", ongle: "Utilisateur", id: "edit_utilisateur", action: "Editer un utilisateur" },
            { menu: "Utilisateur", ongle: "Utilisateur", id: "add_utilisateur", action: "Ajouter un utilisateur" },
            { menu: "Utilisateur", ongle: "Utilisateur", id: "delete_utilisateur", action: "Supprimer un utilisateur" },

            { menu: "Utilisateur", ongle: "Entreprise", id: "list_entreprise", action: "Lister les entreprises" },
            { menu: "Utilisateur", ongle: "Entreprise", id: "edit_entreprise", action: "Editer un entreprise" },
            { menu: "Utilisateur", ongle: "Entreprise", id: "add_entreprise", action: "Ajouter un entreprise" },
            { menu: "Utilisateur", ongle: "Entreprise", id: "delete_entreprise", action: "Supprimer un entreprise" },

            { menu: "Utilisateur", ongle: "Etablissement", id: "list_etablissement", action: "Lister les etablissements" },
            { menu: "Utilisateur", ongle: "Etablissement", id: "edit_etablissement", action: "Editer un etablissement" },
            { menu: "Utilisateur", ongle: "Etablissement", id: "add_etablissement", action: "Ajouter un etablissement" },
            { menu: "Utilisateur", ongle: "Etablissement", id: "delete_etablissement", action: "Supprimer un etablissement" },

            { menu: "Utilisateur", ongle: "Privilege", id: "list_privilege", action: "Lister les privileges" },
            { menu: "Utilisateur", ongle: "Privilege", id: "edit_privilege", action: "Editer un privilege" },
            { menu: "Utilisateur", ongle: "Privilege", id: "add_privilege", action: "Ajouter un privilege" },
            { menu: "Utilisateur", ongle: "Privilege", id: "delete_privilege", action: "Supprimer un privilege" },

            { menu: "Privilege", ongle: "Privilege", id: "list_privilege", action: "Lister les privileges" },
            { menu: "Privilege", ongle: "Privilege", id: "edit_privilege", action: "Editer un privilege" },
            { menu: "Privilege", ongle: "Privilege", id: "add_privilege", action: "Ajouter un privilege" },
            { menu: "Privilege", ongle: "Privilege", id: "delete_privilege", action: "Supprimer un privilege" },
          ],
        },
        {
          name: "Entreprise",
          path: "/home/entreprise",// A modifier
          icon: "bi bi-house",
          children: [],
          les_actions: [
            { menu: "Entreprise", ongle: "Entreprise", id: "list_entreprise", action: "Lister les entreprises" },
            { menu: "Entreprise", ongle: "Entreprise", id: "edit_entreprise", action: "Editer un entreprise" },
            { menu: "Entreprise", ongle: "Entreprise", id: "add_entreprise", action: "Ajouter un entreprise" },
            { menu: "Entreprise", ongle: "Entreprise", id: "delete_entreprise", action: "Supprimer un entreprise" },
          ]
        }

      ]
    }
  ]

  network: any = {
    token: undefined,
    status: true,
    message: "Aucun probléme détecté",
  }
  token: any = {
    token_key: null,
    token_decoded: null,
    user_connected: null,
    is_expired: null,
    date_expiration: null
  }

  constructor(private http: HttpClient, private route: Router, private idb: IdbService, public location: Location) { }
  // sauvegardes
  async get_from_local_storage(key: string): Promise<any> {
    try {
      let res: any = await this.idb.get_from_indexedDB(key)
      return res
    } catch (error) {
      console.error("erreur de recuperation", error)
      return null
    }
  }
  async save_on_local_storage(key: string, value: any): Promise<void> {
    await this.idb.save_on_indexedDB(key, value);
  }
  async delete_from_local_storage(key: string) {
    await this.idb.delete_from_indexedDB(key);
  }

  async get_token() {
    //le token n'est pas encore chargé
    if (this.network.token == undefined) {
      this.network.token = await this.get_from_local_storage("token")
      if (this.network.token != undefined && this.network.token != null) {// token existant
        this.update_data_from_token()// mise a jour du token
      }
    } else {// token dèja chargé
      this.update_data_from_token()// mise a jour du token
    }
    return this.network.token
  }
  //les requetes http
  async taf_get(path: string, on_success: Function, on_error: Function) {
    let api_url = this.taf_base_url + path;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + await this.get_token(),
      })
    };

    this.http.get(api_url, httpOptions).subscribe(
      (reponse: any) => {// on success
        on_success(reponse)
      },
      (error: any) => {// on error
        this.on_taf_get_error(error, on_error)
      }
    )
  }
  on_taf_get_error(error: any, on_error: Function) {
    this.network.status = false;
    this.network.message = error
    this.Swal_info("Merci de vérifier votre connexion")
    on_error(error)
  }
  async taf_post(path: string, data_to_send: any, on_success: Function, on_error: Function) {
    let api_url = this.taf_base_url + path;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + await this.get_token(),
      })
    };
    this.http.post(api_url, data_to_send, httpOptions).subscribe(
      (reponse: any) => {// on success
        on_success(reponse)
      },
      (error: any) => {// on error
        this.on_taf_post_error(error, on_error)
      }
    )
  }
  async taf_post_with_files(path: string, data_to_send: any, form_files: any, on_success: Function, on_error: Function) {
    let api_url = this.taf_base_url + path;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + await this.get_token(),
      })
    };
    const formData = new FormData();
    // Ajouter les données du formulaire au FormData
    for (const key in data_to_send) {
      formData.append(key, data_to_send[key]);
    }
    // Ajouter les fichiers sélectionné au FormData
    for (const key in form_files) {
      for (let i = 0; i < form_files[key].length; i++) {
        const one_file = form_files[key][i];
        formData.append(key + "[]", one_file);
      }
    }
    this.http.post(api_url, formData, httpOptions).subscribe(
      (reponse: any) => {// on success
        on_success(reponse)
      },
      (error: any) => {// on error
        this.on_taf_post_error(error, on_error)
      }
    )
  }
  async taf_post_login(path: string, data_to_send: any, on_success: Function, on_error: Function) {
    let api_url = this.taf_base_url + path;

    this.http.post(api_url, data_to_send).subscribe(
      (reponse: any) => {// on success
        on_success(reponse)
      },
      (error: any) => {// on error
        this.on_taf_post_error(error, on_error)
      }
    )
  }
  on_taf_post_error(error: any, on_error: any) {
    this.network.status = false;
    this.network.message = error
    this.Swal_info("Merci de vérifier votre connexion")
    on_error(error)
  }
  async update_data_from_token() {
    let token_key = await this.get_from_local_storage("token")
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token_key);
    const expirationDate = helper.getTokenExpirationDate(token_key);
    const isExpired = helper.isTokenExpired(token_key);

    this.token = {
      token_key: token_key,
      token_decoded: decodedToken,
      user_connected: decodedToken.taf_data,
      is_expired: isExpired,
      date_expiration: expirationDate
    }
    if (this.token.is_expired) {
      this.on_token_expire()
    }
  }
  on_token_expire() {
    this.Swal_info("Votre session s'est expiré! Veuillez vous connecter à nouveau")
    this.delete_from_local_storage("token")
    this.route.navigate(['/public/login'])
  }

  Swal_success(title: any) {
    let succes = Swal.fire({
      title: title,
      icon: "success"
    });
    return succes
  }

  Swal_error(title: any) {
    let error = Swal.fire({
      title: title,
      icon: "error"
    });
    return error
  }
  Swal_info(title: any) {
    let info = Swal.fire({
      title: title,
      icon: "info"
    });
    return info
  }

  format_date(date_string: string) {
    // console.log("date_string",date_string)
    return {
      full: moment(date_string).locale("fr").format("dddd Do MMMM YYYY"),// 27 février 2023
      jma: moment(date_string).locale("fr").format("Do MMMM YYYY"),// jeudi ...
      jma2: moment(date_string).locale("fr").format("DD-MM-YYYY"),// 01-11-2023
      jma3: moment(date_string).locale("fr").format("YYYY-MM-DD"),// 2023-10-21
      jma3_hour: moment(date_string).locale("fr").format("YYYY-MM-DD HH:mm"),// 2023-10-21 14:50
      full_datetime: moment(date_string).locale("fr").format("dddd Do MMMM YYYY à HH:mm"),// 27 février 2023
      full_date: moment(date_string).locale("fr").format("dddd Do MMMM YYYY"),// 27 février 2023
    }
  }
  format_current_date() {
    return {
      full: moment().locale("fr").format("dddd Do MMMM YYYY"),// 27 février 2023
      jma: moment().locale("fr").format("Do MMMM YYYY"),// jeudi ...
      jma2: moment().locale("fr").format("DD-MM-YYYY"),// 01-11-2023
      jma3: moment().locale("fr").format("YYYY-MM-DD"),// 2023-10-21
      jma3_hour: moment().locale("fr").format("YYYY-MM-DD HH:mm"),// 2023-10-21 14:50
      full_datetime: moment().locale("fr").format("dddd Do MMMM YYYY à HH:mm"),// 27 février 2023
      full_date: moment().locale("fr").format("dddd Do MMMM YYYY"),// 27 février 2023
    }
  }

  go_back() {
    this.location.back()
  }
  custom_menu() {
    let droits: any[] = [];

    try {
      droits = typeof this.current_entreprise.les_droits === 'string'
        ? JSON.parse(this.current_entreprise.les_droits)
        : this.current_entreprise.les_droits;
    } catch (error) {
      console.error("Erreur de parsing des droits :", error);
      droits = [];
    }
    console.log("droits", droits)
    this.menu = this.full_menu
    // .map(menuGroup => {
    //   const filteredItems = menuGroup.items
    //     .map((item: any) => {
    //       const hasMenu = droits.some(d => d.ongle?.toLowerCase() === item.name?.toLowerCase());

    //       if (!hasMenu) return null;

    //       const filteredActions = item.les_actions?.filter((action: any) =>
    //         droits.some(d => d.id === action.id)
    //       ) || [];

    //       if (filteredActions.length === 0) return null;

    //       return {
    //         ...item,
    //         les_actions: filteredActions
    //       };
    //     })
    //     .filter((item: any) => item !== null);

    //   if (filteredItems.length === 0) return null;

    //   return {
    //     menu_header: menuGroup.menu_header,
    //     items: filteredItems
    //   };
    // }).filter(group => group !== null);

    console.log("Menu personnalisé avec headers :", this.menu);
  }


  hasMenuAccess(menu: any): boolean {

    if (!this.current_entreprise?.les_droits) {
      return false;
    }

    let droitsArray: any[];

    try {
      droitsArray = JSON.parse(this.current_entreprise.les_droits);
    } catch (error) {
      console.error("Error parsing les_droits:", error);
      return false;
    }

    if (!Array.isArray(droitsArray)) {
      return false;
    }

    return droitsArray.some(droit =>
      droit.menu &&
      droit.menu.toLowerCase().includes(menu.toLowerCase())
    );
  }


  hasOngleAccess(menu: any): boolean {

    if (!this.current_entreprise?.les_droits) {
      return false;
    }

    let droitsArray: any[];

    try {
      droitsArray = JSON.parse(this.current_entreprise.les_droits);
    } catch (error) {
      console.error("Error parsing les_droits:", error);
      return false;
    }

    if (!Array.isArray(droitsArray)) {
      return false;
    }

    return droitsArray.some(droit =>
      droit.ongle &&
      droit.ongle.toLowerCase().includes(menu.toLowerCase())
    );
  }


  hasActionAccess(menu: any): boolean {
    return true

    if (!this.current_entreprise?.les_droits) {
      return false;
    }

    let droitsArray: any[];

    try {
      droitsArray = JSON.parse(this.current_entreprise.les_droits);
    } catch (error) {
      console.error("Error parsing les_droits:", error);
      return false;
    }

    if (!Array.isArray(droitsArray)) {
      return false;
    }

    return droitsArray.some(droit =>
      droit.id &&
      droit.id.toLowerCase().includes(menu.toLowerCase())
    );
  }
}
