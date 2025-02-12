# LT-CLI

## Prerequisites

> _NOTE:_ These instructions assume you are using a mac, if you are using windows or linux, follow the pnpm install instructions from the installation reference.

- Install PNPM [installation reference](https://pnpm.io/installation)
  - `$ brew install pnpm`
  - `$ pnpm setup`

## Local Installation

1. CD into root folder of project
2. Run `$ pnpm pack` to install dependencies, build and pack the project
3. Run `$ pnpm add -g "$(pwd)"`to install the CLI tool to your computer

## Usage

### Commands:

- `$ lt-cli photo --id=1`
  - Retrieves one photo based on the ID and presents it in a table view.
- `$ lt-cli albums`
  - Retrieves all photos in all albums. Presents each album in ordered list of tables, and each picture in the albums sorted by photo id.
- `$ lt-cli albums --id=1`
  - Retrieves all photos in one album based on the album ID and presents the photos in an ordered table sorted by photo id.

### Testing

- To run unit tests for the project, run `$ pnpm test` from the root directory of the project.
- Coverage reports will be generated in a folder named coverage in the project.

### Notes:
I chose to use PNPM for this project out of personal preference for a node package manager. It beats install times compared to both yarn and npm, and has better monorepo support. If you'd like to use yarn or npm, you can convert the project easily by following these steps:

- Delete node_modules
- Delete pnpm_lock.yaml (this will be replaced by package-lock.json)
- Replace all pnpm calls to npm in package.json
- Now you can run npm install