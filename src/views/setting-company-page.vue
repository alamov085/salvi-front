<template lang="pug">
    .section__content
        .caption Налаштування компанії
        v-snackbar(
            v-model="alert"
            dismissible
            type="success"
            :top="false"
            :bottom="true"
            :left="false"
            color='#4caf50'
            :multi-line="true"
            :right="false"
            :timeout="6000"

            :vertical="false" ) Інформація оновлена
            v-btn(
                color="pink"
                flat
                icon
                @click="alert = false")
                v-icon close
        form.setting__company-page
            .setting__company-page__row
                .setting__company-page__row__box
                    .checkbox__custom
                        v-checkbox(v-model="model.empty_string" :label="`Порожній рядок для товара:`" :disabled="!$root.rbac.settingsCompany")
                        template
                            v-tooltip( max-width="400px" top)
                                template(v-slot:activator="{ on }")
                                    i.vsm-icon.icon-info(v-on="on")
                                span В разі відсутності товару в номенклатурі, користувач може додати порожній рядок, де може вказати назву товару, його вартість, посилання на його придбання, кількість і од. виміру, а також комментар.
            .setting__company-page__row
                .setting__company-page__row__box
                    .checkbox__custom
                        v-checkbox(:disabled='!$root.rbac.settingsCompany' :value="false" v-model="model.non_budget_order" :label="`Замовлення без бюджету:`")
                        template
                            v-tooltip( top)
                                template(v-slot:activator="{ on }")
                                    i.vsm-icon.icon-info(v-on="on")
                                span Дозволяє оформити замовлення в обхід бюджету
            .setting__company-page__row
                .setting__company-page__row__box
                    .checkbox__custom
                        v-checkbox(v-model="model.coordination" :label="`Процес затвердження:`" :disabled="!$root.rbac.settingsCompany")
                        template
                            v-tooltip( top)
                                template(v-slot:activator="{ on }")
                                    i.vsm-icon.icon-info(v-on="on")
                                span Процес налаштування кроків підтвердження запиту на закупівлю вищестоящими особами
            .setting__company-page__row
                .setting__company-page__row__box
                      .checkbox__custom
                        v-checkbox(v-model="model.po_number_required" :label="`Обов'язкове поле №РО в замовленні:`")
                        template
                              v-tooltip( top)
                                  template(v-slot:activator="{ on }")
                                    i.vsm-icon.icon-info(v-on="on")
                                  span Поле буде обов'язкове в процесі замовлення

            .input-box
                label.label-caption Валюта
                v-select( solo  :items="currency" disabled item-text="name" item-value="id" :clearable="false" :searchable="false" label='Валюта' v-model="model.currency_id")
            button.button.button__yellow(@click="handleSubmit" v-show="$root.rbac.settingsCompany") Зберегти
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "SettingCompanyPage",
  data() {
    return {
      model: {},
      currency: [],
      alert: false
    }
  },
  computed: {
    ...mapGetters("user", ["currentUser"])
  },
  created() {
    if (this.currentUser.company_id == 0) {
      return this.$router.push("/lk-index")
    }
    this.getDataFromApi()
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.$api
        .post("/company/update-my-company", this.model)
        .then(response => {
          if (response.data.success) {
            this.alert = true
          }
        })
    },
    disableNonBudget() {
      if (this.model.budgets == false) {
        this.model.non_budget_order = false
      }
    },
    getDataFromApi() {
      this.loading = true
      this.$api
        .post("/graphql", {
          query: `query{
                            myCompany{
                                  budgets
                                  non_budget_order
                                  empty_string
                                  coordination
                                  currency_id
                                  po_number_required
                            }
                            currency{
                                id
                                code
                                name
                            }
                        }`
        })
        .then(response => {
          this.model = response.data.data.myCompany
          this.currency = response.data.data.currency
          this.loading = false
        })
    }
  }
}
</script>

<style lang="sass"></style>
