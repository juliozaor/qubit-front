import { DateTime } from "luxon";

export class ProjectVersionModel {
  id?: number;
  projectId?: number;
  version?: string;
  preparedByClientId?: number;
  preparedByUserId?: number;
  createdUserId?: number;
  updatedUserId?: number;
  conceptnetDrawId?: number;
  revisedDate?: DateTime;
  executiveSummary?: string;
  scopeWork?: string;
  tradingConditions?: string;
  commentClarifications?: string;
  paymentTerms?: string;
  quotePath?: string;
  quoteName?: string;
  statusId?: number;
  userId?: number;
  editing?:boolean = false;

} 