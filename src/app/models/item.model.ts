export class ItemModel {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  typeItemId?: number;
  categoryId?: number;
  basePrice?: number;
  baseTax?: number;
  typeUnitId?: number;
  statusId?: number;
  userId?: number;
  quantity?: number;
  cost?: number;
  editing?: boolean = false;
  originalValues?: any;
} 