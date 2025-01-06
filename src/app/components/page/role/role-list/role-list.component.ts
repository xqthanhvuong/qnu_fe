import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RoleService } from '../../../../service/role.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RoleResponse } from '../../../../dto/response/role-response';
import { catchError, debounceTime, EMPTY, fromEvent } from 'rxjs';
import { AuthService } from '../../../../service/auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css',
})
export class RoleListComponent implements OnInit {
  roles: RoleResponse[] = [];
  totalRecords: number = 0;
  rows: number = 7;
  first: number = 0;
  page: number = 0;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  itemIdToDelete: number | null = null;
  private modalInstance: any;
  private myType: String = '';
  username: string = '';
  selectedRoleId: number | null = null;

  constructor(
    private roleService: RoleService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadRoles({ page: event.page, rows: event.rows });
  }

  openAddModal(roleId: number) {
    this.selectedRoleId = roleId;
    const modal = new bootstrap.Modal(document.getElementById('addRoleModal'));
    this.modalInstance = modal;
    this.modalInstance.show();
  }

  isSimilarType(type: String): boolean {
    if (type == this.myType) {
      return true;
    } else {
      return false;
    }
  }

  loadRoles(event: any = { page: 0, rows: 2 }): void {
    this.page = event.page; // PrimeNG paginator sử dụng chỉ số bắt đầu từ 0
    const size = event.rows;
    this.roleService
      .getRoles({
        page: this.page,
        size,
        filter: { keyWord: this.searchInput.nativeElement.value },
      })
      .subscribe((response) => {
        if (response.code === 200) {
          this.roles = response.result.content;
          this.totalRecords = response.result.totalItems;
        }
      });
  }

  initializeSearch(): void {
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(debounceTime(500))
      .subscribe(() => {
        const searchValue = this.searchInput.nativeElement.value;
        this.loadRoles({ page: 0, rows: this.rows });
      });
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

  navigateAddRole(): void {
    this.router.navigateByUrl('/role/add');
  }

  editRole(id: number): void {
    this.router.navigateByUrl(`/role/edit/${id}`);
  }

  deleteRole(roleId: number): void {
    this.roleService
      .deleteRole(roleId)
      .pipe(
        catchError((error) => {
          if (error.error.code === 1041)
            this.toastr.error("This role can't be delete!", 'Error');
          return EMPTY;
        })
      )
      .subscribe((response) => {
        if (response.code === 200) {
          this.loadRoles({ page: this.page, rows: this.rows });
        }
      });
  }

  ngOnInit(): void {
    this.loadRoles({ page: 0, rows: this.rows }); // Tải dữ liệu lần đầu
    this.initializeSearch();
    this.myType = this.authService.getRole();
    
  }

  navigateRoleDetail(id: number): void {
    this.router.navigateByUrl(`/role/detail/${id}`);
  }

  assignRoleToAccount() {
    if (!this.username || !this.selectedRoleId) {
      alert('Please provide a username');
      return;
    }

    const request = {
      accountName: this.username,
      roleId: this.selectedRoleId,
    };

    this.roleService
      .setRoleForAccount(request)
      .pipe(
        catchError((error) => {
          if(error.error.code === 1043){
            this.toastr.error('Type not match', 'Error');
          }else if(error.error.code === 1004){
            this.toastr.error('User not found', 'Error');
          }else {
            this.toastr.error('Server error or network issue!', 'Error');
          }
          return EMPTY;
        })
      )
      .subscribe((response) => {
        if (response.code === 200) {
          this.toastr.success('Role assigned successfully', 'Success');
          const modal = bootstrap.Modal.getInstance(
            document.getElementById('addRoleModal')
          );
          modal.hide();
        } else {
          alert('Error assigning role');
        }
      });

      this.modalInstance.hide();
  }
}
