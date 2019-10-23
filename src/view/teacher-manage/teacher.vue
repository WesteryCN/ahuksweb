<style lang="less">
  @import './index.less';
</style>

<template>

  <div>
    <List size="large" border class="my-list">
      <template slot="header">
        <div style="display: flex; align-items: flex-start; width: 100%">
          <h2 style="width: 100%;">教师列表</h2>
          <Button>添加教师</Button>
        </div>
      </template>
      <List-item v-for="item in cur_list" v-bind:key="item.name">
        <span style="width: 100%">{{item.name}}<Divider type="vertical" />{{item.number}}</span>
        <template slot="action">
<!--          <li>-->
<!--            <a>详情</a>-->
<!--          </li>-->
          <li>
            <a @click="psw_modal=true">修改密码</a>
            <modal v-model="psw_modal" title="修改密码" @on-ok="setPassword" :loading="loading_modal">
              <Form :model="psw_form" label-position="left" :label-width="70">
                <FormItem label="新密码">
                  <Input type="password" password v-model="psw_form.passwd"></Input>
                </FormItem>
              </Form>
            </modal>
          </li>
        </template>
      </List-item>
      <template slot="footer">
        <Page :total="t_list.length" :page-size="page_size" :current="cur_page" @on-change="change_page"/>
      </template>
    </List>

    </div>
</template>

<script>
import { setPassword } from '../../api/teacher'

export default {
  name: 'teacher',
  data: function () {
    return {
      t_list: [],
      cur_page: 1,
      page_size: 10,
      psw_modal: false,
      loading_modal: true,
      psw_form: {
        passwd: ''
      }
    }
  },
  methods: {
    change_page: function (page) {
      this.cur_page = page
    },
    setPassword: function () {
      // this.$Message.info('密码修改成功')
      setPassword(this.psw_form).then(res => {
        if (res.data.code === '0') {
          this.$Message.info('密码修改成功')
          this.psw_modal = false
        } else {
          this.$Message.info(res.data.msg)
          this.psw_modal = false
        }
      }).catch(() => {
        this.$Message.info('密码修改失败')
        this.psw_modal = false
      })
    }
  },
  mounted: function () {
    let me = {
      name: this.$store.state.user.userName,
      number: this.$store.state.user.userNumber
    }
    this.t_list.push(me)
  },
  computed: {
    cur_list: function () {
      return this.t_list.slice((this.cur_page - 1) * this.page_size, this.cur_page * this.page_size)
    }
  },
  watch: {
    psw_modal: function () {
      this.psw_form.passwd = ''
    }
  }
}
</script>
