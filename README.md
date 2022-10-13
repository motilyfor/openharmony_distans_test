# ohos_short_range_test
 openharmony short range(wifi,bt,gps) test in shell

安装
hdc shell mount -o rw,remount /

hdc file send 文件路径 /system/app

重启

启动
进入 hdc shell

aa start -b com.motilyfor.testservice -a com.motilyfor.entry.MainAbility

使用
param get [key]	keyname
param set key value	key value
param wait key value	key value value """val"val
param dump	
配置项:
## WIFI

wifi.op	enable

disable

scan

connect

disconnect

isactive

isconnect
wifi.ssid	wifi 名
wifi.psw	wifi 密码
eg: param set wifi.op enable 开启wifi

param set wifi.op disable 关闭wifi

连接wifi 

param set wifi.ssid hyc

param set wifi.psw 12345678

param set wifi.op connect 连接wif (没试过)
