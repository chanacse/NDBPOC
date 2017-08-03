import { PipeTransform, Pipe } from '@angular/core';
import { ICompany } from '../models/company';

@Pipe({
    name: 'CompanyFilterPipe'
})

export class CompanyFilterPipe implements PipeTransform {

    transform(value: ICompany[], filter: string): ICompany[] {
        filter = filter ? filter.toLocaleLowerCase() : null;


        if (true) {
            return filter ? value.filter((app: ICompany) =>
                app.CName != null && app.CName.toLocaleLowerCase().indexOf(filter) != -1
            ) : value;
        }

    }
}