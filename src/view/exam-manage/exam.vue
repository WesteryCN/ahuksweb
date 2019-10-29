<template>
  <card :bordered="false">
    <template slot="title" >
      <div style="display: flex;">
    <h2 style="width: 100%">考试列表</h2>
    <Button @click="add_exam_modal=true" type="info">添加考试</Button></div>
      <modal v-model="add_exam_modal" :loading="loading_add_exam" @on-ok="submit_add_exam">
        <br><br>
        <Form :model="new_exam" :label-width="100" >
          <form-item label="考试名称" required><Input v-model="new_exam.exam_name"></Input></form-item>
          <form-item label="地点" required><Input v-model="new_exam.place"></Input></form-item>
          <form-item label="开始时间" required><date-picker type="datetime" @on-change="set_start_at"></date-picker></form-item>
          <form-item label="结束时间" required><date-picker type="datetime" @on-change="set_end_at"></date-picker></form-item>
          <form-item label="总分" required><Input v-model="new_exam.total_score"></Input></form-item>
          <form-item label="备注" required><Input v-model="new_exam.note"></Input></form-item>
        </Form>
      </modal>
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
          <Col span="4">
            <Button type="error" style="float: right">删除考试</Button>
          </Col>
          </row>
          <Divider />
        <list :loading="loading_stu">
          <template slot="header">
            <div style="display: flex; align-items: flex-start; width: 100%">
              <h3 style="width: 100%;">试题列表</h3>
              <Button @click="add_pro" type="info">添加试题</Button>
              <modal v-model="add_pro_modal" :loading="loading_add_pro" @on-ok="submit_add_pro">
                <Form :model="new_problem" :label-width="100" >
                  <form-item label="序号" style="width: 30%" required><Input v-model="new_problem.q_rank"></Input></form-item>
                  <form-item label="题目类型" required><RadioGroup v-model="new_problem.q_type">
                    <radio label="1">填空</radio>
                    <radio label="2">选择</radio>
                  </RadioGroup></form-item>
                  <form-item label="题目题干" required><Input v-model="new_problem.q_title" type="textarea" :rows="3"></Input></form-item>
                  <form-item v-if="new_problem.q_type==='2'" label="答案选项" required>
                    <list border size="small">
                      <list-item v-for="(item, key) in new_problem.q_answers" :key="key">
                        {{key}}.&nbsp;
                        <Input v-model="new_problem.q_answers[key]" style="width: 90%"></Input>
                        <div style="width: 10%"><a style="float: right" @click="del_ans(key)">×</a></div>
                      </list-item>
                      <template slot="footer">
                        <a @click="add_ans">添加选项</a>
                      </template>
                    </list>
                  </form-item>
                  <form-item label="正确答案" required>
                    <checkbox-group v-if="new_problem.q_type==='2'" v-model="new_problem.right_answer">
                      <checkbox v-for="(ans,key) in new_problem.q_answers" :key="key" :label="key" >{{key}}</checkbox>
                    </checkbox-group>
                    <Input v-else v-model="new_problem.right_answer"></Input>
                  </form-item>
                  <form-item label="分值" required><Input v-model="new_problem.q_mark" style="width: 30%"></Input>
                  (剩余分值：{{left_mark}})</form-item>
                </Form>
              </modal>
            </div>
          </template>
          <list-item v-for="(problem, id) in problem_list" v-if="problem!=null" :key="id"  >
            <span style="width:100%">{{problem.q_rank}}.{{problem.q_title}}</span>
            <!--          <ListItemMeta :title="student.s_name" :description="'学号：'+student.s_number"></ListItemMeta>-->
            <template slot="action">
              <li>
                <a @click="q_detail(id)">详细信息</a>
                <modal v-model="detail_modal" >
                  <Form :model="problem_detail" :label-width="100" >
                    <form-item label="序号"><span>{{problem_detail.q_rank}}</span></form-item>
                    <form-item label="题目"><span>{{problem_detail.q_title}}</span></form-item>
                    <form-item label="题目类型"><span>{{types[problem_detail.type]}}</span></form-item>
                    <form-item v-if="problem_detail.type===2" label="答案选项">
                      <list border>
                      <list-item v-for="(item, key) in problem_detail.q_answers" :key="key">
                      {{key}}.{{item}}
                    </list-item></list></form-item>
                    <form-item label="正确答案">
                      <span v-for="(item, index) in problem_detail.right_answer" :key="index">{{item}}
                      <Divider v-if="index<problem_detail.right_answer.length-1"  type="vertical"/></span>
                    </form-item>
                    <form-item label="分值"><span>{{problem_detail.q_mark}}</span></form-item>
                  </Form>
                </modal>
              </li>
              <li>
                <a @click="del_pro(problem.q_rank)">删除</a>
                <modal title="删除" v-model="del_pro_modal" @on-ok="del_problem" :loading="loading_del_pro">您确定要删除吗？</modal>
              </li>
            </template>
          </list-item>
          <template slot="footer">
            <!--          <Page :total="student_list.length" :page-size="page_size" :current="cur_page" @on-change="change_page"/>-->
          </template>
        </list>
        </div>
      </panel>
    </collapse>
  </card>

</template>

<script>
import { getExam, getProblem, delProblem, getLeftScore, addProblem, addExam } from '../../api/teacher'

export default {
  name: 'exam',
  data: function () {
    return {
      loading_stu: true,
      add_pro_modal: false,
      del_pro_modal: false,
      detail_modal: false,
      add_exam_modal: false,
      loading_del_pro: true,
      loading_add_pro: true,
      loading_add_exam: true,
      new_problem: {},
      exams: {},
      problems: {},
      problem_detail: {},
      new_exam: {},
      left_mark: 0,
      selected_exam: [],
      selected_q_rank: 0,
      types: {
        1: '填空',
        2: '选择'
      }
    }
  },
  methods: {
    open_exam: function (id) {
      // console.log(id)
      if (id.length === 0) return
      this.loading_stu = true
      this.problems = {}
      getProblem(id).then((res) => {
        if (res.data.code === '0') {
          this.problems = res.data.data.questions
        } else this.$Message.info('获取题目列表失败')
      }).catch(() => {
        this.$Message.info('获取题目列表失败')
      })
      this.loading_stu = false
    },
    del_pro: function (q_rank) {
      this.selected_q_rank = q_rank
      this.del_pro_modal = true
    },
    q_detail: function (id) {
      this.problem_detail = this.problem_list[id]
      this.detail_modal = true
    },
    del_problem: function () {
      // debugger
      let exam_id = this.selected_exam[0]
      let q_rank = this.selected_q_rank
      delProblem({ exam_id, q_rank }).then(
        (res) => {
          if (res.data.code === '0') {
            this.$Message.info('删除成功')
            this.open_exam(exam_id)
          } else {
            this.$Message.info(res.data.msg)
          }
          this.del_pro_modal = false
        }
      ).catch(
        () => {
          this.$Message.info('删除失败')
          this.del_pro_modal = false
        }
      )
    },
    add_ans: function () {
      let a = {}
      if (this.new_problem.hasOwnProperty('q_answers')) {
        a = this.new_problem.q_answers
        delete this.new_problem.q_answers
      }
      let key = String.fromCharCode('A'.charCodeAt() + Object.keys(a).length)
      // alert(Object.keys(a).length)
      a[key] = ''
      this.$set(this.new_problem, 'q_answers', a)
    },
    del_ans: function (id) {
      let a = this.new_problem.q_answers
      delete a[id]
      delete this.new_problem.q_answers
      this.$set(this.new_problem, 'q_answers', a)
    },
    add_pro: function () {
      this.add_pro_modal = true
      getLeftScore(this.selected_exam[0]).then(
        (res) => {
          if (res.data.code === '0') {
            this.left_mark = res.data.data.left_score
          }
        }
      )
    },
    submit_add_pro: function () {
      this.new_problem.exam_id = this.selected_exam[0]
      addProblem(this.new_problem).then((res) => {
        if (res.data.code === '0') {
          this.$Message.info('添加成功')
          this.add_pro_modal = false
          this.open_exam(this.selected_exam[0])
        } else {
          this.$Message.info('添加失败')
          // this.add_pro_modal = false
        }
      }).catch(() => {
        this.$Message.info('添加失败')
        // this.add_pro_modal = false
      })
    },
    submit_add_exam: function () {
      // this.new_exam.start_at = (this.new_exam.start_at).format('yyyy-MM-dd HH:mm:ss')
      // this.new_exam.end_at = (this.new_exam.end_at).format('yyyy-MM-dd HH:mm:ss')
      addExam(this.new_exam).then((res) => {
        if (res.data.code === '0') {
          this.$Message.info('添加成功')
          this.add_exam_modal = false
          this.refreshExam()
        } else {
          this.$Message.info('添加失败')
        }
      }).catch(() => {
        this.$Message.info('添加失败')
      })
    },
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
    set_start_at: function (t) {
      this.new_exam.start_at = t
    },
    set_end_at: function (t) {
      this.new_exam.end_at = t
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
    },
    problem_list: function () {
      let problems = this.problems
      let list = []
      for (let key in problems) {
        let cont = problems[key][0]
        cont.id = key
        list[cont.q_rank] = cont
      }
      return list
    }
  },
  watch: {
    add_pro_modal: function () {
      this.new_problem = {}
    }
  },
  mounted: function () {
    this.refreshExam()
  }
}
</script>

<style scoped>

</style>
