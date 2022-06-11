# Thesis Management System

数据库系统及其应用期末项目

## 开始

以下说明会帮助你在本地上安装和运行项目，进行开发和测试。请参考部署小节。

### 安装要求

* 需要最新版本的 JDK

* 在本地必须要有稳定版的 Node.js, 否则项目运行将会出现问题; 目前(2022-06)稳定版本是16.15.1, 可以在 Node.js 官网中查看: https://nodejs.org/zh-cn/

* 最好使用目前主流的代码集成环境, 例如 VSCode, IDEA, 这样你的项目运行会更顺利

* 如果使用的是 VSCode，请提前安装好 SpringBoot 插件: `Spring Boot Extension Pack`

* Maven 依赖管理

## 运行

* 使用命令行，在 front 目录下输入 `npm install`, 安装项目所需依赖

* 配置 SpringBoot 项目运行环境, 可以找到运行入口(Main函数), 或者利用 Maven 的 package 命令, 将项目进行打包, 打包好的jar包自动放在 `项目名>target>xxx.jar`, 终端输入 `java -jar ***.jar` 运行

* 终端输入 `npm run start` 运行, 如果出现错误, 请将 front 目录下的 node_modules 文件夹删除, 重新输入 `npm install` 安装依赖

* 使用 IDEA 时, 会自动识别 Spring Boot 项目依赖, 并且配置好运行环境

## 使用到的框架 

* React 以及 React 第三方工具库

* Maven - 管理属性管理

* Spring Boot 服务

* Mybatis Java持久化框架

* 云端 MySQL

## 数据库的部署

* 数据库使用了 MySQL

* 部署在由腾讯云维护的云端服务器, 后端运行时会建立 SSH 通道, 安全获取数据

## 版本控制

* 项目在 gitee 上进行了版本控制

## 作者

* ECNU_SEI: 刘赛威(前端)

* ECNU_SEI: 崔光远(前端, 数据库部署)

* ECNU_SEI: 马百腾(后端, 数据库管理)




  