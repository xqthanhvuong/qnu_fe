import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountHaveRole } from '../../../../dto/response/account-have-role';
import { Table } from 'primeng/table';
import { RoleService } from '../../../../service/role.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, concatMap, EMPTY } from 'rxjs';

declare var bootstrap: any;


@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrl: './role-detail.component.css',
})
export class RoleDetailComponent implements OnInit {
  @ViewChild('dt2') dt2!: Table;
  accounts!: AccountHaveRole[];
  loading: boolean = false;
  roleId: number | null = null;
  itemIdToDelete: number | null = null;
  private modalInstance: any;

  clear(table: Table) {
    table.clear();
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.dt2.filterGlobal(input.value, 'contains');
    }
  }

  constructor(
    private roleService: RoleService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.roleId = params['id'] ? Number(params['id']) : null;
      this.loadRoles();
    });
  }

  loadRoles() {
    if (this.roleId !== null) {
      this.roleService.getAccountHaveRole(this.roleId!).pipe(
        catchError((error) => {
          this.toastr.error('Server error or network issue!', 'Error');
          this.router.navigate(['/role']);
          return EMPTY;
        })
      ).subscribe((response) => {
        if (response.code === 200) {
          this.accounts = response.result;
        }
      });
    } else {
      this.router.navigate(['/role']);
    }
  }

  openDeleteModal(id: number) {
    this.itemIdToDelete = id;
    const modalElement = document.getElementById('deleteModal');
    this.modalInstance = new bootstrap.Modal(modalElement!);
    this.modalInstance.show();
  }

  confirmDelete() {
    if (this.itemIdToDelete !== null) {
      this.deleteRole(this.itemIdToDelete);
      this.itemIdToDelete = null;
      this.modalInstance.hide();
    }
  }

  deleteRole(roleId: number): void {
    this.roleService
      .deleteAccountHaveRole(roleId)
      .pipe(
        catchError((error) => {
          if (error.error.code === 1041)
            this.toastr.error("This role can't be delete!", 'Error');
          return EMPTY;
        })
      )
      .subscribe((response) => {
        if (response.code === 200) {
          this.toastr.success("Delete role success", 'Success');
          this.loadRoles();
        }
      });
  }
}
