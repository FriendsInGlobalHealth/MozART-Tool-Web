import { Form } from 'antd';

import React, { Component } from 'react';
import { FormComponentProps } from 'antd/es/form';
import classNames from 'classnames';
import LoginContext, { LoginContextProps } from './LoginContext';
import LoginItem, { LoginItemProps, LoginItemType } from './LoginItem';

import LoginSubmit from './LoginSubmit';
import styles from './index.less';

export interface LoginProps {
  style?: React.CSSProperties;
  onSubmit?: (error: unknown, values: any) => void;
  className?: string;
  form: FormComponentProps['form'];
  onCreate?: (form?: FormComponentProps['form']) => void;
  children: React.ReactElement<unknown>[];
}

interface LoginState {
  type?: string;
  active?: { [key: string]: unknown[] };
}

class Login extends Component<LoginProps, LoginState> {
  public static Submit = LoginSubmit;

  public static UserName: React.FunctionComponent<LoginItemProps>;

  public static Password: React.FunctionComponent<LoginItemProps>;

  public static ConfirmPassword: React.FunctionComponent<LoginItemProps>;

  static defaultProps = {
    className: '',
    onTabChange: () => {},
    onSubmit: () => {},
  };

  constructor(props: LoginProps) {
    super(props);
    this.state = {
      type: '',
      active: {},
    };
  }

  componentDidMount() {
    const { form, onCreate } = this.props;
    if (onCreate) {
      onCreate(form);
    }
  }

  getContext: () => LoginContextProps = () => {
    const { form } = this.props;
    return {
      form: { ...form },
      updateActive: activeItem => {
        const { type = '', active = {} } = this.state;
        if (active[type]) {
          active[type].push(activeItem);
        } else {
          active[type] = [activeItem];
        }
        this.setState({
          active,
        });
      },
    };
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { active = {}, type = '' } = this.state;
    const { form, onSubmit } = this.props;
    const activeFields = active[type] || [];
    if (form) {
      form.validateFields(activeFields as string[], { force: true }, (err, values) => {
        if (onSubmit) {
          onSubmit(err, values);
        }
      });
    }
  };

  render() {
    const { className, children } = this.props;
    const otherChildren: React.ReactElement<unknown>[] = [];
    React.Children.forEach(children, (child: React.ReactElement<unknown>) => {
      if (!child) {
        return;
      }
      otherChildren.push(child);
    });
    return (
      <LoginContext.Provider value={this.getContext()}>
        <div className={classNames(className, styles.login)}>
          <Form onSubmit={this.handleSubmit}>
            <React.Fragment>{otherChildren}</React.Fragment>
          </Form>
        </div>
      </LoginContext.Provider>
    );
  }
}

(Object.keys(LoginItem) as (keyof LoginItemType)[]).forEach(item => {
  Login[item] = LoginItem[item];
});

export default Form.create<LoginProps>()(Login);
