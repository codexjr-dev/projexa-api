export const organization = {
    endpoints: {
        "/organization": {
            post: {
            summary: "Cria uma nova organização",
            tags: ["Organização"],
            requestBody: {
                required: true,
                content: {
                "application/json": {
                    schema: {
                    type: "object",
                    properties: {
                        name: { type: "string", example: "Empresa Júnior X" },
                        president: {
                        type: "object",
                        properties: {
                            name: { type: "string", example: "Maria Silva" },
                            email: { type: "string", example: "maria@ej.com" },
                            birthDate: { type: "string", format: "date", example: "1998-05-20" },
                            password: { type: "string", format: "password", example: "senha123" },
                            role: { type: "string", example: "presidente" },
                        },
                        },
                    },
                    },
                },
                },
            },
            responses: {
                "201": {
                description: "Organização criada com sucesso",
                content: { "application/json": { schema: { $ref: "#/components/schemas/Organization" } } },
                },
                "500": {
                description: "Erro inesperado",
                content: {
                    "application/json": {
                    schema: { type: "object", properties: { error: { type: "string" } } },
                    example: { error: "erro inesperado" },
                    },
                },
                },
            },
            },
            get: {
            summary: "Retorna todas as organizações",
            tags: ["Organização"],
            responses: {
                "200": {
                description: "Lista de organizações",
                content: {
                    "application/json": {
                    schema: { type: "array", items: { $ref: "#/components/schemas/Organization" } },
                    },
                },
                },
                "500": {
                description: "Erro inesperado",
                content: {
                    "application/json": {
                    schema: { type: "object", properties: { error: { type: "string" } } },
                    example: { error: "erro inesperado" },
                    },
                },
                },
            },
            },
        },
        "/organization/{id}": {
            get: {
            summary: "Retorna uma organização pelo ID",
            tags: ["Organização"],
            parameters: [
                {
                name: "id",
                in: "path",
                required: true,
                description: "ID da organização",
                schema: { type: "string" },
                },
            ],
            responses: {
                "200": {
                description: "Organização encontrada",
                content: { "application/json": { schema: { $ref: "#/components/schemas/Organization" } } },
                },
                "500": {
                description: "Erro inesperado",
                content: {
                    "application/json": {
                    schema: { type: "object", properties: { error: { type: "string" } } },
                    example: { error: "erro inesperado" },
                    },
                },
                },
            },
            },
        },
    },
    components: {
        Organization: {
            type: "object",
            properties: {
                id: { type: "string", example: "64a123" },
                name: { type: "string", example: "Empresa Júnior X" },
                president: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "64b456" },
                        name: { type: "string", example: "Maria Silva" },
                        email: { type: "string", example: "maria@ej.com" },
                        role: { type: "string", example: "presidente" },
                    },
                },
            },
        },
    },
};
