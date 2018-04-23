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
    <div class="result-container" v-show="showResult === 'others'">
      <el-container class="result" v-for="(re,index) in results" :key="index">
        <el-header height="40px">所在文档：{{re.filename}}</el-header>
        <el-main>{{re.standards[0].content}}</el-main>
        <el-footer height="23px">所在章节：{{re.standards[0].index}}</el-footer>
      </el-container>
    </div>
    <div class="result-container" v-show="showResult === 'product'">
      <el-container class="result" v-for="(re,index) in results" :key="index">
        <el-header height="40px">标准文档：{{re.filename}}</el-header>
        <el-main>
          <div class="std-container">
            指标：
            <div v-for="std in re.standards" class="std-box">
              {{std.name}}
            </div>
          </div>
        </el-main>
        <el-footer height="23px">
          <div class="ref-container">
            引用标准：
            <div class="ref-box" v-for="ref in re.references">
              {{ref.name}}
            </div>
          </div>
        </el-footer>
      </el-container>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
//  下拉框的选项配置
  const TYPES_OPTIONS = [
    {label: '按产品搜索', value: 'product'},
    {label: '按指标搜索', value: 'norm'},
    {label: '混合搜索', value: 'mixing'}
  ]
//  模拟数据(模拟按指标搜索，按产品搜索的数据)
  const MOCK_RESULT = [{
    filename: 'GB-XX1',
    standards: [{
      name: '光效',
      content: '台灯的光效balabalabala',
      index: '3.1'
    }],
    references: [{
      name: 'GB-XX2'
    }]
  },
    {
      filename: 'GB-XX2',
      standards: [{
        name: '光效',
        content: '路灯的光效balabalabala',
        index: '3.4'
      }],
      references: [{
        name: 'GB-XX3'
      }]
    }
  ]
//  模拟数据2（模拟按产品搜索的数据）
  const MOCK_RESULT2 = [{
    filename: 'GB-XX1',
    standards: [{
      name: '光效',
      content: '台灯的光效balabalabala',
      index: '3.1'
    }, {
      name: '寿命',
      content: '台灯的寿命balabalabala',
      index: '3.2'
    }, {
      name: '外观',
      content: '台灯的外观balabalabala',
      index: '3.3'
    }],
    references: [{
      name: 'GB-XX2'
    }]
  },
    {
      filename: 'GB-XX3',
      standards: [{
        name: '光效',
        content: '路灯的光效balabalabala',
        index: '3.4'
      }, {
        name: '寿命',
        content: '路灯的寿命balabalabala',
        index: '3.2'
      }, {
        name: '外观',
        content: '路灯的外观balabalabala',
        index: '3.1'
      }],
      references: [{
        name: 'GB-XX5'
      }]
    }
  ]
  export default {
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
        results: []
      }
    },
    methods: {
//  		发送查询数据
  		sendData () {
        console.log('sendData')
//        请求后台数据部分的代码
//        根据不同的查询情况使用不同的模拟数据
        if (this.args.searchType === 'product') {
          this.results = MOCK_RESULT2
          this.showResult = 'product'
        } else{
        	this.results = MOCK_RESULT
          this.showResult = 'others'
        }

//        axios({
//          method: 'get',
//          url: `/search?${this.args.searchType}=${this.args.keywords}`,
//          headers: {
//            'Content-Type': 'application/json'
//          }
//        })
//          .then(res => {
//        	  this.showResult = true
//            console.log('成功接收到返回的数据:', res)
//        })
//          .catch(err => {
//          	this.showResult = false
//            console.log(err)
//          })
      }
    }
  }
</script>

<style>
  section.el-container.result.is-vertical {
    margin: 10px;
    box-shadow: 5px 5px 10px #e4e4e4;
    padding: 20px 20px;
    text-align: left;
  }
  .std-container, .ref-container {
    display: flex;
    flex-direction: row;
  }
  .std-box, .ref-box {
    margin: 0 10px;
  }
</style>
