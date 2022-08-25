import component from './en-US/component';
import globalHeader from './en-US/globalHeader';
import menu from './en-US/menu';
import pwa from './en-US/pwa';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';
import security from './en-US/security';
import user from './en-US/user';
import api from './en-US/api';

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.preview.down.block': 'Download this page to your local project',
  'button.save': 'Save',
  'button.cancel': 'Cancel',
  'button.edit': 'Edit',
  'button.add': 'Add new',
  'operation.success': 'Success',
  'operation.ok': 'Ok',
  'operation.action': 'Action',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...security,
  ...user,
  ...api,
};
