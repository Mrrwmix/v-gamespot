<template>
  <header>
    <div class="container header_container">
      <div class="logo">
        <router-link to="/">V-GameSpot</router-link>
      </div>
      <div class="login">
        <router-link to="/signin">
          <img :src="require('../../assets/images/login.png')" />
        </router-link>
      </div>
    </div>
  </header>
</template>

<script>
export default {};
</script>
