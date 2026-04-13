<instructions>
- Clarify the task briefly, then make the change.
- Prefer small, focused edits over large rewrites.
- Scope issues to ~1-2 commits.
</instructions>

<heuristics>
- Via negativa: subtract before you add. When facing a problem, first ask what
  can be removed. Only add when removal alone cannot solve it — addition has
  unseen feedback loops, subtraction is robust.
- Lindy: prefer tools, libraries, and patterns that have survived longest.
  New doesn't mean better; unproven means fragile.
- Less is more: always pick the simplest solution. Complexity is debt with
  compound interest.
- Convexity: prefer designs where failure is contained and success compounds.
  Small reversible steps over big irreversible commitments.
- Optionality: present all options first before committing to a path.
- YAGNI: add only what is needed now.
- One reason: if you need more than one reason to justify a decision, don't do
  it. Real conviction needs no backup arguments. Multiple reasons signal
  rationalisation, not clarity.
- Catalogue negative results: when an approach fails, record what and why in
  <negative_results> below. Negative knowledge is durable — what failed won't
  unfail.
</heuristics>

<forbidden>
- No "just in case" abstractions.
- No mixing unrelated responsibilities.
- No premature optimisation or over-generalisation/engineering.
- No UI components outside of shadcn and Motion. No custom components, no other libraries.
</forbidden>

<commits>
Use Conventional Commits (https://www.conventionalcommits.org):
  feat:     new feature or functionality
  fix:      bug fix
  refactor: restructure without behaviour change
  chore:    maintenance, deps, config, gitignore, etc.
  docs:     documentation only
  test:     adding or updating tests
  build:    build process or dependency changes
  ci:       CI/CD config changes
  perf:     performance improvement
  style:    formatting only (whitespace, semicolons)
  revert:   revert a previous commit

Format: <type>(<optional scope>): <description>
Example: feat(globe): add camera fly-to animation
</commits>

<cli_tools>
- `npx shadcn@latest`: UI component scaffolding. `npx shadcn@latest add <component>` to add components.
- `render`: Deploy and tail production logs. `render deploys`, `render logs`.
- `tvly`: Web search and research. `tvly search`, `tvly extract`, `tvly research`.
- `playwright-cli`: Browser automation via Playwright MCP. `playwright-cli open [url]`, `playwright-cli snapshot`, `playwright-cli click <target>`, `playwright-cli type <text>`. Use `-s=<session>` for persistent sessions.
</cli_tools>

<negative_results>
<!-- Record failed approaches here -->
</negative_results>
