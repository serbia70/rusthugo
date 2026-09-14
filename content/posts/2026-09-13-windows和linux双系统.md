+++
title = "windows和linux双系统"
date = "2026-09-14"
draft = false

[taxonomies]
tags = []
series = []
+++

硬盘分区
sudo apt update && sudo apt install -y gparted


挂载 Debian 分区

```
sudo mount /dev/sda1 /mnt
```

```
for i in /dev /dev/pts /proc /sys /run; do sudo mount -B $i /mnt$i; done
```
(注：如果你的 Debian 不是安装在 sda1，请把 sda1 换成实际的分区，比如 sda2 或 sda3)
查询 lsblk     看容量

进入硬盘上的 Debian 系统
```
sudo chroot /mnt
```
安装扫描工具
```
apt update && apt install os-prober -y
```

开启扫描 Windows 功能（核心一步！）
```
echo "GRUB_DISABLE_OS_PROBER=false" >> /etc/default/grub
```

重新生成引导菜单
```
update-grub
```




重新安装 GRUB 引导并自动识别 Windows 10
```
grub-install /dev/sda
```

```
apt update && apt install os-prober -y
```

```
sed -i 's/#\?GRUB_DISABLE_OS_PROBER=.*/GRUB_DISABLE_OS_PROBER=false/' /etc/default/grub
```

```
update-grub
```
(注意：在运行 update-grub 后，屏幕上显示 Found Windows 10 就说明成功了！)

退出并重启

```
exit
```

```

sudo reboot
```









# Windows 和 Linux 双系统引导修复与安装指南

在单块 Legacy/MBR 硬盘上部署 Windows 与 Debian 双系统后，如果 Windows 覆盖了主引导记录（MBR），可以通过以下步骤恢复 GRUB 引导并自动识别 Windows 系统。

---

## 1. 硬盘分区查看（可选）

如需图形化调整分区，可在 Live 环境中安装并运行 GParted：

`` `bash
sudo apt update && sudo apt install -y gparted
` ``

---

## 2. 挂载 Debian 系统分区

启动 Linux Live U 盘进入桌面，打开终端，挂载原本安装在硬盘上的 Debian 根分区及系统虚拟目录：

`` `bash
# 挂载根分区（注意：请根据实际情况调整盘符，如 /dev/sda2 或 /dev/sda3）
sudo mount /dev/sda1 /mnt

# 挂载虚拟文件系统以准备 chroot
for i in /dev /dev/pts /proc /sys /run; do sudo mount -B $i /mnt$i; done
` ``

---

## 3. 进入 chroot 硬盘环境

切换根目录环境，直接管理硬盘上的 Debian 系统：

`` `bash
sudo chroot /mnt
` ``

---

## 4. 重新安装 GRUB 引导与配置 Windows 识别

在 `chroot` 环境（`root@debian:/#`）下执行以下完整命令：

`` `bash
# 1. 将 GRUB 安装回硬盘 MBR（注意是主盘 /dev/sda，不要带分区数字）
grub-install /dev/sda

# 2. 安装系统扫描工具 os-prober
apt update && apt install os-prober -y

# 3. 开启 os-prober 自动扫描 Windows 功能
sed -i 's/#\?GRUB_DISABLE_OS_PROBER=.*/GRUB_DISABLE_OS_PROBER=false/' /etc/default/grub

# 4. 重新生成 GRUB 引导菜单
update-grub
` ``

> **注意**：执行 `update-grub` 后，如果终端最后显示 `Found Windows 10 on /dev/sdaX`，即说明成功检测到了 Windows 引导项！

---

## 5. 退出并重启

完成上述修复后，依次退出环境并重启电脑：

`` `bash
# 退出 chroot 环境
exit

# 重启电脑
sudo reboot
` ``

> **提示**：拔掉 U 盘，重启系统后即可看到包含 Debian 13 和 Windows 10 的 GRUB 双系统启动选择菜单。









硬盘分区

```
sudo apt update && sudo apt install -y gparted

```

挂载 Debian 分区

```
sudo mount /dev/sda1 /mnt

```

```
for i in /dev /dev/pts /proc /sys /run; do sudo mount -B $i /mnt$i; done

```

(注：如果你的 Debian 不是安装在 sda1，请把 sda1 换成实际的分区，比如 sda2 或 sda3)
查询 lsblk     看容量

进入硬盘上的 Debian 系统

```
sudo chroot /mnt

```

安装扫描工具

```
apt update && apt install os-prober -y

```

开启扫描 Windows 功能（核心一步！）

```
echo "GRUB_DISABLE_OS_PROBER=false" >> /etc/default/grub

```

重新生成引导菜单

```
update-grub

```

重新安装 GRUB 引导并自动识别 Windows 10

```
grub-install /dev/sda

```

```
apt update && apt install os-prober -y

```

```
sed -i 's/#\?GRUB_DISABLE_OS_PROBER=.*/GRUB_DISABLE_OS_PROBER=false/' /etc/default/grub

```

```
update-grub

```

(注意：在运行 update-grub 后，屏幕上显示 Found Windows 10 就说明成功了！)

退出并重启

```
exit

```

```

sudo reboot

```

















