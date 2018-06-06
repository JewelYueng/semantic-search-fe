<template>
    <div id="container-div">
        <div id="assessment-div">
            <template>
                    <el-tag type="info">标准信息</el-tag>
                    <el-table :data="standardData" border style="width:70%">
                        <el-table-column prop="originalFileName" label="文件名" width="180">
                        </el-table-column>
                        <el-table-column prop="company" label="公司">
                        </el-table-column>
                        <el-table-column prop="size" label="大小" width="180" :formatter="formatSize">
                        </el-table-column>
                        <el-table-column prop="uploadStaff" label="上传者" width="100">
                        </el-table-column>
                        <el-table-column prop="uploadTime" label="上传时间" :formatter="formatTime" width="200">
                        </el-table-column>
                    </el-table>
                    <br/>
                    <el-tag>对标信息</el-tag>
                    <el-table :data="tableData" border style="width: 100%" @cell-dblclick="changeContent">
                        <el-table-column prop="qname" label="指标项" width="200" resizable>
                        </el-table-column>
                        <el-table-column prop="qindex" label="原文章节" width="100" resizable> 
                        </el-table-column>
                        <el-table-column prop="qcontent" label="内容" width="300" class-name="column-left" align="left" resizable>
                        </el-table-column>
                        <el-table-column label="对应的国家标准">
                            <el-table-column prop="gnumber" :formatter="formatColumn" label="对应的国家标准" width="120" resizable>
                            </el-table-column>
                            <el-table-column prop="gindex" :formatter="formatColumn" label="国家标准章节" width="120" resizable>
                            </el-table-column>
                            <el-table-column prop="gcontent" :formatter="formatColumn" label="国家标准内容" class-name="column-left" align="left" resizable>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column prop="result" label="评审结果" width="100" resizable align="left">
                        </el-table-column>
                    </el-table>
                    <el-form class="assessment-result-form">
                        <el-form-item label="评审结果">
                            <el-input type="textarea" v-model="assessmentResult" :disabled="assessDone"></el-input>
                        </el-form-item>
                        <el-form-item v-if="!assessDone">
                            <el-button type="primary" @click="submitResult">提交</el-button>
                        </el-form-item>
                        <el-form-item v-else>
                            <el-button type="success" @click="returnHome">返回首页</el-button>
                        </el-form-item>
                    </el-form>
</template>
            <el-dialog
                title="修改信息"
                :visible.sync="changeDialog.visible"
                width="50%">
                <el-form label-width="110px">
                    <el-form-item :label="changeDialog.label">
                        <el-input type="textarea" rows="5" v-model="changeDialog.content"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="changeDialog.visible = false">取 消</el-button>
                    <el-button type="primary" @click="handleChangeContent">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import FormatUtil from '@/util/FormatUtil'

    const ASSESS_DONE=3;
    const COLUMN_MAP = {
        'gnumber': '对应的国家标准',
        'gindex': '国家标准章节',
        'gcontent': '国家标准内容',
        'result': '评审结果'
    };
    export default {
        components: {
        },
        data() {
            return {
                standard: {
                    id: '',
                    status: 0
                },
                tableData: [],
                changeDialog: {
                    visible: false,
                    label: '',
                    content: '',
                    id: 0,
                    property: '',
                    row: null
                },
                assessmentResult: ''
            };
        },
        methods: {
            formatSize(row, column, cellValue, index) {
                return FormatUtil.formatSize(cellValue);
            },
            formatTime(row, column, cellValue, index) {
                return FormatUtil.formatDate(new Date(cellValue));
            },
            formatColumn(row, column, cellValue, index){
                return cellValue || '--';
            },
            submitResult() {
                this.$axios({
                    method: 'POST',
                    url: `http://${this.$config.host}/api/assessmentRecords/assessmentRecord`,
                    params: {
                        standardId: this.standard.id,
                        result: this.assessmentResult,
                    }
                }).then(res => {
                    if (!res.data.code) {
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        })
                        this.standard.status=ASSESS_DONE;
                    } else {
                        this.$message.error('提交失败');
                    }
                }).catch(err => {
                    console.log(err);
                    this.$message.error('提交失败');
                })
            },
            changeContent(row, column, cell, event) {
                if(this.assessDone){
                    return;
                }
                if (['gnumber', 'gindex', 'gcontent', 'result'].includes(column.property)) {
                    this.changeDialog.visible = true;
                    //设置内容
                    this.changeDialog.label = COLUMN_MAP[column.property];
                    this.changeDialog.content = row[column.property];
                    this.changeDialog.id = row.id;
                    this.changeDialog.property = column.property;
                    this.changeDialog.row = row;
                }
            },
            handleChangeContent() {
                console.log('change');
                this.changeDialog.visible = false;
                let id = this.changeDialog.id;
                let content = this.changeDialog.content;
                let property = this.changeDialog.property;
                let params = {};
                params[property] = content;
                let row = this.changeDialog.row;
                //修改记录
                this.$axios({
                    method: 'post',
                    url: `http://${this.$config.host}/api/assessItems/assessment/${id}`,
                    params: params
                }).then(res => {
                    console.log(res);
                    if (!res.data.code) {
                        console.log('success');
                        this.$message({
                            message: '更新成功!',
                            type: 'success'
                        });
                        row[property] = content;
                    } else {
                        this.$message.error('更新失败');
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            returnHome(){
                this.$router.push('/');
            }
        },
        computed: {
            standardData() {
                return [this.standard];
            },
            assessDone(){
                return this.standard.status === ASSESS_DONE;
            }
        },
        mounted() {
            this.standard.id=this.$route.params.standardId;
            this.$axios
                .get(`http://${this.$config.host}/api/qiyeStandards/${this.standard.id}`)
                .then(res => {
                    this.standard = res.data.data.standard;
                    this.tableData = res.data.data.assessItemList;
                    this.assessmentResult=res.data.data.standard.assessment.result;
                }).catch(err => {
                    console.log(err);
                })
        },
    }
</script>

<style scoped>
    #assessment-div{
        text-align: left;
    }
    #assessment-div .assessment-result-form {
        width: 60%;
    }
</style>

<style>
    #assessment-div .el-table,
    #assessment-div .el-table th {
        text-align: center;
    }
</style>



