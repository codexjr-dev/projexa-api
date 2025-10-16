export const project = {
    endpoints: {
        '/project': {
            post: {
                tags: ['Projetos'],
                summary: 'Criar um novo projeto',
                description:
                    'Cria um novo projeto para a organização autenticada (requer permissão de liderança)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ProjectCreate' },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Projeto criado com sucesso',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        project: {
                                            $ref: '#/components/schemas/Project'
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Erro interno do servidor',
                        content: {
                            'application/json': {
                            schema: {
                                type: 'object',
                                properties: { error: { type: 'string' } },
                            },
                            example: { error: 'Erro interno do servidor' },
                            },
                        },
                    },
                },
            },
            get: {
                tags: ['Projetos'],
                summary: 'Listar todos os projetos da organização',
                description:
                    'Retorna uma lista de projetos vinculados à organização do usuário autenticado',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Lista de projetos retornada com sucesso',
                        content: {
                            'application/json': {
                            schema: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/Project' },
                            },
                            },
                        },
                    },
                    '401': { description: 'Não autorizado' },
                },
            },
        },

        '/project/{id}': {
            get: {
                tags: ['Projetos'],
                summary: 'Buscar um projeto pelo ID',
                description: 'Retorna um projeto específico pelo seu identificador único',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                    in: 'path',
                    name: 'id',
                    required: true,
                    description: 'ID do projeto',
                    schema: { type: 'string' },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Projeto encontrado com sucesso',
                        content: {
                            'application/json': {
                            schema: { $ref: '#/components/schemas/Project' },
                            },
                        },
                    },
                    '404': { description: 'Projeto não encontrado' },
                },
            },
            patch: {
                tags: ['Projetos'],
                summary: 'Atualizar um projeto existente',
                description:
                    'Atualiza os dados de um projeto, disponível apenas para líderes da organização',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                    in: 'path',
                    name: 'id',
                    required: true,
                    description: 'ID do projeto',
                    schema: { type: 'string' },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ProjectCreate' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Projeto atualizado com sucesso',
                        content: {
                            'application/json': {
                            schema: { $ref: '#/components/schemas/Project' },
                            },
                        },
                    },
                    '404': { description: 'Projeto não encontrado' },
                },
            },
            delete: {
                tags: ['Projetos'],
                summary: 'Excluir um projeto existente',
                description:
                    'Remove um projeto específico da organização (somente liderança pode excluir)',
                security: [{ bearerAuth: [] }],
                parameters: [{
                    in: 'path',
                    name: 'id',
                    required: true,
                    description: 'ID do projeto',
                    schema: { type: 'string' },
                }],
                responses: {
                    '200': { description: 'Projeto excluído com sucesso' },
                    '404': { description: 'Projeto não encontrado' },
                },
            },
        },
    },
    components: {
        Project: {
            type: 'object',
            properties: {
                _id: { type: 'string', example: '64fc1a23eaf12b001234abcd' },
                name: { type: 'string', example: 'Projeto Phoenix' },
                description: {
                    type: 'string',
                    example: 'Projeto de melhoria de processos internos.',
                },
                department: {
                    type: 'string',
                    example: 'Qualidade',
                },
                createdAt: {
                    type: 'string',
                    format: 'date-time',
                    example: '2025-09-01T12:00:00Z',
                },
                updatedAt: {
                    type: 'string',
                    format: 'date-time',
                    example: '2025-09-15T09:30:00Z',
                },
            },
        },
        ProjectCreate: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'Novo Projeto' },
                description: {
                    type: 'string',
                    example: 'Descrição detalhada do novo projeto',
                },
                department: {
                    type: 'string',
                    enum: [
                        'Presidência',
                        'Gente & Gestão',
                        'Projetos',
                        'Qualidade',
                        'Marketing',
                        'Negócios',
                    ],
                },
            },
            required: ['name', 'description', 'department'],
        },
    },
};
