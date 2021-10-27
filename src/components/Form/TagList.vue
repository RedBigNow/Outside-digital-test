<template>
  <div class="tag-list">
    <div v-for="(item, id) in items" :key="id" @click="setActiveTag(item)" class="tag-item" :class="{ 'tag-item--active': getActiveTag === item.value }">
      <label :for="item.value">{{ item.label }}</label>
      <input class="modal-form__radio" :id="item.value" name="decrease" type="radio" :value="item.value" :checked="getActiveTag === item.value">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array
    }
  },
  computed: {
    getActiveTag() {
      return this.$store.getters.getActiveTag
    }
  },
  methods: {
    setActiveTag(item) {
      this.$store.dispatch('setActiveTag', item)
    }
  }
}
</script>

<style lang="scss">
.tag-list {
  display: flex;
  align-items: center;
  padding-left: 32px;
}

.tag-item {

  &:nth-child(1) {
    margin-right: 16px;
  }

  label {
  padding: 12px;
  border-radius: 50px;
  background: #EEF0F2;
  cursor: pointer;
  transition: .3s;

    &:hover {
      background: #DFE3E6;
    }
  }

  &.tag-item--active {
    label {
      color: #fff;
      background: linear-gradient(255.35deg, #DC3131 0.83%, rgba(255, 79, 79, 0) 108.93%), #FF5E56;
    }
  }
}

.modal-form__radio {
  display: none;
}

@media screen and (max-width: 576px) {
  .tag-list {
    padding: 24px 0 0;
  }
}
</style>
