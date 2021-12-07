<p align="center">
  <a href="https://tolfix.com/" target="_blank"><img width="260" src="https://cdn.tolfix.com/images/TX-Small.png"></a>
  <br/>
  <strong>C</strong>entral <strong>P</strong>ayment <strong>G</strong>ateway - API
</p>

# ⭐ | CPG-API
CPG-API is being used to create products, invoices, orders, transactions and payments for customers, to grow your business.

# 🧰 | Setup
Setting up `CPG` can be done in various of ways, but by the far easiet is by using `Docker`.
You can pull the latest `docker` image from `tolfixorg/cpg:latest` from `DockerHub`.

`CPG` also needs `env` vars added, which you can find some documents from [`.env.example`](), those added with `(optional)` can be ignored if you don't feel the need of them, but the others are required to make `CPG` functional.

## Installing
`CPG` requires the following
* Node.js
* Typescript - 4.3.5
* MongoDB
* Git

1. Clone repository 
```txt
git clone https://github.com/Tolfix/CPG-API
```
2. Install dependencies
```txt
npm install
```
3. Install `TypeScript`
```txt
npm install -g typescript@4.3.5
```
## Building
`CPG` is built from `TypeScript`, thus simple run it by using the compiler.
```txt
tsc -b
npm run build
```

## Running
You can run `CPG` by using `npm run start` or `node ./build/Main.js`.
Would recommend to use `pm2`.
# 🎨 | Plugins
Plugins allows you to install others features to CPG. Be aware it can be `dangerous` due to plugins get accessed to alot, you can trust `Tolfix` owns plugins, or plugins you created yourself, otherwise there is no guarantee.

## Installing
You can install new plugins by modifying ENV PLUGIN as a array
`PLUGINS=["cpg-plugin-discord-webhook", "cpg-plugin-"]`
This will install the plugin by `npm`.

## Deleting
Simply remove the plugin as you added the plugin reverse.

# 📢 | Contribute
Want to contribute? Great! You can contribute by `forking` this repository, then make changes and make a `PR`!

Or simple ask on our [`discord server`](https://discord.tolfix.com).

# 🔮 | Discord
[![Discord](https://discord.com/api/guilds/833438897484595230/widget.png?style=banner4)](https://discord.tolfix.com)

# ⚙ | Tolfix
**Tolfix** is a `company` focusing about `IT`, `Development` and `Networking`, we drive to help others with their `problems` when it comes to `IT` and love contributing to others.
Want to find more information about us you can visit us at [`https://tolfix.com/`](https://tolfix.com/).
