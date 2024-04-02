export interface Usuario {
  id: string;
  name: string;
  user: string;
  password: string;
  state: boolean;
  lastname: string;
  cargo?: null;
  document: string;
  temporaryPassword: boolean;
  mail: string;
  dateBirth: string;
  phone: null;
  roleId: string;
}
