<template>
    <el-form label-width="80px">
        <el-form-item label="账号" >
            <el-input v-model="account" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input v-model="password" type="password" auto-complete="off"></el-input>
        </el-form-item>
        <el-button type="primary" @click="doLogin" size="small">登录</el-button>
    </el-form>
</template>

<script>
    import axios from 'axios'
    import config from '@/config/config.js'

    export default {
        data() {
            return {
                account: '',
                password: ''
            }
        },
        methods:{
            doLogin(){
                axios({
                    method: 'post',
                    url: `http://${config.host}/api/staffs/doLogin`,
                    params:{
                        account: this.account,
                        password: this.password
                    }
                }).then(res=>{
                    if(res.data.code){
                        this.$message({
                            type: 'error',
                            message: '账户或密码错误',
                            duration: 2000
                        })
                    }else{
                        let loginFrom=sessionStorage.getItem('loginFrom');
                        this.$router.push(loginFrom?loginFrom:'/');
                    }

                }).catch(err=>{
                    console.log(err);
                });
            }
        }
    }
</script>

<style scoped>
.el-form{
    width: 30%;
    margin: 100px auto;
}
</style>


