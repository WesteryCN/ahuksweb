<template>
    <card>
      <h1 style="width: 100%;text-align: center">{{title}}</h1>
      <br>
      <div style="display: flex; flex-flow:column;"><Button v-if="!started" style="align-self: center" @click="start">开始考试</Button></div>
      <h3 v-if="started" style="text-align: center; color: red">用时：{{str}}</h3>
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
      started: false,
      h: 0,
      m: 0,
      ms: 0,
      s: 0,
      time: 0,
      str: '',
      mytime: ''
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
              this.start_timer()
            }
          })
        } else this.$Message.info('获取题目列表失败')
      }).catch(() => {
        this.$Message.info('获取题目列表失败')
      })
    },
    submit () {
      let ans = this.answer
      this.stop_timer()
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
    },
    timer () { // 定义计时函数
      this.ms = this.ms + 50 // 毫秒
      if (this.ms >= 1000) {
        this.ms = 0
        this.s = this.s + 1 // 秒
      }
      if (this.s >= 60) {
        this.s = 0
        this.m = this.m + 1 // 分钟
      }
      if (this.m >= 60) {
        this.m = 0
        this.h = this.h + 1 // 小时
      }
      this.str = this.toDub(this.h) + ':' + this.toDub(this.m) + ':' + this.toDub(this.s) + ''/* +this.toDubms(this.ms)+"毫秒" */
      // document.getElementById('mytime').innerHTML=h+"时"+m+"分"+s+"秒"+ms+"毫秒";
    },

    reset () { // 重置
      clearInterval(this.time)
      this.h = 0
      this.m = 0
      this.ms = 0
      this.s = 0
      this.str = '00:00:00'
    },

    start_timer () { // 开始
      this.time = setInterval(this.timer, 50)
    },

    stop_timer () { // 暂停
      clearInterval(this.time)
    },

    toDub (n) { // 补0操作
      if (n < 10) {
        return '0' + n
      } else {
        return '' + n
      }
    },

    toDubms (n) { // 给毫秒补0操作
      if (n < 10) {
        return '00' + n
      } else {
        return '0' + n
      }
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
  },
  destroyed () {
    this.stop_timer()
  }
}
</script>

<style scoped>

</style>
