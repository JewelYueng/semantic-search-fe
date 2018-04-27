<template>
  <div id="result-page">
    <el-row class="search-box" type="flex" justify="center" :gutter="10" align="middle">
      <el-col :span="4">
        <el-select v-model="args.searchType" placeholder="请选择搜索类型">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-input v-model="args.keywords" placeholder="输入查询关键字"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button icon="el-icon-search" type="primary" @click="sendData">查询</el-button>
      </el-col>
    </el-row>
    <div class="result-container" v-if="showResult === 'others'">
      <el-container class="result" v-for="(re,index) in results.searchResult" :key="index">
        <el-header height="40px">所在文档：{{re.fileName}}</el-header>
        <el-main>{{re.standards[0].content}}</el-main>
        <el-footer height="auto">所在章节：{{re.standards[0].index}}</el-footer>
      </el-container>
    </div>
    <div class="product-container" v-if="showResult === 'product'">
      <div class="left-container">
        <el-container class="result" v-for="(re,index) in results.searchResult" :key="index">
          <el-header height="40px">标准文档：{{re.fileName}}</el-header>
          <el-main>
            <div class="std-container">
              指标：
              <div v-for="std in re.standards" class="std-box">
                {{std.name}}
              </div>
            </div>
          </el-main>
          <el-footer height="auto">
            <div class="ref-container">
              引用标准：
              <div class="ref-box" v-for="ref in re.references">
                {{ref.name}}
              </div>
            </div>
          </el-footer>
        </el-container>
      </div>
      <el-container class="right-container" v-if="results.relatedResult.length">
        <el-header height="20px">相关标准</el-header>
        <el-main>
          <div class="related-container" v-for="(re,index) in results.relatedResult" :key="index" @click="jumpToDetail(re)">
            {{re.cName}}
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import ElContainer from "../../node_modules/element-ui/packages/container/src/main"
//  下拉框的选项配置
  const TYPES_OPTIONS = [
    {label: '按产品搜索', value: 'product'},
    {label: '按指标搜索', value: 'norm'},
    {label: '混合搜索', value: 'mixing'}
  ]
  export default {
    components: {ElContainer},
    name: 'result',
    data: () => {
  		return {
  			args: {
  				searchType: '', //查询类型
          keywords: '' //查询关键字
        },
  			typeOptions: Object.freeze(TYPES_OPTIONS),
//        页面中是否显示结果列表
        showResult: true,
//        结果列表
        results: {relatedResult: {}, searchResult: {}}
      }
    },
    methods: {
//    	跳转到详情页
      jumpToDetail (re) {
      	this.$router.push({name: 'detail', params: {id: re.id}, query: {number: re.number}})
      },
//  		发送查询数据
  		sendData () {
        console.log('sendData')
//        请求后台数据部分的代码
//        根据不同的查询情况使用不同的模拟数据
        if (this.args.searchType === 'product') {
//          console.log('product');
//          this.results = MOCK_RESULT2
          this.showResult = 'product'

        } else{
          console.log('others');
//        	this.results = MOCK_RESULT
          this.showResult = 'others'
        }

      axios({
         method: 'get',
         url: `http://116.56.140.85:8080/api/search?searchType=${this.args.searchType}&keywords=${this.args.keywords}`,
         headers: {
           'Content-Type': 'application/json'
         }
       })
         .then(res => {
           //this.showResult = true
           this.results=res.data.data
       })
         .catch(err => {
           this.showResult = 'others'
           console.log(err)
         })
      }
    }
  }
</script>

<style>
  section.el-container.result.is-vertical {
    margin: 10px;
    box-shadow: 0 0 10px #e4e4e4;
    padding: 20px 20px;
    text-align: left;
  }
  .std-container, .ref-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .std-box, .ref-box {
    margin: 0 10px;
  }
  .product-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
  .left-container {
    width: 70%;
  }
  .right-container {
    width: 25%;
    margin: 10px;
    box-shadow: 0 0 10px #e4e4e4;
    padding: 20px 20px;
    text-align: left;
    color: #409EFF;
  }
  .related-container {
    margin: 10px;
    color: #606266;
  }
</style>
