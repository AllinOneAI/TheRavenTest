# TheRaven Quest

This repository contains source code for my project i wrote for the task TheRaven gave me.
In case you just want to play with my app, I deployed it on my private server specially for you ❤️. So feel free to visit [allinone.onysd.pw](http://allinone.onysd.pw/) and have a good time!

However, i believe you are here for my source code. So... 

## Project Setup
Firstly, you should install all dependencies with npm.  
```sh
npm install
```

### Compile and Hot-Reload for Development
To work with sources out of the box start a Vite server in project's root folder (the one that contains **index.html** file). Vite is a pretty cool tool to develop and maintain vue apps. It has a lot of quality-of-life features such as hot-updates.  
```sh
npm run dev
```
When server starts, open localhost:5173 in your browser to see an app. Vite logs in console a port, on which it starts, but it's 5173 by default.

### Compile and Minify for Production
If you want to host my app on your server, just build it with vite's build script, running the next command:
```sh
npm run build
```
## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/) if you want to configure the server, just in case.