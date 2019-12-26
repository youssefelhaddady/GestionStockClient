import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ModeReglementEnum } from 'app/exchange/mode_reglement_enum';
import { Injectable } from '@angular/core';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
    TimesNewRoman: {
        normal: 'TimesNewRoman.ttf',
        bold: 'TimesNewRomanBD.ttf',
        italics: 'TimesNewRoman.ttf',
        bolditalics: 'TimesNewRomanBD0.ttf'
    }
}

@Injectable({
    providedIn: 'root'
})
export class BillGeneratorService {

    constructor() {}

    generatePdf(type: string, data: any, commandLines: any, reglementLines: any, nomMag: string, action = 'download') {
        const documentDefinition = this.getDocumentDefinition(type, data, commandLines, reglementLines, nomMag);

        switch (action) {
            case 'open': pdfMake.createPdf(documentDefinition).open(); break;
            case 'print': pdfMake.createPdf(documentDefinition).print(); break;
            case 'download': pdfMake.createPdf(documentDefinition).open(); pdfMake.createPdf(documentDefinition).download((type === 'C' ? data.codeCmd : data.codeCmdF) + '.pdf'); break;

            default: pdfMake.createPdf(documentDefinition).open(); break;
        }

    }

    getDocumentDefinition(type: string, data: any, commandLines: any, reglementLines: any, nomMag: string) {
        return {
            content: [
                {
                    columns: [
                        {
                            text: 'فاتورة',
                            width: '*',
                            style: 'title'
                        },
                        {
                            image: 'gdsLogo.png',
                            width: 50,
                            height: 50,
                            margin: [0, 0, 0, 40]
                        }
                    ]
                },
                // general commande details
                {
                    columns: [
                        [
                            (type === 'C') ? this.getClientObject(data) : this.getFournisseurObject(data)
                        ],
                        [
                            this.getCommandeDetailsObject(type, data, nomMag)
                        ]
                    ]
                },
                {
                    text: this.getText('المنتجات : '), style: 'header'
                },
                this.getProductsObject(commandLines),
                {
                    text: this.getText('طرق الدفع : '), style: 'header'
                },
                this.getReglementsObject(reglementLines)
            ],
            styles: {
                title: {
                    bold: true,
                    fontSize: 26,
                    alignment: 'center',
                    margin: [30, 15, 0, 20]
                },
                header: {
                    fontSize: 20,
                    bold: true,
                    decoration: 'underline',
                    margin: [0, 40, 0, 10],
                },
                tableHeader: {
                    bold: true,
                    fontSize: 16,
                    color: 'black'
                },
                tableCell: {
                    fontSize: 13,
                    color: 'black'
                }
            },
            defaultStyle: {
                font: 'TimesNewRoman',
                fontSize: 14,
                alignment: 'right'
            },
            info: {
                title: (type === 'C' ? data.codeCmd : data.codeCmdF),
                author: 'tcreative',
                subject: 'commande',
                keywords: 'commande ' + (type === 'C' ? data.client.name : data.fournisseur.name),
            },
        };
    }

    getText(text: string): string {
        if (text === undefined) {
            return '';
        }

        const strTab = text.split(' ');
        return strTab.reverse().join('\t');
    }

    formatDate(date: Date): string {
        let str = '';

        str += this.numberToString(date.getDay());
        str += '/' + this.numberToString(date.getMonth());
        str += '/' + date.getFullYear();
        str += '\t' + this.numberToString(date.getHours());
        str += ':' + this.numberToString(date.getMinutes());

        return str;
    }

    numberToString(number): string {
        return number < 10 ? '0' + number : number;
    }

    getProductsObject(commandLines) {
        const lignes = commandLines;
        return {
            table: {
                widths: ['*', '*', '*', '*', 20],
                body: [
                    [
                        { text: this.getText('السعر الاجمالي'), style: 'tableHeader' },
                        { text: this.getText('سعر الوحدة'), style: 'tableHeader' },
                        { text: this.getText('الكمية'), style: 'tableHeader' },
                        { text: this.getText('اسم المنتج'), style: 'tableHeader' },
                        { text: '', border: [true, false, false, true], }
                    ],
                    ...lignes.map((ligne, index) => {
                        return [
                            { text: ligne.somme, style: 'tableCell' },
                            { text: ligne.prixVente, style: 'tableCell' },
                            { text: ligne.quantite, style: 'tableCell' },
                            { text: this.getText(ligne.produit.libelle), style: 'tableCell' },
                            { text: (index + 1), style: 'tableCell' },
                        ];
                    })
                ]
            },
            margin: [0, 10, 0, 0]
        };
    }

    getReglementsObject(reglementLines) {
        const lignes = reglementLines;
        return {
            table: {
                widths: ['*', '*', 30],
                body: [
                    [
                        {
                            text: this.getText('المبلغ'),
                            style: 'tableHeader',
                        },
                        {
                            text: this.getText('الطريقة'),
                            style: 'tableHeader'
                        },
                        ''
                    ],
                    ...lignes.map((ligne, index) => {
                        return [
                            { text: ligne.montant, style: 'tableCell' },
                            { text: this.getText(this.getModeReglement(ligne.mode)), style: 'tableCell' },
                            { text: (index + 1), style: 'tableCell' },
                        ];
                    })
                ]
            },
            layout: 'lightHorizontalLines',
            margin: [260, 15, 0, 0]
        };
    }

    getClientObject(data: any) {
        return {
            table: {
                width: ['*', '*', '*'],
                body: [
                    [data.client.idClient, ':', this.getText('رمز الزبون')],
                    [this.getText(data.client.name), ':', this.getText('اسم الزبون')],
                    [this.getText(data.livraison ? 'نعم' : 'لا'), ':', this.getText('تسليم')]
                ],
            },
            layout: 'noBorders',
            margin: [100, 0, 0, 0]
        };
    }

    getFournisseurObject(data: any) {
        return {
            table: {
                width: ['*', '*', '*'],
                body: [
                    [data.fournisseur.idFournisseur, ':', this.getText('رمز المزود')],
                    [this.getText(data.fournisseur.name), ':', this.getText('اسم المزود')]
                ],
            },
            layout: 'noBorders',
            margin: [100, 0, 0, 0]
        };
    }

    getCommandeDetailsObject(type: string, data: any, nomMag: string) {
        return {
            table: {
                width: ['*', '*', '*'],
                body: [
                    [this.getText(type === 'C' ? data.codeCmd : data.codeCmdF), ':', this.getText('رمز الطلب')],
                    [this.formatDate(type === 'C' ? data.dateCmd : data.dateCmdF), ':', this.getText('تاريخ الطلب')],
                    [this.getText(nomMag), ':', this.getText('المخزن')],
                    [data.montantTotal, ':', this.getText('المبلغ الإجمالي')],
                    type === 'C' ? [data.montantPaye, ':', this.getText('المبلغ المدفوع')] : ['', '', ''],
                ],
            },
            layout: 'noBorders',
            margin: [50, 0, 0, 0]
        };
    }

    getModeReglement(mode: ModeReglementEnum): string {
        switch (mode) {
            case ModeReglementEnum.ESPECES:
                return 'نقد';
            case ModeReglementEnum.CHEQUE:
                return 'شيك';
            case ModeReglementEnum.EFFET:
                return '(Effet) كمبيالة';
            case ModeReglementEnum.VIREMENT_BANCAIRE:
                return 'حوالة مصرفية';
            case ModeReglementEnum.CREDIT:
                return 'سلف';
            case ModeReglementEnum.N_EST_PAS_INCLUS:
                return 'معاملة';

            default:
                return 'نقد';
        }
    }
}