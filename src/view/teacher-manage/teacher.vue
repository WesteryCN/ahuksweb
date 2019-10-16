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
      <List-item v-for="item in t_list" v-bind:key="item.name">
        <span style="width: 100%">{{item.name}}</span>
        <template slot="action">
          <li>
            <a>详情</a>
          </li>
          <li>
            <a>删除</a>
          </li>
        </template>
      </List-item>
      <template slot="footer">
        <Page :total="100" :page-size="20" show-sizer></Page>
      </template>
    </List>

    </div>
</template>

<script>
export default {
  name: 'teacher',
  data: function () {
    return {
      t_list: [
        {
          name: 'ssz'
        },
        {
          name: 'lfx'
        }
      ]
    }
  }
}
</script>
