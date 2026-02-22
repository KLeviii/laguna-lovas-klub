# Claude Code – Vue Project Guidelines (David's Style)

This file defines **mandatory rules** for all code generation and modifications in this Vue codebase.
If any rule would be violated, stop and fix the solution to fully comply with these guidelines.

---

## 0) Global Principles (always)

- If "create skeleton" is requested, create a new Vue project with minimal setup: a home page with one text content, router with one route for home. IMPORTANT: keep as simple as possible, do NOT add any extra dependencies, code, or features. Try to solve the request with minimal code as quick as possible.

- **JavaScript everywhere** – no TypeScript, no `lang="ts"` in SFCs.
- Prefer **many small, short functions** over a few large ones.
- **NO automated tests**:
  - Do NOT generate unit / integration / e2e tests.
  - Do NOT keep any test-related scaffolding, configs, or dependencies.
  - If a template generates them (e.g. `__tests__`, `*.spec.js`, Vitest/Jest configs, Playwright, Cypress), **delete them**.
- **Use `.env` files** for all environment variables.
  - Always provide `.env.example` (no secrets, only placeholders).
  - Never commit secrets.
- If any implementation decision or uncertainty arises, **ASK BEFORE coding**.
  - Examples: auth strategy, endpoint contracts, data models, permissions, UI flows, error handling, pagination, realtime needs.

---

## 1) Stack Rules (mandatory)

**Required stack:**

- Vue 3 (Composition API, `<script setup>`)
- Vue Router
- Bootstrap (utility classes and components; no Tailwind)
- Pinia store
- Supabase (auth, database, storage – use the official `@supabase/supabase-js` client)

**Vue conventions:**

- Use Composition API with `<script setup>` in all SFCs.
- Keep `<script setup>` blocks focused; move non-trivial logic to composables or services.
- Access env variables via `import.meta.env` (Vite convention).

**Supabase conventions:**

- Initialise the Supabase client once in `services/supabase.js` and import from there.
- Use Supabase Auth for all authentication flows.
- Use Supabase Realtime, Storage, and Edge Functions only when explicitly requested.
- Never expose the `service_role` key on the client – only `anon` key goes in the frontend.

---

## 2) Folder Structure (mandatory)

### UI / Components

- Reusable components go into: `src/components/`
- Page-level components go into: `src/components/pages/`
- Feature-based components:
  - `src/components/<feature-name>/...`
  - Example:
    - `src/components/auth/LoginForm.vue`
    - `src/components/profile/ProfileCard.vue`

### Pages / Routes

- Routes are defined in `src/router/index.js`.
- Page views live in `src/views/` (one file per route).
- Keep views thin: they compose page-level components + minimal orchestration; real logic goes into composables / services.

### Composables / Services / Utils

- Composables: `src/composables/` (business + UI state, async orchestration)
- Services: `src/services/` (Supabase queries, pure data-access layer – e.g. `services/userService.js`)
- Shared helpers: `src/utils/` (pure utilities, formatting, mapping, etc.)
- Supabase client singleton: `src/services/supabase.js`

### Stores

- Pinia stores: `src/stores/`

---

## 3) Styling Rules (Bootstrap)

- Write **as little custom CSS as possible**.
- Prefer Bootstrap utility classes and components everywhere.
- Customise Bootstrap via SCSS variables (in `src/assets/styles/`) if theming is needed – avoid scattered inline `style` attributes.
- If custom CSS is unavoidable:
  - Keep it scoped to the component (`<style scoped>`).
  - Keep it minimal and justified.

---

## 4) State Management (Pinia)

Pinia is the standard state manager for Vue 3 and is worth using even in smaller projects – it gives a clear, predictable place for shared state and makes debugging straightforward.

- Use Pinia stores in `src/stores/`.
- Store design:
  - Keep state minimal.
  - Actions are small and focused.
  - Any mapping/formatting goes to `src/utils/`.
- Persist state to **localStorage** manually when needed (e.g. `watch` the relevant state slice and write to `localStorage`; rehydrate in the store's setup).
  - Do NOT add external persistence libraries unless explicitly requested.

---

## 5) Validation

Native HTML5 validation and Bootstrap's validation classes cover most simple forms and are the default choice – no extra library needed for straightforward cases.

Use **Zod** only when validation logic is genuinely complex:
- Multi-step forms with cross-field rules.
- Validating Supabase response shapes you don't fully control.
- Shared validation schemas reused across multiple components.

If Zod is used, keep schemas in `src/utils/schemas/` and error messages clear and developer-friendly.

---

## 6) Environment Variables (.env)

- Always use `.env` and `.env.example`.
- Access via `import.meta.env` (Vite).
- Conventions (Vite requires the `VITE_` prefix for client-exposed vars):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_APP_URL`
- Never put the Supabase `service_role` key in any client-side env variable.

---

## 7) README (mandatory)

- Include a `README.md` that lists **features only**, in short bullet points.
- Keep it updated whenever features, routes, or components change.
- Document required env vars briefly (names only, no secrets).

---

## 8) Workflow Rules (mandatory before coding)

For every task:

1. Describe in **3–7 bullet points** what will be created or changed
   - files, routes, components, composables, stores, services
2. If any decision point exists, **stop and ask for clarification before implementation**.
3. After implementation:
   - Remove all test-related artifacts.
   - Verify folder structure (views/components split, composables/services/utils separation).
   - Update the README feature list.
   - Verify `.env.example` completeness (placeholders only).

---

## 9) Forbidden / Avoid

- Any testing frameworks/configs/files (Vitest/Jest/Cypress/Playwright).
- Tailwind CSS or any other CSS framework – Bootstrap only.
- TypeScript – JavaScript only.
- Random global CSS without Bootstrap-first justification.
- Unstructured logic in views/components – move to composables/services/utils.
- Secret values in repo files.
- Multiple Supabase client instances – always import from `src/services/supabase.js`.
- Exposing the Supabase `service_role` key anywhere in the frontend.