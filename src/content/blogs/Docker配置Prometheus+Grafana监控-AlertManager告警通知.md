---
title: Docker配置Prometheus+Grafana监控，AlertManager告警通知
date: 2025-6-18 11:57:14
tags: [监控]
category: 配置
readTime: 10
excerpt: 创建Prometheus容器   创建Grafana容器   监控Linux   配置Grafana可视化界面   监控多个Linux   监控Redis   配置告警
---
# 环境


虚拟机 centos 7 ip : 192.168.37.200
所有镜像都是官方镜像 版本：latest
prometheus 3.4.1
grafana v12.0.1
alertmanager 0.28.1

# 创建Prometheus容器

## 创建配置文件

选择目录创建prometheus.yml，是prometheus的配置文件，等下挂载它，内容如下

```YAML
global:
  scrape_interval: 15s 
  evaluation_interval: 15s



alerting:
  alertmanagers:
    - static_configs:
        - targets:
            #- "192.168.37.200:9103"


rule_files:
  
  # - "first_rules.yml"
  # - "second_rules.yml"


scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]
      
   
```

## 创建告警规则目录（不需要告警可以忽略这一步）

选择目录创建一个告警规则的文件夹用来放告警的规则，比如

![image.png](https://raw.githubusercontent.com/zebytes/images/main/20250618182153363.png)

## 启动prometheus

启动prometheus，如果不需要告警可以不挂载告警规则对应文件夹

```Bash
docker run --name prometheus -d  --user root \
-p 9100:9090 \ 
--restart=always \
-v ./WangZe/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml \
-v ./WangZe/prometheus/prometheusAlertRules/:/root/prometheusRules/ \
prom/prometheus
```

> 容器创建成功后，即可通过浏览器访问 <http://192.168.37.200:9100> 可看到Prometheus默认的UI界面
>![image.png](https://raw.githubusercontent.com/zebytes/images/main/20250618182220024.png)


# 创建Grafana容器

Grafana是一个跨平台开源的度量分析和可视化工具，可以通过将采集的数据可视化的展示

```Java
docker run -d --name=grafana --user root\
-p 9101:3000 \
-v ./WangZe/grafana/:/var/lib/grafana/ \
grafana/grafana
```

`-v ./WangZe/grafana/:/var/lib/grafana/` 是用于持久化 Grafana 的数据文件：Grafana 在运行时会生成各种数据，比如用户配置、仪表盘、插件数据等

> 容器创建成功后，即可通过浏览器访问 <http://192.168.37.200:9101> 可看到Grafana界面
> ![image.png](https://raw.githubusercontent.com/zebytes/images/main/20250618182955311.png)



# 监控Linux

## 安装Node_exporter

因为Prometheus 本身不具备监控功能，所以想要通过Prometheus 收集数据的话，需要安装对应的exporter

Exporter 的核心功能是采集数据并格式化，使其可以被 Prometheus 等监控工具使用

```Bash
docker run -d --name=node-exporter \
--restart=always \
-p 9102:9100 \
-v "/proc:/host/proc:ro" \
-v "/sys:/host/sys:ro" \
-v "/:/rootfs:ro" \
prom/node-exporter
```

挂载的路径是linux内部硬件、内存等信息的路径（好像也可以不用显示挂载，它可能默认挂载）

> 容器创建成功后，即可通过浏览器访问 <http://192.168.37.200:9102/metrics> 来验证查看监控收集的数据
>![image.png](https://raw.githubusercontent.com/zebytes/images/main/20250618182418886.png)



## 配置 Prometheus 监控Node节点

修改Prometheus主配置文件，在prometheus.tml配置文件按以下内容修改：

```YAML
scrape_configs:
  - job_name: "prometheus"

    # metrics_path defaults to '/metrics'
    # scheme defaults to 'http'.

    static_configs:
      - targets: ["localhost:9090"]
      
##########################新增部分###########################

  - job_name: "linux"                     #任务名称随便填了
    static_configs:
    - targets: ['192.168.37.200:9102']    #node-exporter的地址
      labels:
        instance: local-centos
##########################新增部分###########################
```

重启Prometheus容器

```Java
docker restart prometheus
```

访问prometheus然后能在对应页面看到对应的配置

![image.png](https://raw.githubusercontent.com/zebytes/images/main/20250618182453560.png)


# 配置Grafana可视化界面

页面可能由于版本，镜像源不同导致页面不一样，可能也就是按钮不一样吧，大概找找就行

## 配置数据源

![image.png](https://raw.githubusercontent.com/zebytes/images/main/20250618182509282.png)

![image.png](https://raw.githubusercontent.com/zebytes/images/main/20250618182518157.png)

Name可以随便写、或者默认，然后填一个Prometheus的URL就好

![image.png](https://raw.githubusercontent.com/zebytes/images/main/20250618182542898.png)

## 新建仪表盘

![image.png](https://raw.githubusercontent.com/zebytes/images/main/20250618182553436.png)


![image.png](https://raw.githubusercontent.com/zebytes/images/main/20250618182601416.png)


可以去 <https://grafana.com/grafana/dashboards/> 找想用的仪表盘

比如这个是Linux的

![image.png](https://raw.githubusercontent.com/zebytes/images/main/20250618182611306.png)


输入id然后加载
![image.png](https://raw.githubusercontent.com/zebytes/images/main/20250618182624415.png)

最后选择一下数据源就好了
![image.png](https://raw.githubusercontent.com/zebytes/images/main/20250618182630431.png)

找到刚刚的仪表盘即可看到对应的数据
![image.png](https://raw.githubusercontent.com/zebytes/images/main/20250618182636096.png)

# 监控多个Linux

也可以在前面基础上再加一个

```YAML
  - job_name: "linux"
    static_configs:
    - targets: ['192.168.37.200:9102']
      labels:
        instance: local-centos
############更改部分##############
    - targets: ['--.--.--.--:----']         
      labels:
        instance: linux2

  
```

对应的效果就是这样，他们属于同一个Job，但是有两个实例
![image.png](https://raw.githubusercontent.com/zebytes/images/main/20250618182642570.png)

# 监控Redis

## 安装Redis_exporter

```Bash
docker run -d --name redis-exporter -p 9093:9121 oliver006/redis_exporter --redis.addr redis://39.102.215.159:6379 --redis.password 'yourpassword'
```

## 配置 Prometheus 监控Node节点

修改prometheus.yml文件

```Java
  - job_name: 'redis-exporter'
    static_configs:
      - targets: ['192.168.37.200:9093']
        labels:
          instance: redis-prod-1  # 建议改为实际Redis实例名称
```

重启Prometheus

```Bash
docker restart prometheus
```

# 配置告警

## 创建Alertmanager容器

### 创建配置文件,配置邮件告警

AlertManager 默认配置文件为 alertmanager.yml，QQ邮箱实例

```YAML
# 全局配置部分
global:
  # 解析超时时间设置为5分钟
  resolve_timeout: 5m
  # SMTP 发件人邮箱地址
  smtp_from: '发件人邮箱地址'
  # SMTP 服务器地址和端口 (QQ邮箱的SMTP服务器)
  smtp_smarthost: 'smtp.qq.com:465'
  # SMTP 认证用户名 (通常与发件人邮箱相同)
  smtp_auth_username: '2258702249@qq.com'
  # SMTP 认证密码 (通常是QQ邮箱的授权码，而非登录密码)
  smtp_auth_password: 'QQ邮箱的授权码'
  # 是否要求TLS加密连接，这里设置为false表示不强制要求
  smtp_require_tls: false
  # HELO/EHLO命令发送的域名，通常设置为SMTP服务器域名
  smtp_hello: 'qq.com'

# 警报路由配置部分
route:
  # 按警报名称分组
  group_by: ['alertname']
  # 分组等待时间：5秒，即等待5秒看是否有相同group_by字段的警报
  group_wait: 10s
  # 分组间隔时间：5秒，即每5秒检查一次是否有新的同组警报
  group_interval: 5s
  # 重复通知间隔：5分钟，即警报解决后5分钟内不会再次发送已解决通知
  repeat_interval: 5m
  # 该路由规则匹配的警报将发送到名为'email'的接收器
  receiver: 'email'

# 接收器配置部分
receivers:
- name: 'email'  # 接收器名称
  email_configs:
  - to: '收件人邮箱地址'  # 收件人邮箱地址
    # 是否发送警报已解决的通知，这里设置为true表示会发送
    send_resolved: true

# 警报抑制规则部分
inhibit_rules:
  - source_match:
      severity: 'critical'  # 当存在严重级别为'critical'的警报时
    target_match:
      severity: 'warning'   # 抑制严重级别为'warning'的警报
    equal: ['alertname', 'dev', 'instance']  # 只有当警报名称、dev和instance标签完全相同时才应用抑制规则
```

### 启动Alertmanager

在容器内路径为 `/etc/alertmanager/alertmanager.yml`

```Bash
docker run -d --name alertmanager -p 9103:9093 \
-v ./WangZe/prometheus/alertmanager/alertmanager.yml:/etc/alertmanager/alertmanager.yml \
prom/alertmanager
```

## 配置Prometheus告警

### 添加规则

在之前的告警规则目录中创建规则文件，我用的是 .yml 格式，.rules 好像也可以
![image.png](https://raw.githubusercontent.com/zebytes/images/main/20250618182652920.png)

然后重启容器

```Bash
docker restart alertmanager
```

### 修改配置文件

然后修改prometheus.yml文件

```YAML
global:
  scrape_interval: 15s
  evaluation_interval: 15s 
  
alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - "192.168.37.200:9103"   #####配置为刚刚的Alertmanager地址

# 
rule_files:
  - "/root/prometheusRules/*.yml"    ####配置为刚刚设置的容器内部的放规则文件的路径
```

记得重启容器，然后可以看到Prometheus控制台出现了对应规则

```Bash
docker restart prometheus
```
![image.png](https://raw.githubusercontent.com/zebytes/images/main/20250618182658127.png)
