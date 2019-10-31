import { PersonneE } from './e_personne';



export class ClientE extends PersonneE {
    public idClient: number;
    public raison_sociale: string;
    public type: TypeClientEnum;
    public credit: number;

    constructor(
        idClient?: number,
        raison_sociale?: string,
        type?: TypeClientEnum,
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
        this.idClient = idClient;
        this.raison_sociale = raison_sociale;
        this.type = type;
        this.credit = credit;
    }

    // setCredit(credit: number, pret: number) {
    //     this.credit += credit;
    //     this.credit -= pret;
    // }
}

export enum TypeClientEnum {
    NORMAL,
    GROSSISTE,
    SEMI_GROSSISTE
}
