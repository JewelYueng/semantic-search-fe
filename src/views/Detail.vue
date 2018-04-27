<template>
  <div class="detail-container">
    <el-row v-for="co in table.columns" :key="co.value" type="flex" justify="center" class="row-container">
      <el-col class="column" :span="4">{{co.label}}</el-col>
      <el-col class="content" :span="18">{{getContent(co.value)}}</el-col>
    </el-row>
    <el-button @click="jumpToIndex" class="backBtn">返回</el-button>
  </div>
</template>

<script>
  import axios from 'axios'
  import {DETAIL} from '@/contants/columns'
  export default {
  	name: 'detail',
    data () {
  		return {
  			table: {
  				data: {},
          columns: Object.freeze(DETAIL)
        }
      }
    },
    created () {
  		console.log(this.$route.params.id)
      axios({
        method: 'get',
        url: `http://116.56.140.85:8080/api/standards/standard?number=${this.$route.query.number}`,
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          //this.showResult = true
          this.table.data = res.data.data;
        })
        .catch(err => {
          this.showResult = false
        })
    },
    methods: {
  		getContent (val)  {
  			 const STATUS_MAP = {
  			 	  ST: '现行',
           WT: '已废止',
           NST: '未现行'
         }
  			return val === 'status' ? STATUS_MAP[this.table.data[val]] : (this.table.data[val] || '暂无')
      },
      jumpToIndex () {
  			this.$router.push({name: 'result-page'})
      }
    }
  }
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
  .backBtn {
    display: block;
    margin: 0 auto;
  }
</style>
