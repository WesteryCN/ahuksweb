<template>
  <card :bordered="false">
    <template slot="title" >
        <h2 style="width: 100%">考试列表</h2>
    </template>
    <collapse accordion @on-change="open_exam" v-model="selected_exam">
      <panel v-for="item in exam_list" :key="item.id" :name="item.id">
        <span>{{item.name}}</span>
        <div slot="content">
          <row>
            <Col span="20">
              <tag color="magenta">地点：{{item.place}}</tag>
              <tag color="orange">开始时间：{{item.start_at}}</tag>
              <tag color="green">结束时间：{{item.end_at}}</tag>
              <tag color="blue">备注：{{item.note}}</tag>
            </Col>
          </row>
          <Divider />
          <collapse accordion @on-change="open_class">
            <panel v-for="(Class, id) in classes" :key="id" :name="id">
              <span>{{Class}}</span>
              <div slot="content">
                <Table stripe :columns="grade_columns" :data="grades" :loading="score_loading"></Table>
              </div>
            </panel>
          </collapse>
        </div>
      </panel>
    </collapse>
  </card>
</template>

<script>
import { getExam, getClassExam, getScore } from '../../api/teacher'

export default {
  name: 'grade',
  data () {
    return {
      exams: {},
      classes: {},
      grades: [],
      selected_exam: [],
      score_loading: false,
      grade_columns: [
        {
          title: '姓名',
          key: 's_name'
        },
        {
          title: '学号',
          key: 's_number'
        },
        {
          title: '选择题分数',
          key: 'score2'
        },
        {
          title: '填空题分数',
          key: 'score1'
        },
        {
          title: '总分',
          key: 'total_score'
        }
      ]
    }
  },
  methods: {
    refreshExam: function () {
      getExam({}).then((res) => {
        if (res.data.code === '0') {
          this.exams = res.data.data
        } else {
          this.$Message.info('获取考试列表失败')
        }
      }).catch(() => {
        this.$Message.info('获取考试列表失败')
      })
    },
    open_exam: function (id) {
      // console.log(id)
      if (id.length === 0) return
      this.classes = {}
      getClassExam(null, id[0]).then(
        (res) => {
          if (res.data.code === '0') {
            let classes = res.data.data.exam
            for (let key in classes) {
              this.$set(this.classes, classes[key][0]['class_id'], classes[key][0]['class_name'])
            }
          } else {
            this.$Message.info('获取班级列表失败')
          }
        }
      ).catch(() => {
        this.$Message.info('获取班级列表失败')
      })
    },
    open_class: function (id) {
      if (id.length === 0) return
      this.grades = []
      this.score_loading = true
      getScore(id[0], this.selected_exam[0]).then((res) => {
        if (res.data.code === '0') {
          let scores = res.data.data.student_socre
          for (let key in scores) {
            // debugger
            this.grades.push(scores[key][0])
          }
        } else this.$Message.info('获取成绩失败')
        this.score_loading = false
      }).catch(() => {
        this.$Message.info('获取成绩失败')
        this.score_loading = false
      })
    }
  },
  computed: {
    exam_list: function () {
      let list = []
      for (let key in this.exams) {
        let item = this.exams[key][0]
        item['id'] = key
        list.push(item)
      }
      return list
    }
  },
  mounted: function () {
    this.refreshExam()
  }
}
</script>

<style scoped>

</style>
