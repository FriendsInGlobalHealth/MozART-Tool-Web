import { create, select, update } from './crud';
import roles from '@/utils/data/role.json';
import cities from '@/utils/data/city.json';
import provinces from '@/utils/data/province.json';
import neighborhoods from '@/utils/data/neighborhood.json';

export interface LoginParamsType {
  Username: string;
  Password: string;
}
export async function authenticate(payload: LoginParamsType) {
  const res = await create('/api/users', payload);
  return res;
}

export async function getCurrentUser() {
  const res = await select('/api/users/current');
  return res;
}

export interface ChangePasswordParamsType {
  password: string;
}
export async function changePassword(payload: ChangePasswordParamsType) {
  const res = await create('/api/users/changepass', payload);
  return res;
}

export interface ResetPasswordParamsType {
  email: string;
  lang: string;
}
export async function resetPassword(payload: ResetPasswordParamsType) {
  const res = await create('/auth/resetPassword', payload);
  return res;
}

export interface CheckPermissionParamsType {
  email: string;
  token: string;
}
export async function checkResetPermission(payload: CheckPermissionParamsType) {
  const res = await create('/auth/checkResetPermissions', payload);
  return res;
}

export interface ResetParamsType {
  email: string;
  password: string;
  token: string;
}
export async function reset(payload: ResetParamsType) {
  const res = await create('/auth/reset', payload);
  return res;
}



export interface UpdateUserParamsType {
  name: string;
  username: string;
  email: string;
  phone: string;
}
export async function updateUser(params: string, payload: UpdateUserParamsType) {
  const res = await update('/api/accounts/'.concat(params), payload);
  return res;
}

export async function getUsers() {
  const res = await select('/api/accounts');
  return res;
}

// =============================================================================
export async function getRoles() {
  return roles;
}

export async function getProvinces() {
  return provinces;
}

interface CityParams {
  province: string;
}
export async function getCities(payload: CityParams) {
  return cities[payload.province];
}

interface NeighborhoodParams {
  province: string;
  city: string;
}
export async function getNeighborhoods(payload: NeighborhoodParams) {
  return neighborhoods[payload.province.concat(payload.city)];
}
// =============================================================================
