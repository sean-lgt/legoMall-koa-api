
const moment = require('moment');
const { handleError,InvalidQueryError } = require("../utils/error")
const userModel = require('../models/mall-app-user')
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const md5 = require('js-md5'); // 密码加密
const path = require('path');
const fs = require('fs');

const uploadFilePublic = function(ctx,next,files,flag){
    const uploadUrl = "/uploadImg/";
    const filePath = path.join(__dirname,'../public/uploadImg/')
    let file = '';
    let fileReader = '';
    let fileResource = '';
    let writeStream = '';
    let newFileName = '';
    const fileFunc = function(file){
        //读取文件流
        fileReader = fs.createReadStream(file.path);
        //组装成绝对路径
        //  let fileName='';
        //  for (let i = 0; i < 6; i++) //6位随机数，用以加在时间戳后面。
        //  {
        //    fileName += Math.floor(Math.random() * 10);
        //  }
        //  fileName = new Date().getTime() + fileName;  //时间戳，文件名。
        let lastIndex = file.name.lastIndexOf('.');
        let suffixType = file.name.substring(lastIndex, file.name.length);
        console.log('文件类型',suffixType);
        newFileName = new Date().getTime()+suffixType; 
        const fileResource = filePath + newFileName;   
        // 使用 createWriteStream 写入数据，然后使用管道流 pipe 拼接
        const writeStream = fs.createWriteStream(fileResource);
        fileReader.pipe(writeStream);
    };
    const returnFunc =async function(flag){
        console.log(flag);
        console.log(files);
        if(flag){
            let url = '';
            for(let i = 0;i<files.length;i++){
            //    let fileName='';
            //    for (let j = 0; j < 6; j++) //6位随机数，用以加在时间戳后面。
            //    {
            //      fileName += Math.floor(Math.random() * 10);
            //    }
            //    fileName = new Date().getTime() + fileName;  //时间戳，文件名。
               let lastIndex = files[i].name.lastIndexOf('.');
               let suffixType = files[i].name.substring(lastIndex, files[i].name.length);
                console.log('文件类型',suffixType);
               const fileName = new Date().getTime()+suffixType; 
            //    const fileName = new Date().getTime()+`${files[i].name}`;
               url += uploadUrl + fileName;
            }
            url = url.replace(/,$/gi, "");
            
            ctx.body = {
              url: url,
              code: 0,
              message: '上传成功'
            };
        }else{
            //  let fileName='';
            //  for (let i = 0; i < 6; i++) //6位随机数，用以加在时间戳后面。
            //  {
            //    fileName += Math.floor(Math.random() * 10);
            //  }
            // fileName = new Date().getTime() + fileName;  //时间戳，文件名。
            //  let lastIndex = files.name.lastIndexOf('.');
            //    let suffixType = files.name.substring(lastIndex, files.name.length);
            //     console.log('文件类型',suffixType);
            //    const fileName = new Date().getTime()+suffixType; 
            // const fileName = new Date().getTime()+`${files.name}`;
            ctx.body = {
                "code": 200,
                "msg": "",
                "data": {
                    url: uploadUrl + newFileName
                }
            }
            // ctx.result={
            //     url: uploadUrl + newFileName,
            // }
            // await next();
        }
    };

    if(flag){
        // 多个文件上传
       for (let i = 0; i < files.length; i++) {
          const f1 = files[i];
          fileFunc(f1);
       }
    }else{
        fileFunc(files);
    }

    // 判断 /static/upload 文件夹是否存在，如果不在的话就创建一个
    if (!fs.existsSync(filePath)) {
      fs.mkdir(filePath, (err) => {
        if (err) {
          throw new Error(err);
        } else {
          returnFunc(flag);
        }
      });
    } else {
      returnFunc(flag);
    }
}

const uploadImg =  function(ctx,next){
    ctx.set("Content-Type", "application/json")
    let abc = ctx.request.body
    console.log("上传图片",ctx.request.files)
    let files = ctx.request.files.file;
    const fileArrs = [];
    if(files === undefined){
         throw new InvalidQueryError('请正确上传图片且单次只能传一张',"9999eee")
    }else if(files.length === undefined) {
      // 上传单个文件，它不是数组，只是单个的对象
       uploadFilePublic(ctx,next,files, false);
    } 
}

module.exports = {
    uploadImg
};