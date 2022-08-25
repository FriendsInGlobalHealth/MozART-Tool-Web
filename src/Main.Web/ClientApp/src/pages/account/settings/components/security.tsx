import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component, Fragment } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { ConnectState } from '@/models/connect';
import { FormComponentProps } from 'antd/es/form';
import { Button, Form, Input, message } from 'antd';
import { List } from 'antd';
import { connect } from 'dva';

type Unpacked<T> = T extends (infer U)[] ? U : T;

const FormItem = Form.Item;

interface SecurityViewProps extends FormComponentProps {
  dispatch?: Dispatch<AnyAction>;
  submitting?: boolean;
}
interface SecurityViewState {
  password?: string;
  confirmpassword?: string;
  modify?: boolean;
}

@connect(({ loading }: ConnectState) => ({
  submitting: loading.effects['user/updatePass'],
}))
class SecurityView extends Component<SecurityViewProps, SecurityViewState> {
  state: SecurityViewState = {
    modify: false,
  };

  handlerModify = (event: React.MouseEvent) => {
    event.preventDefault();
    this.setState(state => ({
      ...state,
      modify: !state.modify,
    }));
  };

  isModify() {
    const { modify } = this.state;
    if (modify) {
      return true;
    }
    return false;
  }

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

  getSecurityForm() {
    const {
      form: { getFieldDecorator },
      submitting,
    } = this.props;
    return (
      <Form layout="inline" hideRequiredMark>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'security.field.required' }, {}),
              },
            ],
          })(
            <Input
              type="password"
              placeholder={formatMessage({ id: 'security.field.enter.change-password' })}
              onChange={this.handleInputChange}
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('confirmpassword', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'security.field.required' }, {}),
              },
              {
                validator: (rule: any, value: any, callback: any) => {
                  this.validatePassword(rule, value, callback);
                },
                message: formatMessage({ id: 'security.field.confirm' }),
              },
            ],
          })(
            <Input
              type="password"
              placeholder={formatMessage({ id: 'security.field.enter.confirm-password' })}
              onChange={this.handleInputChange}
            />,
          )}
        </FormItem>
        <Button type="primary" loading={submitting} onClick={this.handlerSubmit}>
          <FormattedMessage id="security.login.form.change" />
        </Button>
      </Form>
    );
  }

  handlerSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err && dispatch) {
        dispatch({
          type: 'user/updatePass',
          payload: {
            ...values,
          },
        });

        this.setState(state => ({
          ...state,
          modify: !state.modify,
        }));
        message.success(formatMessage({ id: 'security.login.change-pass' }));
      }
    });
  };

  getData = () => [
    {
      title: formatMessage({ id: 'app.settings.security.password' }, {}),
      description: (
        <Fragment>
          {this.isModify()
            ? this.getSecurityForm()
            : formatMessage({ id: 'app.settings.security.password-description' })}
        </Fragment>
      ),
      actions: [
        <div>
          {this.isModify() ? (
            <div />
          ) : (
            <a key="Modify" onClick={this.handlerModify}>
              <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
            </a>
          )}
        </div>,
      ],
    },
  ];

  render() {
    const data = this.getData();
    return (
      <Fragment>
        <List<Unpacked<typeof data>>
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
      </Fragment>
    );
  }
}

export default Form.create<SecurityViewProps>()(SecurityView);
