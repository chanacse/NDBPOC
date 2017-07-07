import { PipeTransform, Pipe } from '@angular/core';
import { ISampleFile } from '../models/samplefile';

@Pipe({
    name: 'sampleFileFilter'
})

export class SampleFileFilterPipe implements PipeTransform {

    transform(value: ISampleFile[], filter: string): ISampleFile[] {
        filter = filter ? filter.toLocaleLowerCase() : null;
        return filter ? value.filter((localFile: ISampleFile) =>
            localFile.Cname != null && localFile.Cname.toLocaleLowerCase().indexOf(filter) != -1
            || localFile.Fname != null && localFile.Fname.toLocaleLowerCase().indexOf(filter) != -1
            || localFile.ApprovalStatus != null && localFile.ApprovalStatus.toLocaleLowerCase().indexOf(filter) != -1
            || localFile.ShareType != null && localFile.ShareType.toLocaleLowerCase().indexOf(filter) != -1
            || localFile.OfferCode != null && localFile.OfferCode.toLocaleLowerCase().indexOf(filter) != -1
        ) : value;

    }
}