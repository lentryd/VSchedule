if(!self.define){let e,s={};const l=(l,c)=>(l=new URL(l+".js",c).href,s[l]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=l,e.onload=s,document.head.appendChild(e)}else e=l,importScripts(l),s()})).then((()=>{let e=s[l];if(!e)throw new Error(`Module ${l} didn’t register its module`);return e})));self.define=(c,i)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let u={};const r=e=>l(e,n),o={module:{uri:n},exports:u,require:r};s[n]=Promise.all(c.map((e=>o[e]||r(e)))).then((e=>(i(...e),u)))}}define(["./workbox-94d8ddb9"],(function(e){"use strict";e.setCacheNameDetails({prefix:"vdocs"}),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/VSchedule/css/614.03fab845.css",revision:null},{url:"/VSchedule/css/801.e38130a9.css",revision:null},{url:"/VSchedule/css/985.f2e8cb0c.css",revision:null},{url:"/VSchedule/css/app.d282c66f.css",revision:null},{url:"/VSchedule/img/image.9ecbc42e.png",revision:null},{url:"/VSchedule/index.html",revision:"fbb4467abcc97fa41181cdb690ebeef8"},{url:"/VSchedule/js/364.cff81027.js",revision:null},{url:"/VSchedule/js/614.440e56aa.js",revision:null},{url:"/VSchedule/js/801.33f8577c.js",revision:null},{url:"/VSchedule/js/985.ae89690f.js",revision:null},{url:"/VSchedule/js/app.82de2bc1.js",revision:null},{url:"/VSchedule/js/chunk-vendors.10f91261.js",revision:null},{url:"/VSchedule/manifest.json",revision:"09a12bedfb3ca961bf09efa3b30da0fe"},{url:"/VSchedule/robots.txt",revision:"b6216d61c03e6ce0c9aea6ca7808f7ca"}],{}),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute(/^http.*github/,new e.NetworkFirst({cacheName:"api-cache",networkTimeoutSeconds:2,plugins:[]}),"GET")}));
