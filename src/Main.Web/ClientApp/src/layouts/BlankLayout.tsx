import React from 'react';
import styles from './BlankLayout.less';

const Layout: React.FC = ({ children }) => <div className={styles.content}>
                <div className={styles.modulos}>{children}</div>
                
                </div>;
export default Layout;
