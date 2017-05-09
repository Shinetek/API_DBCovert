# API_DBCovert
api 转化 mongodb 的一个小程序

说明
 ###进程1：
    pm2 显示名称
     "name": "fy4a_app",
    pm2 运行文件
     "script":"./fy4a_app.js"     
    pm2 说明
       实现如下URL转化
       http://10.24.240.73:8080/_ds/mcs/faultlog/stat?date=20170426  // 分系统的故障状态 
       http://10.24.240.73:8080/_ds/mcs/task/stat?date=20170426&time=031033 // 任务状态 
       http://10.24.240.73:8080/_ds/mcs/task/near/agri?date=20170426&time=031033 // 任务的当前 已完成 下一个的状态
       http://10.24.240.73:8080/_ds/mcs/resource/dts_station?date=20170426&time=031417 // 分系统的设备状态
    mongodb：
    
    
       
	   
 ### 进程2
    pm2 显示名称
    "name": "fy4a_Level_1_CNS"
    pm2 运行文件
    "script": "./fy4a_Level_1_CNS.js"
    pm2 说明
    实现如下URL转化

### 进程3
 
    pm2 显示名称
      "name": "fy4a_Level_1_CVS"
      pm2 运行文件
    "script": "./fy4a_Level_1_CVS.js"
     pm2 说明
       实现如下URL转化

### 进程4
     
       pm2 显示名称
  "name": "fy4a_Level_1_DSS"
       pm2 运行文件
  "script": "./fy4a_Level_1_DSS.js",
  pm2 说明
       实现如下URL转化
   
 ### 进程1
   pm2 显示名称
  "name": "fy4a_Level_1_DTS",
       pm2 运行文件
  "script": "./fy4a_Level_1_DTS.js",
  pm2 说明
       实现如下URL转化
   
 ### 进程1
   pm2 显示名称
  "name": "fy4a_Level_1_MCS",
       pm2 运行文件
  "script": "./fy4a_Level_1_MCS.js",
  pm2 说明
       实现如下URL转化
 
 ### 进程1
   pm2 显示名称
 
  "name": "fy4a_Level_1_MRS",
       pm2 运行文件
  "script": "./fy4a_Level_1_MRS.js",
  pm2 说明
       实现如下URL转化
 
 ### 进程1
   pm2 显示名称
    "name": "fy4a_Level_1_NRS",
	     pm2 运行文件
  "script": "./fy4a_Level_1_NRS.js",
  pm2 说明
       实现如下URL转化
  
    ### 进程1
  
  
    pm2 显示名称
  "name": "fy4a_Level_1_PGS",
       pm2 运行文件
  "script": "./fy4a_Level_1_PGS.js",
  pm2 说明
       实现如下URL转化
   
 ### 进程1
   pm2 显示名称
  "name": "fy4a_Level_1_SWS",
       pm2 运行文件
  "script": "./fy4a_Level_1_SWS.js",
  pm2 说明
       实现如下URL转化
   
 ### 进程1
 
   pm2 显示名称
  "name": "fy4a_Level_2_CNS",
       pm2 运行文件
  "script": "./fy4a_Level_2_CNS.js",
  pm2 说明
       实现如下URL转化
   
 ### 进程1
   pm2 显示名称
  "name": "fy4a_Level_2_CVS",
       pm2 运行文件
  "script": "./fy4a_Level_2_CVS.js",
  pm2 说明
       实现如下URL转化
   
 ### 进程1
   pm2 显示名称
  "name": "fy4a_Level_2_DSS",
       pm2 运行文件
  "script": "./fy4a_Level_2_DSS.js",
  pm2 说明
       实现如下URL转化
  
  
   ### 进程1
 
   pm2 显示名称
  "name": "fy4a_Level_2_DTS",
       pm2 运行文件
  "script": "./fy4a_Level_2_DTS.js",
  pm2 说明
       实现如下URL转化
	   
   ### 进程1
   pm2 显示名称
 
  "name": "fy4a_Level_2_MCS",
       pm2 运行文件
  "script": "./fy4a_Level_2_MCS.js",
  pm2 说明
       实现如下URL转化
	   
   ### 进程1
   pm2 显示名称
 
  "name": "fy4a_Level_2_MRS",
       pm2 运行文件
  "script": "./fy4a_Level_2_MRS.js",
  pm2 说明
       实现如下URL转化
   
 ### 进程1  
 pm2 显示名称
 
  "name": "fy4a_Level_2_NRS",
       pm2 运行文件
  "script": "./fy4a_Level_2_NRS.js",
  pm2 说明
       实现如下URL转化
  
   ### 进程1
   pm2 显示名称
 
  "name": "fy4a_Level_2_PGS",
       pm2 运行文件
  "script": "./fy4a_Level_2_PGS.js",
  pm2 说明
       实现如下URL转化
	   
   ### 进程1
   pm2 显示名称
 
  "name": "fy4a_Level_2_SWS",
       pm2 运行文件
  "script": "./fy4a_Level_2_SWS.js",
  pm2 说明
       实现如下URL转化
   
 ### 进程1
   pm2 显示名称
  "name": "fy4a_tasklist",
       pm2 运行文件
  "script": "./fy4a_tasklist.js",
  pm2 说明
       实现如下URL转化
	   
 ### 进程1
   pm2 显示名称
  "name": "fy4a_taskdetail",
       pm2 运行文件
  "script": "./fy4a_taskdetail.js",
  pm2 说明
       实现如下URL转化
   
 
