# Campaign Detail — code review exercise

## Scenario
You join a team that owns a promotional **Campaign** feature (a campaign bundles coupons
across regions/stores for a validity window with a budget). A colleague opened a PR
adding the **Campaign Detail** page (`frontend/`) and the REST endpoints behind it
(`backend/`). You are asked to review it.

## Your task
Deliver, in whatever form you like (PR-style comments, a document, bullet points):

1. **Review** — what problems do you see (frontend and backend)? Prioritise them and
   say why each matters.
2. **Target structure** — sketch how you would structure the page instead (components,
   state, data flow, where logic lives). Any sound architecture is fine; we care about
   your reasoning and tradeoffs.
3. **API contract critique** — what would you change about the endpoints and why?
4. **Migration path** — how would you get from here to your target safely, given the page is live?

Timebox: TBD

## Running it
Backend (Java 21, Maven; in-memory seeded data, port 8085):
```
cd backend && mvn spring-boot:run
```
Frontend (Node.js `^22.22.3`, `^24.15.0`, or `>=26.0.0`; needs access to the internal npm registry for the REWE Design System; port 4200):
```
cd frontend && npm ci && npm start
```
Open http://localhost:4200/campaigns/c-1 (also `c-2`, `c-3`).

### IntelliJ IDEA

Open the repository root (`campaign-review-exercise`) as a project. Configure a
Java 21 SDK and a Node.js version listed above, then allow IntelliJ to import
the root `pom.xml` as a Maven project; it includes the backend module. If the
project was already open, right-click the root `pom.xml`, choose **Add as Maven
Project**, then **Reload All Maven Projects** in the Maven tool window. This
imports the backend source roots, dependencies, and `target/classes` output
directory; do not configure a separate compiler output path manually.

Install the frontend dependencies with
`npm ci` from `frontend/` (the REWE Design System package requires access to the
internal npm registry).

The shared run configurations in `.run/` provide **Campaign Backend**,
**Campaign Frontend**, and **Campaign Full Stack**. Select **Campaign Full
Stack** to start both services, then open
http://localhost:4200/campaigns/c-1 (or `c-2` / `c-3`).
