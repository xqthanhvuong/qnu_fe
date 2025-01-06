import { Component, OnInit } from '@angular/core';
import { Permissions } from '../../../../dto/permissons';
import { RoleService } from '../../../../service/role.service';
import { parsePermissions } from '../../../../until/permission-parser';
import { ToastrService } from 'ngx-toastr';
import { catchError, concatMap, EMPTY, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-role-add',
  templateUrl: './role-add.component.html',
  styleUrl: './role-add.component.css',
})
export class RoleAddComponent implements OnInit {
  permissions: Permissions[] = [];
  isEditMode: boolean = false;
  selectedPermissions: Permissions | null = null;
  selectedIndex: number = 0;
  isSelectedAll: boolean = false;
  roleName: string = '';
  roleId: number | null = null;
  selectedPermissionIds: number[] = [];

  constructor(
    private roleService: RoleService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.roleId = params['id'] ? Number(params['id']) : null;
      this.isEditMode = !!this.roleId;

      this.loadPermissions();
    });

  }

  
loadPermissions() {
  if (this.isEditMode) {
    this.roleService.getPermissionsOfRole(this.roleId!).pipe(
      catchError((error) => {
        this.toastr.error('Server error or network issue!', 'Error');
        this.router.navigate(['/role/add']);
        return EMPTY;
      })
    ).pipe(
      concatMap((response) => {
        if (response.code === 200) {
          this.roleName = response.result.roleName;
          this.selectedPermissionIds = response.result.permissionIds;
        }
        return this.roleService.getPermissionOfType();
      })
    ).subscribe((response) => {
      if (response.code === 200) {
        this.permissions = parsePermissions(
          response.result,
          this.selectedPermissionIds
        );
        this.selectedPermissions = this.permissions[0];
      }
    });
  } else {
    this.roleService.getPermissionOfType().subscribe((response) => {
      if (response.code === 200) {
        this.permissions = parsePermissions(
          response.result,
          this.selectedPermissionIds
        );
        this.selectedPermissions = this.permissions[0];
      }
    });
  }
}

  setActivePermission(name: string, index: number): void {
    this.selectedPermissions = this.permissions[index];
    this.selectedIndex = index;
    this.permissions.forEach((permission) => {
      permission.ischeck = permission.name === name;
    });
  }
  isSelectAll(permissions: Permissions): boolean {
    const selectAll = permissions.permission.every((p) => p.ischeck);
    return selectAll;
  }

  selectAllPermissions(permissions: Permissions): void {
    const selectAll = permissions.permission.some((p) => !p.ischeck);
    permissions.permission.forEach((p) => (p.ischeck = selectAll));
  }

  getCheckedPermissions(): number[] {
    // Lọc các permission đã check và lấy ra id
    const checkedIds = this.permissions
      .map((permission) => permission.permission) // Lấy danh sách permission của mỗi entity
      .flat() // Dồn các permission vào một mảng duy nhất
      .filter((permission) => permission.ischeck) // Chỉ lấy các permission có ischeck: true
      .map((permission) => permission.id); // Lấy id của các permission đã check
    return checkedIds;
  }

  addRole() {
    const permissionIds = this.getCheckedPermissions();
    if (this.roleName == '') {
      this.toastr.warning('Please fill in all required fields!', 'Warning');
      return;
    }
    const request = {
      roleName: this.roleName,
      permissionIds: permissionIds,
    };
    this.roleService
      .addRole(request)
      .pipe(
        catchError((error) => {
          this.toastr.error('Server error or network issue!', 'Error');
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response === null) {
          return;
        }
        if (response.code === 200) {
          this.toastr.success('Role added successfully!', 'Success');
        } else {
          this.toastr.error('Failed to add role!', 'Error');
        }
      });
  }

  updateRole() {
    const permissionIds = this.getCheckedPermissions();
    if (this.roleName == '') {
      this.toastr.warning('Please fill in all required fields!', 'Warning');
      return;
    }
    const request = {
      roleName: this.roleName,
      permissionIds: permissionIds,
    };
    this.roleService
      .updateRole(this.roleId! ,request)
      .pipe(
        catchError((error) => {
          this.toastr.error('Server error or network issue!', 'Error');
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response === null) {
          return;
        }
        if (response.code === 200) {
          this.toastr.success('Role update successfully!', 'Success');
        } else {
          this.toastr.error('Failed to update role!', 'Error');
        }
      });
  }
}
