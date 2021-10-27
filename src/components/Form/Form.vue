<template>
  <form class="modal-form" @submit.prevent="onSubmit">

    <div class="modal-form__top" :class="{ errorInput: v$.earn.$error }">
      <span class="small-title">Ваша зарплата в месяц</span>
      <div class="input-wrapper">
        <input
          v-model="earnMask"
          v-money3="configMask"
          id="earnMask"
          class="modal-form__input"
          :class="{ error: v$.earn.$error }"
          @click="placeholderActive = false"
        >
        <label for="earnMask" class="placeholder" v-if="placeholderActive" @click="!placeholderActive">Введите данные</label>
      </div>
      <ValidateErrors :errors="v$.earn.$errors"/>
      <span class="modal-form__calc" @click="CalcTax()">Рассчитать</span>
    </div>

    <!--Чекбоксы с выбором года-->
    <div class="modal-form__center" v-if="successCalc">
      <span class="small-title">Итого можете внести в качестве досрочных:</span>
      <YearList :items="getYearsList" />
    </div>

    <!--Теги-->
    <div class="modal-form__bottom">
      <span class="small-title">Что уменьшаем?</span>
      <TagList :items="getTagsList" />
    </div>

    <AppButton btnClass="btn-gradient" :disabled="!successCalc">Добавить</AppButton>

  </form>
</template>

<script>
import AppButton from '@/components/UI/Controls/Button'
import YearList from '@/components/Form/YearList'
import TagList from '@/components/Form/TagList'
import Vuelidate from '@vuelidate/core'
import { required, minLength, helpers } from '@vuelidate/validators'
import ValidateErrors from '@/components/Form/ValidateErrors'
import { Money3Directive } from 'v-money3'

export default {
  components: {
    AppButton,
    YearList,
    TagList,
    ValidateErrors
  },
  directives: {
    money3: Money3Directive
  },
  data () {
    return {
      earn: 0,
      earnMask: '0',
      configMask: {
        suffix: ' ₽',
        thousands: ' ',
        decimal: '.',
        precision: 0,
        disableNegative: true
      },
      placeholderActive: true,
      successCalc: false
    }
  },
  computed: {
    getYearsList() {
      return this.$store.getters.getYearsList
    },
    getTagsList() {
      return this.$store.getters.getTagsList
    }
  },
  methods: {
    CalcTax () {
      this.v$.$touch()
      this.earn = this.earnMask.replace(/[^0-9]/g, '')
      if(this.earn === '0') {
        this.earn = ''
      }
      if(!this.v$.$invalid) {
        this.successCalc = true
        this.$store.dispatch('setYearsList', this.earn)
      }
    },
    onSubmit () {
      this.v$.$touch()
      if(!this.v$.$invalid) {
        this.earnMask = '0 ₽'
        this.successCalc = false
        this.placeholderActive = true
        this.$store.dispatch('clearYearsList')
        this.v$.$reset()
        this.$emit('close')
      }
    }
  },
  setup () {
    return {
      v$: Vuelidate()
    }
  },
  validations: {
    earn: {
      required: helpers.withMessage('Поле обязательно для заполнения', required),
      minLength: helpers.withMessage('Минимальная длинна поля 5 символов', minLength(5))
    }
  }
}
</script>

<style lang="scss">
.small-title {
  display: block;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
}

.modal-form__top {
  padding-bottom: 24px;
}

.input-wrapper {
  position: relative;

  label.placeholder {
    position: absolute;
    top: 18px;
    left: 10px;
    font-size: 14px;
    color: #BEC5CC;
    background: #fff;
    cursor: auto;
    transition: .3s;

    &:hover {
      opacity: 0;
    }
  }

  &:hover {
    label.placeholder {
      opacity: 0;
    }
  }
}

.modal-form__input {
  width: 100%;
  padding: 8px 10px;
  margin: 8px 0;
  border-radius: 3px;
  line-height: 24px;
  transition: .3s;

  &:hover {
    border: 1px solid #000;
  }

  &::placeholder {
    color: #BEC5CC;
  }

  &.error {
    border-color: #EA0029;
  }
}

.modal-form__calc {
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: #F53A31;
  cursor: pointer;
  transition: .3s;

  &:hover {
    color: #EA0029;
  }
}

.modal-form__center {
  padding-bottom: 32px;
}

.modal-form__bottom {
  display: flex;
  align-items: center;
  padding-bottom: 52px;
}

@media screen and (max-width: 576px) {
  .modal-title {
    font-size: 18px;
    line-height: 24px;
  }

  .modal-text p {
    font-size: 12px;
    line-height: 16px;
  }

  .modal-form__center {
    .small-title {
      padding-right: 40%;
    }
  }

  .modal-form__bottom {
    display: block;
  }
}
</style>
