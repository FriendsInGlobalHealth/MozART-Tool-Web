import { Alert, Icon, Tooltip } from 'antd';
import React, { Component } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { StateType } from '@/models/login';
import LoginComponents from './components';
import { ChangePasswordParamsType } from '@/services/security';
import { getEnabled } from '@/utils/authorization';
import { Redirect } from 'react-router-dom';
import styles from './style.less';
import logo from '@/assets/password.svg';

const { Password, ConfirmPassword, Submit } = LoginComponents;

interface ChangePasswordProps {
  dispatch: Dispatch<AnyAction>;
  userLogin: StateType;
  submitting: boolean;
}
interface ChangePasswordState {
  type: string;
  password?: string;
  confirmpassword?: string;
}

@connect(({ loading }: ConnectState) => ({
  submitting: loading.effects['login/changePassword'],
}))
class ChangePassword extends Component<ChangePasswordProps, ChangePasswordState> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state: ChangePasswordState = {
    type: 'account',
  };

  handleSubmit = (err: unknown, values: ChangePasswordParamsType) => {
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/changePassword',
        payload: {
          ...values,
        },
      });
    }
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    this.setState(state => ({
      ...state,
      [id]: value,
    }));
  };

  validatePassword = (rule: any, value: any, callback: any) => {
    const { password } = this.state;
    try {
      if (value && password !== value) {
        throw new Error('Validation error!');
      }
      callback();
    } catch (err) {
      callback(err);
    }
  };

  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 24 }} message={content} type="warning" showIcon />
  );

  render() {
    const { submitting } = this.props;

    const enabled = getEnabled();
    if (enabled === null || enabled === '1') {
      return <Redirect to="/welcome" />;
    }

    return (
      <div className={styles.main}>
        <div className={styles.logo}>
          <span>{formatMessage({ id: 'security.change-pass.form.name' })}</span>
          <img alt="logo" src={logo} />
        </div>
        {this.renderMessage(formatMessage({ id: 'security.login.message-change-pass' }))}
        <LoginComponents
          onSubmit={this.handleSubmit}
          onCreate={(form?: FormComponentProps['form']) => {
            this.loginForm = form;
          }}
        >
          <Password
            name="password"
            placeholder={formatMessage({ id: 'security.login.form.change-password' })}
            suffix={
              <Tooltip title={formatMessage({ id: 'security.field.enter.change-password' })}>
                <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            }
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
            onChange={this.handleInputChange}
          />
          <ConfirmPassword
            name="confirmpassword"
            placeholder={formatMessage({ id: 'security.login.form.confirm-password' })}
            suffix={
              <Tooltip title={formatMessage({ id: 'security.field.enter.confirm-password' })}>
                <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            }
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'security.field.required' }),
              },
              {
                validator: (rule: any, value: any, callback: any) => {
                  this.validatePassword(rule, value, callback);
                },
                message: formatMessage({ id: 'security.field.confirm' }),
              },
            ]}
            onPressEnter={e => {
              e.preventDefault();
              if (this.loginForm) {
                this.loginForm.validateFields(this.handleSubmit);
              }
            }}
            onChange={this.handleInputChange}
          />
          <Submit loading={submitting}>
            <FormattedMessage id="security.login.form.change" />
          </Submit>
        </LoginComponents>
      </div>
    );
  }
}

export default ChangePassword;
