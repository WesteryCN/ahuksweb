<template>
  <card :bordered="false"><h2 slot="title">班级列表</h2>
  <collapse accordion @on-change="open_class">
    <panel v-for="item in class_list" :key="item.id" :name="item.id">
      <span>{{item.class_name}}</span>
      <span style="float: right;padding-right: 10%">创建教师：{{item.t_name}}</span>
      <list slot="content" :loading="loading_stu">
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
              <a >详细信息</a>
            </li>
            <li>
              <a>删除</a>
              <modal title="删除">您确定要删除吗？</modal>
            </li>
          </template>
        </list-item>
        <template slot="footer">
          <Page :total="student_list.length" :page-size="page_size" :current="cur_page" @on-change="change_page"/>
        </template>
      </list>
    </panel>
  </collapse>
  </card>

</template>

<script>
import { getClasses, getStudent } from '../../api/teacher'

export default {
  name: 'student',
  data: function () {
    return {
      page_size: 30,
      cur_page: 1,
      loading_stu: false,
      classes: {
        1: [{
          // class_name: '123',
          // t_name: 'abc'
        }]
      },
      students: {
        // '5': [
        //   {
        //     's_number': 'E104',
        //     's_name': '樊梓林3',
        //     'class_id': 2,
        //     'sex': 1,
        //     'grade': 2017,
        //     'academy': '计算机科学与技术',
        //     'email': null
        //   }
        // ]
      }
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
  }

}
</script>

<style scoped>

</style>
