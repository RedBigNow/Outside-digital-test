<template>
    <modal title="Налоговый вычет" @close="$emit('close')">
        <div slot="body">
            <div class="modal-text">
                <p>Используйте налоговый вычет чтобы погасить ипотеку досрочно. Размер налогового вычета составляет не более 13% от своего официального годового дохода.</p>
            </div>
            <form class="modal-form" @submit.prevent="onSubmit">

                <div class="modal-form__top" :class="{ errorInput: $v.earn.$error }">
                    <span class="small-title">Ваша зарплата в месяц</span>
                    <div class="input-wrapper">
                        <input 
                            v-model="earnMask"
                            v-money="money"
                            id="earnMask"
                            class="modal-form__input"
                            :class="{ error: $v.earn.$error }"
                            @click="placeholderActive = false"
                            >
                        <label for="earnMask" class="placeholder" v-if="placeholderActive" @click="!placeholderActive">Введите данные</label>
                    </div>
                    <p class="errorText" v-if="!$v.earn.required">Поле обязательно для заполнения</p>
                    <p class="errorText" v-if="!$v.earn.minLength"> Минимальная длинна поля {{ $v.earn.$params.minLength.min }} символов</p>
                    <span class="modal-form__calc" @click="CalcTax()">Рассчитать</span>

                </div>

                <div class="modal-form__center" v-if="successCalc">
                    <span class="small-title">Итого можете внести в качестве досрочных:</span>
                    <div class="year-list">
                        <div class="year-item" v-for="(year, id) in yearList" :key="id">
                            <input class="modal-form__checkbox" type="checkbox" :id="year.id" :name="year.id" :value="year.value" checked>
                            <label :for="year.id">{{year.money}} рублей <span> {{year.year}}</span></label>
                        </div>
                    </div>
                </div>

                <div class="modal-form__bottom">
                    <span class="small-title">Что уменьшаем?</span>
                    <div class="tag-list">
                        <div class="tag-item" :class="{ 'tag-item--active': activeTag === tag.value }" v-for="(tag, id) in tags" :key="id" @click="activeTag = tag.value">
                            <label :for="tag.value">{{ tag.label }}</label>
                            <input class="modal-form__radio" :id="tag.value" name="decrease" type="radio" :value="tag.value" :checked="activeTag === tag.value">
                            <p> {{tag.active}} </p>
                        </div>
                    </div>
                </div>

                <button :disabled="!successCalc" class="btn btn-gradient" @click="modalShow = !modalShow">Добавить</button>
                
            </form>
        </div>
    </modal>
</template>

<script>
import modal from '@/components/UI/Modal.vue'
import { required, minLength } from 'vuelidate/lib/validators' //Валидация
import {VMoney} from 'v-money' // Маска для инпута с зарплатой

export default {
    components: { modal },
    directives: { money: VMoney },
    data () {
        return {
            modalShow: false,
            earn: 0,
            earnMask: '0',
            money: {
                decimal: ',',
                thousands: ' ',
                prefix: '',
                suffix: ' ₽',
                precision: 0,
                masked: false
            },
            successCalc: false,
            placeholderActive: true,
            yearList: [],
            tags: [
                {
                    id: 1,
                    value: 'payment',
                    label: 'Платёж'
                },
                {
                    id: 2,
                    value: 'time',
                    label: 'Срок'
                }
            ],
            activeTag: 'payment'
        }
    },
    methods: {
        // Расчет суммы и срока внесения досрочных
        CalcTax () {
            this.$v.$touch()

            this.earn = this.earnMask.replace(/[^0-9]/g, '') 

            if(this.earn === '0') {
                this.earn = ''
            }

            if(!this.$v.$invalid) {
                this.yearList = []
                this.successCalc = true

                let maxSum = 260000, // Максимальная сумма налогового вычета
                    salaryMonth = this.earnMask.replace(/[^0-9]/g, ''), //Получение данных из инпута с зарплатой и приведение к числу без символов и пробелов
                    taxYear = (salaryMonth * 12) * 0.13, // 13% от заработка за год
                    taxYearMoney = taxYear.toLocaleString(), // Форматируем 13% от заработка за год в формат цены
                    totalYears = maxSum / taxYear, // На сколько лет разобьется максимальная сумма налогового вычета
                    wholeYears = Math.floor(totalYears), // Кол-во целых лет
                    allYears = Math.ceil(totalYears), // Кол-во целых лет с округлением последнего года до целого
                    lastYear = totalYears - wholeYears, // Остаток последнего года без округления (Дробное число)
                    taxLastYear = Math.round(taxYear * lastYear), // Определяем остаток денег на последний год
                    taxLastYearMoney = taxLastYear.toLocaleString() // Форматируем остаток денег на последний год в формат цены

                // Получение читаемого года по порядковому номеру
                let id = 1,
                    year = null

                const fmtYear = () => {
                    if (id === 2) {
                        year = `во ${id}-ой год`
                    } else if (id === 3 || id === 23 || id === 33) {
                        year = `в ${id}-ий год`
                    } else if (id === 6 || id === 7 || id === 8 || id === 22 || id === 26 || id === 27 || id === 28 || id === 32 || id === 36 || id === 37 || id === 38) {
                        year = `в ${id}-ой год`
                    } else {
                        year = `в ${id}-ый год`
                    }
                } 

                // Заполнение массива с чекбоксами
                if (taxYear >= maxSum) {
                    this.yearList.push({id: 1, year: 'в 1-ый год', value : 260000, money : '260 000'})
                } else {
                    // При каждой итерации цикла заносим новый год в массив
                    for (let i = 0; i < wholeYears; i++) {
                        fmtYear()
                        this.yearList.push({id: id, year: year, value : taxYear, money : taxYearMoney})
                        id++
                        // На последней итерации заносим в массив остатки на последний год
                        if (id == allYears) {
                            fmtYear()
                            this.yearList.push({id: id, year: year, value : taxLastYear, money : taxLastYearMoney})
                        }
                    }
                }
            }
        },
        // Успешная отправка формы
        onSubmit () {
            this.$v.$touch()
            if(!this.$v.$invalid) {
                //DONE
                this.earnMask = '0 ₽'
                this.yearList = []
                this.successCalc = false
                this.placeholderActive = true
                this.$v.$reset()
                this.$emit('close')
            }
        }
    },
    validations: {
        earn: {
            required,
            minLength: minLength(5)
        }
    },
}
</script>

<style lang="scss">
.modal-text {
    margin-bottom: 24px;

    p {
        font-size: 14px;
        line-height: 24px;
        color: #808080;
    }
}

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

.modal-form__bottom {
    display: flex;
    align-items: center;
    padding-bottom: 52px;
}

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

input.error {
    border-color: #EA0029;
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

    .year-list {
        max-height: none;
        overflow-y: visible;
    }

    .modal-form__bottom {
        display: block;
    }

    .tag-list {
        padding: 24px 0 0;
    }
}
</style>