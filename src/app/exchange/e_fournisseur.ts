import { PersonneE } from './e_personne';



export class FournisseurE extends PersonneE {
    public idFournisseur: number;
    public raison_sociale: string;
    public credit: number;

    constructor(
        idFournisseur?: number,
        raison_sociale?: string,
        credit?: number,
        cin?: string,
        name?: string,
        rip?: number,
        phone?: string,
        address?: string,
        email?: string,
        picture?: string,
    ) {
        super(cin, name, rip, phone, address, email, picture);
        this.idFournisseur = idFournisseur;
        this.raison_sociale = raison_sociale;
        this.credit = credit;
    }
}
