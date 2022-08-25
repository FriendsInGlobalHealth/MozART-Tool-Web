import { Spin } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { CurrentUser } from '@/models/user';
import { ConnectProps, ConnectState } from '@/models/connect';
import { Division } from '@/models/division';
import styles from './index.less';

export interface GlobalHeaderRightProps extends ConnectProps {
  currentUser?: CurrentUser;
  menu?: boolean;
}

class InstitutionLabel extends React.Component<GlobalHeaderRightProps> {
  render() {
    const { currentUser = {} } = this.props;

    if (!currentUser) {
      return <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />;
    }

    if (currentUser.location) {
      return (
        <span className={`${styles.action} ${styles.text}`}>
          <h3>{(currentUser.location.division as Division).name}</h3>
        </span>
      );
    }
    return <span />;
  }
}
export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(InstitutionLabel);
