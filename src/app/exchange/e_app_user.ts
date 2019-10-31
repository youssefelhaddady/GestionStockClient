import { MagasinE } from './e_magasin';
import { PersonneE } from './e_personne';


export class AppUserE extends PersonneE {
    public idUser?: number;
    public username?: string;
    public password?: string;
    public roles?: AppUserRoleE[];
    public magasin?: MagasinE;

    constructor(
        idUser?: number,
        name?: string,
        username?: string,
        password?: string,
        email?: string,
        roles?: AppUserRoleE[],
        magasin?: MagasinE
    ) {
        super();
        this.idUser = idUser;
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.roles = roles ? roles : [new AppUserRoleE(0, 'ROLE_USER')];
        this.magasin = magasin;
    }
}


export class AppUserRoleE {
    public idRole?: number;
    public name?: string;

    constructor(idRole?: number, name?: string) {
        this.idRole = idRole;
        this.name = name;
    }
}
