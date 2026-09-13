+++
title = "debian13通过KVM + QEMU + Virt-Manager虚拟机安装server2022"
date = "2026-09-13"
draft = false

[taxonomies]
tags = []
series = []
+++
将你日常使用的普通用户名（假设为 your_username）加入 libvirt 和 kvm 用户组，后续使用时无需每次都输入 root 密码：

`sudo usermod -aG libvirt,kvm your_username`
