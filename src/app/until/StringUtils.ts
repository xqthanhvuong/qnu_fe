
export class StringUtils {

  
    // Phương thức static để loại bỏ dấu
    static removeAccents(str: string): string {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

  }
  