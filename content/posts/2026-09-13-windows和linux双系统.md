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









本文档记录在单块硬盘（Legacy BIOS / MBR 结构）上部署 Windows 10 与 Debian 13 双系统后，因安装或覆盖 Windows 导致 MBR 主引导记录丢失时，通过 Debian Live 环境恢复 GRUB 双系统引导的完整过程。

---

## 1. 硬盘分区查看（可选）

如需图形化查看或调整分区状态，可在 Live 环境中安装并运行 GParted：

```bash
sudo apt update && sudo apt install -y gparted

```

> **提示**：如果在终端中不清楚具体的磁盘盘符，可以随时运行 `lsblk -f` 查看容量大小与文件系统格式（如 `ext4`）。

---

## 2. 挂载 Debian 系统分区

启动 Linux Live U 盘进入桌面，打开终端，挂载原本安装在硬盘上的 Debian 根分区以及系统虚拟运行目录：

```bash
# 挂载根分区（注意：请根据实际情况调整盘符，如 /dev/sda2 或 /dev/sda3）
sudo mount /dev/sda1 /mnt

# 绑定挂载系统虚拟文件系统以准备 chroot
for i in /dev /dev/pts /proc /sys /run; do sudo mount -B $i /mnt$i; done

```

*(注：如果你的 Debian 不是安装在 sda1，请把 sda1 替换为实际的分区名字。)*

---

## 3. 进入 chroot 硬盘环境

切换根目录环境，直接以 root 身份接管并管理硬盘上的真实 Debian 系统：

```bash
sudo chroot /mnt

```

---

## 4. 重新安装 GRUB 引导与配置 Windows 识别

在 `chroot` 环境（终端提示符变为 `root@debian:/#`）下执行以下完整步骤，将 GRUB 刷回 MBR 并开启对 Windows 系统的自动扫描：

```bash
# 1. 将 GRUB 安装回主硬盘 MBR（注意是整个磁盘 /dev/sda，不要带数字）
grub-install /dev/sda

# 2. 安装双系统引导扫描工具 os-prober
apt update && apt install os-prober -y

# 3. 开启 os-prober 自动扫描 Windows 功能（核心步骤！）
sed -i 's/#\?GRUB_DISABLE_OS_PROBER=.*/GRUB_DISABLE_OS_PROBER=false/' /etc/default/grub

# 4. 重新生成 GRUB 配置文件
update-grub

```

> **注意**：执行 `update-grub` 后，观察终端输出。如果最后显示 `Found Windows 10 on /dev/sdaX`，即说明已成功检测并添加了 Windows 引导项！

---

## 5. 退出并重启

完成上述修复后，依次退出 chroot 环境并重启电脑：

```bash
# 退出 chroot 环境
exit

# 重启电脑
sudo reboot

```

> **提示**：重启时请拔掉 Live U 盘，系统启动后即可看到包含 Debian 13 与 Windows 10 的 GRUB 双系统选择菜单。












