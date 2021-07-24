
class CodedError extends Error {
  constructor (message = '未知错误', code = -1) {
    super(message)
    this.code = code
  }
}

/**
   * @description: 放回请求接口失败原因
   * @return {*}
   * @param {*} code 错误码
   * @param {*} msg 错误信息
   * @param {*} data 错误data
   */
  function handleError(code,msg,data) {
      const dataJson = {
          code:code||'999E',
          msg:JSON.stringify(msg)||'系统异常',
          data:{}
      }
      return dataJson
 }

module.exports = {
  CodedError,
  handleError,
  /**
   * 拒绝访问构造函数
   */
  ForbiddenError: class ForbiddenError extends CodedError {
    constructor (message = '拒绝访问') {
      super(message, 403)
    }
  },
  /**
   * 无效的参数构造函数
   */
  InvalidQueryError: class InvalidQueryError extends CodedError {
    constructor (message = '无效的参数',code='999E') {
      super(message, code)
    }
  }

  
  
}
