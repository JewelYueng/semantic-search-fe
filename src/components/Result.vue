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
        <el-input v-model="args.keywords" placeholder="输入查询关键字" clearable></el-input>
      </el-col>
      <el-col :span="2">
        <el-button icon="el-icon-search" type="primary" @click="sendData">查询</el-button>
      </el-col>
      <el-col :span="2">
        <el-button icon="el-icon-search" type="success" @click="goSeniorSearch">高级搜索</el-button>
      </el-col>
    </el-row>
    <div class="result-container" v-if="showResult === 'others'">
      <el-container class="result" v-for="(re,index) in results.searchResult" :key="index">
        <el-header height="40px">所在文档：<span @click="jumpToDetail(re)" class="file-name-span">{{re.fileName}}</span></el-header>
        <el-main>{{re.standards[0].content}}</el-main>
        <el-footer height="auto">所在章节：{{re.standards[0].index}} {{re.standards[0].name}}</el-footer>
      </el-container>
    </div>
    <div class="full-text-container" v-if="showResult === 'fullText'">
      <el-container class="result" v-for="(re,index) in currentSearchResult" :key="index">
        <el-header height="20px">所在文档：<span @click="jumpToDetail(re)" class="file-name-span">{{re.fileName}}</span></el-header>
        <el-main>
          <div v-for="(content,index) in re.contents" :key="index" v-html="content"></div>
        </el-main>
      </el-container>
      <self-pagination 
          :result="results.searchResult"
          :currentPage="pagination.currentPage"
          :pageSize="pagination.pageSize"
          :small="pagination.small"
          @currentChange='handleCurrentChange'>
        </self-pagination>
    </div>
    <div class="product-container" v-if="showResult === 'product'">
      <div class="left-container">
        <el-container class="result" v-for="(re,index) in currentSearchResult" :key="index">
          <el-header height="auto">
            <el-row>
              <el-col :span="3">标准文档：</el-col>
              <el-col :span="21">
                <span @click="jumpToDetail(re)" class="file-name-span">{{re.fileName}}</span>
              </el-col>
            </el-row>
          </el-header>
          <el-main>
            <el-row>
              <el-col :span="3">指标：</el-col>
              <el-col :span="21">
              <div class="std-container">
              <div v-for="(std,index) in re.standards" class="std-box" :key="index">
                <el-popover
                  placement="top-start"
                  width="250"
                  trigger="click"
                  :content="std.content">
                  <el-button type="text" slot="reference">{{std.name}}</el-button>
                </el-popover>
              </div>
              </div>
              
              </el-col>
            </el-row>
          </el-main>
          <el-footer height="auto">
            <el-row>
            <el-col :span="3">引用标准：</el-col>
            <el-col :span="21">
            <div class="ref-container">
              <div class="ref-box" v-for="(ref,index) in re.references" :key="index">
                 {{ref.name}}
              </div>
            </div>
            </el-col>
            </el-row>
          </el-footer>
        </el-container>
        <self-pagination 
          :result="results.searchResult"
          :currentPage="pagination.currentPage"
          :pageSize="pagination.pageSize"
          :small="pagination.small"
          @currentChange='handleCurrentChange'>
        </self-pagination>
      </div>
      <el-container class="right-container" v-if="results.relatedResult.length">
        <el-header height="20px">相关标准</el-header>
        <el-main>
          <a class="related-container" v-for="(re,index) in currentRelatedResult" :key="index" @click="jumpToDetail(re)">
            {{re.cName}}
          </a>
        <self-pagination 
          :result="results.relatedResult"
          :currentPage="relatedResultPagination.currentPage"
          :pageSize="relatedResultPagination.pageSize"
          :small="relatedResultPagination.small"
          @currentChange='handleRelatedResultCurrentChange'>
        </self-pagination>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "@/config/config.js";
import ElContainer from "../../node_modules/element-ui/packages/container/src/main";
import SelfPagination from "@/components/SelfPagination.vue"
//  下拉框的选项配置
const TYPES_OPTIONS = [
  { label: "按产品搜索", value: "product" },
  { label: "按指标搜索", value: "norm" },
  { label: "混合搜索", value: "mixing" },
  { label: "全文检索", value: "fullText" }
];
const MOCK_RESULT = {
  searchResult: [
    {
      fileName: "GB 19651.3-2008 杂类灯座 第2-2部分:LED模块用连接器的特殊要求",
      content: "按照GB19651.1-2008第11章的<em>要求</em>"
    },
    {
      fileName: "GB 19651.3-2008 杂类灯座 第2-2部分:LED模块用连接器的特殊要求",
      content: "按照GB19651.1-2008第11章的<em>要求</em>。"
    }
  ]
};
export default {
  components: { ElContainer,SelfPagination },
  name: "result",
  data: () => {
    return {
      args: {
        searchType: "", //查询类型
        keywords: "" //查询关键字
      },
      typeOptions: Object.freeze(TYPES_OPTIONS),
      //        页面中是否显示结果列表
      showResult: true,
      //        结果列表
      results: { relatedResult: [], searchResult: []},
      pagination:{
        currentPage:1,
        pageSize:5,
        small: false
      },
      relatedResultPagination:{
        currentPage:1,
        pageSize:25,
        small: true
      }
    };
  },
  mounted(){
    this.$nextTick(function(){
      console.log('mounted');
      this.args.searchType=this.$route.query.searchType?this.$route.query.searchType:'';
      this.args.keywords=this.$route.query.keywords?this.$route.query.keywords:'';
      if(this.args.searchType && this.args.keywords){
        this.sendData();
      }
    });
  },
  methods: {
    //    	跳转到详情页
    jumpToDetail(re) {
      this.$router.push({
        name: "detail",
        // params: { id: re.id },
        query: { number: re.number }
      });
    },
    //  		发送查询数据
    sendData() {
      console.log("sendData");
      //        请求后台数据部分的代码
      //        根据不同的查询情况使用不同的模拟数据
      console.log(this.args.searchType);
      this.showResult = this.args.searchType;
      if (this.showResult === "fullText") {
        // this.results = MOCK_RESULT;
        // return;
      }else if(this.showResult === 'mixing' || this.showResult === 'norm'){
        this.showResult='others';
      }

      axios({
        method: "get",
        url: `http://${config.host}/api/search?searchType=${
          this.args.searchType
        }&keywords=${this.args.keywords}`,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          //this.showResult = true
          this.results = res.data.data;
          //将查询参数添加到url,供返回功能使用
          this.$router.replace(`/search?searchType=${this.args.searchType}&keywords=${this.args.keywords}`);
          //当前页重置为1
          this.pagination.currentPage=1;
        })
        .catch(err => {
          this.showResult = "others";
          console.log(err);
        });
    },
    goSeniorSearch (){
      this.$router.push('/advancedSearch');
    },
    handleCurrentChange(val){
      this.pagination.currentPage=val;
    },
    handleRelatedResultCurrentChange(val){
      this.relatedResultPagination.currentPage=val;
    }
  },
  computed:{
    currentSearchResult(){
      let pagination=this.pagination;
      let begin=(pagination.currentPage-1)*pagination.pageSize;
      let end=pagination.currentPage*pagination.pageSize;
      return this.results.searchResult.slice(begin,end);
    },
    currentRelatedResult(){
      let pagination=this.relatedResultPagination;
      let begin=(pagination.currentPage-1)*pagination.pageSize;
      let end=pagination.currentPage*pagination.pageSize;
      return this.results.relatedResult.slice(begin,end);
    }
  }
};
</script>

<style>
section.el-container.result.is-vertical {
  margin: 10px;
  box-shadow: 0 0 10px #e4e4e4;
  padding: 20px 20px;
  text-align: left;
}
.std-container,
.ref-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.std-box,
.ref-box {
  margin-right: 10px;
  line-height: 24px;
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
  color: #409eff;
}
.related-container {
  display: block;
  margin: 10px;
  color: #606266;
  cursor: pointer;
}
.related-container:hover {
  color: #409eff;
}
.result .std-box {
  line-height: 24px;
}
.result .std-box:hover {
  color: #409eff;
  cursor: pointer;
}
.file-name-span:hover {
  color: #409eff;
  cursor: pointer;
}
.el-button--text {
  color: #2c3e50;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
.std-box button {
  padding: 0;
  font-size: 16px;
}
.el-main {
  line-height: 24px;
}
.el-main em{
  color: red;
  font-style: normal;
}
</style>
