+++
title = "headscale"
date = "2026-05-31"
draft = false

[taxonomies]
tags = ["headscale"]
series = ["headscale", "vps"]
+++
# vps上安装

## 第三方安装
github.com/hwdsl2/docker-headscale

docker compose down

docker compose up -d

## 检查是否正常

docker logs -f headscale


# 常用命令

## 检查版本
docker image ls | grep headscale
## 检查数据
docker volume ls | grep headscale
## 移除数据
docker volume rm headscale_headscale-data

docker volume rm headscale_headscale_headscale-data
## 检查网络
docker network ls | grep headscale
## 移除网络
docker network rm headscale_default

## 移除版本
docker rmi -f headscale/headscale:latest

docker rmi -f headscale/headscale:0.28.0

docker rmi -f headscale/headscale

docker rmi -f hwdsl2/headscale-server:latest

docker compose down -v
docker compose up -d --force-recreate
docker logs -f headscale

docker compose down -v
docker rm -f headscale
docker compose up -d
docker logs -f headscale

## 删除未使用镜像，删除未使用网络，删除 build cache
docker system prune -a -f

docker volume create headscale_headscale-data

关键验证
docker exec -it headscale cat /config.yaml

查找设备
docker exec headscale headscale nodes list

## 查询admin
docker exec headscale headscale users list

## 查询全部
docker exec headscale headscale nodes list

## vps给windows管理员打标签 假设设备是3

docker exec headscale headscale nodes tag -i 3 -t tag:admin

## N1第一次安装headscale

tailscale up --login-server=https://headscale.serbia70.com --authkey 这里是token --reset


## 给设备命名为n2
开始就命名

```
tailscale up --login-server=https://headscale.serbia70.com --authkey <这里输入你的token> --reset --hostname=n2
```

在 Headscale 服务端进行重命名

登录您的 Headscale 服务器，查看刚才注册的 N1 盒子的 ID
```
headscale nodes list
```
docker安装headscale的命令查询
```
docker exec headscale headscale nodes list
```

使用重命名命令（假设查出来的 N1 盒子 ID 为 1）：
```
headscale nodes rename --identifier 1 n2
```

```
docker exec headscale headscale nodes rename --identifier 1 n2
```


## N1检查错误
journalctl -u tailscaled -n 20 --no-pager

## tailscale 升级到 headscale

登出原有的 Tailscale 账号
```
tailscale logout
```
彻底清理旧的缓存状态
```
systemctl stop tailscaled
rm -rf /var/lib/tailscale/tailscaled.state
systemctl start tailscaled
```
注册
```
tailscale up --login-server https://你的headscale域名.com --authkey 刚才复制的key
```


# VPS

## vps创建admin 

headscale users create admin

## 查id
headscale users list

## 生成预授权 Key（365 天有效，假设id:1）
headscale preauthkeys create --user 1 --reusable --expiration 8760h

## vps安装tailscale
curl -fsSL https://tailscale.com/install.sh | sh

tailscale up --login-server https://headscale.你的网址.com --authkey <刚才的key>

## 确认运行
systemctl status headscale | head -5

## 确认 8081 端口在监听
ss -tlnp | grep 8081

## 测试本地 HTTPS 访问
curl -k https://headscale.你的网址.com/health

curl http://127.0.0.1:8081/health

如果返回 {"status":"pass"} 或类似内容，说明 NPM 反代 + SSL + Headscale 全通了



## VPS检查错误

journalctl -u headscale -n 30 --no-pager

# windows

## 重启
systemctl restart headscale

## 检查

systemctl status headscale

## 管理员 PowerShell

### 彻底停止
net stop Tailscale
taskkill /f /im tailscaled.exe 2>$null
taskkill /f /im tailscale.exe 2>$null

### 清掉旧注册状态
Remove-Item -Recurse -Force "$env:ProgramData\Tailscale" -ErrorAction SilentlyContinue

### 重启服务

```
net start Tailscale
```







