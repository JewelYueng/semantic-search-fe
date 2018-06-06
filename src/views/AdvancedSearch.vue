<template>
  <div>
    <my-nav></my-nav>
    <div id="search-div">
      <el-row justify="center" :gutter="10" align="middle" type="flex">
        <el-col :span="2" class="search-label">标准号</el-col>
        <el-col :span="4">
          <el-input v-model="standardForm.number" placeholder="标准号"></el-input>
        </el-col>
        <el-col :span="2" class="search-label">标准中文名</el-col>
        <el-col :span="4">
          <el-input v-model="standardForm.cName" placeholder="标准中文名"></el-input>
        </el-col>
        <el-col :span="2" class="search-label">ICS</el-col>
        <el-col :span="4">
          <el-input v-model="standardForm.ics" placeholder="国际标准分类号"></el-input>
        </el-col>
        <el-col :span="2" class="search-label">CCS</el-col>
        <el-col :span="4">
          <el-input v-model="standardForm.ccs" placeholder="中国标准分类号"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2" class="search-label">标准状态</el-col>
        <el-col :span="4">
          <el-checkbox-group v-model="standardForm.status">
            <el-checkbox label="ST" name="type">现行</el-checkbox>
            <el-checkbox label="WT" name="type">已废止</el-checkbox>
            <el-checkbox label="NST" name="type">未现行</el-checkbox>
          </el-checkbox-group>
        </el-col>
        <el-col :span="2" class="search-label">发布日期</el-col>
        <el-col :span="6">
          <el-date-picker v-model="standardForm.publishDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col :span="2" class="search-label">实施日期</el-col>
        <el-col :span="4">
          <el-date-picker v-model="standardForm.carryOutDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2" class="search-label">章节</el-col>
        <el-col :span="4">
          <el-input v-model="standardForm.index" placeholder="章节"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2" :offset="18">
          <el-button type="primary" icon="el-icon-search" @click="onSubmit" size="small">查询</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="onReset" icon="el-icon-remove" size="small">重置</el-button>
        </el-col>
      </el-row>
      <hr />
    </div>
    <div id="result-div">
      <el-table :data="tableData" @cell-click="jumpToDetail">
        <el-table-column prop="number" label="标准号" width="180">
          <template slot-scope="scope">
                            <span class="number-span">{{ scope.row.number }}</span>
</template>
        </el-table-column>
        <el-table-column prop="cName" label="中文名" width="300">
        </el-table-column>
        <el-table-column prop="ics" label="ICS" width="150">
        </el-table-column>
        <el-table-column prop="ccs" label="CCS" width="50">
        </el-table-column>
        <el-table-column prop="status" label="标准状态" width="100" :formatter="formatStatus">
        </el-table-column>
        <el-table-column prop="publishDate" label="发布日期" width="150">
        </el-table-column>
        <el-table-column prop="carryOutDate" label="实施日期" width="150">
        </el-table-column>
        <el-table-column prop="content" label="章节内容">
        </el-table-column>
      </el-table>
      
      <el-pagination
        v-show="result.total>0"
        background 
        layout="total,prev, pager, next" 
        :total="result.total" 
        @current-change="handleCurrentChange"
        :current-page="result.currentPage"
        :page-size="result.pageSize">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import config from "@/config/config.js";
  import MyNav from '@/components/MyNav'
  const MOCK_RESULT = [{
    number: 'GB 7000.211-2008',
    cName: '灯具 第2-11部分:特殊要求 水族箱灯具',
    ics: '29.140.40',
    ccs: 'K72',
    status: 'ST',
    publishDate: '2008/12/31',
    content: '--'
  }];
  const STATUS_MAP = {
    ST: "现行",
    WT: "已废止",
    NST: "未现行"
  };
  export default {
    components: {MyNav},
    data() {
      return {
        standardForm: {
          number: '',
          cName: '',
          ics: '',
          ccs: '',
          status: [],
          publishDate: [],
          carryOutDate: [],
          index: ''
        },
        result: {
          data: [],
          total: 0,
          currentPage: 1,
          pageSize: 10
        }
      };
    },
    methods: {
      onSubmit() {
        console.log("submit!");
        let standardForm = this.standardForm;
        let number = standardForm.number;
        let cName = standardForm.cName;
        let ics = standardForm.ics;
        let ccs = standardForm.ccs;
        let status = standardForm.status;
        let publishDateStart = standardForm.publishDate[0] ? new Date(standardForm.publishDate[0]).getTime() : 0;
        let publishDateEnd = standardForm.publishDate[1] ? new Date(standardForm.publishDate[1]).getTime() : 0;
        let carryOutDateStart = standardForm.carryOutDate[0] ? new Date(standardForm.carryOutDate[0]).getTime() : 0;
        let carryOutDateEnd = standardForm.carryOutDate[1] ? new Date(standardForm.carryOutDate[1]).getTime() : 0;
        let index = standardForm.index;
        //发送查询请求
        axios({
          method: 'post',
          url: `http://${config.host}/api/advancedSearch`,
          params: {
            number,
            cName,
            ics,
            ccs,
            status,
            publishDateStart,
            publishDateEnd,
            carryOutDateStart,
            carryOutDateEnd,
            index
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => {
          this.result.data = res.data.data.searchResult;
          this.result.total = this.result.data.length;
          this.result.currentPage=1;
        }).catch(err => {
          console.log(err);
        })
      },
      onReset() {
        this.standardForm = {
          number: '',
          cName: '',
          ics: '',
          ccs: '',
          status: [],
          publishDate: [],
          carryOutDate: [],
          index: ''
        };
      },
      formatStatus(row, column, cellValue, index) {
        return STATUS_MAP[cellValue] ? STATUS_MAP[cellValue] : '--'
      },
      formatNumber(row, column, cellValue, index) {
        return `<span class="number">${cellValue}</span>`;
      },
      jumpToDetail(row, column, cell, event) {
        if (column.property === 'number') {
          let number = row[column.property];
          this.$router.push({
            name: 'detail',
            query: {
              number
            }
          })
        }
      },
      handleCurrentChange(val) {
        console.log(`当前页:${val}`)
        this.result.currentPage=val;
      }
    },
    computed:{
      tableData(){
        var result=this.result;
        return result.data.slice((result.currentPage-1)*result.pageSize,result.currentPage*result.pageSize)
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #search-div .search-label,
  .el-checkbox-group {
    height: 32px;
    line-height: 32px;
  }
  .el-row {
    margin-top: 10px;
  }
  .el-checkbox {
    margin-left: 10px;
  }
  #result-div .el-table {
    margin: 0 auto;
  }
  .number-span:hover {
    color: #409eff;
    cursor: pointer;
  }
</style>
<style>
  #search-div .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  #result-div .el-table th {
    text-align: center;
  }
</style>
