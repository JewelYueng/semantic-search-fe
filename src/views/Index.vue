<template>
  <div>
    <my-nav></my-nav>
    <div id="container-div">
      <el-upload class="upload-demo" 
        ref="upload" 
        :action="uploadFileAction" 
        :auto-upload="false" 
        :limit="1" 
        :before-upload="beforeUpload" 
        :on-success="fileUploadSuccess" 
        :on-error="fileUploadFail">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">
        上传到服务器
        </el-button>
        <div slot="tip" class="el-upload__tip">只能上传pdf文件，且不超过2M</div>
        <el-button size="small" 
          type="success"
          id="begin-assessment-btn" 
          @click="doAssessment" 
          :disabled="!beginBtnEnabled">
        开始评审
        </el-button>
      </el-upload>
    </div>
  </div>
</template>

<script>
  import MyNav from '@/components/MyNav'
  import axios from 'axios'
  import config from '@/config/config.js'

  export default {
    components: {
      MyNav
    },
    data() {
      return {
        standardId: '',
        beginBtnEnabled: false,
        uploadFileAction: `http://${config.host}/files/uploadFile`,
      };
    },
    methods: {
      submitUpload() {
        this.$refs.upload.submit();
      },
      beforeUpload(file) {
        const isPdf = file.type === 'application/pdf';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isPdf) {
          this.$message({
            message: '上传文件只能是 pdf 格式!',
            showClose: true,
            duration: 10000,
            type: 'error'
          });
        }
        if (!isLt2M) {
          this.$message.error({
            message: '上传文件大小不能超过 2MB!',
            showClose: true,
            duration: 1000,
            type: 'error'
          });
        }
        return isPdf && isLt2M;
      },
      fileUploadSuccess(response, file, fileList) {
        console.log(response);
        if (response.code === 0) {
          this.$message({
            message: '文件上传成功!',
            showClose: true,
            duration: 2000,
            type: 'success'
          });
          //显示对标
          this.standardId = response.data.id;
          this.beginBtnEnabled=true;
        } else {
          this.$message({
            message: '文件上传失败!',
            showClose: true,
            duration: 2000,
            type: 'error'
          })
        }
      },
      fileUploadFail(err, file, fileList) {
        console.log(err);
        this.$message({
          message: '文件上传失败!',
          showClose: true,
          duration: 2000,
          type: 'error'
        })
      },
      doAssessment() {
        console.log(this.standardId);
        if(!this.standardId){
          this.$message.error('获取指标出错');
          return;
        }
        //新开评审页面
        let routeData = this.$router.resolve({name: 'assessment', params: {standardId: this.standardId}});
        window.open(routeData.href, '_blank');
        //重置
        this.$refs.upload.clearFiles();
        this.standardId='';
        this.beginBtnEnabled=false;
      }
    }
  }
</script>

<style scoped>
  #container-div,#begin-assessment-btn {
    margin-top: 20px;
  }
  .upload-demo{
    width: 300px;
    margin: 0 auto;
    text-align: left;
  }
  #begin-assessment-btn{
    text-align: left;
  }
</style>
