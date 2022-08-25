import { notification } from 'antd';
import axios from 'axios';
import { formatMessage } from 'umi-plugin-react/locale';
import { getAuthorization } from '@/utils/authorization';

function getFormattedMessage(status: any) {
  return formatMessage({ id: 'api.response.status.'.concat(status) });
}

export function isError(status: any): boolean {
  if (status >= 400 && status <= 500) {
    return true;
  }
  return false;
}

export function isSuccess(status: any): boolean {
  if (status >= 200 && status < 300) {
    return true;
  }
  return false;
}

const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = getFormattedMessage(response.status) || response.statusText;
    const { status } = response;

    notification.error({
      message: `Error ${status}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: formatMessage({ id: 'message.request.error' }),
      message: 'Error:',
    });
  }
  return response;
};

const axiosInstance = axios.create({
  baseURL: '/',
});

const successHandler = (response: any) => response;

axiosInstance.interceptors.response.use(
  response => successHandler(response),
  error => errorHandler(error),
);

axiosInstance.interceptors.request.use(
  config => {
    const token = getAuthorization();
    config.headers.common.Authorization = `Bearer ${token}`;
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

export default axiosInstance;
