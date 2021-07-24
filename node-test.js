

const diskinfo = require('diskinfo');
const os = require('os');
//当前盘符
const current_disk = __dirname.substr(0,2).toLowerCase();
 
//获得所有磁盘空间
diskinfo.getDrives((err, aDrives)=>{
      
      //遍历所有磁盘信息
      for (let i = 0; i < aDrives.length; i++) {
           
           console.log("磁盘符",aDrives[i])
      }
 
});

console.log("操作系统OS",os.version())
