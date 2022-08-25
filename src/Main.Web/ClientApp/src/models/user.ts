import { notification } from 'antd';
import { Effect } from 'dva';
import { Reducer } from 'redux';
import { routerRedux } from 'dva/router';
import { formatMessage } from 'umi-plugin-react/locale';
import {
  getCurrentUser,
  checkResetPermission,
  resetPassword,
  reset,
  updateUser,
  changePassword,
} from '@/services/security';
import { query as queryUsers } from '@/services/user';
import { getPageQuery } from '@/utils/utils';
import { isSuccess, isError } from '@/services/api';

export interface CurrentUser {
  avatar?: string;
  id?: string | number;
  name?: string;
  username?: string;
  email?: string;
  role?: string;
  active?: number;
  phone?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  unreadCount?: number;
}

export interface UserModelState {
  currentUser?: CurrentUser;
  resetStatus?: string | number;
  resetTokenStatus?: string | undefined | number;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
    resetPassword: Effect;
    cancelReset: Effect;
    reset: Effect;
    checkResetPasswordToken: Effect;
    updateUser: Effect;
    updatePass: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
    changeResetStatus: Reducer<UserModelState>;
    changeResetTokenStatus: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
    resetTokenStatus: undefined,
    resetStatus: undefined,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      const response = yield call(getCurrentUser);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },

    *resetPassword({ payload }, { call, put }) {
      const response = yield call(resetPassword, payload);
      yield put({
        type: 'changeResetStatus',
        payload: response,
      });
    },

    *cancelReset(_, { put }) {
      const state = { status: undefined };
      yield put({
        type: 'changeResetStatus',
        payload: state,
      });

      yield put({
        type: 'changeResetTokenStatus',
        payload: state,
      });

      yield put(
        routerRedux.replace({
          pathname: '/auth/login',
        }),
      );
    },

    *reset({ payload }, { call, put }) {
      const params = getPageQuery();
      const { token, email } = params as { token: string; email: string };
      const { password } = payload;
      const response = yield call(reset, { email, password, token });

      const { status } = response;

      if (isSuccess(status)) {
        notification.success({
          message: formatMessage({ id: 'security.reset.success' }),
        });
      } else {
        notification.error({
          message: formatMessage({ id: 'security.reset.token-expired' }),
        });
      }

      yield put(routerRedux.replace('/'));
    },

    *checkResetPasswordToken(_, { call, put }) {
      const params = getPageQuery();
      const { token, email } = params as { token: string; email: string };
      if (token && email) {
        const response = yield call(checkResetPermission, params);
        yield put({
          type: 'changeResetTokenStatus',
          payload: response,
        });
      } else {
        yield put(
          routerRedux.replace({
            pathname: '/auth/login',
          }),
        );
      }
    },

    *updateUser({ payload }, { call, put }) {
      const response = yield call(updateUser, payload.id, payload.data);

      const { status, data } = response;
      if (isSuccess(status)) {
        yield put({
          type: 'saveCurrentUser',
          payload: data,
        });
      } else {
        notification.error({
          message: formatMessage({ id: 'account-settings.basic.update.error' }),
        });
      }
    },

    *updatePass({ payload }, { call }) {
      const response = yield call(changePassword, payload);

      const { status } = response;
      if (isError(status)) {
        notification.error({
          message: formatMessage({ id: 'security.login.change-pass.error' }),
        });
      }
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
    changeResetTokenStatus(state, { payload }) {
      return {
        ...state,
        resetTokenStatus: payload.status,
      };
    },
    changeResetStatus(state, { payload }) {
      return {
        ...state,
        resetStatus: payload.status,
      };
    },
  },
};

export default UserModel;
