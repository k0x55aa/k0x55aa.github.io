---
layout: post
title: "IOT/Hardware NOTES"
categories: hardware
author:
- k0x55aa
meta: "hardware"
---


## Binwalk

The operating system deletes system files directory such as `/sys` `/proc` `/dev`. To preserve the sym links when extracting rootfs with binwalk we use 

```
binwalk --perserve-symlinks -e <firmware file>
```

## Qemu

Quick static binary emulation

```
qemu-arm-static -L arm-rootfs ./staticbinary
```
