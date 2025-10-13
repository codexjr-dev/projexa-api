export const link = {
    endpoints: {
        '/link': {
            get: {
            summary: 'Lista todos os links cadastrados',
            tags: ['Links'],
            security: [{ bearerAuth: [] }],
            responses: {
                '200': {
                description: 'Lista de links retornada com sucesso',
                content: {
                    'application/json': {
                    schema: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Link' },
                    },
                    },
                },
                },
                '401': { description: 'Não autorizado' },
            },
            },
            post: {
            summary: 'Cria um novo link',
            tags: ['Links'],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                'application/json': {
                    schema: { $ref: '#/components/schemas/Link' },
                },
                },
            },
            responses: {
                '201': {
                description: 'Link criado com sucesso',
                content: {
                    'application/json': {
                    schema: { $ref: '#/components/schemas/Link' },
                    },
                },
                },
                '400': { description: 'Dados inválidos' },
                '401': { description: 'Não autorizado' },
            },
            },
        },
        '/link/{id}': {
            get: {
                summary: 'Busca um link pelo ID',
                tags: ['Links'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: { type: 'string' },
                    description: 'ID do link',
                    },
                ],
                responses: {
                    '200': {
                    description: 'Link encontrado',
                    content: {
                        'application/json': {
                        schema: { $ref: '#/components/schemas/Link' },
                        },
                    },
                    },
                    '404': { description: 'Link não encontrado' },
                },
            },
            patch: {
                summary: 'Atualiza um link existente',
                tags: ['Links'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: { type: 'string' },
                    description: 'ID do link a ser atualizado',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Link' },
                    },
                    },
                },
                responses: {
                    '200': {
                    description: 'Link atualizado com sucesso',
                    content: {
                        'application/json': {
                        schema: { $ref: '#/components/schemas/Link' },
                        },
                    },
                    },
                    '404': { description: 'Link não encontrado' },
                },
            },
            delete: {
                summary: 'Remove um link existente',
                tags: ['Links'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: { type: 'string' },
                    description: 'ID do link a ser removido',
                    },
                ],
                responses: {
                    '200': { description: 'Link removido com sucesso' },
                    '404': { description: 'Link não encontrado' },
                },
            },
        },
    },
    components: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        },
        Link: {
            type: 'object',
            properties: {
            _id: { type: 'string', example: '64ab1234ef567890abcd1234' },
            name: { type: 'string', example: 'Link Importante' },
            url: { type: 'string', example: 'https://exemplo.com' },
            tags: {
                type: 'array',
                items: {
                type: 'string',
                enum: ['Importante', 'Treinamento', 'Documentação'],
                },
                example: ['Importante', 'Documentação'],
            },
            departments: {
                type: 'array',
                items: {
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
                example: ['Gente & Gestão', 'Qualidade'],
            },
            },
        },
    },
};
