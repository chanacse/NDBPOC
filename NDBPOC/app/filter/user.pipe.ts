import { PipeTransform, Pipe } from '@angular/core';
import { IUsers } from '../models/user';

@Pipe({
    name: 'UsersFilterPipe'
})

export class UsersFilterPipe implements PipeTransform {

    transform(value: IUsers[], filter: string): IUsers[] {
        filter = filter ? filter.toLocaleLowerCase() : null;


        if (true) {
            return filter ? value.filter((app: IUsers) =>
                app.LoginName != null && app.LoginName.toLocaleLowerCase().indexOf(filter) != -1
            ) : value;
        }

    }
}