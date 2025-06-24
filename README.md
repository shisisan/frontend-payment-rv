# Revitalize Police Pursuit Frontend

🌐 Frontend of the Revitalize Police Pursuit website  
**Tech Stack:** Next.js, Chakra UI, TypeScript

---

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
  - [Build for Production](#build-for-production)
- [Folder Structure](#folder-structure)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/shisisan/frontend-payment-rv.git
   cd frontend-payment-rv
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```
   _or if you use yarn:_
   ```sh
   yarn install
   ```

### Running the Development Server

Start the local development server:

```sh
npm run dev
```
_or_
```sh
yarn dev
```

- The app will be available at [http://localhost:3000](http://localhost:3000).

### Build for Production

To build the app for production:

```sh
npm run build
```
_or_
```sh
yarn build
```

To start in production mode:

```sh
npm start
```
_or_
```sh
yarn start
```

---

## Folder Structure

Here’s an overview of the primary folders in this project:

```
frontend-payment-rv/
├── public/             # Static files (images, fonts, etc.)
├── src/
│   ├── components/     # Reusable React components
│   ├── pages/          # Next.js pages (routes)
│   ├── styles/         # Global and component styles (CSS/Chakra)
│   ├── utils/          # Utility functions and helpers
│   ├── hooks/          # Custom React hooks
│   ├── contexts/       # React context providers
│   └── types/          # TypeScript type definitions
├── .env.example        # Example environment variables
├── package.json        # Project metadata and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

> **Note:**  
> - All main source code is under the `/src` directory.
> - The `/pages` folder follows the [Next.js routing conventions](https://nextjs.org/docs/routing/introduction).
> - Chakra UI theming and configuration may be found in `/src/styles` or `/src/theme`.

---

## Scripts

Common scripts (see `package.json` for more):

- `dev` – Start development server
- `build` – Build for production
- `start` – Start production server
- `lint` – Run linter
- `format` – Format code using Prettier

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)
