+++
title = "cloudflared tunnel"
date = "2026-06-01"
draft = false

[taxonomies]
tags = ["cloudflared"]
series = ["cloudflared"]
+++

cloudflared.exe tunnel login

ps -ef | grep cloudflared

N1盒子安装docker
curl -fsSL https://get.docker.com/ | sh
# 使用阿里云安装脚本
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun

docker --version

systemctl start docker
systemctl enable docker

```
docker run -d --name cloudflared --restart unless-stopped --network host cloudflare/cloudflared:latest tunnel --no-autoupdate run --token <你的_TOKEN>
```


## windows运行隧道

https://github.com/cloudflare/cloudflared/releases

下载软件改名为cloudflared.exe，按照下面路径

tanmussh.serbia70.com绑定ssh://127.0.0.1:22

```
D: && cd D:\cloudflared && cloudflared.exe access tcp --hostname tanmussh.serbia70.com --url localhost:2222
```
windows通过ssh访问N1
```
ssh root@localhost -p 2222
```







