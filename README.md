# 校推宝Pro 第一版简化设计 README

## 1. 设计目标

这一版不追求做成很重的 SaaS 平台，只做最小可上线版本，先把核心闭环跑通：

1. 机构后台创建活动
2. 代理在小程序里拿到专属推广码和海报
3. 学生通过分享进入活动页
4. 学生留资或下单
5. 后台能看到是谁带来的线索和订单

一句话说清楚：

> 第一版先把“活动发布、代理推广、学生转化、数据归因”做通，其他复杂功能后面再补。

---

## 2. 技术方案

### 2.1 服务端

按你的要求，服务端改成简单的 Node 方案。

- 运行时：`Node.js 20`
- 框架：`NestJS`
- 数据库：`MySQL 8`
- 缓存：`Redis`
- ORM：`Prisma`
- 文件上传：本地存储或 MinIO
- 登录认证：`JWT`

为什么用 `NestJS`：

- 比 `Express` 规范一点，但又没有 Java 那么重
- 做后台管理、活动、订单、用户这些 CRUD 很顺手
- 结构清晰，后面想扩功能不会太乱

### 2.2 后台管理端

后台还是建议直接找现成中后台模板改。

- 推荐：`vue-element-plus-admin` 或 `vben admin`
- 技术：`Vue 3 + TypeScript + Element Plus`

第一版后台重点不是界面多高级，而是：

- 表单能配
- 列表能查
- 数据能看
- 权限能控

### 2.3 客户端

客户端改成你指定的：

- `uni-app + Vue 3 + Pinia`

一套代码同时支持：

- 微信小程序
- H5

并且：

- **代理端和学生端共用一套代码**
- 登录后根据角色切换页面和权限

---

## 3. 第一版架构，尽量简单

### 3.1 架构原则

第一版不要拆太多服务，不要搞微服务。

直接这样就够了：

- 一个后台前端
- 一个 uni-app 客户端
- 一个 Node API 服务
- 一个 MySQL
- 一个 Redis

### 3.2 简化架构图

```text
后台管理端(Vue3)
      |
      v
  Node.js API (NestJS)
      |
      +------ MySQL
      |
      +------ Redis
      |
      +------ 文件存储
      ^
      |
uni-app(H5/微信小程序)
```

---

## 4. 第一版核心功能，只保留必要的

### 4.1 后台管理端

第一版后台只做这些：

- 机构管理员登录
- 活动管理
- 代理管理
- 学生线索管理
- 订单管理
- 数据统计

#### 活动管理

- 新建活动
- 编辑活动
- 上下架活动
- 设置活动标题、封面、介绍、报名表单
- 设置奖励规则

#### 代理管理

- 代理列表
- 审核代理
- 启用/禁用代理
- 查看代理推广数据

#### 线索管理

- 查看学生留资
- 查看来源活动
- 查看来源代理
- 导出报名数据

#### 订单管理

- 查看订单列表
- 查看支付状态
- 手动标记已成交

#### 数据统计

- 活动浏览量
- 留资量
- 下单量
- 每个代理带来的数据

### 4.2 uni-app 客户端

客户端分两种身份，但只做一套代码。

#### 角色 1：代理

代理登录后能看到：

- 我的活动
- 推广海报
- 我的数据
- 我的邀请

#### 角色 2：学生

学生进入后能看到：

- 活动详情
- 报名/留资
- 下单支付
- 我的报名记录

---

## 5. 一套代码切换代理端和学生端

这个是第一版的关键简化点。

不做两个独立小程序，不做两个独立项目，直接一个 uni-app 项目，根据身份切换。

### 5.1 用户类型

系统里只定义两种前台用户：

- `agent` 代理
- `student` 学生

### 5.2 切换方式

登录后服务端返回：

```json
{
  "userId": 10001,
  "role": "agent"
}
```

客户端根据 `role` 跳转不同首页：

- `agent` 跳代理首页
- `student` 跳学生首页

### 5.3 页面复用

很多页面其实可以共用：

- 登录页
- 个人中心
- 活动详情页
- 订单页

差异主要在：

- 代理多一个“推广中心”
- 学生多一个“报名/支付”

---

## 6. 页面设计，简单版

## 6.1 代理端页面

### 首页

- 今日推广数据
- 我的活动列表
- 快捷入口：生成海报、复制链接、查看线索

### 活动详情页

- 活动介绍
- 奖励说明
- 生成专属海报
- 复制推广文案

### 推广中心

- 我的专属二维码
- 我的专属链接
- 海报下载

### 我的数据

- 浏览量
- 留资数
- 下单数

### 我的

- 基本信息
- 我的邀请
- 退出登录

## 6.2 学生端页面

### 首页

- 活动列表
- 推荐活动

### 活动详情页

- 活动介绍
- 课程介绍
- 优惠说明
- 报名按钮

### 报名页

- 姓名
- 手机号
- 学校
- 专业
- 年级
- 提交报名

### 下单页

- 商品信息
- 价格
- 支付按钮

### 我的

- 我的报名
- 我的订单

---

## 7. 第一版业务流程

### 7.1 代理推广流程

```text
后台创建活动
-> 代理登录小程序
-> 进入活动详情
-> 系统生成代理专属分享链接
-> 代理转发给学生
```

### 7.2 学生转化流程

```text
学生点击代理分享链接
-> 进入活动页
-> 系统记录来源代理ID
-> 学生填写报名表
-> 或直接下单支付
-> 后台看到该学生归属到哪个代理
```

### 7.3 数据归因

第一版不要做复杂归因模型，直接做最简单方案：

- 链接里带 `agentId`
- 学生首次进入时记录 `agentId`
- 学生报名或下单时，把这个 `agentId` 写入线索或订单

这样已经够用了。

---

## 8. 服务端模块设计，简单版

Node 服务端建议按下面拆模块，但都在一个项目里：

- `auth` 登录认证
- `user` 用户管理
- `agent` 代理管理
- `campaign` 活动管理
- `lead` 留资管理
- `order` 订单管理
- `stats` 数据统计
- `upload` 文件上传

### 8.1 目录建议

```text
src
├─ app.module.ts
├─ common
├─ auth
├─ user
├─ agent
├─ campaign
├─ lead
├─ order
├─ stats
└─ upload
```

---

## 9. 数据库设计，第一版精简表

第一版不要上太多表，不要做得很复杂。

我建议先只做这 10 张核心表：

1. `admin_user` 后台用户
2. `app_user` 前台用户
3. `agent_profile` 代理资料
4. `campaign` 活动
5. `campaign_share` 代理分享记录
6. `lead` 学生留资
7. `product` 商品/课程
8. `orders` 订单
9. `payment_record` 支付记录
10. `stats_daily` 每日统计

---

## 10. 详细表结构

### 10.1 `admin_user`

后台管理员表。

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint | 主键 |
| username | varchar(50) | 登录账号 |
| password | varchar(255) | 密码 |
| name | varchar(50) | 姓名 |
| mobile | varchar(20) | 手机号 |
| role | varchar(30) | admin/operator |
| status | tinyint | 1正常 0禁用 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

### 10.2 `app_user`

前台统一用户表，代理和学生共用。

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint | 主键 |
| role | varchar(20) | agent/student |
| nickname | varchar(50) | 昵称 |
| avatar | varchar(255) | 头像 |
| mobile | varchar(20) | 手机号 |
| openid | varchar(100) | 微信 openid |
| unionid | varchar(100) | 微信 unionid |
| status | tinyint | 1正常 0禁用 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

### 10.3 `agent_profile`

代理扩展资料表。

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint | 主键 |
| user_id | bigint | 对应 app_user.id |
| real_name | varchar(50) | 姓名 |
| school_name | varchar(100) | 学校 |
| major_name | varchar(100) | 专业 |
| grade_name | varchar(30) | 年级 |
| invite_code | varchar(30) | 邀请码 |
| status | tinyint | 0待审核 1通过 2拒绝 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

### 10.4 `campaign`

活动表。

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint | 主键 |
| title | varchar(100) | 活动标题 |
| cover | varchar(255) | 封面图 |
| description | text | 活动介绍 |
| form_config | json | 报名表单配置 |
| reward_desc | varchar(255) | 奖励说明 |
| start_time | datetime | 开始时间 |
| end_time | datetime | 结束时间 |
| status | tinyint | 0草稿 1上线 2下线 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

### 10.5 `campaign_share`

代理推广分享记录。

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint | 主键 |
| campaign_id | bigint | 活动ID |
| agent_user_id | bigint | 代理用户ID |
| share_code | varchar(50) | 分享码 |
| share_url | varchar(255) | 分享链接 |
| pv | int | 浏览量 |
| uv | int | 访客数 |
| lead_count | int | 留资数 |
| order_count | int | 订单数 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

### 10.6 `lead`

学生留资表。

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint | 主键 |
| campaign_id | bigint | 活动ID |
| agent_user_id | bigint | 来源代理ID |
| student_user_id | bigint | 学生用户ID，可为空 |
| name | varchar(50) | 姓名 |
| mobile | varchar(20) | 手机号 |
| school_name | varchar(100) | 学校 |
| major_name | varchar(100) | 专业 |
| grade_name | varchar(30) | 年级 |
| remark | varchar(255) | 备注 |
| status | tinyint | 0新线索 1已跟进 2已成交 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

### 10.7 `product`

课程或商品表。

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint | 主键 |
| campaign_id | bigint | 所属活动 |
| title | varchar(100) | 商品名称 |
| price | decimal(10,2) | 售价 |
| original_price | decimal(10,2) | 原价 |
| cover | varchar(255) | 封面图 |
| description | text | 商品介绍 |
| status | tinyint | 1上架 0下架 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

### 10.8 `orders`

订单表。

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint | 主键 |
| order_no | varchar(50) | 订单号 |
| product_id | bigint | 商品ID |
| campaign_id | bigint | 活动ID |
| agent_user_id | bigint | 来源代理ID |
| student_user_id | bigint | 学生用户ID |
| student_name | varchar(50) | 学生姓名 |
| mobile | varchar(20) | 手机号 |
| amount | decimal(10,2) | 支付金额 |
| status | tinyint | 0待支付 1已支付 2已取消 |
| pay_time | datetime | 支付时间 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

### 10.9 `payment_record`

支付流水表。

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint | 主键 |
| order_id | bigint | 订单ID |
| order_no | varchar(50) | 订单号 |
| pay_channel | varchar(20) | wechat |
| transaction_id | varchar(100) | 微信流水号 |
| amount | decimal(10,2) | 支付金额 |
| status | tinyint | 0待支付 1成功 2失败 |
| raw_callback | text | 回调原文 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

### 10.10 `stats_daily`

每日统计表。

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint | 主键 |
| stat_date | date | 日期 |
| campaign_id | bigint | 活动ID |
| agent_user_id | bigint | 代理ID，可为空 |
| pv | int | 浏览量 |
| uv | int | 访客数 |
| lead_count | int | 留资数 |
| order_count | int | 下单数 |
| paid_amount | decimal(10,2) | 支付金额 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

---

## 11. 最简单接口设计

### 11.1 后台接口

- `POST /admin/login`
- `GET /admin/campaign/list`
- `POST /admin/campaign/create`
- `POST /admin/campaign/update`
- `POST /admin/campaign/change-status`
- `GET /admin/agent/list`
- `POST /admin/agent/audit`
- `GET /admin/lead/list`
- `GET /admin/order/list`
- `GET /admin/stats/overview`

### 11.2 客户端接口

- `POST /app/login/wechat`
- `GET /app/user/profile`
- `GET /app/campaign/list`
- `GET /app/campaign/detail`
- `POST /app/agent/share/create`
- `POST /app/lead/submit`
- `POST /app/order/create`
- `POST /app/order/pay`
- `GET /app/my/orders`
- `GET /app/my/stats`

---

## 12. 第一版不做什么

为了简单，第一版明确不做这些：

- 不做多租户复杂隔离
- 不做复杂佣金结算
- 不做团队分销
- 不做拼团、助力、任务宝
- 不做消息中心
- 不做复杂 BI 报表
- 不做多角色后台体系

第一版里，奖励说明可以先写在活动里，佣金先后台人工统计。

这样成本最低，也最容易上线。

---

## 13. 开发顺序建议

### 第一阶段

- 后台登录
- 活动管理
- 代理登录
- 学生活动页
- 留资提交

### 第二阶段

- 商品和订单
- 微信支付
- 来源代理归因
- 后台统计

### 第三阶段

- 海报生成
- 导出报表
- 代理审核优化

---

## 14. 最终落地建议

如果按“简单、能用、能尽快上线”的原则，我建议就这样定：

- 服务端：`Node.js + NestJS + Prisma + MySQL`
- 后台：直接套现成 Vue Admin 模板改
- 客户端：`uni-app` 一套代码，同时跑 H5 和微信小程序
- 用户体系：代理和学生共用一个用户表，通过 `role` 区分
- 核心链路：活动 -> 分享 -> 留资/下单 -> 后台统计

这个版本最适合先做 MVP。

后面如果跑通了，再补：

- 自动佣金
- 团队代理
- 裂变玩法
- SaaS 多租户

