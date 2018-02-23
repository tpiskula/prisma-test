<h1 align="center"><strong>GraphQL Prisma Typescript Rbac</strong></h1>

<br />

<div align="center"><img src="https://imgur.com/1MfnLVl.png" /></div>

<div align="center"><strong>Basic role/scope based access controll for graphql schema</strong></div>

Based on https://github.com/graphql-boilerplates/typescript-graphql-server/tree/master/advanced

## Why
This repo is an experiment for testing purposes and not actively mantained, feel free to look around to see my solution to scope based auth using JWT and a custom graphql directive

## Requirements

You need to have the [Prisma CLI](https://www.prismagraphql.com/docs/quickstart/) installed to bootstrap your Prisma database using `prisma deploy`:

```sh
npm i -g prisma
```

## Getting started

```sh
# Start server (runs on http://localhost:4000) and open GraphQL Playground
yarn dev
```

![](https://imgur.com/hElq68i.png)


### Commands

* `yarn start` starts GraphQL server on `http://localhost:4000`
* `yarn dev` starts GraphQL server on `http://localhost:4000` _and_ opens GraphQL Playground
* `yarn playground` opens the GraphQL Playground for the `projects` from [`.graphqlconfig.yml`](./.graphqlconfig.yml)
* `yarn prisma <subcommand>` gives access to local version of Prisma CLI (e.g. `yarn prisma deploy`)

> **Note**: We recommend that you're using `yarn dev` during development as it will give you access to the GraphQL API or your server (defined by the [application schema](./src/schema.graphql)) as well as to the Prisma API directly (defined by the [Prisma database schema](./generated/prisma.graphql)). If you're starting the server with `yarn start`, you'll only be able to access the API of the application schema.


