export const user = {
    endpoints: {

    },
    components: {
        User: {
            type: 'object',
            properties: {
                id: { type: 'string', example: '64a456' },
                name: { type: 'string', example: 'Maria Silva' },
                email: { type: 'string', example: 'maria@ej.com' },
                organization: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '64a123' },
                        name: { type: 'string', example: 'Empresa Júnior X' },
                    },
                },
            },
        },
    },
};
