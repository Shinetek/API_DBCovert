# API_DBCovert
api 转化 mongodb 的一个小程序

 ----------
###进程1：基础信息
    pm2 显示名称
    "name": "fy4a_app",
    pm2 运行文件
    "script":"./fy4a_app.js"     
    pm2 说明       
    /_ds/mcs/faultlog/stat?date=20170426  // 分系统的故障状态 
    /_ds/mcs/task/stat?date=20170426&time=031033 // 任务状态 
    /_ds/mcs/task/near/agri?date=20170426&time=031033 // 任务的当前 已完成 下一个的状态
    /_ds/mcs/resource/dts_station?date=20170426&time=031417 // 分系统的设备状态 

----------
### 进程2   一级故障
    pm2 显示名称
    "name": "fy4a_level_1"
    pm2 运行文件
    "script": "./fy4a_level_1.js"
    pm2 说明
    

### 进程3  一级故障
 
    pm2 显示名称
      "name": "fy4a_level_2"
    pm2 运行文件
    "script": "./fy4a_level_2.js"
        pm2 说明
     调用process
        faultlevelF.js
       实现如下URL转化

### 进程4 任务列表
     
       pm2 显示名称
      "name": "fy4a_Level_1_DSS"
       pm2 运行文件
      "script": "./fy4a_Level_1_DSS.js",
      pm2 说明
       实现如下URL转化
   
### 进程5 任务详情

     pm2 显示名称
    "name": "fy4a_Level_1_DTS",
       pm2 运行文件
    "script": "./fy4a_Level_1_DTS.js",
     pm2 说明
       实现如下URL转化
   
  