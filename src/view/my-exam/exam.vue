<template>
  <card :bordered="false"><h2 slot="title">考试列表</h2>
    <collapse accordion @on-change="open_exam_list">
      <panel v-for="(name,key) in list_item" :name="key" :key="key">
        <span>{{name}}</span>
        <div slot="content">
          <list :loading="loading_exam" item-layout="vertical">
            <list-item v-for="(exam, id) in exam_list" :key="id"  >
              <ListItemMeta :title="exam.name" ></ListItemMeta>
              <tag>地点：{{exam.place}}</tag>
              <tag>开始时间：{{exam.start_at}}</tag>
              <tag>结束时间：{{exam.end_at}}</tag>
              <tag>备注：{{exam.note}}</tag>
              <template slot="extra">
                  <Button @click="start_exam(exam.id,exam.name)" type="success" :disabled="key==='2'">进入考试</Button>
              </template>
            </list-item>
          </list>
        </div>
      </panel>
    </collapse>
  </card>
</template>

<script>
import { getExam } from '../../api/student'

export default {
  name: 'exam',
  data: function () {
    return {
      loading_exam: false,
      exams: {},
      list_item: {
        0: '未开始',
        1: '进行中',
        2: '已完成'
      }
    }
  },
  methods: {
    open_exam_list: function (type) {
      this.loading_exam = true
      this.exams = {}
      getExam(type[0]).then((res) => {
        if (res.data.code === '0') {
          this.exams = res.data.data.exam
        } else this.$Message.info('获取考试列表失败')
        this.loading_exam = false
      }).catch(() => {
        this.$Message.info('获取考试列表失败')
        this.loading_exam = false
      })
    },
    start_exam: function (id, title) {
      this.$router.push({
        name: 'enter_exam',
        params: {
          id,
          title
        }
      })
    }
  },
  computed: {
    exam_list: function () {
      let list = this.exams
      for (let key in list) {
        list[key] = list[key][0]['exam_info'][0]
      }
      return list
    }
  }
}
</script>

<style scoped>

</style>
