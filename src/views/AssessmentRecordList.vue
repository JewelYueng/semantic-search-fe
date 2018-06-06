<template>
    <div>
        <my-nav></my-nav>
        <el-form :inline="true">
            <el-form-item label="标准名">
                <el-input placeholder="标准名"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select placeholder="状态">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="assessmentRecordList" style="width:100%" border>
            <el-table-column prop="originalFileName" label="标准名称" header-align="center">
                <template slot-scope="scope">
                            <a class="assessment-a" :href="getDownloadHref(scope.row)" target="_blank">{{ scope.row.originalFileName }}</a>
</template>
            </el-table-column>
            <el-table-column prop="company" label="公司" header-align="center"></el-table-column>
            <el-table-column prop="size" label="大小" :formatter="formatSize" header-align="center" width="60"></el-table-column>
            <el-table-column prop="uploadStaff" label="上传者" header-align="center"></el-table-column>
            <el-table-column prop="uploadTime" label="上传时间" :formatter="formatTime" width="160px" header-align="center"></el-table-column>
            <el-table-column prop="status" label="状态" :formatter="formatStatus" header-align="center"></el-table-column>
            <el-table-column prop="assessment.result" label="评审结果" header-align="center"></el-table-column>
            <el-table-column prop="assessment.staffName" label="评审者" header-align="center" width="80"></el-table-column>
            <el-table-column prop="assessment.assessTime" label="评审时间" :formatter="formatTime" width="160px" header-align="center"></el-table-column>
            <el-table-column label="操作" header-align="center">
<template slot-scope="scope">
    <a class="assessment-a" :href="getHref(scope.row)" target="_blank">{{ getOperation(scope.row) }}</a>
</template>
            </el-table-column>
        </el-table>
    </div>
</template>


<script>
    import MyNav from '@/components/MyNav'
    import FormatUtil from '@/util/FormatUtil'
    const UPLOADED = 1; //已上传
    const ASSESS_DOING = 2; //对标中
    const ASSESS_DONE = 3; //已完成
    let STATUS_MAP = {};
    STATUS_MAP[UPLOADED] = '未评审';
    STATUS_MAP[ASSESS_DOING] = '评审中';
    STATUS_MAP[ASSESS_DONE] = '评审完成'
    export default {
        components: {
            MyNav
        },
        mounted() {
            console.log(FormatUtil.formatDate(new Date()))
            this.$axios({
                method: 'get',
                url: `http://${this.$config.host}/api/standards/list`
            }).then(res => {
                if (!res.data.code) {
                    this.assessmentRecordList = res.data.data.standards;
                } else {
                    this.$message.error('获取信息出错');
                }
            }).catch(err => {
                console.log(err);
            });
        },
        data() {
            return {
                assessmentRecordList: []
            }
        },
        methods: {
            formatSize(row, column, cellValue, index) {
                return FormatUtil.formatSize(cellValue);
            },
            formatTime(row, column, cellValue, index) {
                if (!cellValue) {
                    return '';
                }
                return FormatUtil.formatDate(new Date(cellValue));
            },
            formatStatus(row, column, cellValue, index) {
                return STATUS_MAP[cellValue] ? STATUS_MAP[cellValue] : '';
            },
            getHref(row) {
                return this.$router.resolve({
                    name: 'assessment',
                    params: {
                        standardId: row.id
                    }
                }).href;
            },
            getOperation(row) {
                if (row.status === UPLOADED) {
                    return '开始评审';
                } else if (row.status === ASSESS_DOING) {
                    return '继续评审';
                } else {
                    return '查看结果';
                }
            },
            getDownloadHref(row) {
                return `http://${this.$config.host}/files/download?fileName=${row.fileName}&type=2&originalFileName=${row.originalFileName}`
            }
        }
    }
</script>

<style scoped>
    .assessment-a:link {
        text-decoration: none;
    }
    .assessment-a {
        color: #409EFF;
    }
</style>

