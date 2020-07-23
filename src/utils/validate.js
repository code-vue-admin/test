/**
 *过滤特殊字符
 **/
export function stripscript(str) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{ }【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < str.length; i++) {
        rs = rs+str.substr(i,1).replace(pattern, '');
    }
    return rs;
}
/**
 *验证邮箱
 **/
export function validateEmail(value) {
    let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    return !reg.test(value) ? true : false
}
/**
 *验证密码 6-20位的数字加字母
 **/
export function validatePassword(value) {
    let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
    return !reg.test(value) ? true : false
}
/**
 *验证验证码
 **/
export function validateCode(value) {
    let reg = /^[a-z0-9]{6}$/;
    return !reg.test(value) ? true : false
}
/**
 * 没有使用 default时，可以同时定义多个export
 * 文件import需要花括号
 * */