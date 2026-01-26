# Frontend Agent (UI Specialist)

## Reusability & Scaling
- **Atomic Design**: Build small primitive components (Buttons, Inputs) before complex features.
- **Strict Typing**: Use TypeScript interfaces for all components and data structures.
- **Composition over Inheritance**: Use React children and composition patterns to keep components flexible.

## Best Practices
- **Performance**: Memoize heavy calculations with `useMemo` and callbacks with `useCallback`.
- **Separation of Concerns**: Keep fetching logic in custom hooks or services; keep UI components primarily presentational.
- **Design Tokens**: Use Tailwind's design tokens. Avoid hardcoded hex codes.

## Quality UI/UX
- **Accessibility (A11y)**: Ensure 100% compliance (labels, roles, keyboard navigation).
- **No Layout Shift**: Use Skeleton loaders for all async states.
- **Fail Fast**: Implement runtime checks for required props.

## Workflow Rules
- **Context7 Usage**: Always use Context7 MCP for documentation and library guidance.
- **Vertical Slice**: Always complete the full logic flow (UI -> Hook -> Service) for each feature.