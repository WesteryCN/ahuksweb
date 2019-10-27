<template>
    <card>
      <h1 style="width: 100%;text-align: center">{{title}}</h1>
      <br>
      <div style="display: flex; flex-flow:column;"><Button style="align-self: center" @click="start">开始考试</Button></div>
      <divider />
      <list :split="false" item-layout="vertical">
        <list-item v-for="(problem, id) in problem_list" v-if="problem!=null" :key="id"  >
          <h4>{{problem.q_rank}}.{{problem.q_title}}({{problem.q_mark}}分)</h4>
          <br>
          <div v-if="problem.type===1" >
            <Form :model="answer" label-position="left" :label-width="70">
              <FormItem label="答案">
                <Input v-model="answer[(problem.q_id)]" style="width: 60%;" placeholder="请输入答案" :disabled="!started"></Input>
              </FormItem>
            </Form>
          </div>
          <div v-else>
            <checkbox-group v-model="answer[(problem.q_id)]" >
              <checkbox v-for="(ans,key) in problem.q_answers" :key="key" :label="key" :disabled="!started">{{key}}.{{ans}}</checkbox>
            </checkbox-group>
          </div>
        </list-item>
        <template slot="footer">
          <div v-if="started" style="display: flex; flex-flow:column;"><Button style="align-self: center" @click="submit">提交</Button></div>
        </template>
      </list>
    </card>
</template>

<script>
import { getQues, endAsk, startAsk } from '../../api/student'

export default {
  name: 'index',
  data: function () {
    return {
      title: '',
      exam_id: 0,
      problems: {},
      answer: {},
      started: false
    }
  },
  methods: {
    start: function () {
      getQues(this.exam_id).then((res) => {
        if (res.data.code === '0') {
          let ques = res.data.data.questions
          startAsk(this.exam_id).then((res) => {
            if (res.data.code === '0' || res.data.code === '402') {
              this.problems = ques
              this.started = true
            }
          })
        } else this.$Message.info('获取题目列表失败')
      }).catch(() => {
        this.$Message.info('获取题目列表失败')
      })
    },
    submit () {
      let ans = this.answer
      for (let key in ans) {
        if (Array.isArray(ans[key])) {
          ans[key].sort()
        } else {
          ans[key] = [ ans[key] ]
        }
      }
      endAsk(this.exam_id, 0, ans).then((res) => {
        if (res.data.code === '0') {
          this.$Message.info('提交成功')
          this.started = false
        } else this.$Message.info('提交失败')
      }).catch(() => {
        this.$Message.info('提交失败')
      })
    }
  },
  computed: {
    problem_list: function () {
      let problems = this.problems
      let list = []
      for (let key in problems) {
        let cont = problems[key][0]
        list[cont.q_rank] = cont
      }
      return list
    }
  },
  mounted () {
    this.title = this.$route.params.title
    this.exam_id = this.$route.params.id
  }
}
</script>

<style scoped>

</style>
