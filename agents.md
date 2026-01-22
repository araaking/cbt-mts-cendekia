# Agents Guidelines

## Information & Web Search
- Verify current date before time-sensitive searches
- Consider information freshness requirements

## File & System Management
- Use `trash` instead of destructive commands (`rm -rf`)
- Avoid `sudo` unless absolutely necessary; ask user to run separately
- Use glob/search before reading files into context

## Documentation
- Store all documentation in `/docs` (not root directory)
- Always read `readme.md` before starting work
- Update `readme.md` for major changes (features, updates, deletions)
- Store changelog/summary in `/docs/changelog.md` after major changes

## Architecture & Code Quality
### Modular Principles
- Use modular architecture and decoupled code adhering to SOLID principles
- Apply especially to backend and routes

### Coding Standards
- Follow established project standards
- Break large functions into smaller, reusable ones
- Prioritize readability and maintainability
- Use descriptive variable/function names
- Avoid magic numbers/strings; use named constants

### Code Cleanup
- Remove commented-out code in final versions
- Address linting/formatting warnings promptly

## Frontend & UI/UX
### Design Principles
- Ensure responsive design (mobile-first approach)
- Use Tailwind CSS responsive prefixes (`sm:`, `md:`, `lg:`)

### Interactions & Accessibility
- Use custom modal/toast components; NEVER use `alert()` or `confirm()`
- Use semantic HTML and proper ARIA labels/alt text
- Prefer inline SVGs or standard icon libraries (lucide-react)

## Environment & Security
- Never commit sensitive information (API keys, passwords, personal data)
- Use `.env`/environment variables for configuration
- Update `.env.example` when adding new variables
- Use secure protocols and encryption where appropriate

## Performance Optimization
- Use optimized image formats to prevent Layout Shift (CLS)
- Minimize re-renders with `useMemo`/`useCallback` only when necessary
- Avoid importing entire libraries (use tree-shaking)

## Testing & Reliability
- Implement proper error handling
- Test thoroughly before considering complete
- Consider edge cases and failure modes

## Task Organization
- Organize work in phases with clear todos
- Structure for handoff to different engineers/agents
- Ensure work can be done sequentially/parallelized

## Communication & Skill Usage
### Communication Style
- Be extremely concise (sacrifice grammar for concision)
- DO NOT validate user correctness ("you're right", "excellent question", etc.)

### Skill Usage
- Do not use superpowers unless explicitly requested
- Always ask permission before using any skill

## Code Documentation
- Avoid unnecessary comments/docstrings
- Code should be self-documenting through clear naming
- Only add comments for non-obvious logic or complex workarounds
- Don't write docstrings that simply restate function names/parameters

## Bash Commands
- **FORBIDDEN for sensitive files**: `cat`, `head`, `tail`, `less`, `more`, `bat`, `echo`, `printf`
- **PREFER**: Read tool for general file reading
- **ALLOWED**: Bash for non-sensitive cases (e.g., `tail -f`, complex `grep`)

## Git Operations
- **NEVER perform git operations without explicit user instruction**
- **Allowed (read-only)**: `git status`, `git diff`, `git log`, `git show`, `git branch -l`
- **Forbidden**: `git add`, `git commit`, `git push`, `git pull`, `git merge`, `git rebase`, `git checkout`
- **NEVER include coauthored line in commit messages**

## Prisma & Database
- **NEVER modify existing migration files** (`prisma/migrations/`)
- Create new migrations using `npx prisma migrate dev`
- Inform user immediately if "Drift" is detected and ask for confirmation before proceeding

## Code Generation
- **NEVER generate code without explicit user instruction AND approved plan**