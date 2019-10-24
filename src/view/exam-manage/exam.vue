<template>
  <card :bordered="false"><h2 slot="title">考试列表</h2>
    <collapse accordion @on-change="open_exam">
      <panel v-for="item in exam_list" :key="item.id" :name="item.id">
        <span>{{item.name}}</span>
        <div slot="content">
          <row>
            <Col span="20">
            <tag>地点：{{item.place}}</tag>
            <tag>开始时间：{{item.start_at}}</tag>
            <tag>结束时间：{{item.end_at}}</tag>
            <tag>备注：{{item.note}}</tag>
            </Col>
          <Col span="4">
            <Button type="info" style="float: right">修改考试</Button>
          </Col>
          </row>
          <Divider />
        <list :loading="loading_stu">
          <template slot="header">
            <div style="display: flex; align-items: flex-start; width: 100%">
              <h3 style="width: 100%;">试题列表</h3>
              <Button>添加试题</Button>
            </div>
          </template>
          <list-item v-for="(problem, id) in problem_list" v-if="problem!=null" :key="id"  >
            <span style="width:100%">{{id}}.{{problem.q_title}}</span>
            <!--          <ListItemMeta :title="student.s_name" :description="'学号：'+student.s_number"></ListItemMeta>-->
            <template slot="action">
              <li>
                <a @click="q_detail(id)">详细信息</a>
                <modal v-model="detail_modal" >
                  <Form :model="problem_detail" label-width="100%" >
                    <form-item label="序号"><span>{{problem_detail.q_rank}}</span></form-item>
                    <form-item label="题目"><span>{{problem_detail.q_title}}</span></form-item>
                    <form-item label="题目类型"><span>{{types[problem_detail.type]}}</span></form-item>
                    <form-item label="答案选项"><list>
                      <list-item v-for="(item, key) in problem_detail.q_answers" :key="key">
                      {{key}}.{{item}}
                    </list-item></list></form-item>
                    <form-item label="正确答案"><span v-for="(item, index) in problem_detail.right_answer" :key="index">{{item}}<Divider v-if="index<problem_detail.right_answer.length-1" /></span></form-item>
                    <form-item label="分值"><span>{{problem_detail.q_mark}}</span></form-item>
                  </Form>
                </modal>
              </li>
              <li>
                <a @click="del_modal=true">删除</a>
                <modal title="删除" v-model="del_modal">您确定要删除吗？</modal>
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
import { getExam, getProblem } from '../../api/teacher'

export default {
  name: 'exam',
  data: function () {
    return {
      loading_stu: false,
      del_modal: false,
      detail_modal: false,
      exams: {},
      problems: {},
      problem_detail: {},
      types: {
        1: '填空',
        2: '选择'
      }
    }
  },
  methods: {
    open_exam: function (id) {
      console.log(id)
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
    q_detail: function (id) {
      this.problem_detail = this.problem_list[id]
      this.detail_modal = true
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
  mounted: function () {
    getExam({}).then((res) => {
      if (res.data.code === '0') {
        this.exams = res.data.data
      } else {
        this.$Message.info('获取考试列表失败')
      }
    }).catch(() => {
      this.$Message.info('获取考试列表失败')
    })
  }
}
</script>

<style scoped>

</style>
