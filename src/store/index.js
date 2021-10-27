import { createStore } from 'vuex'

export const store = createStore({
  state: {
    yearsList: null,
    tagsList: [
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
  },
  actions: {
    setYearsList ({commit}, earn) {
      let maxSum = 260000, // Максимальная сумма налогового вычета
          taxYear = (earn * 12) * 0.13, // 13% от заработка за год
          taxYearMoney = taxYear.toLocaleString(), // Форматируем 13% от заработка за год в формат цены
          totalYears = maxSum / taxYear, // На сколько лет разобьется максимальная сумма налогового вычета
          wholeYears = Math.floor(totalYears), // Кол-во целых лет
          allYears = Math.ceil(totalYears), // Кол-во целых лет с округлением последнего года до целого
          lastYear = totalYears - wholeYears, // Остаток последнего года без округления (Дробное число)
          taxLastYear = Math.round(taxYear * lastYear), // Определяем остаток денег на последний год
          taxLastYearMoney = taxLastYear.toLocaleString(), // Форматируем остаток денег на последний год в формат цены
          yearsList = [],
          id = 1,
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
        yearsList.push({
          id: 1,
          year: 'в 1-ый год',
          value : 260000,
          money : '260 000'
        })
      } else {
        // При каждой итерации цикла заносим новый год в массив
        for (let i = 0; i < wholeYears; i++) {
          fmtYear()
          yearsList.push({
            id: id,
            year: year,
            value : taxYear,
            money : taxYearMoney
          })
          id++
          // На последней итерации заносим в массив остатки на последний год
          if (id == allYears) {
            fmtYear()
            yearsList.push({
              id: id,
              year: year,
              value : taxLastYear,
              money : taxLastYearMoney
            })
          }
        }
      }
      commit('setYearsList', yearsList)
    },
    clearYearsList({commit}) {
      commit('clearYearsList')
    },
    setActiveTag({commit}, item) {
      commit('setActiveTag', item)
    }
  },
  mutations: {
    setYearsList (state, yearsList) {
      state.yearsList = yearsList
    },
    clearYearsList(state) {
      state.yearsList = null
    },
    setActiveTag(state, item) {
      state.activeTag = item.value
    }
  },
  getters: {
    getYearsList (state) {
      return state.yearsList
    },
    getTagsList (state) {
      return state.tagsList
    },
    getActiveTag (state) {
      return state.activeTag
    }
  }
})
