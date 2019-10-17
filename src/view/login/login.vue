<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>

        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'

export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password, type }) {
      this.handleLogin({ userName, password, type }).then(res => {
        this.$Message.info(res)
        this.getUserInfo({ type }).then(
          this.$router.push({
            name: this.$config.homeName
          })
        )
      }).catch(res => {
        this.$Message.info(res)
      })
    }
  }
}
</script>

<style>

</style>
