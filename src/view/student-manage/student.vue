<template>
  <card :bordered="false"><h2 slot="title">班级列表</h2>
  <collapse accordion @on-change="open_class">
    <panel v-for="item in class_list" :key="item.id" :name="item.id">
      <span>{{item.class_name}}</span>
      <span style="float: right;padding-right: 10%">创建教师：{{item.t_name}}</span>
      <div slot="content">
        <Button type="info" @click="list_exam(item.id)">开启考试</Button>
        <modal v-model="list_exam_modal" :loading="list_exam_loading" @on-ok="submit_list_exam(del_class_id)">
<!--          <Form :label-width="120" >-->
<!--            <form-item label="本班参加的考试">-->
          <h3>本班参加的考试</h3>
          <Divider />
              <checkbox-group v-model="selected_exams">
                <checkbox v-for="(name, key) in exam_list" :key="key" :label="key">{{name}}</checkbox>
              </checkbox-group>
<!--            </form-item>-->
<!--          </Form>-->
        </modal>
        <Divider />
      <list :loading="loading_stu">
        <template slot="header">
          <div style="display: flex; align-items: flex-start; width: 100%">
            <h3 style="width: 100%;">学生列表</h3>
            <Button>添加学生</Button>
          </div>
        </template>
        <list-item v-for="(student, id) in student_list" :key="id"  >
          <span style="width:100%">{{student.s_name}}</span>
<!--          <ListItemMeta :title="student.s_name" :description="'学号：'+student.s_number"></ListItemMeta>-->
          <template slot="action">
            <li>
              <a @click="detail_modal=true">详细信息</a>
              <modal v-model="detail_modal" ></modal>
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
import { getClasses, getStudent, getExam, getClassExam, addClassExam, delClassExam } from '../../api/teacher'
import { arrSubtraction } from '../../libs/util'

export default {
  name: 'student',
  data: function () {
    return {
      page_size: 30,
      cur_page: 1,
      loading_stu: false,
      del_modal: false,
      detail_modal: false,
      list_exam_modal: false,
      list_exam_loading: true,
      del_class_id: 0,
      classes: {
        1: [{
        }]
      },
      students: {},
      exam_list: {},
      class_exams: [],
      selected_exams: [],
      deleted_exams: []
    }
  },
  methods: {
    open_class: function (cid) {
      this.loading_stu = true
      this.students = {}
      getStudent(cid).then((res) => {
        if (res.data.code === '0') {
          this.students = res.data.data
        } else this.$Message.info('获取学生列表失败')
      }).catch(() => {
        this.$Message.info('获取学生列表失败')
      })
      this.loading_stu = false
    },
    list_exam: function (class_id) {
      this.del_class_id = class_id
      getClassExam(class_id).then(
        (res) => {
          if (res.data.code === '0') {
            let exams = res.data.data.exam
            for (let key in exams) {
              this.class_exams.push(String(exams[key][0].exam_info[0].id))
              this.selected_exams.push(String(exams[key][0].exam_info[0].id))
            }
          }
        }
      )
      this.list_exam_modal = true
    },
    submit_list_exam: function (class_id) {
      new Promise((resolve, reject) => {
        let arr = arrSubtraction(this.selected_exams, this.class_exams)
        if (arr.length === 0) resolve()
        for (let exam_id of arr) {
          addClassExam({ class_id, exam_id }).then(
            (res) => {
              if (res.data.code !== '0') {
                reject(new Error('error'))
              } else {
                if (exam_id === arr[arr.length - 1]) {
                  resolve()
                }
              }
            }
          ).catch(() => {
            reject(new Error('error'))
          })
        }
      }).then(() => {
        let arr = arrSubtraction(this.class_exams, this.selected_exams)
        if (arr.length === 0) {
          this.list_exam_modal = false
          this.$Message.info('考试更新成功')
        }
        for (let exam_id of arr) {
          delClassExam({ class_id, exam_id }).then(
            (res) => {
              if (res.data.code !== '0') {
                this.$Message.info('考试更新失败')
                this.list_exam_modal = false
              } else {
                if (exam_id === arr[arr.length - 1]) {
                  this.list_exam_modal = false
                  this.$Message.info('考试更新成功')
                }
              }
            }
          ).catch(() => {
            this.$Message.info('考试更新失败')
            this.list_exam_modal = false
          })
        }
      })
    }
  },
  computed: {
    class_list: function () {
      let list = []
      for (let key in this.classes) {
        let item = this.classes[key][0]
        item['id'] = key
        list.push(item)
      }
      return list
    },
    student_list: function () {
      let list = this.students
      for (let key in list) {
        list[key] = list[key][0]
      }
      return list
    }
  },
  watch: {
    list_exam_modal: function () {
      this.class_exams = []
      this.selected_exams = []
    }
  },
  mounted: function () {
    getClasses({}).then((res) => {
      if (res.data.code === '0') {
        this.classes = res.data.data.class
      } else {
        this.$Message.info('获取班级列表失败')
      }
    }).catch(() => {
      this.$Message.info('获取班级列表失败')
    })
    getExam().then((res) => {
      if (res.data.code === '0') {
        let exams = res.data.data
        let list = {}
        for (let key in exams) {
          list[exams[key][0].id] = exams[key][0].name
        }
        this.exam_list = list
      }
    }).catch()
  }

}
</script>

<style scoped>

</style>
