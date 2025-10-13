export const news = {
    endpoints: {
        "/news": {
            get: {
            summary: "Lista todas as notícias de uma organização",
            tags: ["Notícias"],
            responses: {
                "200": {
                description: "Lista de notícias retornada com sucesso",
                content: {
                    "application/json": {
                    schema: { type: "array", items: { $ref: "#/components/schemas/News" } },
                    },
                },
                },
                "401": { description: "Usuário não autorizado" },
            },
            },
        },
        "/news/{projectId}": {
            get: {
            summary: "Busca todas as notícias de um projeto específico",
            tags: ["Notícias"],
            parameters: [
                { in: "path", name: "projectId", schema: { type: "string" }, required: true, description: "ID do projeto" },
            ],
            responses: {
                "200": {
                description: "Notícias do projeto retornadas com sucesso",
                content: {
                    "application/json": {
                    schema: { type: "array", items: { $ref: "#/components/schemas/News" } },
                    },
                },
                },
                "404": { description: "Projeto não encontrado" },
            },
            },
            post: {
            summary: "Cria uma nova notícia em um projeto",
            tags: ["Notícias"],
            parameters: [
                { in: "path", name: "projectId", schema: { type: "string" }, required: true, description: "ID do projeto" },
            ],
            requestBody: {
                required: true,
                content: { "application/json": { schema: { $ref: "#/components/schemas/NewsInput" } } },
            },
            responses: {
                "201": {
                description: "Notícia criada com sucesso",
                content: { "application/json": { schema: { $ref: "#/components/schemas/News" } } },
                },
                "403": { description: "Usuário não é membro do projeto" },
            },
            },
            delete: {
            summary: "Remove uma notícia de um projeto",
            tags: ["Notícias"],
            parameters: [
                { in: "path", name: "projectId", schema: { type: "string" }, required: true, description: "ID do projeto" },
            ],
            responses: {
                "200": { description: "Notícia removida com sucesso" },
                "403": { description: "Sem permissão para remover a notícia" },
                "404": { description: "Projeto ou notícia não encontrada" },
            },
            },
        },
        "/news/{newsId}": {
            patch: {
            summary: "Atualiza uma notícia existente",
            tags: ["Notícias"],
            parameters: [
                { in: "path", name: "newsId", schema: { type: "string" }, required: true, description: "ID da notícia" },
            ],
            requestBody: {
                required: true,
                content: { "application/json": { schema: { $ref: "#/components/schemas/NewsInput" } } },
            },
            responses: {
                "200": {
                description: "Notícia atualizada com sucesso",
                content: { "application/json": { schema: { $ref: "#/components/schemas/News" } } },
                },
                "403": { description: "Sem permissão para atualizar a notícia" },
                "404": { description: "Notícia não encontrada" },
            },
            },
        },
    },
    components: {
        News: {
            type: "object",
            properties: {
            id: { type: "string", example: "64fa1b3d9c12e" },
            title: { type: "string", example: "Atualização do projeto" },
            content: {
                type: "string",
                example: "O projeto foi atualizado com novos recursos.",
            },
            projectId: { type: "string", example: "64f91a1c83ab2" },
            createdAt: {
                type: "string",
                format: "date-time",
                example: "2025-09-30T12:00:00Z",
            },
            updatedAt: {
                type: "string",
                format: "date-time",
                example: "2025-09-30T15:00:00Z",
            },
            },
        },
        NewsInput: {
            type: "object",
            properties: {
            title: { type: "string", example: "Nova notícia importante" },
            content: {
                type: "string",
                example: "Detalhes sobre a novidade do projeto.",
            },
            },
            required: ["title", "content"],
        },
    },
};
