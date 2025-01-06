import { Permission } from "../dto/permission";
import { Permissions } from "../dto/permissons";

export function parsePermissions(serverResponse: Permission[], isHavePermissions: number[]): Permissions[] {
  const result: Permissions[] = [];

  serverResponse.forEach((item, index) => {
    const parts = item.name.split('_'); 
    const action = parts[0].toLowerCase();
    const entity = parts.slice(1).join(' ').toLowerCase(); 

    const existingEntity = result.find(r => r.name === entity);

    if (existingEntity) {
      if(isHavePermissions.includes(item.id)){
      existingEntity.permission.push({ id: item.id, name: action , ischeck: true});
      } else {
        existingEntity.permission.push({ id: item.id, name: action, ischeck: false });
      }
    } else {
      if(isHavePermissions.includes(item.id)) {
        result.push({
          name: entity,
          ischeck: index === 0,
          permission: [{ id: item.id, name: action, ischeck: true}]
        });
      }else {
        result.push({
          name: entity,
          ischeck: index === 0,
          permission: [{ id: item.id, name: action, ischeck: false}]
        });
      }

    }
  });

  return result;
}