// base-filter.component.ts
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { StringUtils } from '../until/StringUtils';

export abstract class BaseFilterComponent {
  filterGeneric(
    event: AutoCompleteCompleteEvent,
    sourceKey: keyof this,
    targetKey: keyof this
  ) {
    console.log('Running filterGeneric', sourceKey, targetKey);

    const query = StringUtils.removeAccents(event.query.toLowerCase());

    const sourceList = this[sourceKey] as any[];
    let result;
    if(sourceList.length != 0 && sourceList[0].name !== undefined){
      console.log('sourceList[0].name !== undefined', sourceList[0].name);
      result = sourceList.filter((item: any) =>
          StringUtils.removeAccents(item.name.toLowerCase()).includes(query)
      );
    }else {
      result = sourceList.filter((item: any) =>
          StringUtils.removeAccents(item.toString().toLowerCase()).includes(query)
      );
    }
 
    (this as any)[targetKey] = result; // gán lại mảng để Angular detect
  }
}
