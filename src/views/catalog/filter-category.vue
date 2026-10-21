<template>
  <div class="large-filter">
    <div class="large-filter__header">
      <h3 class="large-filter__title">
        Фільтри
      </h3>

      <button
        type="button"
        class="large-filter__close"
        @click="$emit('close')"
      >
        ×
      </button>
    </div>

    <div class="large-filter__content">
      <div class="large-filter__section">
        <label class="large-filter__label">
          Пошук
        </label>

        <input
          v-model.trim="localFilters.search"
          type="text"
          class="large-filter__input"
          placeholder="Введіть назву або ключове слово"
          @keyup.enter="applyFilters"
        >
      </div>

      <div class="large-filter__section">
        <div class="large-filter__section-title">
          Період
        </div>

        <div class="large-filter__dates">
          <div class="large-filter__field">
            <label class="large-filter__label">
              Дата від
            </label>

            <input
              v-model="localFilters.dateFrom"
              type="date"
              class="large-filter__input"
            >
          </div>

          <div class="large-filter__field">
            <label class="large-filter__label">
              Дата до
            </label>

            <input
              v-model="localFilters.dateTo"
              type="date"
              class="large-filter__input"
            >
          </div>
        </div>
      </div>

      <div
        v-for="group in checkboxGroups"
        :key="group.key"
        class="large-filter__section"
      >
        <button
          type="button"
          class="large-filter__group-header"
          @click="toggleGroup(group.key)"
        >
                    <span class="large-filter__section-title">
                        {{ group.label }}
                    </span>

          <span class="large-filter__group-info">
                        <span
                          v-if="getSelectedCount(group.key)"
                          class="large-filter__count"
                        >
                            {{ getSelectedCount(group.key) }}
                        </span>

                        <span
                          class="large-filter__arrow"
                          :class="{
                                'large-filter__arrow--open':
                                    isGroupOpened(group.key)
                            }"
                        >
                            ▼
                        </span>
                    </span>
        </button>

        <div
          v-show="isGroupOpened(group.key)"
          class="large-filter__checkbox-list"
        >
          <label
            v-if="group.options && group.options.length"
            class="large-filter__checkbox large-filter__checkbox--all"
          >
            <input
              type="checkbox"
              :checked="isAllGroupSelected(group)"
              @change="toggleAllGroup(group)"
            >

            <span class="large-filter__custom-checkbox"></span>

            <span class="large-filter__checkbox-text">
                            Обрати все
                        </span>
          </label>

          <label
            v-for="option in group.options"
            :key="`${group.key}-${option.value}`"
            class="large-filter__checkbox"
          >
            <input
              v-model="localFilters.checkboxes[group.key]"
              type="checkbox"
              :value="option.value"
            >

            <span class="large-filter__custom-checkbox"></span>

            <span class="large-filter__checkbox-text">
                            {{ option.label }}
                        </span>

            <span
              v-if="option.count !== undefined"
              class="large-filter__option-count"
            >
                            {{ option.count }}
                        </span>
          </label>

          <div
            v-if="!group.options || !group.options.length"
            class="large-filter__empty"
          >
            Немає доступних значень
          </div>
        </div>
      </div>
    </div>

    <div class="large-filter__footer">
      <button
        type="button"
        class="large-filter__button large-filter__button--reset"
        @click="resetFilters"
      >
        Скинути
      </button>

      <button
        type="button"
        class="large-filter__button large-filter__button--apply"
        @click="applyFilters"
      >
        Застосувати

        <span v-if="totalSelectedCheckboxes">
                    ({{ totalSelectedCheckboxes }})
                </span>
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LargeFilter',

    props: {
      /*
       *
       * {
       *     search: '',
       *     dateFrom: '',
       *     dateTo: '',
       *     checkboxes: {
       *         statuses: [1, 2],
       *         categories: [5],
       *     }
       * }
       */
      value: {
        type: Object,
        default: () => ({
          search: '',
          dateFrom: '',
          dateTo: '',
          checkboxes: {},
        }),
      },

      /*
       *
       * [
       *     {
       *         key: 'statuses',
       *         label: 'Статуси',
       *         options: [
       *             {
       *                 value: 1,
       *                 label: 'Активний',
       *                 count: 10
       *             }
       *         ]
       *     }
       * ]
       */
      checkboxGroups: {
        type: Array,
        default: () => [],
      },

      openAllGroups: {
        type: Boolean,
        default: true,
      },
    },

    data() {
      return {
        localFilters: this.createFilters(this.value),
        openedGroups: {},
      };
    },

    computed: {
      totalSelectedCheckboxes() {
        return Object.values(this.localFilters.checkboxes)
          .reduce((total, values) => {
            return total + values.length;
          }, 0);
      },
    },

    watch: {
      value: {
        deep: true,
        handler(value) {
          this.localFilters = this.createFilters(value);
        },
      },

      checkboxGroups: {
        deep: true,
        immediate: true,
        handler(groups) {
          this.prepareCheckboxGroups(groups);
        },
      },
    },

    methods: {
      createFilters(filters = {}) {
        return {
          search: filters.search || '',
          dateFrom: filters.dateFrom || '',
          dateTo: filters.dateTo || '',
          checkboxes: this.cloneCheckboxes(
            filters.checkboxes || {}
          ),
        };
      },

      cloneCheckboxes(checkboxes) {
        return Object.keys(checkboxes).reduce((result, key) => {
          result[key] = Array.isArray(checkboxes[key])
            ? [...checkboxes[key]]
            : [];

          return result;
        }, {});
      },

      prepareCheckboxGroups(groups) {
        groups.forEach(group => {
          if (
            !Object.prototype.hasOwnProperty.call(
              this.localFilters.checkboxes,
              group.key
            )
          ) {
            this.$set(
              this.localFilters.checkboxes,
              group.key,
              []
            );
          }

          if (
            !Object.prototype.hasOwnProperty.call(
              this.openedGroups,
              group.key
            )
          ) {
            this.$set(
              this.openedGroups,
              group.key,
              this.openAllGroups
            );
          }
        });
      },

      toggleGroup(groupKey) {
        this.$set(
          this.openedGroups,
          groupKey,
          !this.openedGroups[groupKey]
        );
      },

      isGroupOpened(groupKey) {
        return Boolean(this.openedGroups[groupKey]);
      },

      getSelectedCount(groupKey) {
        const selectedValues =
          this.localFilters.checkboxes[groupKey];

        return Array.isArray(selectedValues)
          ? selectedValues.length
          : 0;
      },

      isAllGroupSelected(group) {
        if (!group.options || !group.options.length) {
          return false;
        }

        const selectedValues =
          this.localFilters.checkboxes[group.key] || [];

        return group.options.every(option => {
          return selectedValues.includes(option.value);
        });
      },

      toggleAllGroup(group) {
        const allValues = group.options.map(option => {
          return option.value;
        });

        const newValues = this.isAllGroupSelected(group)
          ? []
          : allValues;

        this.$set(
          this.localFilters.checkboxes,
          group.key,
          newValues
        );
      },

      applyFilters() {
        const filters = this.createFilters(
          this.localFilters
        );

        this.$emit('input', filters);
        this.$emit('apply', filters);
      },

      resetFilters() {
        const emptyCheckboxes =
          this.checkboxGroups.reduce((result, group) => {
            result[group.key] = [];
            return result;
          }, {});

        this.localFilters = {
          search: '',
          dateFrom: '',
          dateTo: '',
          checkboxes: emptyCheckboxes,
        };

        const filters = this.createFilters(
          this.localFilters
        );

        this.$emit('input', filters);
        this.$emit('reset', filters);
        this.$emit('apply', filters);
      },
    },
  };
</script>

<style scoped>
  .large-filter {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 480px;
    max-height: 90vh;
    border: 1px solid #e4e7ec;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: 0 12px 32px rgba(16, 24, 40, 0.12);
    overflow: hidden;
  }

  .large-filter__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid #e4e7ec;
  }

  .large-filter__title {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #101828;
  }

  .large-filter__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    padding: 0;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: #667085;
    font-size: 28px;
    line-height: 1;
    cursor: pointer;
  }

  .large-filter__close:hover {
    background: #f2f4f7;
  }

  .large-filter__content {
    flex: 1;
    padding: 0 24px;
    overflow-y: auto;
  }

  .large-filter__section {
    padding: 20px 0;
    border-bottom: 1px solid #eaecf0;
  }

  .large-filter__section:last-child {
    border-bottom: none;
  }

  .large-filter__section-title {
    font-size: 15px;
    font-weight: 700;
    color: #344054;
  }

  .large-filter__label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #475467;
  }

  .large-filter__input {
    width: 100%;
    height: 44px;
    padding: 0 14px;
    border: 1px solid #d0d5dd;
    border-radius: 8px;
    background: #ffffff;
    color: #101828;
    font-size: 14px;
    box-sizing: border-box;
    outline: none;
  }

  .large-filter__input:focus {
    border-color: #7f56d9;
    box-shadow: 0 0 0 3px rgba(127, 86, 217, 0.12);
  }

  .large-filter__dates {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 14px;
  }

  .large-filter__field {
    min-width: 0;
  }

  .large-filter__group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
  }

  .large-filter__group-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .large-filter__count {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    border-radius: 20px;
    background: #f4ebff;
    color: #6941c6;
    font-size: 12px;
    font-weight: 700;
    box-sizing: border-box;
  }

  .large-filter__arrow {
    display: inline-block;
    color: #667085;
    font-size: 11px;
    transition: transform 0.2s ease;
  }

  .large-filter__arrow--open {
    transform: rotate(180deg);
  }

  .large-filter__checkbox-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 16px;
  }

  .large-filter__checkbox {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 24px;
    cursor: pointer;
  }

  .large-filter__checkbox--all {
    padding-bottom: 12px;
    border-bottom: 1px dashed #e4e7ec;
    font-weight: 600;
  }

  .large-filter__checkbox input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }

  .large-filter__custom-checkbox {
    position: relative;
    flex: 0 0 20px;
    width: 20px;
    height: 20px;
    border: 1px solid #d0d5dd;
    border-radius: 5px;
    background: #ffffff;
    box-sizing: border-box;
  }

  .large-filter__checkbox input:checked
  + .large-filter__custom-checkbox {
    border-color: #7f56d9;
    background: #7f56d9;
  }

  .large-filter__checkbox input:checked
  + .large-filter__custom-checkbox::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 6px;
    width: 5px;
    height: 9px;
    border-right: 2px solid #ffffff;
    border-bottom: 2px solid #ffffff;
    transform: rotate(45deg);
  }

  .large-filter__checkbox-text {
    flex: 1;
    color: #344054;
    font-size: 14px;
    line-height: 20px;
  }

  .large-filter__option-count {
    color: #98a2b3;
    font-size: 13px;
  }

  .large-filter__empty {
    padding: 12px;
    border-radius: 8px;
    background: #f9fafb;
    color: #98a2b3;
    font-size: 14px;
    text-align: center;
  }

  .large-filter__footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 18px 24px;
    border-top: 1px solid #e4e7ec;
    background: #ffffff;
  }

  .large-filter__button {
    height: 44px;
    padding: 0 18px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }

  .large-filter__button--reset {
    border: 1px solid #d0d5dd;
    background: #ffffff;
    color: #344054;
  }

  .large-filter__button--apply {
    border: 1px solid #7f56d9;
    background: #7f56d9;
    color: #ffffff;
  }

  .large-filter__button:hover {
    opacity: 0.9;
  }

  @media (max-width: 600px) {
    .large-filter {
      max-width: none;
      max-height: 100vh;
      border-radius: 0;
    }

    .large-filter__dates {
      grid-template-columns: 1fr;
    }

    .large-filter__header,
    .large-filter__content,
    .large-filter__footer {
      padding-left: 16px;
      padding-right: 16px;
    }
  }
</style>
