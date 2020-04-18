# 项目介绍

## 项目组织结构
- BuzService：数据业务层
- common：通用util库
- ClientApp：app客户端接口
- WebManager：管理平台

## 技术集成记录
- 通用Mapper+MYBATIS GENERATOR+PageHelper分页插件：实现单表业务零SQL
- 通用类库guava/common-lang3/hutool
- easyPoi（更简单的操作word/excel等等）
- 统一响应结果封装及生成工具
- 统一异常处理
- 整合logback日志框架
- 集成swagger-2 
- 开启mybatis日志sql打印
- 整合shiro进行用户登录验证
- 整合HibernateValidator做参数校验


## 待集成记录
- AOP日志记录
- HikariCP和Mybatis整合
- logback接管catalina.out并按日轮转
- 集成Redis
- 集成邮件服务
- 集成短信发送
- 待续
