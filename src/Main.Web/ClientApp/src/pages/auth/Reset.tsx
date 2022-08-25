import { Alert, Icon, Tooltip, Button } from 'antd';
import React, { Component } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { UserModelState } from '@/models/user';
import LoginComponents from './components';
import { ChangePasswordParamsType } from '@/services/security';
import { isError } from '@/services/api';
import styles from './style.less';
import logo from '@/assets/password.svg';

const { Password, ConfirmPassword, Submit } = LoginComponents;

interface ResetProps {
  dispatch: Dispatch<AnyAction>;
  currentUser: UserModelState;
  submitting: boolean;
}
interface ResetState {
  type: string;
  password?: string;
  confirmpassword?: string;
}

@connect(({ user, loading }: ConnectState) => ({
  currentUser: user,
  submitting: loading.effects['user/reset'],
}))
class Reset extends Component<ResetProps, ResetState> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state: ResetState = {
    type: 'resetpass',
  };

  componentDidMount() {
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'user/checkResetPasswordToken',
      });
    }
  }

  handleSubmit = (err: unknown, values: ChangePasswordParamsType) => {
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'user/reset',
        payload: {
          ...values,
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

  renderMessage = (content: string, type: any) => (
    <Alert style={{ marginBottom: 24 }} message={content} type={type} showIcon />
  );

  render() {
    const { submitting, currentUser } = this.props;
    const { resetTokenStatus } = currentUser;

    return (
      <div className={styles.main}>
        <div className={styles.logo}>
          <span>{formatMessage({ id: 'security.change-pass.form.name' })}</span>
          <img alt="logo" src={logo} />
        </div>

        {isError(resetTokenStatus)
          ? this.renderMessage(formatMessage({ id: 'security.reset.token-expired' }), 'error')
          : this.renderMessage(formatMessage({ id: 'security.reset.info' }), 'info')}

        <LoginComponents
          onSubmit={this.handleSubmit}
          onCreate={(form?: FormComponentProps['form']) => {
            this.loginForm = form;
          }}
        >
          {isError(resetTokenStatus) ? (
            <div />
          ) : (
            <div>
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
            </div>
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

export default Reset;
