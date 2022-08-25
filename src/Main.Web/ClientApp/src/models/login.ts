import { Reducer } from 'redux';
import { stringify } from 'qs';
import { notification } from 'antd';
import { Effect } from 'dva';
import { routerRedux } from 'dva/router';
import { formatMessage } from 'umi-plugin-react/locale';
import { authenticate, changePassword } from '@/services/security';
import { getPageQuery } from '@/utils/utils';
import { setAuthority } from '@/utils/authority';
import { setAuthorization, setEnabled, cleanStorage } from '@/utils/authorization';

export interface StateType {
  status?: '401' | number;
  type?: string;
  currentAuthority?: string;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    changePassword: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
  // TODO: applyMiddleware: ''
}

const Model: ModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(authenticate, payload);

      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });

      const { status, data } = response;

      console.log(status, data);

      if (status === 200) {
        notification.success({
          message: formatMessage({ id: 'security.login' }),
        });

        setAuthorization(data.token);

        
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }

        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *changePassword({ payload }, { call, put }) {
      const response = yield call(changePassword, payload);

      const { status } = response;

      if (status >= 200 && status < 300) {
        notification.success({
          message: formatMessage({ id: 'security.login.change-pass' }),
        });

        yield put(routerRedux.replace('/'));
      }
    },

    *logout(_, { put }) {
      const { redirect } = getPageQuery();
      // clean localstorage when logging out
      cleanStorage();

      // redirect
      if (window.location.pathname !== '/auth/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/auth/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        //currentAuthority: payload.data.authority,
      };
    },
  },
};

export default Model;
