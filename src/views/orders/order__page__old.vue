<template>
    <div class="order__page">
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


        <div class="section__content">
            <v-flex v-if="statuses.length > 0" xs12 sm12 class="section__box__head">
                <v-toolbar color="#FFFFFF" class="tollbar__mobile">
                    <div class="toolbar__wrap">
                        <v-toolbar-title>
                            <div class="name">
                                <v-toolbar-title>Замовлення №{{ data.id }}</v-toolbar-title>
                            </div>
                        </v-toolbar-title>
                        <div v-if="statuses.find(x => x.id === data.status)" class="status-desc" :class="statuses.find(x => x.id === data.status).class">
                            {{ statuses.find(x => x.id === data.status).name }}
                        </div>
                    </div>
                    <span v-show="showActionBtn" class="label__head__menu">Дії</span>
                    <v-menu
                            v-show="showActionBtn"
                            offset-x
                            bottom
                            nudge-bottom="40"
                            nudge-left="-40"
                            left
                            content-class="action__td__drop"
                    >
                        <v-btn slot="activator" icon>
                            <v-icon>more_horiz</v-icon>
                        </v-btn>
                        <v-list v-show="showActionBtn">
                            <span>Дії</span>
                            <v-list-tile
                                    v-if="data.status == 2"
                                    v-show="
                  $root.rbac.changeAnyStatusOrder ||
                    data.created_by_user == currentUser.id ||
                    $root.rbac.orderApproveReceive
                "
                            >
                                <v-list-tile-title @click="receivedOrder(data)">
                                    Підтвердити отримання
                                </v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile
                                    v-if="data.status == 0 || data.status == 6"
                                    v-show="
                  $root.rbac.changeStatusOrder ||
                    data.created_by_user == currentUser.id ||
                    $root.rbac.changeAnyStatusOrder
                "
                            >
                                <v-list-tile-title @click="checkProductAvailable(data)">
                                    Перевести до узгодження
                                </v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile
                                    v-if="data.status == 0"
                                    v-show="$root.rbac.changeStatusOrder"
                            >
                                <v-list-tile-title @click="deleteOrder(data)">
                                    Видалити замовлення
                                </v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile
                                    v-if="data.status == 0"
                                    v-show="$root.rbac.updateOrder"
                            >
                                <v-list-tile-title @click="updateOrderFunc(data)">
                                    Деталі замовлення
                                </v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile
                                    v-if="data.status == 4"
                                    v-show="$root.rbac.changeAnyStatusOrder"
                            >
                                <v-list-tile-title @click="setStatusAtSupplier(data)">
                                    Передати постачальнику
                                </v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile
                                    v-if="data.status == 4 || data.status == 1"
                                    v-show="
                  $root.rbac.changeStatusOrder ||
                    $root.rbac.changeAnyStatusOrder
                "
                            >
                                <v-list-tile-title @click="cancelOrder(data)">
                                    Відхилити замовлення
                                </v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile
                                    v-if="data.status == 5"
                                    v-show="$root.rbac.orderModeration"
                            >
                                <v-list-tile-title @click="approveByModerator(data)">
                                    Підтвердити модерацію
                                </v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile
                                    v-if="data.status == 5"
                                    v-show="$root.rbac.orderModeration"
                            >
                                <v-list-tile-title @click="rejectByModerator(data)">
                                    Відхилити модерацію
                                </v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile
                                    v-if="data.status == 5"
                                    v-show="$root.rbac.orderModeration"
                            >
                                <v-list-tile-title @click="onApproveByModerator(data)">
                                    Перевести до узгодження
                                </v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile
                                    v-if="data.status == 2 || data.status == 3"
                                    v-show="$root.rbac.orderGoBack"
                            >
                                <v-list-tile-title @click="orderGoBack(data)">
                                    На узгодження постачальнику
                                </v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>
                </v-toolbar>
                <v-card class="section__box__head__body">
                    <div class="item">
                        <span class="head">Покупець:</span>
                        <v-tooltip z-index="101" bottom max-width="320px">
                            <div class="wrap-text">{{ data.company_entity.short_name }}</div>
                            <span slot="activator" class="desc wrap-text">{{
                data.company_entity.short_name | truncate(30, "...")
              }}</span>
                        </v-tooltip>
                    </div>
                    <div class="item">
                        <span class="head">Дата створення:</span>
                        <span class="desc">{{ data.created_at | formatDateDot }}</span>
                    </div>
                    <div class="item">
                        <span class="head">Бажана дата доставки:</span>
                        <span class="desc">{{ data.delivery_date | formatDateDot }}</span>
                    </div>
                    <div v-if="data.budget_id > 0" class="item">
                        <span class="head">Бюджет:</span>
                        <span class="desc">{{ data.budget.availableSum }}</span>
                    </div>
                    <div class="item">
                        <span class="head">Локація:</span>
                        <v-tooltip z-index="101" bottom max-width="320px">
                            <div class="wrap-text">{{ data.location_name }}</div>
                            <span slot="activator" class="desc wrap-text">{{
                data.location_name | truncate(30, "...")
              }}</span>
                        </v-tooltip>
                    </div>
                    <div class="item">
                        <span class="head">Кост-центр:</span>
                        <v-tooltip z-index="101" bottom max-width="320px">
                            <div class="wrap-text">{{ data.cost_center_name }}</div>
                            <span slot="activator" class="desc wrap-text">{{
                data.cost_center_name | truncate(30, "...")
              }}</span>
                        </v-tooltip>
                    </div>
                    <div class="item">
                        <span class="head">Сума:</span>
                        <span class="desc">{{ data.total_sum }}</span>
                    </div>
                    <div class="item">
                        <span class="head">Автор:</span>
                        <span class="desc">
              {{ data.created_by.first_name }}
              {{ data.created_by.last_name }}
            </span>
                    </div>
                    <div class="item PurchaseOrder" :class="{ errors: RoErrors }">
                        <span class="head">№ Purchase Order:</span>
                        <div
                                class="desc"
                                style="display: flex; align-items: center; cursor: pointer"
                        >
                            {{
                            data.ro_number == ""
                            ? "Пусто"
                            : data.ro_number | truncate(20, "...")
                            }}
                            <div
                                    v-if="
                  data.status == 0 ||
                    data.status == 1 ||
                    data.status == 4 ||
                    data.status == 5 ||
                    data.status == 6
                "
                                    class="redactRO"
                                    @click="redactPO(data.ro_number)"
                            >
                                редагувати
                            </div>
                            <div
                                    v-if="data.ro_number.length > 20"
                                    @click="descDialog(data.ro_number)"
                            >
                                <v-icon style="font-size: 15px" color="#19B200">more</v-icon>
                            </div>
                        </div>
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
                        <div
                                class="desc"
                                style="display: flex; align-items: center;"
                        >
                            {{data.ttn}}
                        </div>
                    </div>
                </v-card>
            </v-flex>
            <div class="flex col-12 text-danger font-bolder" v-if="cartIsChanged === true">
                Кількість товарів, які додані у кошику відрізняються від замовлення. Перейдіть до кошику та додайте товари до замовлення.
            </div>


            <div class="section__box list__orders__accordion">
                <div class="section__content__head">
                    <div class="section__content__buttons">
                        <div @click="() => {this.isChanged = false}" :class="['section__content__button', !isChanged && 'active']">Список товарів</div>
                        <div v-if="dataTableAdd.length > 0 || dataTableDelete.length > 0" @click="() => {this.isChanged = true}" :class="['section__content__button', isChanged && 'active']">Зміни за замовленням</div>
                    </div>
                    <button
                            v-show="emptyString && data.status == 0 && $root.rbac.updateOrder"
                            class="button button__yellow no-plus"
                            @click.prevent="emptyStringDialog"
                    >
                        Порожній рядок
                    </button>
                    <router-link
                            v-show="data.status == 0 && $root.rbac.updateOrder"
                            class="button button__yellow"
                            :to="`/catalog/`"
                    >
                        Додати товар
                    </router-link>
                </div>


                <div v-if="!isChanged">

                    <div
                            class="list__orders__accordion__item"
                            :class="{ active: listOrder }"
                    >
                        <template>
                            <v-data-table
                                    :headers="orderExceeds ? headersExceeds : headers"
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
                                    <tr
                                            v-if="!props.item.custom"
                                            :class="{
                                                readOnly: props.item.view_only,
                                                productDelete: props.item.is_delete,
                                                changed: dataTableAdd.find(item => item.sku == props.item.product.sku),
                                                productExceeds: orderExceeds ?  props.item.quantity >  props.item.product.leftovers ? true : false : false
                                              }"
                                    >
                                        <td
                                                class="icon"
                                                style="display: flex; align-items: center; min-width: 89px"
                                        >
                                            <v-tooltip
                                                    v-if="!props.item.is_delete"
                                                    z-index="101"
                                                    bottom
                                            >
                                                <v-icon slot="activator" :style="props.item.status.style">
                                                    {{ props.item.status.icon }}
                                                </v-icon>
                                                <span>{{ props.item.status.text }}</span>
                                            </v-tooltip>
                                            <v-tooltip
                                                    v-if="
                            !props.item.is_delete &&
                              props.item.orderProductHistory != null
                          "
                                                    z-index="101"
                                                    bottom
                                            >
                                                <v-icon slot="activator">
                                                    refresh
                                                </v-icon>
                                                <span>
                            Змінено з:
                            {{ props.item.orderProductHistory.product_name }}
                          </span>
                                            </v-tooltip>
                                            <v-tooltip
                                                    v-if="props.item.is_delete"
                                                    z-index="101"
                                                    bottom
                                            >
                                                <v-icon
                                                        slot="activator"
                                                        style="background-color: #F24949; color: white"
                                                >
                                                    close
                                                </v-icon>
                                                <span>
                            Товару немає в наявності
                          </span>
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
                                        <td>
                                            {{
                                            (pagination.page - 1) * pagination.rowsPerPage +
                                            props.index +
                                            1
                                            }}
                                        </td>
                                        <td class="text-xs-left">
                                            <v-tooltip top max-width="320px">
                                                <div class="wrap-text">{{ props.item.product.sku }}</div>
                                                <span slot="activator">{{
                            props.item.product.sku | truncate(20, "...")
                          }}</span>
                                            </v-tooltip>
                                        </td>
                                        <td
                                                class="text-xs-left text-wrap"
                                                style="min-width: 370px; max-width: 370px"
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
                                        </td>
                                        <td class="text-xs-left">
                                            <div v-if="
                                                    (data.status === 0 && $root.rbac.updateOrder) ||
                                                    (data.status === 6 && $root.rbac.updateOrder) ||
                                                    (data.status === 5 && $root.rbac.orderModeration) ||
                                                    (data.status === 1 && $root.rbac.editOnApproveOrder && data.can_approve_next_coordination)"
                                                 style="display: flex; justify-content: flex-start; align-items: center">
                                                <div class="quantity-section">
                                                    <button class="minus-btn" @click="changeQuantity(props.item, 'remove', index, props.item.id)">
                                                        <v-icon color="#4caf50">remove</v-icon>
                                                    </button>

                                                    <input type="number" name="item-quantity" :value="props.item.quantity" :data-quantity="props.item.quantity" @keyup="changeQuantity(props.item, $event.target.value, index, props.item.id)" @change="changeQuantity(props.item, $event.target.value, index, props.item.id)">

                                                    <button class="plus-btn" @click="changeQuantity(props.item, 'add', index, props.item.id)">
                                                        <v-icon color="#4caf50">add</v-icon>
                                                    </button>
                                                </div>
                                                <div v-if="orderExceeds ? props.item.quantity > props.item.product.leftovers ? true : false : false"
                                                     @click="changeQuantity(props.item, props.item.product.leftovers, index, props.item.id)"
                                                     class="button-exceeds">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 -0.5 17 17" version="1.1" class="si-glyph si-glyph-arrow-change">
                                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                            <g transform="translate(1.000000, 0.000000)" fill="#434343">
                                                                <path d="M1.539,8.001 C2.367,8.001 2.918,7.45 2.918,6.622 L2.914,6.187 C2.914,6.187 2.709,4.954 4.354,4.954 L11.015,5 L11.015,6.759 C11.338,7.081 11.862,7.081 12.185,6.759 L14.758,4.187 C15.08,3.863 15.08,3.339 14.758,3.017 L12.185,0.292 C11.862,-0.03 11.338,-0.03 11.015,0.292 L11.015,2.137 C10.854,2.09 4.562,2.063 4.562,2.063 C0.851,2.063 0.039,4.492 0.039,5.47 L0.039,6.501 C0.039,7.329 0.711,8.001 1.539,8.001 L1.539,8.001 Z" class="si-glyph-fill">

                                                                </path>
                                                                <path d="M13.5,8.042 C12.672,8.042 12,8.626 12,9.454 L12.002,10.411 C11.957,10.768 11.357,11.001 10.477,11.001 L3.938,11.001 L3.936,9.442 C3.614,9.12 3.09,9.12 2.766,9.442 L0.194,12.014 C-0.128,12.338 -0.128,12.862 0.194,13.184 L2.766,15.756 C3.09,16.08 3.614,16.08 3.936,15.756 L3.938,13.905 L10.477,13.905 C14.188,13.905 15,11.463 15,10.484 L15,9.453 C15,8.626 14.328,8.042 13.5,8.042 L13.5,8.042 Z" class="si-glyph-fill">
                                                                </path>
                                                            </g>
                                                        </g>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div v-else
                                                 style="display: flex; justify-content: flex-start; align-items: center">
                                                {{ props.item.quantity }}
                                            </div>
                                        </td>
                                        <td v-if="orderExceeds" class="text-xs-left"> <span v-if="props.item.product.leftovers > 0">{{ props.item.product.leftovers }}</span></td>
                                        <td class="text-xs-left">{{ props.item.price }}</td>
                                        <td class="text-xs-left">{{ props.item.total_sum }}</td>
                                        <td class="text-xs-left">
                                            <i
                                                    v-show="
                            (data.status == 0 && $root.rbac.updateOrder) ||
                              (data.status === 1 &&
                                $root.rbac.editOnApproveOrder &&
                                data.can_approve_next_coordination)
                          "
                                                    class="icon icon-delete"
                                                    @click="deleteItem(props.item)"
                                            ></i>
                                            <i
                                                    v-if="data.status == 2 || data.status == 3"
                                                    v-show="$root.rbac.orderChangeProduct"
                                                    class="icon el-icon-refresh"
                                                    @click="changeProduct(props.item)"
                                            ></i>
                                        </td>
                                    </tr>
                                    <tr v-else class="custom_product">
                                        <td class="icon">
                                            <v-icon
                                                    v-if="!props.item.view_only"
                                                    style="color: white; background-color: #19B200;"
                                            >
                                                done
                                            </v-icon>
                                            <v-icon
                                                    v-else
                                                    style="color: white; background-color: #F24949;"
                                            >
                                                priority_high
                                            </v-icon>
                                        </td>
                                        <td>
                                            {{
                                            (pagination.page - 1) * pagination.rowsPerPage +
                                            props.index +
                                            1
                                            }}
                                        </td>
                                        <td class="text-xs-left">
                                            <v-tooltip top tag="div">
                                                <v-icon
                                                        slot="activator"
                                                        class="pointer"
                                                        color="#93a2dd"
                                                        size="17px"
                                                >
                                                    info
                                                </v-icon>
                                                <span>Товар доданий через порожній рядок</span>
                                            </v-tooltip>
                                        </td>
                                        <td class="text-xs-left">
                                            {{ props.item.name }} {{ props.item.comment }}
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
                                                <span>{{ props.item.quantity + " шт" }}</span>
                                                <!--<input class="product__input" v-model="props.item.quantity"-->
                                                <!--v-on:change="changeQuantity(props.item)"-->
                                                <!--:disabled="data.status != 0 || data.status != 0 && !$root.rbac.updateOrder">-->
                                            </div>
                                        </td>
                                        <td class="text-xs-left">{{ props.item.price }}</td>
                                        <td class="text-xs-left">{{ props.item.total_sum }}</td>
                                        <td class="text-xs-left">
                                            <div class="d-flex">
                                                <i
                                                        v-show="
                              (data.status == 0 && $root.rbac.updateOrder) ||
                                (data.status === 1 &&
                                  $root.rbac.editOnApproveOrder &&
                                  data.can_approve_next_coordination)
                            "
                                                        class="icon icon-delete"
                                                        @click="deleteItem(props.item)"
                                                ></i>
                                                <i
                                                        v-show="data.status == 0 && $root.rbac.updateOrder"
                                                        class="icon icon-redact"
                                                        @click="editItem(props.item)"
                                                ></i>
                                            </div>
                                        </td>
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
                                        :headers="headersChanged"
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
                                            <td>
                                                {{
                                                (pagination.page - 1) * pagination.rowsPerPage +
                                                props.index +
                                                1
                                                }}
                                            </td>
                                            <td class="text-xs-left">
                                                <v-tooltip v-if="props.item.sku" top max-width="320px">
                                                    <div class="wrap-text">{{ props.item.sku }}</div>
                                                    <span slot="activator">
                                                        {{props.item.sku | truncate(20, "...")}}
                                                    </span>
                                                </v-tooltip>
                                                <v-tooltip v-else top tag="div">
                                                    <v-icon
                                                            slot="activator"
                                                            class="pointer"
                                                            color="#93a2dd"
                                                            size="17px"
                                                    >
                                                        info
                                                    </v-icon>
                                                    <span>Товар доданий через порожній рядок</span>
                                                </v-tooltip>
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
                                            <td class="text-xs-left">{{ props.item.price }}</td>
                                            <td class="text-xs-left">{{ props.item.total_sum }}</td>
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
                                        :headers="headersChanged"
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
                                            <td>
                                                {{
                                                (pagination.page - 1) * pagination.rowsPerPage +
                                                props.index +
                                                1
                                                }}
                                            </td>
                                            <td class="text-xs-left">
                                                <v-tooltip v-if="props.item.sku" top max-width="320px">
                                                    <div class="wrap-text">{{ props.item.sku }}</div>
                                                    <span slot="activator">
                                                        {{props.item.sku | truncate(20, "...")}}
                                                    </span>
                                                </v-tooltip>
                                                <v-tooltip v-else top tag="div">
                                                    <v-icon
                                                            slot="activator"
                                                            class="pointer"
                                                            color="#93a2dd"
                                                            size="17px"
                                                    >
                                                        info
                                                    </v-icon>
                                                    <span>Товар доданий через порожній рядок</span>
                                                </v-tooltip>
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
                                            <td class="text-xs-left">{{ props.item.price }}</td>
                                            <td class="text-xs-left">{{ props.item.total_sum }}</td>
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
          data.status == 9
      "
                v-show="matchingStep.length"
                class="section__content"
        >
            <div class="section__content__head">
                <div class="caption">Узгодження</div>
            </div>
            <div class="matching__step">
                <div
                        v-for="(item, index) in matchingStep"
                        :key="index"
                        class="item"
                        :class="{ 'not-active': item.status == 0 && !item.next_step }"
                >
                    <v-toolbar
                            :color="
              item.status == 1 && !item.next_step
                ? '#19B200'
                : item.next_step && item.canApprove
                ? '#FCBD00'
                : '#A1A8C3'
            "
                    >
                        <v-toolbar-title>{{ item.name }}</v-toolbar-title>
                        <v-spacer/>
                        <v-menu
                                v-if="data.status == 1"
                                offset-x
                                bottom
                                nudge-bottom="40"
                                nudge-left="-40"
                                left
                                content-class="action__td__drop"
                        >
                            <v-btn slot="activator" icon>
                                <v-icon>more_horiz</v-icon>
                            </v-btn>
                            <v-list v-hide-empty>
                                <span>Дії</span>
                                <v-list-tile
                                        v-show="
                    $root.rbac.changeStatusOrder ||
                      $root.rbac.changeAnyStatusOrder
                  "
                                >
                                    <v-list-tile-title @click="cancelOrder(data)">
                                        Відхилити крок
                                    </v-list-tile-title>
                                </v-list-tile>
                            </v-list>
                        </v-menu>
                    </v-toolbar>
                    <div class="item__body">
                        <svg
                                v-if="item.status == 1"
                                width="42"
                                height="42"
                                viewBox="0 0 42 42"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                    d="M37.667 21C37.667 30.2083 30.2087 37.6666 21.0003 37.6666C11.792 37.6666 4.33366 30.2083 4.33366 21C4.33366 11.7916 11.792 4.33329 21.0003 4.33329C22.5837 4.33329 24.1253 4.56246 25.5837 4.97913L28.8545 1.70829C26.4378 0.708293 23.792 0.166626 21.0003 0.166626C9.50033 0.166626 0.166992 9.49996 0.166992 21C0.166992 32.5 9.50033 41.8333 21.0003 41.8333C32.5003 41.8333 41.8337 32.5 41.8337 21H37.667ZM12.4795 17L9.54199 19.9583L18.917 29.3333L39.7503 8.49996L36.8128 5.54163L18.917 23.4375L12.4795 17Z"
                                    fill="#19B200"
                            />
                        </svg>

                        <svg
                                v-if="item.status == 0 && item.next_step && item.canApprove"
                                width="42"
                                height="42"
                                viewBox="0 0 42 42"
                                fill="#FCBD00"
                                xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                    d="M18.917 27.25H23.0837V31.4166H18.917V27.25ZM18.917 10.5833H23.0837V23.0833H18.917V10.5833ZM21.0003 0.166626C9.47949 0.166626 0.166992 9.54163 0.166992 21C0.166992 32.5 9.50033 41.8333 21.0003 41.8333C32.5003 41.8333 41.8337 32.5 41.8337 21C41.8337 9.49996 32.5003 0.166626 21.0003 0.166626ZM21.0003 37.6666C11.792 37.6666 4.33366 30.2083 4.33366 21C4.33366 11.7916 11.792 4.33329 21.0003 4.33329C30.2087 4.33329 37.667 11.7916 37.667 21C37.667 30.2083 30.2087 37.6666 21.0003 37.6666Z"
                            />
                        </svg>
                        <svg
                                v-if="
                item.status == 0 &&
                  (!item.canApprove || (!item.next_step && item.canApprove))
              "
                                width="42"
                                height="42"
                                viewBox="0 0 42 42"
                                fill="#A1A8C3"
                                xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                    d="M18.917 27.25H23.0837V31.4166H18.917V27.25ZM18.917 10.5833H23.0837V23.0833H18.917V10.5833ZM21.0003 0.166626C9.47949 0.166626 0.166992 9.54163 0.166992 21C0.166992 32.5 9.50033 41.8333 21.0003 41.8333C32.5003 41.8333 41.8337 32.5 41.8337 21C41.8337 9.49996 32.5003 0.166626 21.0003 0.166626ZM21.0003 37.6666C11.792 37.6666 4.33366 30.2083 4.33366 21C4.33366 11.7916 11.792 4.33329 21.0003 4.33329C30.2087 4.33329 37.667 11.7916 37.667 21C37.667 30.2083 30.2087 37.6666 21.0003 37.6666Z"
                            />
                        </svg>
                        <v-btn
                                type="submit"
                                class="status__step"
                                :class="{
                green: item.status == 1,
                orange: item.status == 0 && item.next_step && item.canApprove,
                silver: item.status == 0 && !item.canApprove
              }"
                                :disabled="
                (item.status == 0 && !item.next_step) || data.status != 1
              "
                                @click.prevent="approveStep(item)"
                        >
                            {{ item.status == 1 ? "Затверджено" : "Підтвердити" }}
                        </v-btn>
                        <span v-if="item.status == 1 && item.user != null">
                            погодив: {{ item.user != null ? item.user.last_name : "" }} {{ item.user != null ? item.user.first_name : "" }}, {{ moment(item.updated_at * 1000).format('D.M.YYYY HH:mm:ss')}}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <!--<comments :id="id"/>-->
        <upFiles :id="id" :init-file="initFile"/>
        <div class="section__content footer__order-page">
            <div class="downloadFileExel">
                <button
                        ref="downloadFileExel"
                        class="button button__blueBG button__icon"
                        @click="downloadDoc(id)"
                >
                    <v-icon>cloud_download</v-icon>
                    <span>Завантажити xls замовлення</span>
                </button>
            </div>
            <div class="downloadFileExel_pdf">
                <button
                        ref="downloadFilePdf"
                        class="button button__blueBG button__icon"
                        @click="downloadPdf(id)"
                >
                    <v-icon>cloud_download</v-icon>
                    <span>Завантажити pdf замовлення</span>
                </button>
            </div>

            <button
                    v-if="data.status == 2"
                    v-show="
          $root.rbac.changeAnyStatusOrder ||
            data.created_by_user == currentUser.id ||
            $root.rbac.orderApproveReceive
        "
                    class="button"
                    style="background: #19B200"
            >
                <span @click="receivedOrder(data)">Підтвердити отримання </span>
            </button>
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
            <button
                    v-if="data.status == 4 || data.status == 1"
                    v-show="$root.rbac.changeStatusOrder || $root.rbac.changeAnyStatusOrder"
                    class="button"
                    style="background: #F24949"
            >
                <span @click="cancelOrder(data)">Відхилити замовлення </span>
            </button>
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

        <createOrder
                :id="id"
                :dialog="dialog"
                :products="dataTable"
                :model="model"
                :update="true"
                @closeDialog="closeDialogOrder"
                @updateList="updateData"
        />
        <div v-if="modalChanged" class="modal-changed">
            <div class="modal-changed__container">
                <div class="modal-changed__content">
                    <div v-if="dataTableAddNote.length">
                        <div class="v-toolbar__title">Додані товари</div>
                        <div
                                class="list__orders__accordion__item"
                                :class="{ active: listOrder }"
                        >
                            <template>
                                <v-data-table
                                        :headers="headersChanged"
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
                                            <td>
                                                {{
                                                (pagination.page - 1) * pagination.rowsPerPage +
                                                props.index +
                                                1
                                                }}
                                            </td>
                                            <td class="text-xs-left">
                                                <v-tooltip v-if="props.item.sku" top max-width="320px">
                                                    <div class="wrap-text">{{ props.item.sku }}</div>
                                                    <span slot="activator">
                                                        {{props.item.sku | truncate(20, "...")}}
                                                    </span>
                                                </v-tooltip>
                                                <v-tooltip v-else top tag="div">
                                                    <v-icon
                                                            slot="activator"
                                                            class="pointer"
                                                            color="#93a2dd"
                                                            size="17px"
                                                    >
                                                        info
                                                    </v-icon>
                                                    <span>Товар доданий через порожній рядок</span>
                                                </v-tooltip>
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
                                            <td class="text-xs-left">{{ props.item.price }}</td>
                                            <td class="text-xs-left">{{ props.item.total_sum }}</td>
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
                        <div class="v-toolbar__title">Видалені товари</div>
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
                                            <td>
                                                {{
                                                (pagination.page - 1) * pagination.rowsPerPage +
                                                props.index +
                                                1
                                                }}
                                            </td>
                                            <td class="text-xs-left">
                                                <v-tooltip v-if="props.item.sku" top max-width="320px">
                                                    <div class="wrap-text">{{ props.item.sku }}</div>
                                                    <span slot="activator">
                                                        {{props.item.sku | truncate(20, "...")}}
                                                    </span>
                                                </v-tooltip>
                                                <v-tooltip v-else top tag="div">
                                                    <v-icon
                                                            slot="activator"
                                                            class="pointer"
                                                            color="#93a2dd"
                                                            size="17px"
                                                    >
                                                        info
                                                    </v-icon>
                                                    <span>Товар доданий через порожній рядок</span>
                                                </v-tooltip>
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
                                            <td class="text-xs-left">{{ props.item.price }}</td>
                                            <td class="text-xs-left">{{ props.item.total_sum }}</td>
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
                    <div class="modal-changed__button">
                        <div @click="closeModalChanged" class="section__content__button">Добре</div>
                    </div>
                </div>
            </div>
        </div>
        <ModalExceeds :item="itemExceeds" :close="itemExceedsClose" />
    </div>
</template>

<script>
    // import comments from "@/views/orders/comments"
    import upFiles from "@/views/orders/up_files"
    import createOrder from "@/views/orders/create-order"
    import {mapGetters, mapActions} from "vuex"
    import moment from "moment"
    import ModalExceeds from "../../components/modalExceeds"

    export default {
        name: "OrderPage",
        components: {
            // comments,
            upFiles,
            createOrder,
            moment,
            ModalExceeds
        },
        props: {
            id: {
                type: String
            },
        },
        data: () => ({
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
                {text: "Статус", value: "number", sortable: false},
                {text: "№", value: "number", sortable: false},
                {text: "Артикул", value: "product.sku"},
                {text: "Найменування", value: "product.name"},
                {text: "Кількість", value: "quantity"},
                {text: "Ціна (з ПДВ)", value: "price"},
                {text: "Сума (з ПДВ)", value: "total_sum"},
                {text: "Дії", value: "action", sortable: false, class: "action__th"}
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
        }),
        computed: {
            ...mapGetters("user", ["currentUser"]),
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
            this.moment = moment;
            this.getDataFromApi()
            this.sockets.subscribe("orderChanged", data => {
                if (data.id === this.id && data.user_id !== this.currentUser.id) {
                    this.getDataFromApi()
                }
            });

            this.cartChanged();
            this.setDefaultDate();
            this.getChangeHistory();
        },
        methods: {
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
                this.itemExceeds = null;
                if (nQty > item.product.leftovers) {
                    this.itemExceeds = item.product;
                    nQty = item.product.leftovers;
                    setTimeout(() => {
                        this.itemExceeds = null;
                    }, 10000)
                }

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
                this.dialog = true
                this.model = Object.assign({}, data)
                this.model.delivery_date = this.$options.filters.formatDateMinus(
                    this.model.delivery_date
                )
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
            ...mapActions("basket", ["setIdProduct"]),
            socketEmit() {
                this.$socket.emit("userCartAction", {
                    order_id: this.id,
                    user_id: 0,
                    update: true
                })
            },
            getDataFromApi(loading = true) {
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
                                price
                                total_sum
                                view_only
                                product{
                                  sku
                                  leftovers
                                  leftovers_salvi
                                  leftovers_supplier
                                  supplier_delivery_postpone
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
                        this.data = response.data.data.orderInfo
                        this.model.comment = this.data.comment
                        if (
                            response.data.data.orderInfo.id &&
                            this.data.status == 0 &&
                            this.$root.rbac.updateOrder
                        ) {
                            let temp = Object.assign({}, response.data.data.orderInfo)
                            this.data.cart_id = temp.card_id;
                            temp.id = temp.cart_id
                            this.setIdProduct({
                                ctx: temp
                            })
                            if (loading) {
                                this.$loadingBus.$emit("updateBasket", true)
                            } else {
                                setTimeout(() => {
                                    this.$loadingBus.$emit("updateBasket", true)
                                },5000)
                            }
                        } else {
                            this.setIdProduct({
                                ctx: {
                                    order_id: 0
                                }
                            })
                        }
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
                    })
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
            approveStep(item) {
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
            }
        }
    }
</script>

<style scoped>
    .productExceeds {
        background: #ffdfd4;
    }
    .modal-changed__button {
        padding-top: 20px;
        display: flex;
        justify-content: center;
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
    }
    .section__content__buttons {
        display: flex;
    }

    .section__content__button {
        margin: 0 10px 0 0;
        padding: 7px 20px;
        font-size: 16px;
        font-weight: 700;
        border: 1px solid #5578eb;
        border-radius: 5px;
        color: #5578eb;
        cursor: pointer;
    }

    .section__content__button:hover, .section__content__button.active {
        background: #5578eb;
        color: #ffffff;
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
</style>
