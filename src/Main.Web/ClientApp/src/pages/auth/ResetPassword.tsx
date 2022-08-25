import { Alert, Icon, Tooltip, Button } from 'antd';
import { FormattedMessage, formatMessage, getLocale } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { UserModelState } from '@/models/user';
import LoginComponents from './components';
import { ResetPasswordParamsType } from '@/services/security';
import { isSuccess, isError } from '@/services/api';
import { ConnectState } from '@/models/connect';
import styles from './style.less';
import logo from '@/assets/padlock.svg';

const { Email, Submit } = LoginComponents;

interface ResetProps {
  dispatch: Dispatch<AnyAction>;
  userState: UserModelState;
  submitting: boolean;
}
interface ResetState {
  type: string;
}

@connect(({ user, loading }: ConnectState) => ({
  userState: user,
  submitting: loading.effects['user/resetPassword'],
}))
class ResetPassword extends Component<ResetProps, ResetState> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state: ResetState = {
    type: 'reset',
  };

  handleSubmit = (err: unknown, values: ResetPasswordParamsType) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'user/resetPassword',
        payload: {
          ...values,
          type,
          lang: getLocale(),
        },
      });
    }
  };

  handleReturn = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/cancelReset',
    });
  };

  renderMessage = (content: string, type: any) => (
    <Alert style={{ marginBottom: 24 }} message={content} type={type} showIcon />
  );

  render() {
    const { userState, submitting } = this.props;
    const { resetStatus } = userState;

    return (
      <div className={styles.main}>
        <div className={styles.logo}>
          <span>{formatMessage({ id: 'security.reset-pass.form.name' })}</span>
          <img alt="logo" src={logo} />
        </div>

        {isError(resetStatus)
          ? this.renderMessage(formatMessage({ id: 'security.login.message-reset-error' }), 'error')
          : isSuccess(resetStatus)
          ? this.renderMessage(
              formatMessage({ id: 'security.login.message-reset-success' }),
              'success',
            )
          : this.renderMessage(formatMessage({ id: 'security.login.message-reset-pass' }), 'info')}

        <LoginComponents
          onSubmit={this.handleSubmit}
          onCreate={(form?: FormComponentProps['form']) => {
            this.loginForm = form;
          }}
        >
          {isSuccess(resetStatus) ? (
            <div />
          ) : (
            <Email
              name="email"
              placeholder="Email"
              suffix={
                <Tooltip title={formatMessage({ id: 'security.field.enter.email' })}>
                  <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                </Tooltip>
              }
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'security.field.required' }),
                },
                {
                  type: 'email',
                  message: formatMessage({ id: 'security.field.email' }),
                },
              ]}
            />
          )}
          {isSuccess(resetStatus) ? (
            <div />
          ) : (
            <Submit loading={submitting}>
              <FormattedMessage id="security.login.form.reset" />
            </Submit>
          )}
          <div className={styles.back}>
            <Button onClick={this.handleReturn} block>
              <FormattedMessage id="security.login.form.return-login" />
            </Button>
          </div>
        </LoginComponents>
      </div>
    );
  }
}

export default ResetPassword;
