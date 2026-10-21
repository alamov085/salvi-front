<template>
  <div class="section__content">
    <create__cost_center
      :cost-center="editCostCenter"
      :dialog="dialogCost"
      :update="true"
      :company-entities="dataLocationTree"
      :hide-button="true"
      :view-only="viewOnlyCost"
      @closeDialog="closeDialogCost"
    />
    <createLocation
      :location="editLocation"
      :dialog="dialogLocation"
      :update="true"
      :company-entities="companies"
      :view-only="viewOnlyLocation"
      :hide-button="true"
      @closeDialog="closeDialogLocation"
    />
    <div class="section__content__head">
      <div class="caption" style="text-align: center; width: 100%">
        Дерево компанії "{{ myCompany }}"
      </div>
    </div>
    <div class="tree__location">
      <div class="tree__location__head">
        {{ myCompany }}
      </div>
      <div class="tree__location__body">
        <div
          v-for="(item, index) in dataLocationTree"
          :key="index"
          class="tree__location__body__item"
        >
          <div class="tree__location__body__parent">
            <div class="icon__parent">
              <svg
                width="41"
                height="40"
                viewBox="0 0 41 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.25642 15.0548H32.8549V40H40.0557V9.31228L19.4854 0L0.0556641 9.31228V40H7.25642V15.0548Z"
                  fill="white"
                />
                <path
                  d="M19.4855 35.1348H14.9434V39.0421H19.4855V35.1348Z"
                  fill="white"
                />
                <path
                  d="M25.0607 35.1348H20.5186V39.0421H25.0607V35.1348Z"
                  fill="white"
                />
                <path
                  d="M13.9123 35.1348H9.37012V39.0421H13.9123V35.1348Z"
                  fill="white"
                />
                <path
                  d="M19.4855 29.7754H14.9434V33.6828H19.4855V29.7754Z"
                  fill="white"
                />
                <path
                  d="M13.9123 29.7754H9.37012V33.6828H13.9123V29.7754Z"
                  fill="white"
                />
                <path
                  d="M25.0607 29.7754H20.5186V33.6828H25.0607V29.7754Z"
                  fill="white"
                />
                <path
                  d="M19.4855 24.4165H14.9434V28.3239H19.4855V24.4165Z"
                  fill="white"
                />
                <path
                  d="M13.9123 24.4165H9.37012V28.3239H13.9123V24.4165Z"
                  fill="white"
                />
                <path
                  d="M30.6349 35.1348H26.0928V39.0421H30.6349V35.1348Z"
                  fill="white"
                />
              </svg>
            </div>
            <a @click="editCostLocationView(item)">
              <v-tooltip top max-width="320px">
                <div class="wrap-text">{{ item.name }}</div>
                <span slot="activator">{{ item.name }}</span>
              </v-tooltip>
            </a>
            <v-icon
              v-show="$root.rbac.updateLocations"
              @click="editCostLocation(item)"
              >launch</v-icon>
          </div>
          <div
            v-for="(children, index) in item.costCenters"
            :key="index"
            class="tree__location__body__child"
          >
            <div class="icon__child">
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.8509 28H12.5468H12.149V19.8259H15.8509V28ZM18.1113 28V18.6987C18.1113 18.0761 17.6052 17.5714 16.9811 17.5714H11.0188C10.3946 17.5714 9.88858 18.0761 9.88858 18.6987V28H6.21157H2C0.895431 28 0 27.1046 0 26V10.5297L13.9999 0L28 10.5297V26C28 27.1046 27.1046 28 26 28H18.1113Z"
                  fill="white"
                />
              </svg>
            </div>
            <a @click="editCostView(children)">
              <v-tooltip top max-width="320px">
                <div class="wrap-text">{{ children.name }}</div>
                <span slot="activator">{{ children.name }}</span>
              </v-tooltip>
            </a>
            <v-icon
              v-show="$root.rbac.updateCostCenter"
              @click="editCost(children)"
              >launch</v-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import create__cost_center from "@/views/location/dialog-create-cost-center.vue"
import createLocation from "@/views/location/dialog-create-location.vue"

export default {
  name: "TreeLocation",
  components: {
    create__cost_center,
    createLocation
  },
  data: () => ({
    dataLocationTree: [],
    loading: false,
    myCompany: "",
    editCostCenter: {
      history: {
        email: "",
        role: ""
      }
    },
    dialogCost: false,
    viewOnlyCost: false,
    editLocation: {
      history: {
        email: "",
        role: ""
      }
    },
    dialogLocation: false,
    viewOnlyLocation: false,
    companies: []
  }),
  watch: {
    loading(e) {
      this.$loadingBus.$emit("loading", e)
    }
  },
  created() {
    this.getDataFromApi()
  },
  methods: {
    closeDialogCost(e) {
      this.dialogCost = e
      this.getDataFromApi()
    },
    closeDialogLocation(e) {
      this.dialogLocation = e
      this.getDataFromApi()
    },
    editCost(e) {
      this.editCostCenter = e
      this.dialogCost = true
      this.viewOnlyCost = false
    },
    editCostLocation(e) {
      this.editLocation = e
      this.dialogLocation = true
      this.viewOnlyLocation = false
    },
    editCostView(e) {
      this.editCostCenter = e
      this.dialogCost = true
      this.viewOnlyCost = true
    },
    editCostLocationView(e) {
      if (this.$root.rbac.viewOnlyLocations) {
        this.editLocation = e
        this.dialogLocation = true
        this.viewOnlyLocation = true
      }
    },
    getDataFromApi() {
      this.loading = true
      this.$api
        .post("/graphql", {
          query: `
                        query{
                              location(perPage: 1000){
                                 items{
                                    id
                                    company_id
                                    name
                                    zip_code
                                    city
                                    street
                                    building
                                    office
                                    floor
                                    phone_one
                                    phone_two
                                    comment
                                    isActive
                                    activeDate
                                    allCompanies
                                    budgetLocationOnly
                                    history{
                                        email
                                        role
                                    }
                                    companyEntities{
                                        id
                                        location_id
                                        company_id
                                    }
                                    costCenters{
                                        id
                                        name
                                        location_id
                                        uuid_client
                                        uuid_contract
                                        history{
                                            email
                                            role
                                        }
                                    }
                                }
                              }
                              myCompany{
                                short_name
                              }
                              companyEntity(perPage:1000){
                                items{
                                  id
                                  full_name
                                  short_name
                                }
                              }
                            }`
        })
        .then(response => {
          let data = response.data.data.location.items
          data.forEach(function(value, index) {
            if (value.allCompanies) {
              data[
                index
              ].companyEntitiesIds = response.data.data.companyEntity.items.map(
                function(value) {
                  return value.id
                }
              )
            } else {
              data[index].companyEntitiesIds = value.companyEntities.map(
                function(value) {
                  return value.company_id
                }
              )
            }
          })
          this.dataLocationTree = data
          if (response.data.data.myCompany) {
            this.myCompany = response.data.data.myCompany.short_name
          } else {
            this.myCompany = ""
          }
          this.companies = response.data.data.companyEntity.items
          this.loading = false
        })
      this.$emit("listUpdated", false)
    }
  }
}
</script>

<style scoped></style>
