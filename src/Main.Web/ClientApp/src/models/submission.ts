import { Effect } from 'dva';
import { Reducer } from 'redux';
import { query, add, edit } from '@/services/submission';
import { isSuccess } from '@/services/api';

export interface Submission {
    id?: string;
    year: string;
    quarter: string;
    partner: string;
    password: string;
    filename: string;
    createdby: string;
}

export interface SubmissionModelState {
    submissions: Submission[];
    currentSubmission?: Submission;
    status?: string;
    total?: number;
}

export interface SubmissionModelType {
    namespace: string;
    state: SubmissionModelState;
    effects: {
      fetch: Effect;
      add: Effect;
      edit: Effect;
    };
    reducers: {
      save: Reducer<SubmissionModelState>;
      saveSubmission: Reducer<SubmissionModelState>;
      addSubmission: Reducer<SubmissionModelState>;
      updateSubmission: Reducer<SubmissionModelState>;
    };
}

const SubmissionModel: SubmissionModelType = {
    namespace: 'submissions',
    state: {
        submissions: [],
        currentSubmission: undefined,
        status: undefined,
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
                type: 'addSubmission',
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
                type: 'updateSubmission',
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
              submissions: payload,
            };
        },

        saveSubmission(state, { payload }) {
            return {
              ...state,
              submissions: (state as SubmissionModelState).submissions,
              currentSubmission: payload,
            };
        },
        addSubmission(state, { payload }) {
            return {
              ...state,
              submissions: [payload, ...(state as SubmissionModelState).submissions],
            };
        },
        updateSubmission(state, { payload }) {
            return {
              ...state,
              submissions: (state as SubmissionModelState).submissions.map((item, index) => {
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
export default SubmissionModel;