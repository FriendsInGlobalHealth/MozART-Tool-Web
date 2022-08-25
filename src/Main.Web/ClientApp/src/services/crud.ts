import axiosInstance from './api';
const FormData = require('form-data');

export async function create(params: any, payload: any = {}) {
  return await axiosInstance.post(params, payload);
}

export async function update(params: any, payload: any = {}) {
  return await axiosInstance.put(params, payload);
}

export async function select(params: any) {
  const res = await axiosInstance.get(params);
  return res.data;
}
/*
export async function createWithFormData(params: any, payload: any) {
  //return await axiosInstance.post(params, payload);


  const formData = new FormData();
  formData.append( stringName, stringValue );
  formData.append( intName, intValue );
  formData.append( bufferName, bufferValue );

  return await axiosInstance.post(params, formData.getBuffer(), formData.getHeaders());

}*/
