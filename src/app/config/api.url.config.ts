



export class API_URLS {
    // public static BASE_URL = 'http://149.202.107.248:7777';
    public static BASE_URL = window['cfgApiBaseUrl'];
    public static LOGIN_URL = `${API_URLS.BASE_URL}/login`;
    public static SIGNUP_URL = `${API_URLS.BASE_URL}/api/auth/signup`;
    public static ADMIN_URL = `${API_URLS.BASE_URL}/api/test/admin`;
    public static APP_USERS_URL = `${API_URLS.BASE_URL}/api/user`;
    public static CAISSE_URL = `${API_URLS.BASE_URL}/api/caisse`;
    public static CATEGORIE_URL = `${API_URLS.BASE_URL}/api/categorie`;
    public static CHARGE_URL = `${API_URLS.BASE_URL}/api/charge`;
    public static CLIENT_URL = `${API_URLS.BASE_URL}/api/client`;
    public static CMD_CLIENT_URL = `${API_URLS.BASE_URL}/api/commande_client`;
    public static CMD_FOURNISSEUR_URL = `${API_URLS.BASE_URL}/api/commande_fournisseur`;
    public static FACTURE_URL = `${API_URLS.BASE_URL}/api/facture`;
    public static FOURNISSEUR_URL = `${API_URLS.BASE_URL}/api/fournisseur`;
    public static MAGASIN_URL = `${API_URLS.BASE_URL}/api/magasin`;
    public static MOUVEMENT_STOCK_URL = `${API_URLS.BASE_URL}/api/mouvement_de_stock`;
    public static OUVRIER_URL = `${API_URLS.BASE_URL}/api/ouvrier`;
    public static PRODUIT_URL = `${API_URLS.BASE_URL}/api/produit`;
    public static REGLEMENT_CLIENT_URL = `${API_URLS.BASE_URL}/api/reglement_client`;
    public static REGLEMENT_FOURNISSEUR_URL = `${API_URLS.BASE_URL}/api/reglement_fournisseur`;
    public static STATISTIQUES_URL = `${API_URLS.BASE_URL}/api/statistiques`;
    public static TYPE_CHARGE_URL = `${API_URLS.BASE_URL}/api/type_de_charge`;
}
