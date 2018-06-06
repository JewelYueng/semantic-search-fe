<template>
<div id="nav-div">
    <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" router>
    <el-menu-item index="/">首页</el-menu-item>
    <el-menu-item index="/assessments">评审记录</el-menu-item>
    <el-submenu index='/search'>
      <template slot="title">搜索
</template>
  <el-menu-item index="/search">普通搜索</el-menu-item>
  <el-menu-item index="/advancedSearch">高级搜索</el-menu-item>
</el-submenu>
</el-menu>
<div id="logout-div">
<el-button type="text" style="color:black" >{{userName}}</el-button>
<span><b>|</b></span>
<el-button type="text" @click="logout">退出</el-button>
</div>
</div>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: '1',
        userName: sessionStorage.getItem('userName'),
      };
    },
    methods: {
      logout(){
        //退出
        this.$axios({
          method: 'get',
          url: `http://${this.$config.host}/api/staffs/logout`
        }).then(res=>{
          sessionStorage.removeItem('userName');
          this.$router.push('/login');
        }).catch(err=>{
          console.log(err);
        })
      }
    }
  }
</script>

<style scoped>
  .el-menu {
    padding-left: 550px;
    margin-bottom: 20px;
  }
  #nav-div{
    position: relative;
  }
  #logout-div{
    position: absolute;
    top: 20px;
    right: 50px;
  }
</style>
