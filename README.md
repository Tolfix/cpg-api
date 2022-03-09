<div class="margin: 0 auto;" align="center">
  <a href="https://tolfix.com/" target="_blank"><img width="260" src="https://cdn.tolfix.com/images/TX-Small.png" alt="Tolfix"></a>
  <br/>
  <strong>C</strong>entral <strong>P</strong>ayment <strong>G</strong>ateway - API
</div>

#
[![Typescript Typings](https://github.com/Tolfix/cpg-api/actions/workflows/type-testing.yml/badge.svg?branch=master&event=push)](https://github.com/Tolfix/cpg-api/actions/workflows/type-testing.yml)
[![Docker Image](https://github.com/Tolfix/cpg-api/actions/workflows/docker.yml/badge.svg?branch=master&event=push)](https://github.com/Tolfix/cpg-api/actions/workflows/docker.yml)
[![CodeQL](https://github.com/Tolfix/cpg-api/actions/workflows/codeql-analysis.yml/badge.svg?branch=master)](https://github.com/Tolfix/cpg-api/actions/workflows/codeql-analysis.yml)
![Build Version](https://img.shields.io/github/v/release/Tolfix/cpg-api)


# ⭐ | CPG-API
CPG-API is being used to generate items, create invoices, handle orders, view transactions, and ensure payments make it to the client to develop your business. It offers many approaches for developers to personalize CPG

# 📝| Table of content
* [Documentations](#--documentation)
* [Setup](#--setup)
  * [Installing](#--installing)
  * [Building](#👷--building-the-project)
  * [Running](#-running)
* [Plugins](#--plugins)
  * [Installing](#installing)
  * [Deleting](#deleting)
* [Contribute](#--contribute)
* [Discord](#--discord)

# 📋 | Documentation
You can read our documentation on our [`wiki.`](https://github.com/Tolfix/CPG-API/wiki)

# 📦 | Setup
Setting up **CPG** can be done in various ways, but by far the simplest is by using **Docker**.

You can pull the latest **Docker Image** from `tolfixorg/cpg:latest` from **DockerHub**.

**CPG** also needs environment variables added, which you can find in [`.env.example`](), those that have (optional) in the comment can be ignored if you don't feel the need for them, but the others are required to make CPG functional.

# 🔧 | Installing
**CPG** requires the following
* Node.js v14 or v16
* Typescript - 4.3.5
* MongoDB
* Git

1. Clone repository
```bash
git clone https://github.com/Tolfix/CPG-API
```
2. Install dependencies
```bash
npm install
```
3. Install `TypeScript`
```bash
npm install -g typescript@4.3.5
```

## 👷 | Building
**CPG** is built from **TypeScript**, so you can run it by using the compiler.
```bash
tsc -b
npm run build
```

# 👟 | Running
You can run *CPG* by executing `npm run start` or `node ./build/Main.js`.
I Would recommend you use `pm2`.

# 🎨 | Plugins
Plugins allow you to add others features to CPG.
Beware, it can be `dangerous` as plugins get access to a lot of low level features.
You can trust `Tolfix` plugins, or plugins you created yourself, otherwise there is no guarantee on stability or security.

## Installing
You can add new plugins by modifying the environment variable "PLUGIN" as an array of strings.
`PLUGINS=["cpg-plugin-discord-webhook", "cpg-plugin-"]`
This will install the plugin via `npm`.

## Deleting
To delete a plugin, simply remove it from the environment variable "PLUGIN" as an array of strings.
`PLUGINS=[]`
This will uninstall the plugin via `npm`.

# 📢 | Contribute
Want to contribute? Great!
You can contribute to the repository by `forking`, then make a pull request when you're done!

Or you can ask on our [`discord server`](https://discord.tolfix.com).

# 🔮 | Discord
[![Discord](https://discord.com/api/guilds/833438897484595230/widget.png?style=banner4)](https://discord.tolfix.com)

# ⚙ | Tolfix
**Tolfix** is a `company` focused on `IT`, `Development` and `Networking`,
we strive to help others with their `IT` issues and love contributing to other peoples projects!
If you'd like to find out more, you can visit us at [`https://tolfix.com/`](https://tolfix.com/).