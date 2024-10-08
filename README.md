
#Vue Project

This is a Vue 3 application built using Vite, TypeScript, and Tailwind CSS, integrating modern web development technologies and best practices.

## Technologies Used

- **Frontend Framework**: Vue 3
- **Language**: TypeScript
- **Build Tool**: Vite
- **CSS Framework**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **Icons**: Heroicons
- **Utility Library**: Lodash-es
- **Mock Data**: [DummyJSON API](https://github.com/Ovi/DummyJSON)
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

- **Node.js** (version 20 or later)
- **npm** (included with Node.js installation)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DotNetTitan/vue-project.git
   cd vue-project
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:
```bash
npm run dev
```

This will start the Vite server and hot-reload the project on changes.

## IDE Setup

We recommend using **Visual Studio Code** for development, with the following extensions:
- **Volar** (for Vue 3 support) – disable Vetur if installed.
- **ESLint** (for consistent code quality)

## TypeScript Support

The project uses `vue-tsc` for static type checking. The Volar extension in VS Code enhances TypeScript support in `.vue` files.

## Customization

You can modify the Vite configuration to suit your needs. Refer to the [Vite Documentation](https://vitejs.dev/config/) for more details.

## Tailwind CSS

Styling is done using **Tailwind CSS**. The configuration file for customizing Tailwind can be found at `tailwind.config.js`.

## Deployment

GitHub Actions is configured for CI/CD. The workflow configuration is located in `.github/workflows`.

## License

This project is licensed under the [MIT License](LICENSE).
