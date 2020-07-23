<template>
    <div class="login">
        <div class="login-warp">
            <ul class="menu-tab">
                <li v-for="item in menuTab" :key="item.id" :class="{'current': item.current}" @click="toggleMenu(item)">{{ item.txt }}</li>
            </ul>
            <!--  表单 start  -->
            <el-form :model="ruleForm" status-icon :rules="rules" ref="loginFrom" class="login-from" size="medium">
                <el-form-item prop="username" class="item-from">
                    <label for="username">邮箱</label>
                    <el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="password" class="item-from">
                    <label for="password">密码</label>
                    <el-input id="password" type="text" v-model="ruleForm.password" autocomplete="off" maxlength="11" minlength="6"></el-input>
                </el-form-item>
                <el-form-item prop="passwords" class="item-from" v-show="model === 'register'">
                    <label>重复密码</label>
                    <el-input type="text" v-model="ruleForm.passwords" autocomplete="off" maxlength="11" minlength="6"></el-input>
                </el-form-item>
                <el-form-item prop="code" class="item-from">
                    <label>验证码</label>
                    <el-row :gutter="10">
                        <el-col :span="15"><el-input v-model="ruleForm.code" maxlength="6" minlength="6"></el-input></el-col>
                        <el-col :span="9">
                            <el-button type="success" class="block" @click="getSms()" :disabled = "codeButtonStatus.status">
                                {{codeButtonStatus.text}} </el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="submitForm('loginFrom')" class="login-top block" :disabled = "loginButtonStatus">{{model === 'login' ? "登录" : "注册"}}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import sha1 from 'js-sha1';
    import { Message } from 'element-ui';
    import { GetSms,Register,Login } from "@/api/login";
    import { reactive,ref,onMounted } from '@vue/composition-api';
    import { stripscript,validateEmail,validatePassword,validateCode } from '@/utils/validate';
    export default {
        //当前的名称
        name:'login',
        // setup(props,context){
        setup(props, { refs,root }){
            //验证用户名
            let validateUsername = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入用户名'));
                } else if (validateEmail(value)){
                    callback(new Error('邮箱输入有误'));
                }else {
                    callback();
                }
            };
            //验证密码
            let validatepassword = (rule, value, callback) => {
                //过滤后的数据
                ruleForm.password = stripscript(value)
                value = ruleForm.password
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else if (validatePassword(value)) {
                    callback(new Error('密码为6至20位数字加字母组成'));
                } else {
                    callback();
                }
            };
            //验证重复密码
            let validatepasswords = (rule, value, callback) => {
                //绝对等于login的时候直接通过
                if (model.value === 'login'){ callback(); }
                //过滤后的数据
                ruleForm.passwords = stripscript(value)
                value = ruleForm.passwords
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value != ruleForm.password) {
                    callback(new Error('重复密码不相同'));
                } else {
                    callback();
                }
            };
            //验证验证码
            let validatecode = (rule, value, callback) => {
                //过滤后的数据
                ruleForm.code = stripscript(value)
                value = ruleForm.code
                if (value === ' ') {
                    return callback(new Error('请输入验证码'));
                }else if (validateCode(value)){
                    return callback(new Error('验证码格式不正确'));
                }else{
                    callback();
                }
            };
            /**
             *声明数据
             */
            //里面放置data数据，生命周期，自定义打函数
            const menuTab = reactive([
                {txt:'登录',current:true,type:'login'},
                {txt:'注册',current:false, type: 'register'}
            ])
            //模块值
            const model = ref('login')
            //登录按钮禁用状态
            const loginButtonStatus = ref(true);
            //获取验证码按钮状态
            const codeButtonStatus = reactive({
                status:false,
                text:'获取验证码'
            });
            //倒计时
            const timer = ref(null);
            //表单的数据
            const ruleForm = reactive({
                //表单绑定数据
                username: '',
                password: '',
                passwords: '',
                code: ''
            })
            //表单的验证
            const rules = reactive( {
                username: [
                    { validator: validateUsername, trigger: 'blur' }
                ],
                    password: [
                    { validator: validatepassword, trigger: 'blur' }
                ],
                    passwords: [
                    { validator: validatepasswords, trigger: 'blur' }
                ],
                    code: [
                    { validator: validatecode, trigger: 'blur' }
                ]
            });
            /**
             * 不建议在一个方法里面做不同的事
             *尽量吧相同的事情封装到一个方法里面，用函数调用
             */
            /**
             *声明函数
             */
            //切换模块
            const toggleMenu = (data =>{
                menuTab.forEach(elem => {
                    elem.current = false
                });
                //高光
                data.current = true;
                //修改模块值
                model.value =data.type;
                resetFromData()
                clearCountDown()
            })
            //清除表单数据
            const resetFromData = (() => {
                //重置表单
                refs['loginFrom'].resetFields();
            })
            //更新按钮状态
            const updateButtonStatus =((params) => {
                codeButtonStatus.status = params.status;
                codeButtonStatus.text = params.text;
            })
            /**
             * 获取验证码
             * */
            const getSms = (() => {
                //进行提示
                if (ruleForm.username == ''){
                    root.$message.error('邮箱不能为空！！');
                    return false
                }
                if (validateEmail(ruleForm.username)){
                    root.$message.error('邮箱格式有误，请重新输入！');
                    return false
                }
                //获取验证码
                let requestData = {
                    username: ruleForm.username,
                    module: model.value
                }
                //修改获取验证码按钮状态
                updateButtonStatus({
                    status : true,
                    text : '发送中'
                })
                setTimeout(()=>{
                    //延长多长时间
                    GetSms(requestData).then(response =>{
                        let data =response.data
                        root.$message({
                            message: data.message,
                            type: 'success'
                        })
                        //启用登录或注册按钮
                        loginButtonStatus.value = false
                        //调定时器，倒计时
                        countDown(60)
                    }).catch(error =>{
                        console.log(error)
                    })
                },2000)

            })
            /**
             * 提交表单
             * */
            const submitForm = (formName => {
                refs[formName].validate((valid) => {
                    if (valid) {
                        model.value === 'login' ? login() : register()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            })
            /**
             * 登录
             * */
            const login = (() =>{
                let requestData ={
                    username:ruleForm.username,
                    password:sha1(ruleForm.password),
                    code:ruleForm.code,
                }
                Login(requestData).then(response =>{
                    console.log('登录成功')
                    console.log(response)
                    //页面跳转
                    root.$router.push({
                        name : 'Console'
                    })
                }).catch(error =>{

                })
            })
            /**
             * 注册
             * */
            const register =(() =>{
                let requestData ={
                    username:ruleForm.username,
                    password:sha1(ruleForm.password),
                    code:ruleForm.code,
                    module:'register'
                }
                // 注册接口
                Register(requestData).then(response =>{
                    let data = response.data
                    root.$message({
                        message: data.message,
                        type: 'success'
                    })
                    toggleMenu(menuTab[0])
                    clearCountDown()
                }).catch(error =>{
                    // 错误将执行的代码
                })
            })
            /**
             * 倒计时
             * */
            const countDown = ((number) =>{
                //setTimeout:clearTimeout只执行一次
                //setInterval:clearInterval不断的执行需要条件才会停止
                let time = number
                timer.value = setInterval(() =>{
                    time--;
                    if (time === 0 ){
                        clearInterval(timer.value)
                        updateButtonStatus({
                            status : false,
                            text : '再次获取'
                        })
                    }else {
                        codeButtonStatus.text = `倒计时${time}秒`
                    }
                },1000)
            })
            /**
             * 清出倒计时
             */
             const clearCountDown = (() =>{
                 // 还原验证码按钮默认状态
                updateButtonStatus({
                    status : false,
                    text : '获取验证码'
                })
                // 清出倒计时
                clearInterval(timer.value)
            })

            /**
             *生命周期
             */
            //挂载完成后
            onMounted(() => {
                // GetSms({ username: ruleForm.username })
            })
            return {
                menuTab,
                model,
                ruleForm,
                rules,
                toggleMenu,
                submitForm,
                getSms,
                loginButtonStatus,
                codeButtonStatus,
            }
        },
    };
</script>

<style scoped>
    .login {
        height: 100vh;
        background-color: #344a5f;
    }
    .login-warp {
        width: 330px;
        margin: auto;
    }
    .menu-tab {
        text-align: center;
    }
    .menu-tab li {
        display: inline-block;
        width: 88px;
        line-height: 36px;
        font-size: 14px;
        color: #fff;
        border-radius: 2px;
        cursor: pointer;
    }
    .current {
        background-color: rgba(0,0,0,.1);
    }
    .login-from {
        margin-top: 29px;
    }
    .login-from label {
        display: block;
        color: #fff;
        font-size: 14px;
        margin-bottom: 3px;
    }
    .login-from .item-from {
        margin-bottom: 13px;
    }
    .login-from .block {
        display: block;
        width: 100%;
    }
    .login-top {margin-top: 19px;}
</style>