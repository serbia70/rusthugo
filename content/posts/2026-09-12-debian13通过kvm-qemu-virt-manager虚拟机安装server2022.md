+++
title = "debian13通过KVM + QEMU + Virt-Manager虚拟机安装server2022"
date = "2026-09-13"
draft = false

[taxonomies]
tags = []
series = []
+++
将你日常使用的普通用户名（假设为 your_username）加入 libvirt 和 kvm 用户组，后续使用时无需每次都输入 root 密码：

```
sudo usermod -aG libvirt,kvm your_username
```

从 Fedora 官方镜像源下载预编译好的 virtio-win.iso 驱动包（保存到 Downloads 目录）
```
wget https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/stable-virtio/virtio-win.iso -O ~/Downloads/virtio-win.iso
```

在终端运行
```
virt-manager
```

挂载 VirtIO 驱动 ISO

点击左下角的 添加硬件 (Add Hardware) -> 选择 Storage (存储)。

设备类型选择：IDE cdrom 或 SATA cdrom。

点击 选择自定义存储 -> 点击 浏览 -> 本地浏览。

选择你刚刚下载好的驱动文件：/home/chenan/Downloads/virtio-win.iso。

点击 完成。

安装64位windows系统，内存设置4096和以上会导致鼠标键盘不能使用

解决这个问题需要将固件模式改为 UEFI


解决两个系统之间的文字复制粘贴

在 Windows 桌面双击打开 “此电脑”。

找到并双击打开 virtio-win 光盘驱动器（就是我们最开始挂载的驱动光盘）。

在光盘目录里找到 virtio-win-guest-tools.exe 这个安装包，双击运行它。

一路点击 Next (下一步) -> Install (安装) 完成安装。

安装完成后，重启 Windows 虚拟机。

报错 Error: 800070422 无法启动服务 指出：Windows 系统中的 VSS（Volume Shadow Copy，卷影复制服务）被禁用，导致 installer 部署 QEMU VSS Provider 时卡死崩溃。

在 Windows 虚拟机中按下 Win + R 打开运行窗口，输入 services.msc 并回车。

在列表中找到 Volume Shadow Copy（中文名：卷影复制）。

双击打开，将 启动类型 从“禁用”修改为 手动 或 自动，点击 应用 -> 确定。






解决两个系统之间的文件复制粘贴
https://www.spice-space.org/download.html

点击下载 spice-guest-tools-latest.exe。

下载后双击运行安装，一路点击 Next -> Install。

重启虚拟机。


使用 Virt-Manager 原生 VirtFS (9P) 共享文件夹

如果你不想配置 Samba 网络协议，可以利用 QEMU/KVM 虚拟化自带通道直接映射文件夹：

彻底关闭 Windows 虚拟机。

在 Virt-Manager 配置界面中，点击左下角 添加硬件 -> 选择 文件系统 (Filesystem)。

参数设置：
 驱动 (Driver): virtiofs (或 default)

 源路径 (Source path): 选择 Debian 上的本地目录（如 /home/yourname/share）。

  目标路径 (Target path): 输入标志名称（如 hostshare）。

  开机后在 Windows 安装 virtiofs 驱动（在 virtio-win.iso 中的 virtio-win-guest-tools 默认已集成），即可在 Windows 的“网络”中读取该共享挂载点

开启 Windows 共享服务
Windows 虚拟机内

开机进入 Windows Server 2022，按下 Win + R 输入 services.msc：

找到 VirtIO-FS Service，将其启动类型改为 自动 并点击 启动。

设置完成后，打开 Windows 的 此电脑，就会多出一个如同本地硬盘一样的“网络驱动器”，Windows 和 Debian 双方把文件往里放，就能实现双向实时文件传送。

安装 WinFSP 依赖

https://winfsp.dev/rel/

下载安装

WinFSP 安装好之后：再次按下 Win + R 输入 services.msc 回车。找到 VirtIO-FS Service，右键点击 -> 启动。此时服务将瞬间成功启动，不会再报错！4.4. 访问 Debian 共享文件：大功告成。打开 Windows 的 此电脑，你会发现多出了一个 Z: 盘







