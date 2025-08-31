<template>
  <LoginForm @login-success="handleLoginSuccess" />
</template>

<script>
import { useRouter } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'

export default {
  name: 'LoginPage',
  components: {
    LoginForm
  },
  setup() {
    const router = useRouter()

    const handleLoginSuccess = () => {
      router.push('/protected')
    }

    return {
      handleLoginSuccess
    }
  }
}
</script>
