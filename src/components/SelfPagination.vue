<template>
    <el-pagination
        background 
        layout="total,prev, pager, next" 
        :total="total" 
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        v-show="total>0"
        :small="small">

      </el-pagination>
</template>

<script>
    export default {
        name: 'SelfPagination',
        props: ['result','currentPage','pageSize','small'],
        data() {
            return {
                
            }
        },
        computed:{
            total(){
                return this.result.length;
            }
        },
        methods:{
            handleCurrentChange(val){
                console.log(`当前页:${val}`)
                //向父组件传递事件
                this.$emit('currentChange',val);
            }
        }
    }
</script>

<style>

</style>
