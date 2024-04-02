export interface Rol {
  id: string;
  name: string;
  state: boolean;
  created_time: string;
  updated_time: string;
  modules: Module[]
}

export interface Module{
  id: string;
  name: string;
  display_name: string,
  path: string;
  icon: string;
  state: boolean;
  created_time: Date;
  updated_time: Date;
  functionality: Functionality[]
}

export interface Functionality{
  id: string;
  name: string;
  display_name: string,
  path: string;
  icon: string;
  state: boolean;
  created_time: Date;
  updated_time: Date;
}
