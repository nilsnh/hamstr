# HAMSTR

[![Build Status](https://travis-ci.org/nilsnh/hamstr.svg?branch=master)](https://travis-ci.org/nilsnh/hamstr)

Move mountains of SQL data.

## Features

* Run mysqldump through a ssh tunnel.

## Installation

Global installation: `npm i -g hamstr`

Project installation: `npm i hamstr`

## Usage

1.  Copy `.env-example` into `.env` and fill out credentials.
1.  Run `hamstr mysqldump --tunnel prod` to download the database target `PROD` defined in the .env file.
1.  Run `hamstr --help` to get a functionality overview.

## Development and test

Not many tests yet, but we have Typescript.

1.  Run `npm test` to trigger typescript build.
    * Run `npm build -- --watch` to start a auto-compiling process which builds on file save.

## License

Project code is licensed under the MIT license, [see license](LICENSE.txt).
