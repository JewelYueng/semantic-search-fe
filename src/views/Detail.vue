<template>
  <div class="detail-container">
    <el-row v-for="co in table.columns" :key="co.value" type="flex" justify="center" class="row-container">
      <el-col class="column" :span="4">{{co.label}}</el-col>
      <el-col class="content" :span="18">{{getContent(co.value)}}</el-col>
    </el-row>
    <div id="button-div">
    <el-button @click="downloadFile" type="success" icon="el-icon-download">下载</el-button>
    <el-button @click="jumpToIndex" icon="el-icon-back" type="primary" class="backBtn">返回</el-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { DETAIL } from "@/contants/columns";
import config from '@/config/config.js';
export default {
  name: "detail",
  data() {
    return {
      table: {
        data: {},
        columns: Object.freeze(DETAIL)
      }
    };
  },
  created() {
    console.log(this.$route.params.id);
    axios({
      method: "get",
      url: `http://${config.host}/api/standards/standard?number=${this.$route.query.number}`,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        //this.showResult = true
        this.table.data = res.data.data;
      })
      .catch(err => {
        this.showResult = false;
      });
  },
  methods: {
    getContent(val) {
      const STATUS_MAP = {
        ST: "现行",
        WT: "已废止",
        NST: "未现行"
      };
      return val === "status"
        ? STATUS_MAP[this.table.data[val]]
        : this.table.data[val] || "暂无";
    },
    jumpToIndex() {
      // this.$router.push({ name: "result-page" });
      this.$router.go(-1);
    },
    downloadFile(){
      window.open(`http://${config.host}/files/download?fileName=${this.table.data.number}`);
    }
  }
};
</script>

<style>
.detail-container {
  text-align: left;
  padding: 30px;
}
.row-container {
  margin: 10px;
  padding: 5px;
  border-bottom: dotted gray 1px;
}
#button-div{
  margin: 0 auto;
  text-align: center;
}
</style>
