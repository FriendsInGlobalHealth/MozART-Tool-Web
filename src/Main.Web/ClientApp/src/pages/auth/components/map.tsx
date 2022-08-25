import { Icon } from 'antd';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './index.less';

export default {
  Email: {
    props: {
      size: 'large',
      id: 'email',
      prefix: <Icon type="user" className={styles.prefixIcon} />,
      placeholder: 'Email',
    },
    rules: [
      {
        required: true,
        message: formatMessage({ id: 'security.field.required' }),
      },
      {
        type: 'email',
        message: formatMessage({ id: 'security.field.email' }),
      },
    ],
  },
  Password: {
    props: {
      size: 'large',
      prefix: <Icon type="lock" className={styles.prefixIcon} />,
      id: 'password',
      type: 'password',
      placeholder: formatMessage({ id: 'security.login.form.password' }),
    },
    rules: [
      {
        required: true,
        message: formatMessage({ id: 'security.field.required' }),
      },
    ],
  },
  ConfirmPassword: {
    props: {
      size: 'large',
      prefix: <Icon type="lock" className={styles.prefixIcon} />,
      type: 'password',
      id: 'confirmpassword',
      placeholder: formatMessage({ id: 'security.login.form.confirm-password' }),
    },
    rules: [
      {
        required: true,
        message: formatMessage({ id: 'security.field.required' }),
      },
    ],
  },
};
