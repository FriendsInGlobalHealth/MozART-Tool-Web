import { Effect } from 'dva';
import { Reducer } from 'redux';
import { query, add, edit } from '@/services/user';
import { isSuccess } from '@/services/api';
import { Location } from '@/models/location';

export interface Account {
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  role?: string;
  active?: boolean;
  phone?: string;
  location?: Location;
  location_id?: number;
}

export interface AccountModelState {
  accounts: Account[];
  total?: number;
}

export interface AccountModelType {
  namespace: string;
  state: AccountModelState;
  effects: {
    fetch: Effect;
    add: Effect;
    edit: Effect;
  };
  reducers: {
    save: Reducer<AccountModelState>;
    addAccount: Reducer<AccountModelState>;
    updateAccount: Reducer<AccountModelState>;
  };
}

const AccountModel: AccountModelType = {
  namespace: 'accounts',

  state: {
    accounts: [],
    total: 0,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call(add, payload);
      const { status, data } = response;
      if (isSuccess(status)) {
        yield put({
          type: 'addAccount',
          payload: data,
        });
        if (callback) callback();
      }
    },

    *edit({ payload, callback }, { call, put }) {
      const response = yield call(edit, payload);
      const { status, data } = response;
      if (isSuccess(status)) {
        yield put({
          type: 'updateAccount',
          payload: data,
        });
        if (callback) callback();
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        accounts: payload.data,
        total: payload.total,
      };
    },

    addAccount(state, { payload }) {
      return {
        ...state,
        accounts: [payload, ...(state as AccountModelState).accounts],
      };
    },

    updateAccount(state, { payload }) {
      return {
        ...state,
        accounts: (state as AccountModelState).accounts.map((item, index) => {
          if (item.id === payload.id) {
            return {
              ...payload,
            };
          }
          return item;
        }),
      };
    },
  },
};

export default AccountModel;
