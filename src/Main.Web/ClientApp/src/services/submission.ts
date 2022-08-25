import { stringify } from 'qs';
import { create, select, update } from './crud';

export interface GetSubmissionsParamsType {
    createdBy?: string;
}

export async function query(payload?: GetSubmissionsParamsType) {
    let url: string;
    if (payload) {
      url = '/api/submissions/all?'.concat(stringify(payload));
    } else {
      url = '/api/submissions/all';
    }
    const res = await select(url);
    return res;
}  

export interface AddSubmissionParamsType {
    Id?: string;
    Year: string;
    Quarter: string;
    Partner: string;
    Password: string;
    Filename: string;
    Createdby: string;
}
export async function add(payload: AddSubmissionParamsType) {
    const res = await create('/api/submissions', payload);
    return res;
}


export async function edit(payload: AddSubmissionParamsType) {
    const res = await update('/api/submissions', payload);
    return res;
}  
