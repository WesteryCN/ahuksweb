<template>
  <card :bordered="false"><h2 slot="title">成绩列表</h2>
    <collapse accordion @on-change="open_exam_detail">
      <panel v-for="(exam) in exam_list" :name="String(exam.id)" :key="exam.id">
        <span>{{exam.name}}</span>
        <div slot="content">
          <Row :gutter="20">
            <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
              <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36" style="background: grey; color: white">
                <count-to :end="scores[i]" count-class="count-style"/>
                <p>{{ infor.title }}</p>
              </infor-card>
            </i-col>
          </Row>
        </div>
      </panel>
    </collapse>
  </card>
</template>

<script>
import { getExam, getScore } from '../../api/student'
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'

export default {
  name: 'score',
  components: {
    InforCard,
    CountTo
  },
  data () {
    return {
      exams: {},
      inforCardData: [
        { title: '选择分数', icon: 'md-person-add', color: '#2d8cf0' },
        { title: '填空分数', icon: 'md-locate', color: '#19be6b' },
        { title: '总分', icon: 'md-help-circle', color: '#ff9900' }
      ],
      scores: [0, 0, 0]
    }
  },
  methods: {
    open_exam_detail (exam_id) {
      if (exam_id.length === 0) return
      getScore(exam_id[0]).then(
        (res) => {
          if (res.data.code === '0') {
            let score = res.data.data
            this.$set(this.scores, 0, score.score2)
            this.$set(this.scores, 1, score.score1)
            this.$set(this.scores, 2, score.total_score)
            // debugger
            // console.log(that)
          } else {
            this.$Message.info('获取分数失败')
          }
        }
      ).catch(() => {
        this.$Message.info('获取分数失败')
      })
    }
  },
  mounted () {
    getExam(3).then((res) => {
      if (res.data.code === '0') {
        this.exams = res.data.data.exam
      } else this.$Message.info('获取考试列表失败')
    }).catch(() => {
      this.$Message.info('获取考试列表失败')
    })
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

<style lang="less">
  .count-style{
    font-size: 50px;
  }
</style>
