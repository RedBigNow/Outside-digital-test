<template>
  <div class="wrapper">
    <div class="wrapper-content">
      <div class="hero-btn">
        <AppButton @click="modalShow = !modalShow">Налоговый вычет</AppButton>
      </div>
      <modal title="Налоговый вычет" v-show="modalShow" @close="modalShow = false">
        <template v-slot:body>
          <div class="modal-text">
            <p>Используйте налоговый вычет чтобы погасить ипотеку досрочно. Размер налогового вычета составляет не более 13% от своего официального годового дохода.</p>
          </div>
          <Form @close="modalShow = false"/>
        </template>
      </modal>
    </div>
  </div>
</template>

<script>
import modal from '@/components/UI/Modal'
import Form from '@/components/Form/Form'
import AppButton from '@/components/UI/Controls/Button.vue'

export default {
  components: {
    modal,
    Form,
    AppButton
  },
  data () {
    return {
      modalShow: false
    }
  }
}
</script>

<style lang="scss">
.hero-btn {
  height: 100vh;
  max-width: 200px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.modal-text {
  margin-bottom: 24px;

  p {
    font-size: 14px;
    line-height: 24px;
    color: #808080;
  }
}
</style>
