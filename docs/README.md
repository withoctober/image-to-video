# supastarter Documentation

## Table of contents

- [supastarter Documentation](#supastarter-documentation)
  - [Table of contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Internationalization](#internationalization)
  - [Authentication](#authentication)
    - [Secret for the authentication](#secret-for-the-authentication)
  - [Storybook](#storybook)
    - [Set font for storybook](#set-font-for-storybook)

## Introduction

supastarter is the ultimate starter template for your SaaS application. It's built with Next.js, React, TypeScript, and Tailwind CSS.

## Internationalization

supastarter uses [next-i18next](https://github.com/i18next/next-i18next) for internationalization. It's a great library that allows you to easily add multiple languages to your application.

## Authentication

supastarter uses [next-auth](https://next-auth.js.org/) for authentication. It's a great library that allows you to easily add authentication to your application.

### Secret for the authentication

To generate a secret for the authentication, you can use the following command:

```bash
openssl rand -base64 32
```

## Storybook

supastarter uses [Storybook](https://storybook.js.org/) to develop and document your components. It's a great tool that allows you to develop and test your components in isolation.

### Set font for storybook
