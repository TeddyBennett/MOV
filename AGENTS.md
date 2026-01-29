# AGENTS.md (Root)

## Engineering Core Principles
- **Clean Code**: Use intention-revealing names. Functions should do one thing and be small.
- **SOLID**: 
  - *Single Responsibility*: One file, one purpose. 
  - *Dependency Inversion*: Depend on abstractions (interfaces/types), not implementations.
- **Reusability**: Before creating a utility, check `@/lib/utils`. If logic is used >2 times, abstract it.
- **Best Practices**: Follow the "Boy Scout Rule"—always leave the code cleaner than you found it.

## Universal Rules
- **No Magic Strings**: Use Enums or Constants.
- **Dry**: Do not repeat business logic.
- **Error Handling**: Use try/catch blocks with meaningful logging.
- **Context7 Usage**: Always use Context7 MCP for library/API documentation, code generation, setup, or configuration steps without explicit user requests.