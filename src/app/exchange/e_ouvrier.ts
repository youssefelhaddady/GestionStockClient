import { PersonneE } from './e_personne';



export class OuvrierE extends PersonneE {

    public idOuvrier: number;
    public salaire: number;
    public avance: number;
    public absences: AbsenceE[];

    constructor(
        idOuvrier?: number,
        cin?: string,
        name?: string,
        rip?: number,
        phone?: string,
        address?: string,
        email?: string,
        salaire?: number,
        avance?: number,
        absences?: AbsenceE[]
        ) {
        super(cin, name, rip, phone, address, email);
        this.idOuvrier = idOuvrier;
        this.salaire = salaire;
        this.avance = avance;
        this.absences = absences;
    }
}

export class AbsenceE {

    constructor(
        public idAbsence?: number,
        public dateAbsence?: Date,
        public ouvrier?: OuvrierE
    ) { }
}
