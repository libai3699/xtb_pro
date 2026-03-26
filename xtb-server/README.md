# xtb-server

校推宝Pro 服务端项目。

## 目标

- 后台登录
- 前台微信登录
- 活动接口
- 代理接口
- 留资接口
- 订单接口
- 统计接口

## 技术

- Node.js
- NestJS
- Prisma
- MySQL
- Redis

## 当前阶段

先搭最小可运行后端骨架，后续逐步接数据库和业务模块。


npm i
发版
1. 先打包 npm run build
2. 把
dist 目录 
package.json
package-lock.json
prisma
.env

这几项同时发到宝塔目录下

3. 打开终端 npm i
4. pm2 delete backend
5. lsof -i :3000 
6. pm2 start dist/main.js --name backend --update-env 

