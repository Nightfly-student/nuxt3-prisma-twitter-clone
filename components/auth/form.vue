<template>
  <div>
    <div class="pt-5 space-y-6">
      <UIInput
        placeholder="@username"
        v-model="data.username"
        label="Username"
      ></UIInput>

      <UIInput
        placeholder="*******"
        v-model="data.password"
        label="Password"
        type="password"
      ></UIInput>
      <div>
        <button @click="handleLogin">Login</button>
      </div>
    </div>
  </div>
</template>
<script setup>
const data = reactive({
  username: "",
  password: "",
  loading: false,
})

async function handleLogin() {
  const { login } = useAuth()

  data.loading = true
  try {
    await login({
      username: data.username,
      password: data.password,
    })
  } catch (err) {
    console.log(err)
  } finally {
    data.loading = false
  }
}
</script>
