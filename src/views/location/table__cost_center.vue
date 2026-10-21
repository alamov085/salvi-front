<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="dataTable"
      :pagination.sync="pagination"
      :total-items="total_items"
      :loading="loading"
      class="table__tamplate-2 theme--light trPointer"
      no-data-text="Немає даних"
    >
      <template v-slot:items="props">
        <tr @click="editItem(props.item)">
          <td style="width: 50%" class="wrap-text wm200p">
            <v-tooltip top max-width="320px">
              <div class="wrap-text">{{ props.item.name }}</div>
              <span slot="activator">{{
                props.item.name | truncate(80, "...")
              }}</span>
            </v-tooltip>
          </td>
          <td style="width: 50%" class="wrap-text wm200p">
            <v-tooltip top max-width="320px">
              <div class="wrap-text">{{ props.item.location.name }}</div>
              <span slot="activator">{{
                props.item.location.name | truncate(80, "...")
              }}</span>
            </v-tooltip>
          </td>
          <td @click.stop class="justify-center  action__td" align="center">
            <i
              v-show="$root.rbac.updateCostCenter"
              class="icon-redact"
              @click="editItem(props.item)"
            ></i>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "TableCostCenter",
  props: ["updateList"],
  data: () => ({
    loading: false,
    total_items: 0,
    companyEntities: [],
    pagination: {
      sortBy: "id",
      rowsPerPage: 10,
      page: 1,
      descending: false
    },
    headers: [
      { text: "Назва", value: "name", align: "left" },
      { text: "Локація", value: "locations.name" },
      { text: "", value: "actions", sortable: false }
    ],
    dataTable: []
  }),
  computed: {
    ...mapGetters("params", ["search"])
  },
  watch: {
    pagination: {
      handler() {
        this.getDataFromApi()
      },
      deep: true
    },
    updateList(e) {
      if (e) {
        this.getDataFromApi()
      }
    },
    companyEntities(e) {
      this.$emit("companyEntities", e)
    },
    search() {
      this.getDataFromApi()
    },
    loading(e) {
      this.$loadingBus.$emit("loading", e)
    }
  },
  methods: {
    getDataFromApi() {
      this.loading = true
      let url = "/graphql"
      let order = "DESC"
      if (this.pagination.descending) {
        order = "ASC"
      }
      this.$api
        .post(url, {
          query:
            `
                        query{
                              costCenter( page: ` +
            this.pagination.page +
            ` perPage: ` +
            this.pagination.rowsPerPage +
            ` order: "` +
            order +
            `" orderBy: "` +
            this.pagination.sortBy +
            `" search: "` +
            this.search +
            `"){
                                totalCount
                                items{
                                  name
                                  id
                                  location_id
                                  location{
                                    name
                                  }
                                  uuid_client
                                  uuid_contract
                                  history{
                                    email
                                    role
                                  }
                                }
                              }
                              location(perPage: 1000 list:true){
                                items{
                                  id
                                  name
                                }
                              }
                            }`
        })
        .then(response => {
          this.dataTable = response.data.data.costCenter.items
          this.total_items = response.data.data.costCenter.totalCount
          this.companyEntities = response.data.data.location.items
          this.loading = false
        })
      this.$emit("listUpdated", false)
    },
    editItem(item) {
      this.$emit("editItem", item)
    }
  }
}
</script>

<style scoped>
.icon-redact {
  font-size: 18px;
}

.icon-redact:hover:before {
  color: #5678ff;
}
</style>
