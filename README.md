# Centrifuge Insights

[![React](https://img.shields.io/static/v1?label=built+with&message=React&color=61dafb)](https://reactjs.org/)
[![Ant Design](https://img.shields.io/static/v1?label=built+with&message=Ant+Design&color=0170fe)](https://ant.design/)
[![tailwindcss](https://img.shields.io/static/v1?label=built+with&message=Tailwind+CSS&color=38bef8)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/static/v1?label=shipped+with&message=Docker&color=287cf9)](https://www.docker.com/)
[![embrio.tech](https://img.shields.io/static/v1?label=by&message=EMBRIO.tech&color=24ae5f)](https://embrio.tech)
[![Centrifuge](https://img.shields.io/static/v1?label=for&message=Centrifuge&color=2762ff)](https://centrifuge.io/)

<!-- [![Ant Design](https://img.shields.io/static/v1?label=built+with&message=Ant+Design&color=F74455)](https://ant.design/) -->

A single-page application to visualize data and activities on the Centrifuge Parachain on Polkadot.

## :seedling: Staging

Access staging of [`main`](https://github.com/embrio-tech/centrifuge-insights) branch at [https://insights.s.centrifuge.embrio.tech/](https://insights.s.centrifuge.embrio.tech/).

[![20220627_centrifuge_app-preview](https://user-images.githubusercontent.com/16650977/175917219-77a0effc-06b7-432f-93c2-fd4e2d90a84a.png)](https://insights.s.centrifuge.embrio.tech/)

## :construction_worker_man: Development

We highly recommend to develop using the overarching [centrifuge-development](https://github.com/embrio-tech/centrifuge-development) repository. It allows to run all required services (frontend and backend) with [Docker Compose](https://docs.docker.com/compose/).

If you prefer to run the frontend without Docker the following instructions get you started.

### Prerequisites

- [Node Version Manager](https://github.com/nvm-sh/nvm)
  - node: version specified in [`.nvmrc`](/.nvmrc)
- [Yarn](https://classic.yarnpkg.com/en/)
- Environment variables file
  - Copy the template with

        cp .env.sample .env
- Tenant config file with `TENANT_ID`
  - Copy the template with

        cp public/tenant.json.sample public/tenant.json
    
- [centrifuge-subql](https://github.com/embrio-tech/centrifuge-subql) backend.
  - You can set the url of the backend in [`src/config/tenant/local.ts`](https://github.com/embrio-tech/centrifuge-insights/blob/main/src/config/environment/local.ts) as `graphQLServerUrl`.

### Install

    yarn install

### Run

    yarn start
    
### Access

The frontend can be accessed under http://localhost:8010

### Commit

This repository uses commitlint to enforce commit message conventions. You have to specify the type of the commit in your commit message. Use one of the [supported types](https://github.com/pvdlg/conventional-changelog-metahub).

    git commit -m "[type]: foo bar"

## :speech_balloon: Contact

[EMBRIO.tech](https://embrio.tech)  
[hello@embrio.tech](mailto:hello@embrio.tech)  
+41 44 552 00 75

## :lock_with_ink_pen: License

The code is licensed under the [GNU Lesser General Public License v2.1](https://github.com/embrio-tech/centrifuge-insights/blob/main/LICENSE)
