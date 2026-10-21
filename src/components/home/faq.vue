<template>
  <div id="faq" class="faq">
    <div class="faq__container l-container">
      <div class="faq__title">Запитували? - <span>Відповідаємо!</span></div>
      <div class="faq__items">
        <div @click="
              () => {
                if (this.open === 1) {
                  this.open = null;
                } else {
                  this.open = 1;
                }
              }
            "
             class="faq__item">
          <div
            :class="['faq__question', open === 1 && 'active']"
          >
            Чи є безкоштовна доставка? Яка мінімальна сума замовлення?
            <div v-if="open === 1" class="faq__icon minus">-</div>
            <div v-else class="faq__icon plus">+</div>
          </div>
          <div v-if="open === 1" class="faq__answer">
            Так, безкоштовну доставку ми здійснюємо при оформленні замовлення на суму від 4000грн.
            Ця ж сума і є мінімальною.
          </div>
        </div>
        <div @click="
              () => {
                if (this.open === 11) {
                  this.open = null;
                } else {
                  this.open = 11;
                }
              }
            " class="faq__item">
          <div
                  :class="['faq__question', open === 11 && 'active']"
          >
            Які саме товари ви постачаєте?
            <div v-if="open === 11" class="faq__icon minus">-</div>
            <div v-else class="faq__icon plus">+</div>
          </div>
          <div v-if="open === 11" class="faq__answer">
            <p>
              У нас ви можете замовити широкий асортимент товарів, необхідних для ефективного функціонування вашого офісу. Ми пропонуємо такі основні групи товарів:
            </p>
            <ul>
              <li>Продукти харчування</li>
              <li>Господарчі товари</li>
              <li>Канцелярські товари та офісний папір.</li>
            </ul>
            <p>У нас також є можливість замовлення:</p>
            <ul>
              <li>Офісні меблі та техніка</li>
              <li>Пошук та закупівля за запитом: надаємо послугу пошуку та закупівлі будь-якого товару за вашим запитом з узгодженою відкритою націнкою, що забезпечує прозорість у вартості та умовах придбання.</li>
            </ul>
            <p>Звертайтеся до нас, і ми допоможемо забезпечити ваш офіс всім необхідним для успішної роботи!</p>
          </div>
        </div>
        <div @click="
              () => {
                if (this.open === 2) {
                  this.open = null;
                } else {
                  this.open = 2;
                }
              }
            " class="faq__item">
          <div
            :class="['faq__question', open === 2 && 'active']"
          >
            Чи здійснюєте ви доставку не в офіси?
            <div v-if="open === 2" class="faq__icon minus">-</div>
            <div v-else class="faq__icon plus">+</div>
          </div>
          <div v-if="open === 2" class="faq__answer">
            Доставка продукції в офіси Києва та України. Але, за погодженням із менеджером, ми
            навіть можемо доставити індивідуальні подарункові набори за домашніми адресами ваших
            співробітників.
          </div>
        </div>
        <div @click="
              () => {
                if (this.open === 9) {
                  this.open = null;
                } else {
                  this.open = 9;
                }
              }
            " class="faq__item">
          <div
                  :class="['faq__question', open === 9 && 'active']"
          >
            Чи є можливість підписати один договір для консолідації в поставці всіх товарів для офісу?
            <div v-if="open === 9" class="faq__icon minus">-</div>
            <div v-else class="faq__icon plus">+</div>
          </div>
          <div v-if="open === 9" class="faq__answer">
            Так, для нашої компанії консолідація в поставці всіх товарів для офісу у рамках одного договору є стандартною практикою. Це означає, що ми забезпечимо закриття всіх ваших потреб у товарах для офісу, що включає продукти харчування, господарчі товари, канцелярські потреби, офісний папір, меблі, техніку та навіть організацію івентів.
          </div>
        </div>
        <div @click="
              () => {
                if (this.open === 3) {
                  this.open = null;
                } else {
                  this.open = 3;
                }
              }
            " class="faq__item">
          <diм
            :class="['faq__question', open === 3 && 'active']"
          >
            Які варіанти оплати доступні?
            <div v-if="open === 3" class="faq__icon minus">-</div>
            <div v-else class="faq__icon plus">+</div>
          </diм>
          <div v-if="open === 3" class="faq__answer">
            <ul>
              <li>для юридичних осіб згідно виставленого рахунку з ПДВ;</li>
              <li>на розрахунковий рахунок ФОПу згідно виставленого рахунку, єдиний податок;</li>
              <li>також існують гнучкі умови для IT-компаній.</li>
            </ul>
          </div>
        </div>
        <div @click="
              () => {
                if (this.open === 4) {
                  this.open = null;
                } else {
                  this.open = 4;
                }
              }
            " class="faq__item">
          <div
            :class="['faq__question', open === 4 && 'active']"
          >
            Чи допоможе мені кур’єр розкласти продукцію в офісі по своїм місцям зберігання?
            <div v-if="open === 4" class="faq__icon minus">-</div>
            <div v-else class="faq__icon plus">+</div>
          </div>
          <div v-if="open === 4" class="faq__answer">
            Так, співробітник нашої компанії, що здійснює доставку за вашим замовленням допоможе
            розкласти продукцію в місця зберігання, але це заздалегідь узгоджується з менеджером
            SALVI.
          </div>
        </div>
        <div @click="
              () => {
                if (this.open === 5) {
                  this.open = null;
                } else {
                  this.open = 5;
                }
              }
            " class="faq__item">
          <div
            :class="['faq__question', open === 5 && 'active']"
          >
            Чи можна повернути ті товари, які нам не сподобалися по якості?
            <div v-if="open === 5" class="faq__icon minus">-</div>
            <div v-else class="faq__icon plus">+</div>
          </div>
          <div v-if="open === 5" class="faq__answer">
            Якщо вам щось не сподобалося в якості поставленої продукції чи наданому сервісі – ви
            просто можете повернути замовлення кур’єру. Наш менеджер з якості уточнить причину
            виникнення даної ситуації та усуне її.
          </div>
        </div>
        <div @click="
              () => {
                if (this.open === 6) {
                  this.open = null;
                } else {
                  this.open = 6;
                }
              }
            " class="faq__item">
          <div
            :class="['faq__question', open === 6 && 'active']"
          >
            Як я буду отримувати документи на поставлену продукцію?
            <div v-if="open === 6" class="faq__icon minus">-</div>
            <div v-else class="faq__icon plus">+</div>
          </div>
          <div v-if="open === 6" class="faq__answer">
            За попередньою домовленістю з менеджером SALVI можна обрати один із зручних варіантів:
            <ul>
              <li>Видаткова накладна надається з кожним замовленням при доставці;</li>
              <li>
                Видаткова накладна формується раз у обумовлений період (наприклад, раз на місяць), і
                включає у себе всі замовлення за цей період
              </li>
              <li>Електронний документообіг</li>
            </ul>
          </div>
        </div>
        <div @click="
              () => {
                if (this.open === 7) {
                  this.open = null;
                } else {
                  this.open = 7;
                }
              }
            " class="faq__item">
          <div
            :class="['faq__question', open === 7 && 'active']"
          >
            Чи можливе відтермінування платежу?
            <div v-if="open === 7" class="faq__icon minus">-</div>
            <div v-else class="faq__icon plus">+</div>
          </div>
          <div v-if="open === 7" class="faq__answer">
            Так, відтермінування можливе. Для цього вам необхідно лише заключити з нами договір
            поставки. Більш детальну інформацію можна отримати у менеджера SALVI.
          </div>
        </div>
        <div @click="
              () => {
                if (this.open === 8) {
                  this.open = null;
                } else {
                  this.open = 8;
                }
              }
            " class="faq__item">
          <div
            :class="['faq__question', open === 8 && 'active']"
          >
            Чи приймаєте ви участь в тендерах на поставки?
            <div v-if="open === 8" class="faq__icon minus">-</div>
            <div v-else class="faq__icon plus">+</div>
          </div>
          <div v-if="open === 8" class="faq__answer">
            Так. Для того, щоб нас запросити до участі у тендерній процедурі - напишіть нам на
            support@salvigroup.com.ua або у "відкритий чат".
          </div>
        </div>
        <div @click="
              () => {
                if (this.open === 10) {
                  this.open = null;
                } else {
                  this.open = 10;
                }
              }
            " class="faq__item">
          <div
                  :class="['faq__question', open === 10 && 'active']"
          >
            Чи можливо замовляти через вас послуги клінінгу та оренди обладнання?
            <div v-if="open === 10" class="faq__icon minus">-</div>
            <div v-else class="faq__icon plus">+</div>
          </div>
          <div v-if="open === 10" class="faq__answer">
            Так, у разі консолідації всіх закупівель через нашу компанію, ми закриваємо всі необхідні послуги за вашою потребою.
          </div>
        </div>
      </div>
      <div class="faq__button-container">
        <a @click="openForm" class="faq__button">Задати питання</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeFAQ",
  data() {
    return {
      open: null,
    };
  },
    methods: {
        openForm() {
            document.querySelector('.b24-web-form-popup-btn-1').click();
        }
    }
};
</script>

<style lang="scss" scoped>
.faq {
  padding: 0px 0 110px;
  background: #ffffff;
  &__title {
    font-weight: 600;
    font-size: 32px;
    color: #222222;
    text-align: center;

    span {
      color: #269447;
    }
  }

  &__button-container {
    padding-top: 38px;
    display: flex;
    justify-content: center;
  }

  &__button {
    display: block;
    width: fit-content;
    padding: 15px 60px;
    font-weight: 600;
    font-size: 14px;
    color: #ffffff;
    background: #269447;
    border-radius: 8px;
    transition: all ease-in-out 0.3s;
    cursor: pointer;

    &:hover {
      color: #ffffff;
      transform: scale(1.1);
      transition: all ease-in-out 0.3s;
    }
  }

  &__items {
    padding-top: 40px;
  }

  &__item {
    padding: 20px;
    background: #ffffff;
    border: 2px solid #f6f6f8;
    border-radius: 12px;
    margin-bottom: 12px;
    cursor: pointer;
  }

  &__question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    font-size: 16px;
    color: #222222;
    cursor: pointer;

    &.active {
      color: #269447;
    }
  }

  &__icon {
    font-size: 20px;
    margin-left: 50px;
  }

  &__answer {
    padding-top: 15px;
    margin-right: 30%;
    font-weight: 500;
    font-size: 16px;
    color: #222222;
    ul {
      padding-left: 20px;
      list-style-type: disc;
      padding-bottom: 16px;
    }
  }
}
.l-container {
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 1440px) {
  .l-container {
    max-width: none;
    margin: 0;
    padding-right: 120px !important;
    padding-left: 120px !important;
  }
}

@media (max-width: 1350px) {
  .l-container {
    padding-right: 80px !important;
    padding-left: 80px !important;
  }
}

@media (max-width: 1100px) {
  .l-container {
    padding-right: 40px !important;
    padding-left: 40px !important;
  }
}

@media (max-width: 768px) {
  .faq {
    padding-top: 60px;
    padding-bottom: 60px;

    &__title {
      font-size: 22px;
    }

    &__button-container {
      padding-top: 30px;
    }

    &__button {
      max-width: 100%;
      min-width: 340px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 48px;
      padding: 0;
    }

    &__items {
      padding-top: 40px;
    }

    &__answer {
      margin-right: 5%;
    }
  }
  .l-container {
    padding-right: 20px !important;
    padding-left: 20px !important;
  }
}

@media (max-width: 576px) {
  .l-container {
    padding-right: 15px !important;
    padding-left: 15px !important;
  }

  .faq {
    &__button {
      max-width: 100%;
      min-width: 100%;
    }
  }
}
</style>
