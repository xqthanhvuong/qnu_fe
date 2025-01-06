import { Permission } from "./permission";

export interface Permissions {
    name: string;
    ischeck: boolean;
    permission: Permission[];
  }