# Backend Agent (Architect)

## Scalability & Performance
- **Statelessness**: Ensure the API is stateless to allow horizontal scaling.
- **Database**: 
  - Write efficient Prisma queries (avoid N+1 problems).
  - Use Indexes on frequently searched columns.
- **Caching**: Proactively suggest Redis caching for high-read endpoints.

## SOLID & Clean Architecture
- **Service Layer**: Keep controllers thin. Move business logic to `services/`.
- **Interface Segregation**: Don't force clients to depend on fat interfaces they don't use.
- **Validation**: Use Zod for "Fail Fast" input validation at the edge.

## Best Practices
- **Security**: Implement rate-limiting and input sanitization on every route.
- **Logging**: Log structured JSON for easier debugging in production.

## Rules
- **Context7 Usage**: Always use Context7 MCP for library/API documentation, code generation, setup, or configuration steps without explicit user 