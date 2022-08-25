import { Alert, Icon, Tooltip } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import Link from 'umi/link';
import { StateType } from '@/models/login';
import LoginComponents from './components';
import { LoginParamsType } from '@/services/security';
import { ConnectState } from '@/models/connect';
import styles from './style.less';
import logo from '@/assets/login.svg';

const { UserName, Password, Submit } = LoginComponents;

interface LoginProps {
  dispatch: Dispatch<AnyAction>;
  userLogin: StateType;
  submitting: boolean;
}
interface LoginState {
  type: string;
}

@connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))
class Login extends Component<LoginProps, LoginState> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state: LoginState = {
    type: 'account',
  };

  handleSubmit = (err: unknown, values: LoginParamsType) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { userLogin, submitting } = this.props;
    const { status } = userLogin;

    return (
      <div className={styles.main}>
        <div className={styles.logo}>
          <span>{formatMessage({ id: 'security.login.form.name' })}</span>
          
        </div>
        {status === 401 &&
          !submitting &&
          this.renderMessage(formatMessage({ id: 'security.login.message-invalid-credentials' }))}
        <LoginComponents
          onSubmit={this.handleSubmit}
          onCreate={(form?: FormComponentProps['form']) => {
            this.loginForm = form;
          }}
        >
          <UserName
            name="Username"
            placeholder="Username"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'security.field.required' }),
              },
            ]}
          />
          <Password
            name="Password"
            placeholder={formatMessage({ id: 'security.login.form.password' })}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'security.field.required' }),
              },
            ]}
            onPressEnter={e => {
              e.preventDefault();
              if (this.loginForm) {
                this.loginForm.validateFields(this.handleSubmit);
              }
            }}
          />
          <Submit loading={submitting}>
            <FormattedMessage id="security.login.form.login" />
          </Submit>
          
        </LoginComponents>
      </div>
    );
  }
}

export default Login;
