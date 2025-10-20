## PECAN Tool (WIP): Build Interactive Perceived Causal Problem Networks

This web app is an open-source tool that lets users create interactive perceived causal networks — a clinically oriented variant of causal loop diagrams. It is under active development, and the codebase is still being organized and documented.

[Demo website](https://pecan-tool.rpsychologist.com)


This monorepo includes a Next.js frontend and a Strapi v4 backend for building and exploring these networks.

- This project currently uses the deprecated [nextjs-corporate-starter](https://github.com/strapi/nextjs-corporate-starter) template for non-network components.
- Network-related UI lives in `./frontend/src/app/[lang]/network`.

## Requirements

- Node 18
- Yarn 4

## Tech stack

- Frontend
	- Next.js 14
		- HeroUI component library
		- Typescript (not yet used for the network)
- Backend
	- Strapi v4

## Project structure

```
.
├─ backend/          # Strapi CMS (content types, controllers, routes)
├─ frontend/         # Next.js app (app router, components, pages)
├─ seed-data.tar.gz  # Optional Strapi content export for local seeding
├─ build.sh, dev.sh  # Helper scripts
└─ README.md
```

## Setup (first time)

1) Install dependencies at the repo root

```bash
yarn install
yarn setup
```

2) Configure environment files

- Backend: copy `backend/.env.example` to `backend/.env` and fill required values.
- Frontend: copy `frontend/.env.example` to `frontend/.env` and fill required values.

3) Start backend dev server in `./backend`

```bash
yarn develop
```
- Strapi Admin: http://localhost:1337/admin

4) Create a Strapi admin user (first run only) via http://localhost:1337/admin

## Strapi API tokens

Create the following tokens in Strapi Admin → Settings → API Tokens.

1) Public API Token Content

- Description: Access to public content
- Token duration: Unlimited
- Token type: Custom

Permissions:

| Content | Permissions |
| --------------- | :--------------: |
| Article | find, findOne |
| Author | find, findOne |
| Category | find, findOne |
| Custom-role | find, findOne |
| Global | find |
| Network | find, findOne |
| Network-config | find |
| Node | find |
| Page | find, findOne |
| Product-feature | find, findOne |

Set this token in the frontend env file:

```bash
# ./frontend/.env
STRAPI_API_TOKEN=your-public-content-token
```

2) API Token Network Submit

- Description: Allow frontend/backend to store network data
- Token duration: Unlimited
- Token type: Custom

Permissions:

| Content | Permissions |
| --------------- | :--------------: |
| Network | create |

Set this token in the frontend env file:

```bash
# ./frontend/.env
NEXT_INTERNAL_STRAPI_NETWORK_SUBMISSION_TOKEN=your-network-submit-token
```

## Seeding demo content (optional)

To import sample content into Strapi:

```bash
yarn seed
```

This uses `seed-data.tar.gz` to populate local content types and entries.

## Development

### Backend (Strapi)

```bash
cd backend
yarn develop
```

### Frontend (Next.js)

```bash
cd frontend
yarn dev
```

- Network tool UI: http://localhost:3000/network

## Contributing

Contributions are welcome while the project is still taking shape. Please open an issue or PR with a concise description of the change and testing notes.

## License

MIT


