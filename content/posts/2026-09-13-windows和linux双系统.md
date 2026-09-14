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


进入硬盘上的 Debian 系统
```
sudo chroot /mnt
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

