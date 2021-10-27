<template>
  <div class="input-errors" v-for="error of errors" :key="error.$uid">
    <p class="errorText">{{ error.$message }}</p>
  </div>
</template>

<script>
export default {
  props: {
    errors: {
      type: Array
    }
  }
}
</script>

<style lang="scss">
.modal-form__top .errorText {
  display: none;
  margin-top: -10px;
  font-size: 10px;
  color: #EA0029;
}

.modal-form__top {
  &.errorInput .errorText {
    display: block;
  }
}
</style>
