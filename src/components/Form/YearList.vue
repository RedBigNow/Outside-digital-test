<template>
  <div class="year-list">
    <div class="year-item" v-for="(item, id) in items" :key="id">
      <input class="modal-form__checkbox" type="checkbox" :id="item.id" :name="item.id" :value="item.value" checked>
      <label :for="item.id">{{item.money}} рублей <span> {{item.year}}</span></label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss">
.year-list {
  max-height: 228px;
  overflow-y: auto;
}

.year-item {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #DFE3E6;
}

.modal-form__checkbox {
  position: absolute;
  z-index: -1;
  opacity: 0;
}

.modal-form__checkbox + label {
  color: #000;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  user-select: none;
  cursor: pointer;

  span {
    padding-left: 5px;
    color: #808080;
  }

  &:hover {
    &::before {
      border: 1px solid #000;
    }
  }

  &::before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    flex-grow: 0;
    border: 1px solid #DFE3E6;
    border-radius: 6px;
    margin-right: 10px;
    background: #fff;
    background-repeat: no-repeat;
    background-position: center center;
    cursor: pointer;
    transition: .3s;
  }
}

.modal-form__checkbox:checked + label::before {
  border-color: transparent;
  background: #FF5E56;
  background-image: url('~@/assets/images/check.svg'); /* fallback */
  background-image: url('~@/assets/images/check.svg'), linear-gradient(255.35deg, #DC3131 0.83%, rgba(255, 79, 79, 0) 108.93%);
  background-repeat: no-repeat;
  background-position: center center;
}

@media screen and (max-width: 576px) {
  .year-list {
    max-height: none;
    overflow-y: visible;
  }
}
</style>
