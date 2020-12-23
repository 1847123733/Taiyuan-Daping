<template>
  <div class="page-wrapper">
    <div class="wrapper">
      <img src="../../assets/logotaiyuan.png" alt="">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'index'
  }
</script>

<style scoped>
  .page-wrapper {
    width: 100%;
    height: 100%;
    background-image: url("../../assets/background1.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .wrapper {
    width: 50%;
  }

  .wrapper > img {
    width: 100%;
  }
</style>
