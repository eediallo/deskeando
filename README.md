<!-- PROJECT LOGO -->
<div align="center">
  <h1 align="center"> HaveALook — Desk Booking Application</h1>
  <p align="center">
    A web application to book desks in advance.
    <br />
   
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about">About</a>
      <ul>
        <li><a href="#key-features">Key Features</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About

This project is a flexible web application built to help manage shared office space efficiently. It solves a key problem: "Who works where, and when?"

### Key Features

- **Calendar View** — Navigate to upcoming weeks and see bookings at a glance
- **Log in/Registretion** — Each user has to register
- **Desk Availability Dashboard** — See which desks are free and which are booked
- **Interactive Floorplan (SVG)** — Select desks visually
- **Team Bookings** — Book for yourself a desk
- **Cancellations** — Cancel your own bookings

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

<!-- Frontend -->

[![React][React.js]][React-url]
[![React Router][ReactRouter]][ReactRouter-url]
[![Vite][Vite.js]][Vite-url]

<!-- Backend -->

[![Node.js][Node.js]][Node-url]
[![Express][Express.js]][Express-url]
[![PostgreSQL][Postgres]][Postgres-url]

<!-- Logging -->

[![Winston][Winston]][Winston-url]
[![Morgan][Morgan]][Morgan-url]

<!-- Code Quality -->

[![ESLint][ESLint]][ESLint-url]
[![Prettier][Prettier]][Prettier-url]

<!-- Testing -->

[![Vitest][Vitest]][Vitest-url]
[![TestContainers][TestContainers]][TestContainers-url]
[![Playwright][Playwright]][Playwright-url]

<!-- DevOps -->

[![Docker][Docker]][Docker-url]
[![GitHub Actions][GitHubActions]][GitHubActions-url]
[![Coolify][Coolify]][Coolify-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

Ensure you have the latest version of **npm** installed:

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

Follow these steps to set up and run the project locally:

1. Clone the repo
   ```sh
   git clone https://github.com/eediallo/deskeando.git
   ```
2. Install NPM packages in web and api directories
   ```sh
   npm install
   ```
3. Configure Environment Variables

   Create a `.env` file with the following variables:

   ```env
   DATABASE_URL=your_postgresql_database_url
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```

4. Start the Development Server

   To start both the frontend and backend concurrently in development mode, run:

   ```sh
   npm run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are \*greatly appreciated\*\*.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Express.js]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[Postgres]: https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white
[Postgres-url]: https://www.postgresql.org/
[Vite.js]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[ReactRouter]: https://img.shields.io/badge/React%20Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white
[ReactRouter-url]: https://reactrouter.com/
[Winston]: https://img.shields.io/badge/Winston-3C3C3C?style=for-the-badge
[Winston-url]: https://github.com/winstonjs/winston
[Morgan]: https://img.shields.io/badge/Morgan-000000?style=for-the-badge
[Morgan-url]: https://github.com/expressjs/morgan
[ESLint]: https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white
[ESLint-url]: https://eslint.org/
[Prettier]: https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black
[Prettier-url]: https://prettier.io/
[Vitest]: https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white
[Vitest-url]: https://vitest.dev/
[TestContainers]: https://img.shields.io/badge/TestContainers-0db7ed?style=for-the-badge&logo=docker&logoColor=white
[TestContainers-url]: https://www.testcontainers.org/
[Playwright]: https://img.shields.io/badge/Playwright-45ba63?style=for-the-badge&logo=playwright&logoColor=white
[Playwright-url]: https://playwright.dev/
[Docker]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/
[GitHubActions]: https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white
[GitHubActions-url]: https://github.com/features/actions
[Coolify]: https://img.shields.io/badge/Coolify-333333?style=for-the-badge
[Coolify-url]: https://coolify.io/
