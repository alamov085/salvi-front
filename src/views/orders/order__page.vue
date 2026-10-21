<template>
    <div class="order__page">
        <div class="order-page__container">
            <div class="order-page__top">
                <v-toolbar-title>
                    <div class="name">
                        <v-toolbar-title>Замовлення №{{ data.id }}</v-toolbar-title>
                    </div>
                </v-toolbar-title>
            </div>
            <div class="order-page__content">
                <div class="section__content">
                    <div class="order-page__nav">
                        <div @click="copyProduct" class="order-page__nav-item retry">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 16 16">
                                <path fill="#269446" d="M14.9547098,7.98576084 L15.0711,7.99552 C15.6179,8.07328 15.9981,8.57957 15.9204,9.12636 C15.6826,10.7983 14.9218,12.3522 13.747,13.5654 C12.5721,14.7785 11.0435,15.5888 9.37999,15.8801 C7.7165,16.1714 6.00349,15.9288 4.48631,15.187 C3.77335,14.8385 3.12082,14.3881 2.5472,13.8537 L1.70711,14.6938 C1.07714,15.3238 3.55271368e-15,14.8776 3.55271368e-15,13.9867 L3.55271368e-15,9.99998 L3.98673,9.99998 C4.87763,9.99998 5.3238,11.0771 4.69383,11.7071 L3.9626,12.4383 C4.38006,12.8181 4.85153,13.1394 5.36475,13.3903 C6.50264,13.9466 7.78739,14.1285 9.03501,13.9101 C10.2826,13.6916 11.4291,13.0839 12.3102,12.174 C13.1914,11.2641 13.762,10.0988 13.9403,8.84476 C14.0181,8.29798 14.5244,7.91776 15.0711,7.99552 L14.9547098,7.98576084 Z M11.5137,0.812976 C12.2279,1.16215 12.8814,1.61349 13.4558,2.14905 L14.2929,1.31193 C14.9229,0.681961 16,1.12813 16,2.01904 L16,6.00001 L12.019,6.00001 C11.1281,6.00001 10.6819,4.92287 11.3119,4.29291 L12.0404,3.56441 C11.6222,3.18346 11.1497,2.86125 10.6353,2.60973 C9.49736,2.05342 8.21261,1.87146 6.96499,2.08994 C5.71737,2.30841 4.57089,2.91611 3.68976,3.82599 C2.80862,4.73586 2.23802,5.90125 2.05969,7.15524 C1.98193,7.70202 1.47564,8.08224 0.928858,8.00448 C0.382075,7.92672 0.00185585,7.42043 0.0796146,6.87364 C0.31739,5.20166 1.07818,3.64782 2.25303,2.43465 C3.42788,1.22148 4.95652,0.411217 6.62001,0.119916 C8.2835,-0.171384 9.99651,0.0712178 11.5137,0.812976 Z"/>
                            </svg>
                            Повторити замовлення
                        </div>
                        <div class="order-page__nav-item">
                            <div v-if="statuses.find(x => x.id === data.status)" class="status-desc" :class="statuses.find(x => x.id === data.status).class">
                                {{ statuses.find(x => x.id === data.status).name }}
                            </div>
                        </div>
                    </div>
                    <div v-if="data.status == 0 || data.status == 1"
                         v-show="$root.rbac.updateOrder" class="order-page__nav">
                        <div @click="updateOrderFunc(data)" class="order-page__nav-item retry">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                                <path d="M12 20H20.5M18 10L21 7L17 3L14 6M18 10L8 20H4V16L14 6M18 10L14 6" stroke="#269446" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Редагувати дані отримувача
                        </div>
                    </div>
                    <div class="order-page__date">
                        Від: {{ data.created_at | formatDateDot }}
                    </div>
                </div>
                <div class="section__content">
                    <div class="order-page__detail-title">
                        Деталі замовлення
                    </div>
                    <v-flex v-if="statuses.length > 0" xs12 sm12 class="section__box__head">
                        <v-card class="section__box__head__body">
                            <div class="item">
                                <span class="head">Дата доставки:</span>
                                <span v-if="data.delivery_date && data.delivery_date > 10800" class="desc">{{ handleDeliveryDate(data.delivery_date) }} ({{getDayName(handleDeliveryDate(data.delivery_date))}})</span>
                                <span v-else class="desc">{{ handleDeliveryDate(data.delivery_date) }}</span>
                            </div>
                            <div class="item">
                                <span class="head">Локація:</span>
                                <v-tooltip z-index="101" bottom max-width="320px">
                                    <div class="wrap-text">{{ data.location_name }}</div>
                                    <span :title="data.location_name" slot="activator" class="desc wrap-text">{{
                                data.location_name | truncate(30, "...")
                              }}</span>
                                </v-tooltip>
                            </div>
                            <div class="item">
                                <span class="head">Кост-центр:</span>
                                <v-tooltip z-index="101" bottom max-width="320px">
                                    <div class="wrap-text">{{ data.cost_center_name }}</div>
                                    <span :title="data.cost_center_name" slot="activator" class="desc wrap-text">{{
                                data.cost_center_name | truncate(30, "...")
                              }}</span>
                                </v-tooltip>
                            </div>
                            <div class="item">
                                <span class="head">Юридична Особа:</span>
                                <v-tooltip z-index="101" bottom max-width="320px">
                                    <div class="wrap-text">{{ data.company_entity.short_name }}</div>
                                    <span slot="activator" class="desc wrap-text">{{
                                data.company_entity.short_name | truncate(30, "...")
                              }}</span>
                                </v-tooltip>
                            </div>

                            <div class="item">
                                <span class="head">Автор:</span>
                                <span class="desc">{{data.created_by.last_name}} {{data.created_by.first_name}}</span>
                            </div>

                            <div v-if="data.budget_id > 0" class="item">
                                <span class="head">Бюджет:</span>
                                <span class="desc">{{data.budget.name}} ({{ data.budget.availableSum }})</span>
                            </div>
                            <div v-if="data.contract" class="item">
                                <span class="head">Договір:</span>
                                <span v-if="momentToDay(data.contract.date_end)" class="desc">{{data.contract.name}} <span style="color: red">Прострочений</span></span>
                                <span v-else class="desc">{{data.contract.name}} ({{momentGetFormatDay(data.contract.date_end, 'DD.MM.YYYY')}})</span>
                            </div>
                            <div v-if="data.comment !== ''" class="item">
                                <span class="head">Коментар до замовлення:</span>
                                <!--<span class="desc">{{this.data.comment}}</span>-->
                                <div
                                        class="desc"
                                        style="display: flex; align-items: center; cursor: pointer"
                                >
                                    {{ data.comment | truncate(20, "...") }}
                                    <div
                                            v-if="data.comment.length > 20"
                                            @click="descDialog(data.comment)"
                                    >
                                        <v-icon style="font-size: 15px" color="#19B200">more</v-icon>
                                    </div>
                                </div>
                            </div>
                            <div v-if="data.ttn" class="item">
                                <span class="head">ТТН:</span>
                                <a
                                    :href="`https://tracking.novaposhta.ua/#/uk`"
                                    target="_blank"
                                    class="desc ttn-link"
                                    style="display: flex; align-items: center;"
                                >
                                    {{data.ttn}}
                                </a>
                            </div>
                        </v-card>
                    </v-flex>

                    <div class="section__box list__orders__accordion">
                        <div class="section__content__head">
                            <template v-if="dataTableAdd.length > 0 || dataTableDelete.length > 0">
                                <div class="section__content__buttons border-item">
                                    <div @click="() => {this.isChanged = false}" :class="['section__content__button', !isChanged && 'active']">Товари</div>
                                    <div @click="() => {this.isChanged = true}" :class="['section__content__button', isChanged && 'active']">Зміни</div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="section__content__buttons">
                                    <div @click="() => {this.isChanged = false}" :class="['section__content__button', !isChanged && 'active']">Товари</div>
                                </div>
                            </template>
                            <div class="section__content__buttons">
                                <div
                                        v-if="data.status == 0 || data.status == 1"
                                        v-show="$root.rbac.updateOrder"
                                        class="order-page__nav-item retry"
                                        @click="handleEditProduct"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 20H20.5M18 10L21 7L17 3L14 6M18 10L8 20H4V16L14 6M18 10L14 6" stroke="#269446" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    Редагувати товари в замовленні
                                </div>
                            </div>
                        </div>


                        <div class="order-page__table-sort" v-if="!isChanged">
                            <div
                                    class="list__orders__accordion__item"
                                    :class="{ active: listOrder }"
                            >
                                <template>
                                    <v-data-table
                                            :items="dataTable.slice(0, allList)"
                                            hide-actions
                                            :pagination.sync="pagination"
                                            :total-items="total_items"
                                            :loading="loading"
                                            class="table__tamplate-2 theme--light"
                                            :class="{ opaciiLast: !listOrder && total_items > 7 }"
                                            no-data-text="Немає даних"
                                    >
                                        <template v-slot:items="props">

                                            <template v-if="props.index == 0 && (data.status == 0 || data.status == 1)">
                                                <template
                                                        v-for="(date, index) of deliveryDateArray"
                                                        :key="index"
                                                >
                                                    <tr class="detail-line" v-if="date.id == 1" style="order: 1; box-shadow: none">
                                                        <td class="detail-line detail-line-bold" style="padding: 10px 10px 10px 0; font-size: 16px" colspan="4">
                                                            <b>Доступно на наступний робочий день ({{getNextDay()}}):</b>
                                                        </td>
                                                    </tr>
                                                    <tr class="detail-line" v-else-if="date.id == 0" style="order: 9999999999999999; box-shadow: none">
                                                        <td class="detail-line detail-line-bold" style="padding: 10px 10px 10px 0; font-size: 16px" colspan="4">
                                                            <b>Доступність повідомимо додатково</b>
                                                        </td>
                                                    </tr>
                                                    <tr class="detail-line" v-else :style="`order: ${date.id}; box-shadow: none`">
                                                        <td class="detail-line detail-line-bold" style="padding: 10px 10px 10px 0; font-size: 16px" colspan="4">
                                                            <b>Доступно на {{date.date}} ({{getDayName(date.date)}})</b>
                                                        </td>
                                                    </tr>
                                                </template>
                                            </template>

                                            <tr
                                                    v-if="!props.item.custom && props.item.product != null"
                                                    :class="{
                                                        readOnly: props.item.view_only,
                                                        productDelete: props.item.is_delete,
                                                        changed: dataTableAdd.find(item => item.product_uuid == (props.item.product ? props.item.product.uuid : null)),
                                                      }"
                                                    :style="`order: ${getOrderProduct(props.item)}`"
                                            >
                                                <td class="text-xs-left first-td" style="padding-left: 0">
                                                    <img
                                                            style="max-width: 60px; min-width: 60px; width: 60px; object-fit: contain"
                                                            :src="props.item.product.img"
                                                    />
                                                    <div class="badge__isTemp">
                                                        <v-tooltip v-if="props.item.product.is_temperature_conditions" top max-width="320px">
                                                            <span>Товар вимагає дотримання температурного режиму зберігання</span>
                                                            <span slot="activator">
                                                              <font-awesome-icon :icon="['fas', 'temperature-low']" />
                                                            </span>
                                                        </v-tooltip>
                                                    </div>
                                                </td>
                                                <td
                                                        class="text-xs-left text-wrap"
                                                        style="min-width: 370px; max-width: 370px; position: relative"
                                                >
                                                    <v-tooltip bottom content-class="tooltip__catalog__table">
                                                      <span slot="activator" class="wrap-text wm200p">{{
                                                        props.item.product.name
                                                      }}</span>
                                                        <img
                                                                style="max-width: 200px; max-height: 260px; object-fit: contain"
                                                                :src="props.item.product.img"
                                                                class="img__display"
                                                        />
                                                    </v-tooltip>
                                                    <v-tooltip v-if="!props.item.catalog" top max-width="320px">
                                                        <span>Товар зi спецiфiкацii</span>
                                                        <v-icon
                                                                slot="activator"
                                                                class="icon__isSpecification"
                                                                color="#3D4465"
                                                                size="16px"
                                                                style="padding: 0px; margin-left: 5px"
                                                        >
                                                            book
                                                        </v-icon>
                                                    </v-tooltip>
                                                </td>
                                                <td class="text-xs-left">
                                                    <div
                                                         style="display: flex; justify-content: flex-start; align-items: center; position: relative">
                                                        {{ props.item.quantity }}
                                                    </div>
                                                </td>
                                                <td class="text-xs-right" width="50%"><b>{{ props.item.total_sum | price-break }}₴</b></td>
                                            </tr>
                                            <tr v-if="props.item.custom" class="custom_product">
                                                <td class="text-xs-left" style="padding-left: 13px; padding-right: 36px;">
                                                    <v-tooltip top tag="div">
                                                        <v-icon
                                                                slot="activator"
                                                                class="pointer"
                                                                color="#93a2dd"
                                                                size="35px"
                                                        >
                                                            info
                                                        </v-icon>
                                                        <span>Товар доданий через порожній рядок</span>
                                                    </v-tooltip>
                                                </td>
                                                <td class="text-xs-left" style="min-width: 370px; max-width: 370px; position: relative">
                                                    <span class="wrap-text">{{
                                                        props.item.name
                                                      }}{{
                                                        props.item.comment
                                                        }}
                                                    </span>
                                                </td>
                                                <td
                                                        class="text-xs-left"
                                                        @click="
                                                        dialogQuantity(props.item.id, props.item.quantity, props)
                                                    "
                                                >
                                                    <div
                                                            style="display: flex; justify-content: flex-start; align-items: center"
                                                    >
                                                        <i
                                                                v-if="
                                                      (data.status == 6 && $root.rbac.updateOrder) ||
                                                        (data.status == 5 && $root.rbac.orderModeration) ||
                                                        (data.status == 1 &&
                                                          $root.rbac.editOnApproveOrder &&
                                                          data.can_approve_next_coordination)
                                                    "
                                                                class="icon icon-redact mr-2"
                                                        ></i>
                                                        <span>{{ props.item.quantity }}</span>
                                                    </div>
                                                </td>
                                                <td class="text-xs-right" width="50%"><b>{{ props.item.total_sum | price-break }}₴</b></td>
                                            </tr>
                                            <tr
                                                    v-if="!props.item.custom && props.item.product == null"
                                                    :class="{
                                                        readOnly: props.item.view_only,
                                                        productDelete: props.item.is_delete,
                                                        changed: dataTableAdd.find(item => item.sku == (props.item.product ? props.item.product.sku : null)),
                                                      }"
                                                    :style="`order: ${getOrderProduct(props.item)}`"
                                            >
                                                <td class="text-xs-left first-td" style="padding-left: 0; min-width: 84px"></td>
                                                <td
                                                        class="text-xs-left text-wrap"
                                                        style="min-width: 370px; max-width: 370px; position: relative"
                                                >
                                                    <v-tooltip bottom content-class="tooltip__catalog__table">
                                                      <span slot="activator" class="wrap-text wm200p">Немає даних про товар</span>
                                                    </v-tooltip>

                                                </td>
                                                <td class="text-xs-left">
                                                    <div
                                                            style="display: flex; justify-content: flex-start; align-items: center">
                                                        {{ props.item.quantity }}
                                                    </div>
                                                </td>
                                                <td class="text-xs-right" width="50%"><b>{{ props.item.total_sum | price-break }}₴</b></td>
                                            </tr>
                                        </template>
                                    </v-data-table>
                                </template>
                            </div>
                            <div v-if="total_items > 7" class="d-flex justify-content-center">
                                <v-btn
                                        class="btn-accordion flex-grow-0"
                                        flat
                                        icon
                                        @click="listOrderFunc"
                                >
                                    <v-icon :class="{ open: listOrder }">keyboard_arrow_down</v-icon>
                                </v-btn>
                            </div>
                        </div>



                        <div v-if="isChanged">
                            <div v-if="dataTableAdd.length">
                                <div class="v-toolbar__title">Додані товари</div>
                                <div
                                        class="list__orders__accordion__item"
                                        :class="{ active: listOrder }"
                                >
                                    <template>
                                        <v-data-table
                                                :items="dataTableAdd"
                                                hide-actions
                                                :pagination.sync="paginationAdd"
                                                :total-items="total_items_add"
                                                :loading="loading"
                                                class="table__tamplate-2 theme--light"
                                                :class="{ opaciiLast: !listOrder && total_items_add > 10 }"
                                                no-data-text="Немає даних"
                                        >
                                            <template v-slot:items="props">
                                                <tr>
                                                    <td class="text-xs-left first-td" style="padding-left: 0">
                                                        <img
                                                                style="max-width: 60px; width: 60px; object-fit: contain"
                                                                :src="props.item.imgs"
                                                        />
                                                    </td>
                                                    <td
                                                            class="text-xs-left text-wrap"
                                                            style="min-width: 370px; max-width: 370px"
                                                    >
                                                        <v-tooltip bottom content-class="tooltip__catalog__table">
                                                          <span slot="activator" class="wrap-text wm200p">{{
                                                            props.item.name
                                                          }}</span>
                                                            <img
                                                                    style="max-width: 200px; max-height: 260px; object-fit: contain"
                                                                    :src="props.item.imgs"
                                                                    class="img__display"
                                                            />
                                                        </v-tooltip>
                                                    </td>
                                                    <td class="text-xs-left">
                                                        <div style="display: flex; justify-content: flex-start; align-items: center">
                                                            {{props.item.quantity}}
                                                        </div>
                                                    </td>
                                                    <td class="text-xs-right" style="width: 50%;"><b>{{ props.item.total_sum | price-break }}₴</b></td>
                                                </tr>
                                            </template>
                                        </v-data-table>
                                    </template>
                                </div>
                                <div v-if="total_items_add > 10" class="d-flex justify-content-center">
                                    <v-btn
                                            class="btn-accordion flex-grow-0"
                                            flat
                                            icon
                                            @click="listOrderFunc"
                                    >
                                        <v-icon :class="{ open: listOrder }">keyboard_arrow_down</v-icon>
                                    </v-btn>
                                </div>
                            </div>


                            <div v-if="dataTableDelete.length">
                                <div class="v-toolbar__title">Видалені товари</div>
                                <div
                                        class="list__orders__accordion__item"
                                        :class="{ active: listOrder }"
                                >
                                    <template>
                                        <v-data-table
                                                :items="dataTableDelete"
                                                hide-actions
                                                :pagination.sync="paginationDelete"
                                                :total-items="total_items_delete"
                                                :loading="loading"
                                                class="table__tamplate-2 theme--light"
                                                :class="{ opaciiLast: !listOrder && total_items_delete > 10 }"
                                                no-data-text="Немає даних"
                                        >
                                            <template v-slot:items="props">
                                                <tr>
                                                    <td class="text-xs-left first-td" style="padding-left: 0">
                                                        <img
                                                                style="max-width: 60px; width: 60px; object-fit: contain"
                                                                :src="props.item.imgs"
                                                        />
                                                    </td>

                                                    <td
                                                            class="text-xs-left text-wrap"
                                                            style="min-width: 370px; max-width: 370px"
                                                    >
                                                        <v-tooltip bottom content-class="tooltip__catalog__table">
                                                          <span slot="activator" class="wrap-text wm200p">{{
                                                            props.item.name
                                                          }}</span>
                                                            <img
                                                                    style="max-width: 200px; max-height: 260px; object-fit: contain"
                                                                    :src="props.item.imgs"
                                                                    class="img__display"
                                                            />
                                                        </v-tooltip>
                                                    </td>
                                                    <td class="text-xs-left">
                                                        <div style="display: flex; justify-content: flex-start; align-items: center">
                                                            {{props.item.quantity}}
                                                        </div>
                                                    </td>
                                                    <td class="text-xs-right" style="width: 50%;"><b>{{ props.item.total_sum | price-break }}₴</b></td>
                                                </tr>
                                            </template>
                                        </v-data-table>
                                    </template>
                                </div>
                                <div v-if="total_items_delete > 10" class="d-flex justify-content-center">
                                    <v-btn
                                            class="btn-accordion flex-grow-0"
                                            flat
                                            icon
                                            @click="listOrderFunc"
                                    >
                                        <v-icon :class="{ open: listOrder }">keyboard_arrow_down</v-icon>
                                    </v-btn>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                        v-if="
                        (data.coordination && data.status == 1) ||
                          data.status == 2 ||
                          data.status == 3 ||
                          data.status == 4 ||
                          data.status == 7 ||
                          data.status == 8 ||
                          data.status == 9 ||
                          data.status == 10
                      "
                        v-show="matchingStep.length"
                        class="section__content"
                >
                    <div class="matching__step">
                        <template
                            v-for="(item, index) in matchingStep"
                            :key="index"
                        >
                            <div
                                v-if="item.status == 1 || item.status_cancel == 1"
                                class="item"
                                :class="item.status == 1 ? 'approve' : 'decline'"
                            >
                                <div class="item__body">
                                    <h5 v-if="item.status == 1">Затверджено</h5>
                                    <h5 v-if="item.status_cancel == 1">Відхилено</h5>
                                    <span v-if="item.user != null" style="text-align: center">
                                        {{ item.user != null ? item.user.last_name : "" }} {{ item.user != null ? item.user.first_name : "" }}
                                        {{getDate(item.updated_at)}}
                                    </span>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
                <!--<comments :id="id"/>-->
                <!--<upFiles :id="id" :init-file="initFile"/>-->
            </div>
            <div class="order-page__footer">
                <div class="order-page__footer-total">
                    <div class="order-page__footer-total-text">
                        Сума замовлення
                    </div>
                    <div v-if="data.total_sum"  class="order-page__footer-total-text">
                        {{ data.total_sum | price-break }}₴
                    </div>
                </div>
                <div class="section__content footer__order-page">
                    <button
                            v-if="data.status == 0 || data.status == 6"
                            v-show="
                          $root.rbac.changeStatusOrder ||
                            data.created_by_user == currentUser.id ||
                            $root.rbac.changeAnyStatusOrder
                        "
                                    class="button button__yellow"
                            >
                        <span @click="checkProductAvailable(data)">
                          Перевести до узгодження
                        </span>
                    </button>
                    <button
                            v-if="data.status == 0"
                            v-show="$root.rbac.changeStatusOrder || $root.rbac.changeAnyStatusOrder"
                            class="button"
                            style="background: #F24949"
                    >
                        <span @click="deleteOrder(data)">Видалити замовлення </span>
                    </button>
                    <button
                            v-if="data.status == 4"
                            v-show="$root.rbac.changeAnyStatusOrder"
                            class="button"
                            style="background: #19B200"
                    >
                        <span @click="setStatusAtSupplier(data)">Передати постачальнику </span>
                    </button>
                    <template v-if="data.status == 1">
                        <template
                                v-for="(item, index) in matchingStep"
                                :key="index"
                        >
                            <template v-if="item.status == 0 && item.next_step && item.canApprove">
                                <div class="order-page__approve-buttons">
                                    <button
                                        class="button"
                                        style="color: #747474; border: 1px solid #747474; background: #fff"
                                        @click="declineOrder(item)"
                                    >
                                        <span>Відхилити</span>
                                    </button>
                                    <button
                                        class="button"
                                        style="background: #269446"
                                        @click="approveStep(item)"
                                    >
                                        <span>
                                          Погодити
                                        </span>
                                    </button>
                                </div>
                            </template>
                        </template>
                    </template>

                    <button
                            v-if="data.status === 5"
                            v-show="$root.rbac.orderModeration"
                            class="button"
                            style="background: #19B200"
                    >
                        <span @click="approveByModerator(data)">Підтвердити модерацію</span>
                    </button>
                    <button
                            v-if="data.status === 5"
                            v-show="$root.rbac.orderModeration"
                            class="button"
                            style="background: #F24949"
                    >
                        <span @click="rejectByModerator(data)">Відхилити модерацію</span>
                    </button>
                    <button
                            v-if="data.status === 5"
                            v-show="$root.rbac.orderModeration"
                            class="button button__yellow"
                    >
                        <span @click="onApproveByModerator(data)">Перевести до узгодження</span>
                    </button>
                    <button
                            v-if="data.status === 2 || data.status === 3"
                            v-show="$root.rbac.orderGoBack"
                            class="button"
                            style="background: #F24949"
                    >
                        <span @click="orderGoBack(data)">На узгодження постачальнику </span>
                    </button>
                </div>
            </div>

            <div v-if="orderLoading" class="order-loading"></div>
        </div>




        <!--Modal and dialog window-->

        <v-dialog
                v-model="dialogDesc"
                width="500"
                :fullscreen="$store.getters['params/mobileView']"
        >
            <v-card>
                <v-card-title>
          <span v-if="dialogDescModal == 'desc'" class="headline">
            Повний опис
          </span>
                    <span v-if="dialogDescModal == 'redactRO'" class="headline">
            Редагування № Purchase Order
          </span>
                    <v-spacer/>
                    <v-flex xs1 sm1>
                        <v-btn flat icon @click="dialogDesc = false">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-flex>
                </v-card-title>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <div v-if="dialogDescModal == 'desc'" style="word-break: break-all">
                            {{ modalData }}
                        </div>
                        <v-flex
                                v-if="dialogDescModal == 'redactRO'"
                                xs12
                                sm12
                                class="input-box"
                        >
                            <label>№ Purchase Order</label>
                            <input
                                    v-model="data.ro_number"
                                    type="text"
                                    class="input-default"
                            />
                            <div class="error__box">
                                <span>{{ errors.ro_number }}</span>
                            </div>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-card-actions v-if="dialogDescModal == 'redactRO'">
                    <v-spacer/>
                    <button
                            class="button button__yellow"
                            flat
                            @click="redactPOPost(data.ro_number)"
                    >
                        Зберегти
                    </button>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <my-dialog
                :model="myDialog"
                :button-one="btnClose"
                :button-two="btnApprove"
                :item="dialogItem"
                :text="dialogText"
                :headline="dialogHeadline"
                @buttonOne="buttonOne"
                @buttonTwo="buttonTwo"
        >
            <p v-if="myDialogAction != 'changeProduct'" slot="text">
                {{ dialogText }}
            </p>
            <div v-if="myDialogAction == 'changeProduct'" slot="body" class="w-100">
                <p slot="text">{{ dialogText }}</p>
                <div class="input-box w-100">
                    <v-autocomplete
                            v-model="autocomplete"
                            solo
                            class="input-default"
                            :items="items"
                            :loading="isLoading"
                            :search-input.sync="searchAutocomplete"
                            hide-no-data
                            hide-selected
                            item-text="name"
                            :no-filter="true"
                            item-value="uuid"
                            placeholder="Назва або uuid товару"
                            return-object
                            hide-details
                    />
                    <div class="error__box">
                        <span>{{ changeProductValidation }}</span>
                    </div>
                </div>
            </div>
        </my-dialog>
        <v-dialog
                v-model="dialogProduct"
                width="500"
                :fullscreen="$store.getters['params/mobileView']"
        >
            <v-card>
                <v-card-title>
                    <span class="headline">Увага!</span>
                    <v-spacer/>
                    <v-flex xs1 sm1>
                        <v-btn flat icon color="" @click="dialogProduct = false">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-flex>
                </v-card-title>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <div>
                            {{ dialogProductData }}
                        </div>
                    </v-layout>
                </v-container>
                <v-card-actions>
                    <v-spacer/>
                    <button class="button button__yellow" flat @click="hideProductModal">
                        Продовжити
                    </button>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
                v-model="oneModal"
                width="600"
                :fullscreen="$store.getters['params/mobileView']"
        >
            <v-card>
                <v-card-title>
                    <span class="headline">{{ oneModalHead }}</span>
                    <v-spacer/>
                    <v-flex xs1 sm1>
                        <v-btn flat icon color="" @click="oneModal = false">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-flex>
                </v-card-title>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <div>
                            {{ oneModalData }}
                            <span v-if="oneModalType === 2">
                            <template>
                              <v-tooltip top max-width="270px">
                                <template v-slot:activator="{ on }">
                                  <i class="vsm-icon icon-info" v-on="on"></i>
                                </template>
                                <span>
                                  Підтвердивши розбиття замовлення, ви зможете швидше
                                  узгодити замовлення з доступними для вас товарами, а
                                  замовлення з недоступними для вас товарами буде додатково
                                  узгоджуватися вашим менеджером.
                                </span>
                              </v-tooltip>
                            </template>
                          </span>
                        </div>
                    </v-layout>
                </v-container>
                <v-card-text v-if="oneModalType === 1">
                    <v-flex xs12 sm12 md12 class="input-box">
                        <label>
                            Бажана дата доставки
                            <v-tooltip top max-width="320px">
                                <div class="wrap-text">Заповнення поля є обов'язковим</div>
                                <i slot="activator" class="red--text pointer">*</i>
                            </v-tooltip>
                        </label>

                        <v-dialog
                                ref="dialog_delivery_date"
                                v-model="modal_delivery_date"
                                content-class="datepicker"
                                :return-value.sync="datePickerValue"
                                persistent
                                lazy
                                full-width
                                width="290px"
                        >
                            <template v-slot:activator="{ on }">
                                <input
                                        ref="input-step"
                                        v-model="model.delivery_date"
                                        :class="{ activeStep: indexSelect == 0 }"
                                        type="text"
                                        class="input-default input-step"
                                        placeholder="ДД/ММ/РРРР"
                                        prepend-icon="event"
                                        readonly
                                        v-on="on"
                                />
                                <div class="error__box">
                                    <span>{{ errors.delivery_date }}</span>
                                </div>
                            </template>
                            <v-date-picker
                                    v-model="datePickerValue"
                                    first-day-of-week="1"
                                    locale="uk"
                                    dark
                                    scrollable
                                    :min="getMinDate"
                                    :allowed-dates="allowedDates"
                            >

                                <v-spacer />
                                <v-btn flat color="primary" @click="modal_delivery_date = false">Скасувати</v-btn>
                                <v-btn flat color="primary" @click="saveDate()">
                                    Зберегти
                                </v-btn>
                            </v-date-picker>
                        </v-dialog>
                    </v-flex>
                    <div v-if="dateError" class="error__date">Заповнення дати є обов'язковим</div>
                    <v-flex xs12 sm12 class="input-box">
                        <label>Коментар до замовлення</label>
                        <textarea
                                v-model="model.comment"
                                class="textarea-default"
                                placeholder="Додайте коментар до замовлення"
                        ></textarea>
                        <div class="error__box">
                            <span>{{ errors.comment }}</span>
                        </div>
                    </v-flex>
                </v-card-text>
                <v-card-actions class="type-1" v-if="oneModalType === 1">
                    <button class="button button__blue" flat @click="oneModal = false">
                        Скасувати
                    </button>
                    <button
                            v-if="model.delivery_date != ''"
                            class="button button__yellow"
                            flat
                            @click="setStatusOnApprove(data)"
                    >
                        Підтвердити
                    </button>
                    <button
                            v-else
                            class="button button__yellow"
                            flat
                            @click="() => {this.dateError = !this.dateError}"
                    >
                        Підтвердити
                    </button>
                </v-card-actions>
                <v-card-actions v-else-if="oneModalType === 2">
                    <button class="button button__blue" flat @click="oneModal = false">
                        Скасувати
                    </button>
                    <button class="button button__yellow" flat @click="doNotSplitOrder">
                        Не розбивати
                    </button>
                    <button class="button button__yellow" flat @click="splitOrder">
                        Розбити
                    </button>
                </v-card-actions>
                <v-card-actions v-else-if="oneModalType === 3">
                    <v-spacer/>
                    <button class="button button__blue" flat @click="oneModal = false">
                        Скасувати
                    </button>
                    <button
                            class="button button__yellow"
                            flat
                            @click="setStatusOnApprove(data)"
                    >
                        Застосувати
                    </button>
                </v-card-actions>
                <v-card-actions v-else-if="oneModalType === 4">
                    <v-spacer/>
                    <button class="button button__blue" flat @click="oneModal = false">
                        Скасувати
                    </button>
                    <button class="button button__yellow" flat @click="doNotSplitOrder">
                        До модерації
                    </button>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar
                v-model="errorModal"
                type="success"
                :bottom="true"
                color="#FCBD00"
                :timeout="6000"
                multi-line
        >
            <span v-html="errorMsg"></span>
            <v-btn color="pink" flat icon @click="errorModal = false">
                <v-icon> close</v-icon>
            </v-btn>
        </v-snackbar>
        <v-dialog v-model="dialogDelete" max-width="400">
            <v-card>
                <v-card-title class="headline">Видалити товар?</v-card-title>
                <v-card-text>
                    Ви впевнені що хочете видалити товар з замовлення?
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <button class="button button__blue" @click="closeDialog">
                        Скасувати
                    </button>
                    <button class="button button__yellow" @click="deleteProduct">
                        Підтвердити
                    </button>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
                v-model="dialogEmptyString"
                :fullscreen="$store.getters['params/mobileView']"
                persistent
                max-width="705px"
        >
            <v-card>
                <v-card-title>
          <span v-if="emptyEdit">
            <span class="headline">Редагувати товар </span>
            <span class="headline__title ml-1">(порожнiй рядок)</span>
          </span>
                    <span v-else>
            <span class="headline">Додати товар </span>
            <span class="headline__title ml-1">(порожнiй рядок)</span>
          </span>
                    <v-spacer/>
                    <v-flex xs1 sm1>
                        <v-btn flat icon color="" @click="cancel">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-flex>
                </v-card-title>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12 sm6 md6 class="input-box">
                            <label>Назва</label>
                            <input
                                    v-model="emptyModel.name"
                                    type="text"
                                    class="input-default"
                                    placeholder="Введіть назву товару"
                            />
                            <div class="error__box">
                                <span>{{ emptyModelErrors.name }}</span>
                            </div>
                        </v-flex>
                        <v-flex xs12 sm6 md6 class="input-box">
                            <label>Кількість</label>
                            <input
                                    v-model="emptyModel.quantity"
                                    type="text"
                                    class="input-default"
                                    placeholder="Введіть кількість"
                            />
                            <div class="error__box">
                                <span>{{ emptyModelErrors.quantity }}</span>
                            </div>
                        </v-flex>
                        <v-flex xs12 sm6 md6 class="input-box">
                            <label>Ціна</label>
                            <input
                                    v-model="emptyModel.price"
                                    type="text"
                                    class="input-default"
                                    placeholder="Введіть ціну"
                            />
                            <div class="error__box">
                                <span>{{ emptyModelErrors.price }}</span>
                            </div>
                        </v-flex>
                        <v-flex xs12 sm12 class="input-box">
                            <label>Примітка</label>
                            <textarea
                                    v-model="emptyModel.comment"
                                    class="textarea-default"
                                    placeholder="Додайте коментар до товару"
                            ></textarea>
                        </v-flex>
                    </v-layout>
                </v-container>

                <v-card-actions>
                    <v-spacer/>
                    <button class="button button__blue" flat @click="cancel">
                        Скасувати
                    </button>
                    <button
                            v-if="emptyEdit"
                            class="button button__yellow"
                            flat
                            @click="editEmptyProduct"
                    >
                        Зберегти
                    </button>
                    <button
                            v-else
                            class="button button__yellow"
                            flat
                            @click="addEmptyProduct"
                    >
                        Додати
                    </button>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
                v-model="dialogInput"
                content-class="dialogInput"
                dark
                max-width="200px"
                @keyup="keymonitor"
        >
            <v-card>
                <v-card-title style="line-height: 16px">
                    <span>Кількість:</span>
                    <b style="font-size: 16px; color: white">{{ summ__prod.join("") }}</b>
                </v-card-title>
                <v-card-text style="height: 240px;">
                    <v-btn fab small dark color="teal" @click="num__input(1)">
                        <span>1</span>
                    </v-btn>
                    <v-btn fab small dark color="teal" @click="num__input(2)">
                        <span>2</span>
                    </v-btn>
                    <v-btn fab small dark color="teal" @click="num__input(3)">
                        <span>3</span>
                    </v-btn>
                    <v-btn fab small dark color="teal" @click="num__input(4)">
                        <span>4</span>
                    </v-btn>
                    <v-btn fab small dark color="teal" @click="num__input(5)">
                        <span>5</span>
                    </v-btn>
                    <v-btn fab small dark color="teal" @click="num__input(6)">
                        <span>6</span>
                    </v-btn>
                    <v-btn fab small dark color="teal" @click="num__input(7)">
                        <span>7</span>
                    </v-btn>
                    <v-btn fab small dark color="teal" @click="num__input(8)">
                        <span>8</span>
                    </v-btn>
                    <v-btn fab small dark color="teal" @click="num__input(9)">
                        <span>9</span>
                    </v-btn>
                    <v-btn fab small dark color="teal" @click="num__input(0)">
                        <span>0</span>
                    </v-btn>

                    <v-btn fab small dark color="teal" @click="summ__prod = ['']">
                        <v-icon>delete_forever</v-icon>
                    </v-btn>
                    <v-btn fab small dark color="teal" @click="summ__prod.splice(-1, 1)">
                        <v-icon>backspace</v-icon>
                    </v-btn>
                </v-card-text>
                <v-card-actions style="justify-content: space-around">
                    <v-btn color="#fff" small icon flat @click="exitDialog">
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-btn color="#19B200" small icon flat @click="saveQuality">
                        <v-icon>check</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar
                v-model="snack"
                :timeout="3000"
                :color="snackColor"
                :bottom="true"
        >
            {{ snackText }}
            <v-btn flat @click="snack = false">
                <v-icon>close</v-icon>
            </v-btn>
        </v-snackbar>

        <div v-if="modalChanged" class="modal-changed">
            <div class="modal-changed__container">
                <div class="modal-changed__content">
                    <div class="v-toolbar__title">Заміни за замовленням</div>
                    <div v-if="dataTableAddNote.length">
                        <div class="modal-changed__add-text">
                            До вашого замовлення було додано такі товари
                        </div>
                        <div
                                class="list__orders__accordion__item"
                                :class="{ active: listOrder }"
                        >
                            <template>
                                <v-data-table
                                        :items="dataTableAddNote"
                                        hide-actions
                                        :pagination.sync="paginationAddNote"
                                        :total-items="total_items_add_note"
                                        :loading="loading"
                                        class="table__tamplate-2 theme--light"
                                        :class="{ opaciiLast: !listOrder && total_items_add_note > 10 }"
                                        no-data-text="Немає даних"
                                >
                                    <template v-slot:items="props">
                                        <tr>
                                            <td class="text-xs-left first-td" style="padding-left: 0">
                                                <img
                                                        style="max-width: 60px; width: 60px; object-fit: contain"
                                                        :src="props.item.imgs"
                                                />
                                            </td>
                                            <td
                                                    class="text-xs-left text-wrap"
                                                    style="min-width: 370px; max-width: 370px"
                                            >
                                                <v-tooltip bottom content-class="tooltip__catalog__table">
                                                  <span slot="activator" class="wrap-text wm200p">{{
                                                    props.item.name
                                                  }}</span>
                                                    <img
                                                            style="max-width: 200px; max-height: 260px; object-fit: contain"
                                                            :src="props.item.imgs"
                                                            class="img__display"
                                                    />
                                                </v-tooltip>
                                            </td>
                                            <td class="text-xs-left">
                                                <div style="display: flex; justify-content: flex-start; align-items: center">
                                                    {{props.item.quantity}}
                                                </div>
                                            </td>
                                            <td class="text-xs-left">{{ props.item.total_sum | price-break }}₴</td>
                                        </tr>
                                    </template>
                                </v-data-table>
                            </template>
                        </div>
                        <div v-if="total_items_add_note > 10" class="d-flex justify-content-center">
                            <v-btn
                                    class="btn-accordion flex-grow-0"
                                    flat
                                    icon
                                    @click="listOrderFunc"
                            >
                                <v-icon :class="{ open: listOrder }">keyboard_arrow_down</v-icon>
                            </v-btn>
                        </div>
                    </div>


                    <div v-if="dataTableDeleteNote.length">
                        <div class="modal-changed__delete-text">
                            Нажаль, дані товари недоступні та були видалені з вашого замовлення
                        </div>
                        <div
                                class="list__orders__accordion__item"
                                :class="{ active: listOrder }"
                        >
                            <template>
                                <v-data-table
                                        :headers="headersChanged"
                                        :items="dataTableDeleteNote"
                                        hide-actions
                                        :pagination.sync="paginationDeleteNote"
                                        :total-items="total_items_delete_note"
                                        :loading="loading"
                                        class="table__tamplate-2 theme--light"
                                        :class="{ opaciiLast: !listOrder && total_items_delete_note > 10 }"
                                        no-data-text="Немає даних"
                                >
                                    <template v-slot:items="props">
                                        <tr>
                                            <td class="text-xs-left first-td" style="padding-left: 0">
                                                <img
                                                        style="max-width: 60px; width: 60px; object-fit: contain"
                                                        :src="props.item.imgs"
                                                />
                                            </td>
                                            <td
                                                    class="text-xs-left text-wrap"
                                                    style="min-width: 370px; max-width: 370px"
                                            >
                                                <v-tooltip bottom content-class="tooltip__catalog__table">
                                                  <span slot="activator" class="wrap-text wm200p">{{
                                                    props.item.name
                                                  }}</span>
                                                    <img
                                                            style="max-width: 200px; max-height: 260px; object-fit: contain"
                                                            :src="props.item.imgs"
                                                            class="img__display"
                                                    />
                                                </v-tooltip>
                                            </td>
                                            <td class="text-xs-left">
                                                <div style="display: flex; justify-content: flex-start; align-items: center">
                                                    {{props.item.quantity}}
                                                </div>
                                            </td>
                                            <td class="text-xs-left">{{ props.item.total_sum | price-break }}₴</td>
                                        </tr>
                                    </template>
                                </v-data-table>
                            </template>
                        </div>
                        <div v-if="total_items_delete_note > 10" class="d-flex justify-content-center">
                            <v-btn
                                    class="btn-accordion flex-grow-0"
                                    flat
                                    icon
                                    @click="listOrderFunc"
                            >
                                <v-icon :class="{ open: listOrder }">keyboard_arrow_down</v-icon>
                            </v-btn>
                        </div>
                    </div>
                    <div class="modal-changed__buttons">
                        <div @click="closeModalChanged" class="modal-changed__button">Зрозуміло</div>
                    </div>
                </div>
            </div>
        </div>
        <ModalExceeds :item="itemExceeds" :close="itemExceedsClose" />

        <div v-if="modalSuccessCopy" class="modal-choose">
            <div class="modal-choose__container">
                <div @click="closeChooseModalSuccess" class="modal-choose__close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9393 12L6.9696 15.9697L8.03026 17.0304L12 13.0607L15.9697 17.0304L17.0304 15.9697L13.0607 12L17.0303 8.03039L15.9696 6.96973L12 10.9393L8.03038 6.96973L6.96972 8.03039L10.9393 12Z" fill="#000000"/>
                    </svg>
                </div>
                <div class="modal-choose__title">
                    Юху, товар додано до корзини!
                </div>
                <div class="modal-choose__button-group">
                    <div @click="closeChooseModalSuccess" class="modal-choose__button">
                        Зрозуміло
                    </div>
                </div>
            </div>
        </div>

        <div v-if="modalSuccessCopyEdit" class="modal-choose">
            <div class="modal-choose__container">
                <div @click="closeChooseModalSuccessEdit" class="modal-choose__close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9393 12L6.9696 15.9697L8.03026 17.0304L12 13.0607L15.9697 17.0304L17.0304 15.9697L13.0607 12L17.0303 8.03039L15.9696 6.96973L12 10.9393L8.03038 6.96973L6.96972 8.03039L10.9393 12Z" fill="#000000"/>
                    </svg>
                </div>
                <div class="modal-choose__title">
                    Юху, товари додано до корзини для редагуваання замовлення
                </div>
                <div class="modal-choose__button-group">
                    <div @click="closeChooseModalSuccessEdit" class="modal-choose__button">
                        Зрозуміло
                    </div>
                </div>
            </div>
        </div>

        <div v-if="modalChooseCopy" class="modal-choose">
            <div class="modal-choose__container">
                <div @click="closeChooseCopyModal" class="modal-choose__close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9393 12L6.9696 15.9697L8.03026 17.0304L12 13.0607L15.9697 17.0304L17.0304 15.9697L13.0607 12L17.0303 8.03039L15.9696 6.96973L12 10.9393L8.03038 6.96973L6.96972 8.03039L10.9393 12Z" fill="#000000"/>
                    </svg>
                </div>
                <div class="modal-choose__title">
                    Упс, в корзині вже є товари!
                </div>
                <div class="modal-choose__button-group">
                    <div @click="addCopyProduct" class="modal-choose__button">
                        Додати товари
                    </div>
                    <div @click="copyProductAndDelete" class="modal-choose__button">
                        Очистити корзину і <br>
                        додати товар
                    </div>
                </div>
            </div>
        </div>

        <div v-if="modalChooseEdit" class="modal-choose">
            <div class="modal-choose__container">
                <div @click="closeChooseEditModal" class="modal-choose__close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9393 12L6.9696 15.9697L8.03026 17.0304L12 13.0607L15.9697 17.0304L17.0304 15.9697L13.0607 12L17.0303 8.03039L15.9696 6.96973L12 10.9393L8.03038 6.96973L6.96972 8.03039L10.9393 12Z" fill="#000000"/>
                    </svg>
                </div>
                <div class="modal-choose__title">
                    Упс, в корзині вже є товари!
                </div>
                <div class="modal-choose__button-group">
                    <div @click="addEditProduct" class="modal-choose__button">
                        Додати товари
                    </div>
                    <div @click="editToCart" class="modal-choose__button">
                        Очистити корзину і <br>
                        додати товар
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    // import comments from "@/views/orders/comments"
    // import upFiles from "@/views/orders/up_files"
    // import createOrder from "@/views/orders/create-order"
    import {mapGetters, mapActions, mapMutations} from "vuex"
    import moment from "moment"
    import ModalExceeds from "../../components/modalExceeds"

    export default {
        name: "OrderPage",
        components: {
            // comments,
            // upFiles,
            // createOrder,
            ModalExceeds
        },
        props: {
            id: {
                type: String
            },
        },
        data: () => ({
            orderLoading: false,
            model: {
                delivery_date: "",
                company_entity_id: "",
                location_id: "",
                cost_center_id: "",
                contract_id: "",
                budget_id: "",
                comment: "",
                history: {
                    email: "",
                    role: ""
                }
            },
            modalChooseEdit: false,
            itemExceeds: null,
            orderExceeds: false,
            modal_delivery_date: false,
            datePickerValue: "",
            dialog: false,
            dialogInput: false,
            summ__prod: [],
            snack: false,
            snackColor: "",
            snackText: "",
            triggerSave: false,
            statuses: [],
            data: {},
            pagination: {
                sortBy: "id",
                rowsPerPage: 100,
                page: 1
            },
            paginationAdd: {
                sortBy: "id",
                rowsPerPage: 100,
                page: 1
            },
            paginationDelete: {
                sortBy: "id",
                rowsPerPage: 100,
                page: 1
            },
            paginationAddNote: {
                sortBy: "id",
                rowsPerPage: 100,
                page: 1
            },
            paginationDeleteNote: {
                sortBy: "id",
                rowsPerPage: 100,
                page: 1
            },
            loading: false,
            total_items: 0,
            total_items_add: 0,
            total_items_add_note: 0,
            total_items_delete: 0,
            total_items_delete_note: 0,
            dataTable: [],
            dataTableAdd: [],
            dataTableAddNote: [],
            dataTableDelete: [],
            dataTableDeleteNote: [],
            allList: 100,
            matchingStep: [],
            headers: [
                {text: "Картинка", value: "product.image"},
                {text: "Найменування", value: "product.name"},
                {text: "Кількість", value: "quantity"},
                {text: "Сума (з ПДВ)", value: "total_sum"}
            ],
            headersExceeds: [
                {text: "Статус", value: "number", sortable: false},
                {text: "№", value: "number", sortable: false},
                {text: "Артикул", value: "product.sku"},
                {text: "Найменування", value: "product.name"},
                {text: "Кількість", value: "quantity"},
                {text: "Доступно до замовлення", value: "product.leftovers"},
                {text: "Ціна (з ПДВ)", value: "price"},
                {text: "Сума (з ПДВ)", value: "total_sum"},
                {text: "Дії", value: "action", sortable: false, class: "action__th"}
            ],
            headersChanged: [
                {text: "№", value: "number", sortable: false},
                {text: "Артикул", value: "product.sku", sortable: false},
                {text: "Найменування", value: "product.name", sortable: false},
                {text: "Кількість", value: "quantity", sortable: false},
                {text: "Ціна (з ПДВ)", value: "price", sortable: false},
                {text: "Сума (з ПДВ)", value: "total_sum", sortable: false},
            ],
            initFile: [],
            errorModal: false,
            errorMsg: "",
            dialogDelete: false,
            dialogData: [],
            dialogEmptyString: false,
            emptyString: false,
            emptyModel: {},
            emptyModelErrors: [],
            listOrder: true,
            showActionBtn: false,
            emptyEdit: false,
            modalData: {},
            dialogDesc: false,
            dialogDescModal: "",
            dialogProduct: false,
            dialogProductData: "",
            oneModal: false,
            oneModalHead: "",
            oneModalData: "",
            oneModalType: 0,
            dataKey: "",
            myDialog: false,
            btnClose: {name: "Скасувати", class: "button__blue"},
            btnApprove: {name: "Підтвердити", class: "button__yellow"},
            dialogText: "",
            dialogItem: {},
            dialogHeadline: "",
            myDialogAction: "",
            entries: [],
            isLoading: false,
            autocomplete: null,
            searchAutocomplete: null,
            changeProductValidation: "",
            errors: {},
            RoErrors: false,
            cartIsChanged: false,
            moment: false,
            dateError: false,
            isChanged: false,
            modalChanged: false,
            deliveryDateArray: [],
            modalChooseCopy: false,
            modalSuccessCopy: false,
            modalSuccessCopyEdit: false,
            idProd: -1,
            valProd: "",
            indexProd: -1,
            selectedChild: []
        }),
        computed: {
            ...mapGetters("user", ["currentUser"]),
            ...mapGetters("basket", ["newBasketProduct", "idProduct"]),
            fields() {
                if (!this.searchAutocomplete) return []

                return Object.keys(this.searchAutocomplete).map(key => {
                    return {
                        key,
                        value: this.searchAutocomplete[key] || "n/a"
                    }
                })
            },
            items() {
                let descriptionLimit = 30
                return this.entries.map(entry => {
                    const Description =
                        entry.name.length > descriptionLimit
                            ? entry.name.slice(0, descriptionLimit) + "..."
                            : entry.name

                    return Object.assign({}, entry, {Description})
                })
            },
            getMinDate() {
                const now = new Date();
                const nowTime = now.getHours()*60+now.getMinutes();
                const dayNumber = moment(now).day();
                let endDate;
                if (dayNumber == 6) {
                    endDate = new Date(new Date().getTime() + 72 * 60 * 60 * 1000)
                } else if (dayNumber == 0) {
                    endDate = new Date(new Date().getTime() + 48 * 60 * 60 * 1000)
                } else {
                    if ( +nowTime < 930 ) {
                        endDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
                    } else {
                        if (dayNumber == 5) {
                            endDate = new Date(new Date().getTime() + 96 * 60 * 60 * 1000)
                        } else {
                            endDate = new Date(new Date().getTime() + 48 * 60 * 60 * 1000)
                        }
                    }
                }


                return endDate.toISOString().slice(0, 10)
            }
        },
        watch: {
            dialogInput() {
                this.keymonitor()
            },
            dialogDesc(e) {
                this.errors.ro_number = ""
                if (this.dialogDescModal === "redactRO" && !e) {
                    this.getDataFromApi()
                }
            },
            pagination: {
                handler() {
                    this.getDataFromApi()
                },
                deep: true
            },
            search() {
                this.getDataFromApi()
            },
            loading(e) {
                this.$loadingBus.$emit("loading", e)
            },
            dataTable(e) {
                if (this.data.modal && e.length > 0) {
                    // eslint-disable-next-line no-unused-vars
                    let modal = 1
                    e.forEach(val => {
                        if (val.view_only) {
                            modal = 2
                        }
                    })
                }
            },
            searchAutocomplete(val) {
                // Items have already been loaded
                if (val == null || val.length < 3) return

                // Items have already been requested
                if (this.isLoading) return
                val = val.replace(/["]/g, '\\"').replace(/[']/g, "'")
                this.isLoading = true
                this.$api
                    .post("/graphql", {
                        query:
                        `
                        query{
                          allProduct(search: "` +
                        val +
                        `"){
                              uuid
                              name
                            }
                        }`
                    })
                    .then(res => {
                        this.entries = res.data.data.allProduct
                    })
                    // eslint-disable-next-line no-unused-vars
                    .catch(err => {
                    })
                    .finally(() => (this.isLoading = false))
            }
        },
        created() {
            this.getDataFromApi()
            this.sockets.subscribe("orderChanged", data => {
                if (data.id === this.id && data.user_id !== this.currentUser.id) {
                    this.getDataFromApi()
                }
            });

            // this.cartChanged();
            this.setDefaultDate();
            this.getChangeHistory();
        },
        methods: {
            ...mapActions("basket", ["setProduct"]),
            ...mapMutations("basket", ["clearNewBasket"]),
            copyProduct() {
                this.selectedChild = [];
                const product = this.dataTable

                if (this.newBasketProduct.length > 0) {
                    this.modalChooseCopy = true
                } else {
                    for (let i = 0; product.length > i; i ++) {
                        if (product[i].product) {
                            this.addToCart(product[i])
                        }
                    }
                    setTimeout(() => {
                        this.modalSuccessCopy = true
                    }, 2000)
                }
            },
            handleDeliveryDate(date) {
                if (date && date > 10800) {
                    return moment(date * 1000).format('DD.MM.YYYY');
                } else {
                    return 'Повідомимо додатково'
                }
            },
            getNextDay() {
                const dayNumber = moment().day();

                if (dayNumber == 1) {
                    return 'Вівторок'
                } else if (dayNumber == 2) {
                    return 'Середа'
                } else if (dayNumber == 3) {
                    return 'Четверг'
                } else if (dayNumber == 4) {
                    return 'П`ятниця'
                } else {
                    return 'Понеділок'
                }
            },
            handleEditProduct() {
                // if (this.newBasketProduct.length > 0) {
                //     this.modalChooseEdit = true
                // } else {
                    this.editToCart()
                // }
            },
            editToCart() {
                let temp = Object.assign({}, this.data)
                this.data.cart_id = temp.card_id;
                temp.id = temp.cart_id
                this.setIdProduct({
                    ctx: temp
                })

                this.$loadingBus.$emit("updateBasket", true)

                this.modalChooseEdit = false
                setTimeout(() => {
                    this.modalSuccessCopyEdit = true
                }, 2000)
            },
            addEditProduct() {
                const basket = this.dataTable
                const product = this.newBasketProduct

                let temp = Object.assign({}, this.data)
                this.data.cart_id = temp.card_id;
                temp.id = temp.cart_id
                this.setIdProduct({
                    ctx: temp
                })

                this.$loadingBus.$emit("updateBasket", true)

                for (let i = 0; basket.length > i; i++ ) {
                    this.selectedChild.push(basket[i].id)
                }

                for (let i = 0; product.length > i; i ++) {
                    this.addToCart(product[i], this.data.id)
                }

                setTimeout(() => {
                    this.modalSuccessCopyEdit = true
                }, 2000)

            },
            getDayName(date) {
                const dayNumber = moment(date, 'DD.MM.YYYY').day();
                const dayNames = ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"];
                const dayName = dayNames[dayNumber];

                return dayName
            },
            copyProductAndDelete() {
                const product = this.dataTable
                let obj = {
                    order_id: this.idProduct.order_id,
                    id: this.idProduct.id
                }
                this.$api.post("/cart/clear-cart", obj).then(response => {
                    for (let i = 0; product.length > i; i ++) {
                        if (product[i].product) {
                            this.addToCart(product[i])
                        }
                    }
                    this.modalChooseCopy = false
                    setTimeout(() => {
                        this.modalSuccessCopy = true
                    }, 2000)
                })
                this.clearNewBasket()
            },

            addCopyProduct() {
                const product = this.dataTable
                const basket = this.newBasketProduct

                for (let i = 0; basket.length > i; i++ ) {
                   this.selectedChild.push(basket[i].id)
                }

                for (let i = 0; product.length > i; i ++) {
                    if (product[i].product) {
                        this.addToCart(product[i])
                    }
                }
                this.modalChooseCopy = false
                setTimeout(() => {
                    this.modalSuccessCopy = true
                }, 2000)
            },

            closeChooseCopyModal() {
                console.log('hello')
                this.modalChooseCopy = false
            },

            closeChooseEditModal() {
                this.modalChooseEdit = false
            },

            closeChooseModalSuccess() {
                window.location.replace('/catalog?basket=open');
            },
            closeChooseModalSuccessEdit() {
                window.location.replace('/catalog?basket=open');
            },

            addToCart(item,order_id = null,index) {
                this.valProd = item;
                this.idProd = item.id;
                this.indexProd = index;

                if(this.idProd === this.valProd.id) {
                    this.summ__prod = [];

                    let $false = false;
                    let s = this.selectedChild;

                    this.selectedChild.push(this.idProd);

                    for(let i = 0; i < s.length; i++) {
                        if(this.selectedChild[i] == item.id) {
                            $false = true;
                        }
                    }
                    let newProduct = true;
                    let changeQuantity = false;
                    let index = undefined;

                    this.newBasketProduct.forEach(i => {
                        if (i.id === item.id) {
                            i.newProduct ? (newProduct = true) : (newProduct = false)
                            index = i.index
                        }
                    });

                    if(!item.newProduct) {
                        changeQuantity = true;
                    }

                    let price = item.price + '';
                    price = price.replace(/[\s,%]/g, "");
                    let total_sum = +price * item.quantity;

                    this.$api
                        .post("/cart/add-product", {
                            id: this.idProduct.id,
                            order_id: order_id ? order_id : this.idProduct.order_id,
                            product_id: item.product.id,
                            quantity: item.quantity,
                            price: item.price + ''
                        })
                        .then(response => {
                            try {
                                if (response.data.success) {
                                    this.socketEmit()
                                    this.$nextTick(() => {
                                        this.setNewBasketProduct({
                                            ctx: {
                                                index: index,
                                                id: item.product.id,
                                                addId: undefined,
                                                lastUpdate: true,
                                                quantity: item.quantity,
                                                val: $false,
                                                total_sum: total_sum.toFixed(2),
                                                price: item.price,
                                                img: item.product.img,
                                                name: item.product.name,
                                                newProduct: newProduct,
                                                changeQuantity: changeQuantity,
                                                leftovers_salvi: item.product.leftovers_salvi,
                                                leftovers_supplier: item.product.leftovers_supplier,
                                                supplier_delivery_postpone: item.product.supplier_delivery_postpone,
                                                multiplicity: item.product.multiplicity,
                                            }
                                        })
                                    })
                                }
                            } catch (e) {
                                console.log(e)
                            }
                        });
                }
            },

            getOrderProduct(item) {
                const now = new Date();
                // let now = new Date(new Date().getTime() + 24 * 1 * 60 * 60 * 1000);
                let nowTime = now.getHours() * 60 + now.getMinutes();
                let dayNumber = moment(now).day();

                if (!item.product) {
                    return
                }

                if (item.product.leftovers_salvi >= item.quantity) {
                    if (nowTime > 900) {
                        return moment(this.getDeliveryInfo(item, item.quantity), 'DD.MM.YYYY').diff(moment("1970-01-01T00:00:00Z"), 'hours');
                    } else {
                        if (dayNumber === 5 || dayNumber === 6 || dayNumber === 0) { // Исправлено на || (ИЛИ)
                            return moment(this.getDeliveryInfo(item, item.quantity), 'DD.MM.YYYY').diff(moment("1970-01-01T00:00:00Z"), 'hours');
                        } else {
                            return 1
                        }
                    }
                } else if (+item.product.leftovers_salvi + +item.product.leftovers_supplier >= item.quantity) {
                    let dateSup = now
                    let dayNumberSup = dayNumber
                    let isSupplier = false
                    if (item.product.supplier_delivery_postpone > 1) {
                        dateSup = new Date(now.getTime() + 24 * (item.product.supplier_delivery_postpone - 1) * 60 * 60 * 1000);
                        dayNumberSup = moment(dateSup).day();
                        isSupplier = true
                    }
                    if (nowTime > 900) {
                        return moment(this.getDeliveryInfo(item, item.quantity), 'DD.MM.YYYY').diff(moment("1970-01-01T00:00:00Z"), 'hours');
                    } else {
                        if (isSupplier || dayNumberSup === 5 || dayNumberSup === 6 || dayNumberSup === 0) { // Исправлено на || (ИЛИ)
                            return moment(this.getDeliveryInfo(item, item.quantity), 'DD.MM.YYYY').diff(moment("1970-01-01T00:00:00Z"), 'hours');
                        } else {
                            return 1
                        }
                    }
                } else {
                    return 9999999999999999
                }
            },
            getDeliveryDateArray() {
                this.deliveryDateArray = [];
                const now = new Date();
                const nowTime = now.getHours() * 60 + now.getMinutes();
                const dayNumber = moment(now).day();

                for (let i = 0; i < this.dataTable.length; i++) {
                    let item = this.dataTable[i];

                    if (item.product) {
                        if (item.product.leftovers_salvi >= item.quantity) {
                            this.processDelivery(nowTime, dayNumber, item);
                        } else if (+item.product.leftovers_salvi + +item.product.leftovers_supplier >= item.quantity) {
                            this.processSupplierDelivery(nowTime, dayNumber, item);
                        } else {
                            this.addDeliveryDate(0);
                        }
                    }
                }

                console.log(this.deliveryDateArray)
            },

            processDelivery(nowTime, dayNumber, item) {
                if (nowTime > 900) {
                    this.addDeliveryDate(moment(this.getDeliveryInfo(item, item.quantity), 'DD.MM.YYYY').diff(moment("1970-01-01T00:00:00Z"), 'hours'), this.getDeliveryInfo(item, item.quantity));
                } else {
                    if ( (dayNumber === 5 || dayNumber === 6 || dayNumber === 0)) { // Исправлено на || (ИЛИ)
                        this.addDeliveryDate(moment(this.getDeliveryInfo(item, item.quantity), 'DD.MM.YYYY').diff(moment("1970-01-01T00:00:00Z"), 'hours'), this.getDeliveryInfo(item, item.quantity));
                    } else {
                        this.addDeliveryDate(1);
                    }
                }
            },

            processSupplierDelivery(nowTime, dayNumber, item) {
                if (item.product.supplier_delivery_postpone < 2) {
                    this.processDelivery(nowTime, dayNumber, item);
                } else {
                    this.addDeliveryDate(moment(this.getDeliveryInfo(item, item.quantity), 'DD.MM.YYYY').diff(moment("1970-01-01T00:00:00Z"), 'hours'), this.getDeliveryInfo(item, item.quantity));
                }
            },

            addDeliveryDate(id, date = null) {
                const existingDate = this.deliveryDateArray.find(el => el.id === id);
                if (!existingDate) {
                    const newDate = { id };
                    if (date) newDate.date = date;
                    this.deliveryDateArray.push(newDate);
                }
            },
            getDeliveryInfo(item, count) {
                const now = new Date();
                // const now = new Date(new Date().getTime() + 24 * 5 * 60 * 60 * 1000);
                const nowTime = now.getHours() * 60 + now.getMinutes();
                const dayNumber = moment(now).day();
                let devDate;

                if (!item.product) {
                    return
                }

                if (+item.product.leftovers_salvi >= count) {
                    if (nowTime < 900) {
                        if (dayNumber === 5) {
                            devDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);
                        } else if (dayNumber === 6) {
                            devDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);
                        } else if (dayNumber === 0) {
                            devDate = new Date(now.getTime() + 48 * 60 * 60 * 1000);
                        } else {
                            return 'Доставка на наступний робочий день';
                        }
                    } else {
                        if (dayNumber === 4) {
                            devDate = new Date(now.getTime() + 96 * 60 * 60 * 1000);
                        } else if (dayNumber === 5) {
                            devDate = new Date(now.getTime() + 96 * 60 * 60 * 1000);
                        } else if (dayNumber === 6) {
                            devDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);
                        } else {
                            devDate = new Date(now.getTime() + 48 * 60 * 60 * 1000);
                        }
                    }
                } else if (+item.product.leftovers_salvi + item.product.leftovers_supplier >= count) {
                    if (item.product.supplier_delivery_postpone < 2) {
                        if (nowTime < 900) {
                            if (dayNumber === 5) {
                                devDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);
                            } else if (dayNumber === 6) {
                                devDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);
                            } else if (dayNumber === 0) {
                                devDate = new Date(now.getTime() + 48 * 60 * 60 * 1000);
                            } else {
                                return 'Доставка на наступний робочий день';
                            }
                        } else {
                            if (dayNumber === 4) {
                                devDate = new Date(now.getTime() + 96 * 60 * 60 * 1000);
                            } else if (dayNumber === 5) {
                                devDate = new Date(now.getTime() + 96 * 60 * 60 * 1000);
                            } else if (dayNumber === 6) {
                                devDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);
                            } else {
                                devDate = new Date(now.getTime() + 48 * 60 * 60 * 1000);
                            }
                        }
                    } else {
                        const dateSup = new Date(now.getTime() + 24 * (item.product.supplier_delivery_postpone - 1) * 60 * 60 * 1000);
                        const dayNumberSup = moment(dateSup).day();

                        if (nowTime < 900) {
                            if (dayNumberSup === 5) {
                                devDate = new Date(dateSup.getTime() + 72 * 60 * 60 * 1000);
                            } else if (dayNumberSup === 6) {
                                devDate = new Date(dateSup.getTime() + 72 * 60 * 60 * 1000);
                            } else if (dayNumberSup === 0) {
                                devDate = new Date(dateSup.getTime() + 72 * 60 * 60 * 1000);
                            } else if (dayNumberSup === 1) {
                                devDate = new Date(dateSup.getTime() + 48 * 60 * 60 * 1000);
                            } else {
                                devDate = new Date(dateSup.getTime() + 24 * 60 * 60 * 1000);
                            }
                        } else {
                            if (dayNumberSup === 4) {
                                devDate = new Date(dateSup.getTime() + 96 * 60 * 60 * 1000);
                            }else if (dayNumberSup === 5) {
                                devDate = new Date(dateSup.getTime() + 96 * 60 * 60 * 1000);
                            } else if (dayNumberSup === 6) {
                                devDate = new Date(dateSup.getTime() + 96 * 60 * 60 * 1000);
                            } else if (dayNumberSup === 0) {
                                devDate = new Date(dateSup.getTime() + 72 * 60 * 60 * 1000);
                            } else {
                                devDate = new Date(dateSup.getTime() + 48 * 60 * 60 * 1000);
                            }
                        }
                    }
                } else {
                    return 'повідомимо додатково';
                }

                return `${moment(devDate).format("DD.MM.YYYY")}`;
            },
            getDeliverDate(day) {
                const now = new Date(new Date().getTime() + 24 * day * 60 * 60 * 1000)
                const nowTime = now.getHours()*60+now.getMinutes();
                const dayNumber = moment(now).day();
                let endDate;
                if (dayNumber == 6) {
                    endDate = new Date(now.getTime() + 72 * 60 * 60 * 1000)
                } else if (dayNumber == 0) {
                    endDate = new Date(now.getTime() + 48 * 60 * 60 * 1000)
                } else {
                    if ( +nowTime < 930 ) {
                        endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000)
                    } else {
                        if (dayNumber == 5) {
                            endDate = new Date(now.getTime() + 96 * 60 * 60 * 1000)
                        } else {
                            endDate = new Date(now.getTime() + 48 * 60 * 60 * 1000)
                        }
                    }
                }
                return moment(endDate).format("DD.MM.YYYY")
            },
            changeQuantity(item, newQty, index, productId) {
                var nQty;
                nQty = +item.quantity;
                if(newQty === 'add') {
                    nQty += 1;
                } else if(newQty === 'remove') {
                    nQty -= 1;
                } else {
                    nQty = newQty;
                }

                if(nQty < 1) {
                    nQty = 1;
                    this.deleteItem(item)
                }

                // r = +r;
                let newProduct = false;
                if (item.newProduct) {
                    newProduct = true
                }
                // this.itemExceeds = null;
                // if (nQty > item.product.leftovers) {
                //     this.itemExceeds = item.product;
                //     nQty = item.product.leftovers;
                //     setTimeout(() => {
                //         this.itemExceeds = null;
                //     }, 10000)
                // }

                if (nQty !== item.quantity) {
                    item.quantity = nQty;
                    // this.socketEmitFreez(true);

                    var basketLastOrder = localStorage.getItem('basketLastOrder');

                    if (basketLastOrder.length) {
                        basketLastOrder = JSON.parse(basketLastOrder);
                    }

                    this.$api.post("/order/change-quantity", {
                        id: item.id,
                        quantity: item.quantity,
                        cartId: basketLastOrder.cart_id,
                        changeQty: false
                    })
                        .then(response => {
                            if (response.data.success) {
                                this.snack = true
                                this.snackColor = "#19B200"
                                this.snackText = "Зміни збережені"
                            } else {
                                this.snack = true
                                this.snackColor = "#ff2525"
                                this.snackText = response.data.message
                            }
                            this.getDataFromApi(false)
                            this.makeChangeEmit()
                        })
                }
            },
            itemExceedsClose() {
                this.itemExceeds = null;
            },
            cartChanged() {
                this.loading = true;
                this.$api
                    .post("/cart/cart-is-changed", {
                        orderId: this.id,
                        cartId: this.$parent.$refs.basketComponent.idProduct.id
                    })
                    .then(response => {
                        if (response.data.success) {
                            this.cartIsChanged = response.data.changed;
                        }
                        this.loading = false
                    });
            },
            saveDate() {
              this.$nextTick(() => (this.model.delivery_date = this.datePickerValue))
              this.modal_delivery_date = false;
                this.dateError = false;
            },
            allowedDates(val) {
                return moment(val).day() !== 0 && moment(val).day() !== 6;
            },
            exitDialog() {
                this.dialogInput = false
                this.summ__prod = [""]
            },
            listOrderFunc() {
                this.listOrder = !this.listOrder
                if (this.listOrder) {
                    this.allList = 1000
                    this.pagination.rowsPerPage = 1000
                } else {
                    this.allList = 6

                }
            },
            changeProduct(e) {
                this.myDialog = true
                this.dialogHeadline = "Заміна товару "
                this.dialogText = "Заміна товару: " + e.product.name
                this.myDialogAction = "changeProduct"
                this.dialogItem = e
                this.btnClose = {name: "Скасувати", class: "button__blue"}
                this.btnApprove = {name: "Замінити", class: "button__yellow"}
            },
            orderGoBackPost(item) {
                this.$api.post("/order/go-back", {id: item.id}).then(response => {
                    if (response.data.success) {
                        this.getDataFromApi()
                        this.makeChangeEmit()
                    }
                })
            },
            orderGoBack(item) {
                this.myDialog = true
                this.dialogHeadline = "Підтвердіть дію"
                this.dialogText =
                    'Ви впевнені, що хочете змінити статус замовлення на "На затвердженні постачальником"?'
                this.myDialogAction = "orderGoBack"
                this.dialogItem = item
                this.btnClose = {name: "Скасувати", class: "button__blue"}
                this.btnApprove = {name: "Замінити", class: "button__yellow"}
            },
            buttonOne() {
                if (this.myDialogAction === "receivedOrder") {
                    this.myDialog = false
                    this.getDataFromApi()
                    this.myDialogAction = ""
                }
                if (this.myDialogAction === "orderGoBack") {
                    this.myDialog = false
                    this.getDataFromApi()
                    this.myDialogAction = ""
                }
                if (this.myDialogAction === "changeProduct") {
                    this.myDialog = false
                    this.getDataFromApi()
                    this.myDialogAction = ""
                }
            },
            buttonTwo(e) {
                if (this.myDialogAction === "receivedOrder") {
                    this.receivedOrderPost(e)
                    this.myDialog = false
                    this.getDataFromApi()
                    this.myDialogAction = ""
                }
                if (
                    this.myDialogAction === "changeProduct" &&
                    this.autocomplete == null
                ) {
                    this.changeProductValidation = "Виберіть товар"
                }
                if (
                    this.myDialogAction === "changeProduct" &&
                    this.autocomplete != null
                ) {
                    this.loading = true
                    this.$api
                        .post("/order/change-product", {
                            from: e.id,
                            to: this.autocomplete.uuid
                        })
                        .then(response => {
                            if (response.data.success) {
                                this.snack = true
                                this.snackColor = "#19B200"
                                this.snackText = "Зміни збережені"


                            } else {
                                this.snack = true
                                this.snackColor = "#ff2525"
                                this.snackText = response.data.message
                            }
                        })
                        .finally(() => {
                            this.autocomplete = ""
                            this.loading = false
                        })
                    this.myDialog = false
                    this.getDataFromApi()
                    this.myDialogAction = ""
                    this.changeProductValidation = ""
                }
                if (this.myDialogAction === "orderGoBack") {
                    this.orderGoBackPost(e)
                    this.myDialog = false
                    this.getDataFromApi()
                    this.myDialogAction = ""
                }
            },
            onApproveByModerator() {
                this.loading = true
                this.$api
                    .post("/order/on-approve-moderation", {id: this.data.id})
                    .then(response => {
                        if (response.data.success) {
                            this.getDataFromApi()
                        }
                        this.loading = false
                    })
            },
            rejectByModerator() {
                this.loading = true
                this.$api
                    .post("/order/reject-moderation", {id: this.data.id})
                    .then(response => {
                        if (response.data.success) {
                            this.getDataFromApi()
                        }
                        this.loading = false
                    })
            },
            approveByModerator() {
                this.loading = true
                this.$api
                    .post("/order/approve-moderation", {id: this.data.id})
                    .then(response => {
                        if (response.data.success) {
                            this.getDataFromApi()
                        }
                        this.loading = false
                    })
            },
            doNotSplitOrder() {
                this.loading = true
                this.$api
                    .post("/order/do-not-split-order", {id: this.data.id})
                    .then(response => {
                        if (response.data.success) {
                            this.oneModal = false
                            this.getDataFromApi()
                        }
                        this.loading = false
                    })
            },
            splitOrder() {
                this.loading = true
                this.$api
                    .post("/order/split-order", {id: this.data.id})
                    .then(response => {
                        if (response.data.success) {
                            this.oneModalHead = "Увага!"
                            this.oneModalData =
                                "Замовлення було розбите. Нове замовлення відправлено на модерацію." +
                                " Номер нового замовлення - " +
                                response.data.id +
                                ". Перевести данне замовлення до узгодження?"
                            this.oneModalType = 3
                            this.getDataFromApi()
                        }
                        this.loading = false
                    })
            },
            hideProductModal() {
                this.loading = true
                this.$api
                    .post("/order/hide-modal", {id: this.data.id})
                    .then(response => {
                        if (response.data.success) {
                            this.dialogProduct = false
                        }
                        this.loading = false
                    })
            },
            descDialog(e) {
                this.modalData = e
                this.dialogDesc = true
                this.dialogDescModal = "desc"
            },
            redactPO(e) {
                this.modalData = e
                this.dialogDesc = true
                this.dialogDescModal = "redactRO"
            },
            redactPOPost(item) {
                this.$api
                    .post("/order/ro-number", {
                        id: this.data.id,
                        ro_number: item
                    })
                    .then(response => {
                        if (response.data.success) {
                            this.snack = true
                            this.snackColor = "#19B200"
                            this.snackText = "Зміни збережені"
                            this.dialogDesc = false
                            this.errors.ro_number = ""
                            this.RoErrors = false
                        } else {
                            if (item.length > 255) {
                                this.snack = true
                                this.snackColor = "#ff2525"
                                this.snackText = "Максимум 255 символiв !"
                                this.errors.ro_number = "Максимум 255 символiв !"
                            } else {
                                this.snack = true
                                this.snackColor = "#ff2525"
                                this.snackText = "Щось не так !"
                            }
                        }
                        this.getDataFromApi()
                        this.makeChangeEmit()
                    })
            },
            showAction() {
                if (
                    this.data.status == 2 &&
                    (this.$root.rbac.changeAnyStatusOrder ||
                        this.data.created_by_user == this.currentUser.id ||
                        this.$root.$rbac.orderApproveReceive)
                ) {
                    this.showActionBtn = true
                } else if (
                    (this.data.status == 0 || this.data.status == 6) &&
                    (this.$root.rbac.changeStatusOrder ||
                        this.data.created_by_user == this.currentUser.id ||
                        this.$root.rbac.changeAnyStatusOrder)
                ) {
                    this.showActionBtn = true
                } else if (this.data.status == 0 && this.$root.rbac.changeStatusOrder) {
                    this.showActionBtn = true
                } else if (this.data.status == 0 && this.$root.rbac.updateOrder) {
                    this.showActionBtn = true
                } else if (
                    this.data.status == 4 &&
                    this.$root.rbac.changeAnyStatusOrder
                ) {
                    this.showActionBtn = true
                } else if (
                    (this.data.status == 4 || this.data.status == 1) &&
                    (this.$root.rbac.changeStatusOrder ||
                        this.$root.rbac.changeAnyStatusOrder)
                ) {
                    this.showActionBtn = true
                } else if (this.$root.$rbac.orderModeration && this.data.status == 5) {
                    this.showActionBtn = true
                } else if (
                    this.$root.$rbac.orderGoBack &&
                    (this.data.status == 2 || this.data.status == 3)
                ) {
                    this.showActionBtn = true
                } else {
                    this.showActionBtn = false
                }
            },
            updateData() {
                this.getDataFromApi()
            },
            updateOrderFunc(data) {
                this.$router.push(`/orders/create-order/?id=${data.id}&update=true`)
            },
            closeDialogOrder(e) {
                this.dialog = e
                this.update = false
            },
            num__input(e) {
                this.summ__prod.push(e)
            },
            saveQuality() {
                let sum = this.summ__prod.reduce((a, b) => a + b, 0)
                if (this.idProd === this.valProd.item.id) {
                    if (sum > 0) {
                        this.valProd.item.quantity = +this.summ__prod.join("")
                        this.summ__prod = []
                        this.dialogInput = false
                        this.triggerSave = true
                        this.changeQuantity(this.valProd.item)
                    } else if (sum <= 0) {
                        this.snack = true
                        this.snackColor = "#ff2525"
                        this.snackText = "Кількість повинна бути більше 0!"
                    }
                }
            },
            keyOn(e) {
                if (
                    e.key == 1 ||
                    e.key == 2 ||
                    e.key == 3 ||
                    e.key == 4 ||
                    e.key == 5 ||
                    e.key == 6 ||
                    e.key == 7 ||
                    e.key == 8 ||
                    e.key == 9 ||
                    e.key == 0
                ) {
                    this.dataKey = e.key
                    this.summ__prod.push(this.dataKey)
                }
                if (e.key == "Enter") {
                    this.saveQuality()
                }
                if (e.key == "Backspace") {
                    this.summ__prod.splice(-1, 1)
                }
            },
            keymonitor() {
                if (this.dialogInput) {
                    document.addEventListener("keydown", this.keyOn)
                } else {
                    document.removeEventListener("keydown", this.keyOn)
                }
            },
            makeChangeEmit() {
                this.$socket.emit("orderChangeSuccess", {
                    id: this.id,
                    user_id: this.currentUser.id
                })
            },
            downloadDoc(id) {
                this.$api.post("/order/generate-xls", {id: id}).then(response => {
                    // let errors = []
                    if (response.data.success) {
                        let link = document.createElement("a")
                        link.setAttribute("href", response.data.link)
                        link.setAttribute("class", "dinamicLink")
                        link.setAttribute("download", "download")
                        // let linkParent = this.$refs.downloadFileExel
                        document.querySelector(".downloadFileExel").appendChild(link)
                        link.click()
                    } else {
                        // response.data.errors.forEach(function(value) {
                        //   errors[value.field] = value.message
                        // })
                        // this.emptyModelErrors = errors
                    }
                })
            },
            downloadPdf(id) {
                this.$api.post("/order/generate-pdf", {id: id}).then(response => {
                    // let errors = []
                    if (response.data.success) {
                        let link = document.createElement("a")
                        link.setAttribute("href", response.data.link)
                        link.setAttribute("class", "dinamicLink")
                        link.setAttribute("download", "download")
                        link.setAttribute("target", "_blank")
                        // let linkParent = this.$refs.downloadFileExel
                        document.querySelector(".downloadFileExel_pdf").appendChild(link)
                        link.click()
                    } else {
                        // response.data.errors.forEach(function(value) {
                        //   errors[value.field] = value.message
                        // })
                        // this.emptyModelErrors = errors
                    }
                })
            },
            addEmptyProduct() {
                this.emptyModel.order_id = this.id
                this.$api
                    .post("/order/add-custom-product", this.emptyModel)
                    .then(response => {
                        let errors = []
                        if (response.data.success) {
                            this.cancel()
                            this.makeChangeEmit()
                        } else {
                            response.data.errors.forEach(function (value) {
                                errors[value.field] = value.message
                            })
                            this.emptyModelErrors = errors
                        }
                    })
            },
            editEmptyProduct() {
                this.$api
                    .post("/order/edit-custom-product", this.emptyModel)
                    .then(response => {
                        let errors = []
                        if (response.data.success) {
                            this.cancel()
                            this.makeChangeEmit()
                        } else {
                            response.data.errors.forEach(function (value) {
                                errors[value.field] = value.message
                            })
                            this.emptyModelErrors = errors
                        }
                    })
            },
            cancel() {
                this.emptyModel = {}
                this.dialogEmptyString = false
                this.emptyEdit = false
                this.getDataFromApi()
            },
            emptyStringDialog(e) {
                e.preventDefault()
                this.dialogEmptyString = true
            },
            getCoordination() {
                this.$api
                    .post("/graphql", {
                        query:
                        `
                        query{
                          orderCoordination(order_id: ` +
                        this.id +
                        `){
                              id
                              name
                              status
                              next_step
                              canApprove
                          }
                        }`
                    })
                    .then(response => {
                        this.matchingStep = response.data.data.orderCoordination
                    })
            },
            ...mapActions("basket", ["setIdProduct", "setNewBasketProduct"]),
            socketEmit() {
                this.$socket.emit("userCartAction", {
                    order_id: this.id,
                    user_id: 0,
                    update: true
                })
            },
            getDataFromApi(loading = true) {
                this.orderLoading = true
                let order = "DESC"
                if (this.pagination.descending) {
                    order = "ASC"
                }
                if (loading) {
                    this.loading = true
                }
                this.$api
                    .post("/graphql", {
                        query:
                        `
                        query{
                          orderInfo(id:` +
                        this.id +
                        `){
                            id
                            ro_number
                            order_id
                            company_id
                            delivery_date
                            company_entity_id
                            location_id
                            location_name
                            cost_center_id
                            cost_center_name
                            contract_id
                            budget_id
                            comment
                            created_by_user
                            created_at
                            updated_at
                            status
                            total_sum
                            cart_id
                            total
                            coordination
                            ttn
                            company_entity{
                                short_name
                                full_name
                            }
                            history{
                                email
                                role
                            }
                            budget{
                              availableSum
                              name
                            }
                            contract{
                              name
                              date_start
                              date_end
                            }
                            empty_string
                            created_by{
                                first_name
                                last_name
                            }
                            modal
                            can_approve_next_coordination
                          }
                          orderStatus{
                                id
                                name
                                class
                          }
                          orderCoordination(order_id: ` +
                        this.id +
                        `){
                              id
                              name
                              status
                              next_step
                              canApprove
                              created_at
                              updated_at
                              status_cancel
                              user {
                                last_name
                                first_name
                              }
                          }
                          orderFile(order_id: ` +
                        this.id +
                        `){
                              id
                              old_name
                              size
                          }
                          orderProduct(order_id: ` +
                        this.id +
                        ` page: ` +
                        this.pagination.page +
                        ` perPage: ` +
                        this.pagination.rowsPerPage +
                        ` order: "` +
                        order +
                        `" orderBy: "` +
                        this.pagination.sortBy +
                        `"){
                              items{
                                is_delete
                                catalog
                                id
                                quantity
                                is_strict_multiplicity
                                price
                                total_sum
                                view_only
                                product{
                                  id
                                  sku
                                  uuid
                                  leftovers
                                  leftovers_salvi
                                  leftovers_supplier
                                  supplier_delivery_postpone
                                  is_temperature_conditions
                                  multiplicity
                                  name
                                  unit{
                                    name
                                  }
                                  img
                                }
                                name
                                custom
                                comment
                                avaliable_quantity
                                order_id
                                product_status
                                approved
                                approved_quantity
                                status{
                                    id
                                    icon
                                    text
                                    style
                                }
                                orderProductHistory{
                                    id
                                    from_uuid
                                    to_uuid
                                    product_name
                                }
                              }
                              totalCount
                          }
                        }`
                    })
                    .then(response => {
                        this.setIdProduct({
                            ctx: {
                                order_id: 0
                            }
                        })

                        this.$loadingBus.$emit("updateBasket", true)

                        this.data = response.data.data.orderInfo
                        this.model.comment = this.data.comment
                        this.statuses = response.data.data.orderStatus
                        this.matchingStep = response.data.data.orderCoordination
                        this.initFile = response.data.data.orderFile
                        this.dataTable = response.data.data.orderProduct.items
                        this.total_items = response.data.data.orderProduct.totalCount
                        this.emptyString = response.data.data.orderInfo.empty_string
                        this.loading = false
                        if (this.data.id === null) {
                            return this.$router.push("/orders")
                        }
                        this.showAction()
                        this.getDeliveryDateArray()
                        this.orderLoading = false
                    })
            },
            getDate(date) {
                return moment(date * 1000).format('DD.MM.YYYY HH:mm:ss')
            },
            getChangeHistory() {
                this.$api
                    .post("/order/get-order-product-change-history",  {
                        id: this.id
                    })
                    .then(res => {
                        const product = Object.values(res.data.product)
                        for (let i = 0; product.length > i; i++) {
                            if (product[i].type_event == 'add') {
                                this.dataTableAdd.push(product[i])
                                if (!product[i].is_note) {
                                    this.dataTableAddNote.push(product[i])
                                }
                            } else {
                                this.dataTableDelete.push(product[i])
                                if (!product[i].is_note) {
                                    this.dataTableDeleteNote.push(product[i])
                                }
                            }
                        }
                        this.total_items_add = this.dataTableAdd.length
                        this.total_items_add_note = this.dataTableAddNote.length
                        this.total_items_delete = this.dataTableDelete.length
                        this.total_items_delete_note = this.dataTableDeleteNote.length

                        if (this.total_items_delete_note > 0 || this.total_items_add_note > 0) {
                            this.modalChanged = true
                            document.querySelector(".section.full").style.height = "100vh"
                        }
                    })
            },

            closeModalChanged() {
                this.$api
                    .post("/order/checked-order-product-change-history",  {
                        id: this.id
                    })
                    .then(res => {
                        this.modalChanged = false
                        document.querySelector(".section.full").style.height = "auto"
                    })
            },
            declineOrder(item) {
                if (item.status == 0 && item.next_step) {
                    this.$api
                        .post("/order/cancel", {
                            id: item.id,
                            order_id: this.id
                        })
                        .then(response => {
                            if (response.data.success) {
                                this.getDataFromApi()
                                this.getCoordination()
                                this.makeChangeEmit()
                            } else {
                                this.snack = true
                                this.snackColor = "#ff2525"
                                this.snackText = response.data.message
                            }
                        })
                }
            },
            approveStep(item) {
                this.orderLoading = true
                if (item.status == 0 && item.next_step) {
                    this.$api
                        .post("/order/approve-coordination", {
                            id: item.id,
                            order_id: this.id
                        })
                        .then(response => {
                            if (response.data.success) {
                                this.getDataFromApi()
                                this.getCoordination()
                                this.makeChangeEmit()
                            } else {
                                this.snack = true
                                this.snackColor = "#ff2525"
                                this.snackText = response.data.message
                            }

                            this.orderLoading = false
                        })
                }
            },
            checkProductAvailable(item) {
                for (let i = 0; this.dataTable.length > i; i++) {
                    if (!this.dataTable[i].custom) {
                        if (this.dataTable[i].quantity > this.dataTable[i].product.leftovers) {
                            this.orderExceeds = true;
                            return
                        }
                    }
                }
                this.$api
                    .post("/order/check-product-available", {id: item.id})
                    .then(response => {
                        if (response.data.success) {
                            this.oneModal = true
                            if (response.data.stage === 1) {
                                this.oneModalHead = "Змінити статус?"
                                this.oneModalData =
                                    "Ви впевнені, що хочете перевести замовлення до узгодження?"
                                this.oneModalType = 1
                            } else if (response.data.stage === 0) {
                                this.oneModalHead = "Увага!"
                                this.oneModalData =
                                    "В замовленні є недоступні для вашої локації товари. " +
                                    "Винести недоступні товари в окреме замовлення?"
                                this.oneModalType = 2
                            } else if (response.data.stage === 4) {
                                this.oneModalHead = "Увага!"
                                this.oneModalData =
                                    "В замовленні є недоступні для вашої локації товари. "
                                this.oneModalType = 4
                            }
                        }
                    })
            },
            setStatusOnApprove(item) {
                const data = {
                    id: item.id,
                    delivery_date: this.model.delivery_date,
                }
                if (this.model.comment.length > 0) {
                    data.comment = this.model.comment
                }

                this.$api
                    .post("/order/set-status-on-approve", data)
                    .then(response => {
                        if (response.data.success) {
                            this.oneModal = false
                            this.getDataFromApi()
                            this.makeChangeEmit()
                            this.RoErrors = false
                        } else {
                            this.RoErrors = true
                            setTimeout(() => (this.RoErrors = false), 3000)
                            this.errorModal = true
                            this.oneModal = false
                            this.errorMsg = response.data.message
                            if (
                                response.data.show_modal !== undefined &&
                                response.data.show_modal &&
                                this.$root.rbac.updateOrder
                            ) {
                                this.updateOrderFunc(this.data)
                            }
                        }
                    })
            },
            setStatusAtSupplier(item) {
                this.$api
                    .post("/order/set-status-at-supplier", {id: item.id})
                    .then(response => {
                        if (response.data.success) {
                            this.getDataFromApi()
                            this.makeChangeEmit()
                        }
                    })
            },
            receivedOrder(item) {
                this.myDialog = true
                this.dialogHeadline = "Підтвердіть дію"
                this.dialogText = "Ви впевнені, що хочете підтвердити отримання товару?"
                this.myDialogAction = "receivedOrder"
                this.dialogItem = item
                this.btnClose = {name: "Скасувати", class: "button__blue"}
                this.btnApprove = {name: "Підтвердити", class: "button__yellow"}
            },
            receivedOrderPost(item) {
                this.$api
                    .post("/order/order-received", {id: item.id})
                    .then(response => {
                        if (response.data.success) {
                            this.getDataFromApi()
                            this.makeChangeEmit()
                        }
                    })
            },
            cancelOrder(item) {
                this.$api
                    .post("/order/repeat-from-start", {id: item.id})
                    .then(response => {
                        if (response.data.success) {
                            this.getDataFromApi()
                            this.makeChangeEmit()
                        }
                    })
            },
            deleteOrder(item) {
                this.$api.post("/order/delete", {id: item.id}).then(response => {
                    if (response.data.success) {
                        this.socketEmit()
                        return this.$router.push("/orders")
                    }
                })
            },
            deleteItem(data) {
                this.dialogDelete = true;
                this.dialogData = data;

                var basketLastOrder = localStorage.getItem('basketLastOrder');

                if (basketLastOrder.length) {
                    basketLastOrder = JSON.parse(basketLastOrder);
                }

                this.dialogData.cartId = basketLastOrder.cart_id;
            },
            editItem(data) {
                this.emptyModelErrors = []
                this.emptyModel = data
                this.dialogEmptyString = true
                this.emptyEdit = true
            },
            closeDialog() {
                this.dialogDelete = false
                this.dialogData = []
            },
            deleteProduct() {
                this.$api
                    .post("/order/delete-product", this.dialogData)
                    .then(response => {
                        if (response.data.success) {
                            this.getDataFromApi()
                            this.makeChangeEmit()
                        } else {
                            if (response.data.message != undefined) {
                                this.snack = true
                                this.snackColor = "#ff2525"
                                this.snackText = response.data.message
                            }
                        }
                    })
                this.closeDialog()
            },
            setDefaultDate() {
                const dateToDay = moment().format("YYYY-MM-DD")
                let dateDefault = moment(dateToDay).add(2, 'd').format("YYYY-MM-DD")
                function addDay() {
                    if (moment(dateDefault).day() == 0 || moment(dateDefault).day() == 6) {
                        dateDefault = moment(dateDefault).add(1, 'd').format("YYYY-MM-DD")
                        addDay()
                    }
                }
                addDay();

                if (moment(dateToDay).day() == 6 || moment(dateToDay).day() == 0) {
                    dateDefault = moment(dateDefault).add(1, 'd').format("YYYY-MM-DD")
                }

                const now = new Date();
                const nowTime = now.getHours()*60+now.getMinutes();
                const dayNumber = moment(now).day();
                if ( +nowTime > 930 && dayNumber == 5 ) {
                    dateDefault = moment(dateDefault).add(1, 'd').format("YYYY-MM-DD")
                }
                this.model.delivery_date = dateDefault;
            },
            momentToDay(date) {
                console.log(moment().unix(), date)
                return moment().unix() > date ? true : false
            },
            momentGetFormatDay(date, format) {
                return moment(date * 1000).format(format)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .badge__isTemp {
        position: absolute;
        z-index: 100000;
        top: 0;
        left: 0;
        color: #3d4465;

        svg {
            width: 20px;
            height: 20px;
        }
    }
    .multiplicity__info-icon {
        font-size: 14px;
        font-weight: 700;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgb(42, 139, 26);
        border: 2px solid rgb(42, 139, 26);
        margin-right: 10px;
        border-radius: 50px;
        cursor: pointer;
    }
    .ttn-link {
        color: #269446 !important;
        &:hover {
            color: #565656 !important;
            text-decoration: underline;
        }
    }
    .first-td img {
        max-height: 76px;
    }
    .v-toolbar__title {
        font-size: 24px;
        font-weight: 600;
        color: #000000;
    }
    .modal-choose {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;

        &__container {
            position: relative;
            width: 400px;
            max-width: 100%;
            background: #ffffff;
            padding: 20px;
            border-radius: 10px;
        }

        &__close {
            cursor: pointer;
            position: absolute;
            top: 10px;
            right: 10px;
        }

        &__title {
            font-size: 20px;
            font-weight: 700;
            text-align: center;
            padding: 10px 0 20px;
        }

        &__button-group {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        &__button {
            border-radius: 10px;
            margin: 0 5px;
            width: 150px;
            height: 50px;
            background: #269446;
            cursor: pointer;
            padding: 5px;
            font-size: 12px;
            color: #ffffff;
            font-size: 700;
            display: flex;
            text-align: center;
            align-items: center;
            justify-content: center;

            &.grey {
                background: #bcbcbc;
                color: black;
            }
        }
    }
    .order-page__table-sort {
        ::v-deep tbody {
            display: flex;
            flex-direction: column;
        }

        ::v-deep td {
            color: #000000 !important;
            font-size: 14px !important;
        }
    }
    .matching__step .item {
        border-radius: 10px !important;

        .item__body {
            padding: 20px !important;
            background: none !important;
        }

        h2 {
            font-weight: 700;
            font-size: 18px;
            padding-bottom: 15px;
            text-align: center;
        }

        &.approve {
             background: #edffef;
        }

        &.decline {
            background: #ffe1e4 ;
        }
    }
    .section__box {
        background: none;
        box-shadow: none;
    }
    .order__page *:not(.v-icon), .detail-line {
        font-family: "Montserrat", sans-serif;
    }

    .detail-line-bold {
      font-weight: 700 !important;
    }
    .section__box__head__body {
        box-shadow: none;
        padding: 0;
        flex-direction: column;
        background: none;

        .item {
            width: 100%;
            flex-direction: row;
            margin: 0 0 10px;
            padding: 0;
            background: none;

            .head {
                width: 50%;
                min-width: 50%;
                max-width: 50%;
            }

            span, .desc {
                color: #565656;
                flex-grow: 1;
                font-size: 14px;
                text-align: left;
            }
        }
    }

    .order-page__detail-title {
        font-size: 14px;
        font-weight: 600;
        padding-bottom: 10px;
    }
    .order-page__date {
        padding-top: 10px;
        color: #565656;
        font-size: 12px;
    }
    .order-page__nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 10px;

        &-item {
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: 600;

            &.retry {
                color: #269446;
                cursor: pointer;
            }

            svg {
                margin-right: 10px;
            }
        }
    }
    .section__box {
        padding: 20px 0;
    }
    .section__content {
        padding: 20px 10px 20px 0;
    }
    .order__page {
        width: 100%;
    }
    .order-page__container {
        height: 100vh;
        max-height: calc(100vh - 20px);
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
    }
    .order-page__approve-buttons {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        .button {
            margin: 0;
            padding: 15px 40px;
            font-size: 16px;
            font-weight: 700;
        }
    }
    .order-page__content {
        padding: 0 10px 0 20px;
        flex-grow: 1;
        overflow-y: auto;

        ::v-deep thead {
            display: none;
        }

        &::-webkit-scrollbar {
            width: 5px;
        }

        &::-webkit-scrollbar-thumb {
            background-color: #7f85aa;
            border-radius: 6px;
        }

        &::-webkit-scrollbar-track {
            background-color: #eeeeee;
        }
    }
    .order-page__top {
        padding: 20px;
        box-shadow: 0px 8px 24px rgba(149, 157, 165, 0.2);
    }
    .order-page__footer {
        padding: 20px 20px 0;
        box-shadow: 0px -8px 24px rgba(149, 157, 165, 0.2);
    }
    .productExceeds {
        background: #ffdfd4;
    }
    .modal-changed__buttons {
        padding-top: 20px;
        display: flex;
        justify-content: center;
    }
    .modal-changed__button {
        padding: 15px 30px;
        font-size: 16px;
        color: #ffffff;
        font-weight: 600;
        background: #269446;
        border-radius: 5px;
        cursor: pointer;
    }
    .modal-changed__add-text {
        background: #edffef;
        padding: 20px;
        border-radius: 10px;
        margin: 10px 0;
        text-align: center;
    }
    .modal-changed__delete-text {
        background: #feff3c;
        padding: 20px;
        border-radius: 10px;
        margin: 10px 0;
        text-align: center;
    }
    .modal-changed {
        position: fixed;
        z-index: 1111111111;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .modal-changed__container {
        max-height: 90vh;
        overflow-x: hidden;
        overflow-y: auto;
        background: #ffffff;
        border-radius: 20px;
        padding: 20px 30px;

        ::v-deep thead {
            display: none;
        }
    }
    .section__content__buttons {
        display: flex;

        &.border-item {
            border-bottom: 1px solid #dddddd;
        }
    }

    .section__content__button {
        margin: 0 10px 0 0;
        padding: 7px 20px 0 0;
        font-size: 14px;
        font-weight: 600;
        color: #000000;
    }

    .order-page__footer-total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 18px;
        font-weight: 700;
    }

    .border-item .section__content__button:hover, .border-item .section__content__button.active {
        font-weight: 700;
        color: #269446;
        cursor: pointer;
    }

    .label__head__menu {
        color: #646c9a;
        font-size: 14px;
    }

    .v-card__actions.type-1 {
        display: flex;
        justify-content: center;
    }

    .error__date {
        color: red;
    }

    @media screen and (max-width: 768px) {
        .label__head__menu {
            display: none;
        }
    }

    .product__input {
        min-width: 20px;
        max-width: 50px;
        width: auto;
        text-align: right;
        border: 1px transparent solid;
    }

    .product__input:focus {
        border-radius: 5px;
        /*border: 1px #C7A500 solid;*/
    }

    .v-btn.btn-accordion {
        transition: 0.3s;
        animation: toggleColor 3s infinite;
    }

    .btn-accordion .v-icon.open {
        transform: rotate(-180deg);
    }

    @keyframes toggleColor {
        0% {
            color: #fcbd00;
            transform: translateY(0px);
        }
        50% {
            color: #19b200;
            transform: translateY(5px);
        }
        100% {
            color: #646c9a;
            transform: translateY(0px);
        }
    }
    .el-icon-refresh {
        font-size: 16px;
        transition: 0.3s;
        cursor: pointer;
        transform: rotate(0deg);
    }
    .el-icon-refresh:hover {
        transform: rotate(180deg);
        color: green;
    }
    .redactRO {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: #19b200;
        font-size: 11px;
    }

    .quantity-section {
        /*height: 50px;*/
        display: flex;
    }
    .quantity-section > button {
        color: #4caf50;
        height: 40px;
        width: 40px;
    }
    .quantity-section > button.minus-btn {
        border: 1px solid #bfbfbf;
        border-right: none;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }
    .quantity-section > button.plus-btn {
        border: 1px solid #bfbfbf;
        border-left: none;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }
    .quantity-section > input {
        width: 70px;
        border: 1px solid #bfbfbf;
        height: 40px;
        padding: 5px 10px;
        text-align: center;
    }
    .quantity-section > button:hover {
        background-color: #4caf50;
    }
    .quantity-section > button:hover > i{
        color: #fff !important;
    }
    .button-exceeds {
        padding-left: 10px;
        cursor: pointer;
    }
    .quantity-section > input::-webkit-outer-spin-button,
    .quantity-section > input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .quantity-section > input[type="number"] {
        -moz-appearance: textfield;
    }
    .section__content__head {
        display: flex;
        justify-content: space-between;
    }
    .order-loading {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to right, rgba(245,248,250, .7) 0%, rgba(245,248,250, .2) 50%, rgba(245,248,250, .7) 100%);
        background-size: 200% 100%;
        animation: gradientAnimation 4s linear infinite;
    }

    @keyframes gradientAnimation {
        0% {
            background-position: 100% 0;
        }
        100% {
            background-position: -100% 0;
        }
    }
</style>
