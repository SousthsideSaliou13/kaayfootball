/**
 * Modèle TypeScript d’une réservation de terrain.
 * À placer dans src/app/models/reservation.model.ts
 */
export interface Reservation {
    id_reservation: number;
    id_entreprise: number;
    id_utilisateur: number;
    id_terrain: number;
    id_type_reservation: number;
    libelle_reservation: string;
    date: string;          // format YYYY-MM-DD
    heure_debut: string;   // format HH:MM (24 h)
    heure_fin: string;     // format HH:MM (24 h)
    evaluation: string | null;
    etat: 'confirmée' | 'actif' | 'annulée' | string;
    created_at: string;    // ISO 8601
    updated_at: string;
    statut: string;
}
