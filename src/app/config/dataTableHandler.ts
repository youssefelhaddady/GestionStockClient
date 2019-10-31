import { ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';



export class DataTableHandler {

    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};
    // We use this trigger because fetching the list of data can be quite long,
    // thus we ensure the data is fetched before rendering
    dtTrigger: Subject<any> = new Subject();


    constructor() { }


    initDataTable() {
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 5,
            destroy: true,
            lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, 'الكل']],
            processing: true,
            language: {
                processing: 'جارٍ التحميل...',
                lengthMenu: 'أظهر _MENU_ مدخلات',
                zeroRecords: 'لم يُعثَر على أيةِ سجلات',
                info: 'إظهار _START_ إلى _END_ من أصل _TOTAL_ مدخل',
                infoEmpty: 'يعرض 0 إلى 0 من أصل 0 سجل',
                infoFiltered: '(منتقاة من مجموع _MAX_ مُدخل)',
                infoPostFix: '',
                search: 'ابحث:',
                url: '',
                paginate: {
                    first: 'الأول',
                    previous: 'السابق',
                    next: 'التالي',
                    last: 'الأخير'
                },
                thousands: '.'
            },
            deferRender: true,
            responsive: false,
        };
    }

    nextTrigger() {
        this.dtTrigger.next();
    }

    unsubscribeTrigger() {
        this.dtTrigger.unsubscribe();
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
        });
    }

}
