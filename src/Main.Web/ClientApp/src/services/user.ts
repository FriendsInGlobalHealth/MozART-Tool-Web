import { stringify } from 'qs';
import { create, select, update } from './crud';

export interface GetAccountParamsType {
  name?: string;
  active?: boolean;
  role?: string[];
  divisionId?: string;
}
export async function query(payload?: GetAccountParamsType) {
  let url: string;
  if (payload) {
    url = '/api/accounts?'.concat(stringify(payload));
  } else {
    url = '/api/accounts';
  }
  const res = await select(url);
  return res;
}

export interface AddDivisionParamsType {
  name: string;
  description: string;
  active: boolean;
}
export async function add(payload: AddDivisionParamsType) {
  const res = await create('/api/accounts', payload);
  return res;
}

export interface UpdateDivisionParamsType {
  id: string;
  name: string;
  description: string;
  active: boolean;
}
export async function edit(payload: UpdateDivisionParamsType) {
  const res = await update('/api/accounts/'.concat(payload.id), payload);
  return res;
}
