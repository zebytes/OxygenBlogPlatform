---
title: 自定义spring boot starter组件
date: 2025-6-19 13:08:00
tags: [Spring]
category: 配置
readTime: 5
excerpt: 创建starter模块 添加所需依赖 创建config包 实现自动配置 创建META-INF及spring目录  接着，在 /main 文件夹下，创建 /resources 包，再创建 /META-INF 文件夹，再在里面创建 /spring 文件夹 , 以及 org.springframework.boot.autoconfigure.AutoConfiguration.imports 文件注意，这是自定义 starter 固定步骤
---

# 环境
`Springboot 3.0.2`


而且版本不同，`META-INF`目录下的内容可能不同，**先记着****`META-INF`****下可能不一样**，看到下面就知道了

> - Spring Boot 2.6- META-INF/spring.factories
>     
> - Spring Boot 2.7+ 上下两种都兼容
>     
> - Spring Boot 3.0+ META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
>     

  

META-INF/spring.factories的内容格式如下

```YAML
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
  com.ze.test.config.UserAutoConfiguration
```

META-INF/org.springframework.boot.autoconfigure.AutoConfiguration.imports的内容格式如下

```YAML
com.ze.test.config.UserAutoConfiguration
```

  

# 创建starter模块

## 创建一个子模块

![](https://raw.githubusercontent.com/zebytes/images/main/20250619125631624.png)


 

## 添加所需依赖

在子模块pom文件加一下依赖（父模块已经做了依赖版本管理了）

```XML
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-autoconfigure</artifactId>
    </dependency>
</dependencies>
```

  

## 创建config包

在子模块创建一个`config`包，用来存放**自动配置类**
![](https://raw.githubusercontent.com/zebytes/images/main/20250619125658383.png)


# 实现自动配置

## 创建`User`类，`UserAutoConfiguration`类

比如说我们可以放一个`User`类，然后写一个它的自动配置类
![](https://raw.githubusercontent.com/zebytes/images/main/20250619125709090.png)

`User`类如下

```TypeScript
package com.ze.test.user;
public class User {
    private String name;
    public User() {
    }
    public User(String name) {
        this.name = name;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
```

`UserAutoConfiguration`类如下

```Java
package com.ze.test.config;

import com.ze.test.user.User;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Bean;
@AutoConfiguration
public class UserAutoConfiguration {
    @Bean
    public User supplyUser() {
        return new User("自动配置...");
    }
}
```

> 这是一个**自动配置类**，通过 `@Bean` 注解的 `supplyUser()` 方法来创建一个 `User`实例，以实现注入到 Spring 容器中

  

## 创建META-INF及spring目录：SpringBoot3 示例

接着，在 `/main` 文件夹下，创建 `/resources` 包，再创建 `/META-INF` 文件夹，再在里面创建 `/spring` 文件夹 , 以及 `org.springframework.boot.autoconfigure.AutoConfiguration.imports` 文件

**注意，这是自定义** **`starter`** **固定步骤，需要严格按照此格式来书写**

  

如下图：
![](https://raw.githubusercontent.com/zebytes/images/main/20250619125717468.png)

  

`.imports` 文件中内容如下，填写刚刚的 `UserAutoConfiguration`自动配置类的完整包路径：

```YAML
com.ze.test.config.UserAutoConfiguration
```

  

> **TIP** : 创建的 `imports` 文件，必须保证前面有_小绿叶_标识，如果不是，可能导致自定义 `starter` 被 IDEA 无法识别的问题：
>                             ![image.png](https://raw.githubusercontent.com/zebytes/images/main/20250619125913048.png)


至此，自定义 `starter` 步骤就完成了，最后的目录结构就是这样

```Bash
kid2-spring-boot-starter/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/ze/test/
│   │   │       ├── config/
│   │   │       │   └── UserAutoConfiguration.java  # 自动配置类
│   │   │       └── user/
│   │   │           └── User.java                   # 实体类
│   │   └── resources/
│   │       └── META-INF/
│   │           └── spring/
│   │               └── org.springframework.boot.autoconfigure.AutoConfiguration.imports  # 自动配置注册文件
│   └── test/
│       └── java/                                  
└── pom.xml                                       
```
