export const auth = {
    endpoints: {
        "/signIn": {
            post: {
            summary: "Autentica um usuário",
            tags: ["Autenticação"],
            requestBody: {
                required: true,
                content: {
                "application/json": {
                    schema: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", example: "usuario@ej.com" },
                        password: { type: "string", format: "password", example: "senha123" },
                    },
                    },
                },
                },
            },
            responses: {
                "200": {
                description: "Usuário autenticado com sucesso",
                content: {
                    "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                        user: { $ref: "#/components/schemas/User" },
                        token: { type: "string", description: "Token JWT de autenticação" },
                        },
                    },
                    example: {
                        user: {
                        id: "64a456",
                        name: "Maria Silva",
                        email: "maria@ej.com",
                        organization: { _id: "64a123", name: "Empresa Júnior X" },
                        },
                        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    },
                    },
                },
                },
                "401": {
                description: "Credenciais incorretas (usuário ou senha inválidos)",
                content: {
                    "application/json": {
                    schema: { type: "object", properties: { error: { type: "string" } } },
                    example: { error: "Usuário ou senha incorretos" },
                    },
                },
                },
                "500": {
                description: "Erro inesperado no servidor",
                content: {
                    "application/json": {
                    schema: { type: "object", properties: { error: { type: "string" } } },
                    example: { error: "Erro inesperado" },
                    },
                },
                },
            },
            },
        },
    },
    components: {

    },
};
