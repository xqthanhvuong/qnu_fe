import { TemplateRef, PipeTransform } from '@angular/core';

export interface ColumnDef {
  header: string;                       // tiêu đề
  field?: string;                       // key trong object (nếu hiển thị trực tiếp)
  width?: string;                       // ví dụ '80px'
  pipe?: PipeTransform;                 // date, currency …
  template?: TemplateRef<any>;          // cell tùy biến
  show?: () => boolean;                 // ẩn/hiện theo điều kiện (quyền, role …)
}
