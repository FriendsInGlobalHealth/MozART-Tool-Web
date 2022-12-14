import component from './pt-BR/component';
import globalHeader from './pt-BR/globalHeader';
import menu from './pt-BR/menu';
import pwa from './pt-BR/pwa';
import settingDrawer from './pt-BR/settingDrawer';
import settings from './pt-BR/settings';
import security from './pt-BR/security';
import user from './pt-BR/user';
import api from './pt-BR/api';

export default {
  'navBar.lang': 'Idiomas',
  'layout.user.link.help': 'ajuda',
  'layout.user.link.privacy': 'política de privacidade',
  'layout.user.link.terms': 'termos de serviços',
  'app.preview.down.block': 'Download this page to your local project',
  'button.save': 'Salvar',
  'button.cancel': 'Cancelar',
  'button.edit': 'Editar',
  'button.add': 'Adicionar',
  'operation.success': 'Operação bem sucedida',
  'operation.ok': 'Aceitar',
  'operation.action': 'Acção',
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
