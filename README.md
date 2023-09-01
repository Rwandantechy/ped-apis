# PublishEveryDay Backend
Welcome to the PublishEveryDay Backend repository! This repository contains the backend code for the PublishEveryDay Blogging Platform, a web application aimed at empowering bloggers and content creators.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Introduction

PublishEveryDay (PED) is a web-based application that provides an easy-to-use environment for content creators to write, publish, and share their insights with a global audience. This backend repository is developed using the MERN (MongoDB, Express.js, React.js, Node.js) Stack, and it complements the frontend of the platform.

## Features

- User authentication and authorization 
- Content creation and scheduling
- Media integration (images, videos)
- Categories and tags for content organization
- User engagement features (comments, likes, sharing,follow, claping, reporting)
- SEO optimization for better visibility
- Analytics dashboard for insights
- Support for monetization strategies
- sanity checking using automated machine learning model(Bot).

## Getting Started

To get started with the PublishEveryDay Backend, follow these steps:

### Installation

1. Clone this repository:
git clone https://github.com/M-p-MU/PublishEveryDay_Backend.git
2. then navigate to the folder: cd PublishEveryDay_Backend

3. Install the dependencies:
 npm install

### Usage

1. Configure environment variables:
Create a `.env` file in the root directory with the following variables:
    1. PORT=3000
    2. MONGODB_URI=your_mongodb_uri
    3. JWT_SECRET=your_jwt_secret

2. Start the server:
npm start

3. Access the backend at `http://localhost:3000`.

## API Documentation

The API documentation for this backend is generated using Swagger. Follow these steps to access and use the documentation:

1. Start the backend server by following the "Usage" instructions mentioned above.

2. Once the server is running, access the Swagger UI by navigating to `http://localhost:3000/api-docs`.

3. You will be presented with an interactive API documentation page where you can explore the available endpoints, request parameters, and responses.

4. Use the Swagger UI to test and understand the functionality of each API endpoint. You can also make test requests directly from the documentation.

For detailed information about the API endpoints, request and response formats, please refer to the Swagger documentation.

## Contributing

Contributions are welcome! If you'd like to contribute to the project, please follow the [Contributing Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).


