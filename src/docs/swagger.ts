import { link } from '../modules/link/link.swagger';
import { news } from '../modules/news/news.swagger';
import { organization } from '../modules/organization/organization.swagger';
import { project } from '../modules/project/project.swagger';
import { user } from '../modules/user/user.swagger';
import { auth } from '../modules/user/auth/auth.swagger';

export default {
  openapi: '3.0.4',
  info: {
    title: 'Projexa - API',
    version: '1.4.0',
    description:
      'Documentação das rotas de endpoint REST disponíveis no backend da aplicação Projexa.',
  },
  servers: [
    {
      url: 'https://projexa-api.onrender.com',
      description: 'Backend no Render',
    },
  ],
  paths: {
    ...link.endpoints,
    ...news.endpoints,
    ...organization.endpoints,
    ...project.endpoints,
    ...user.endpoints,
    ...auth.endpoints,
  },
  components: {
    schemas: {
      ...link.components,
      ...news.components,
      ...organization.components,
      ...project.components,
      ...user.components,
    },
  },
};