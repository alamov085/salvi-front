<template>
  <div class="second">
    <div class="second__container l-container">
      <h2 class="second__title">Існують два типи закупівель для офісу</h2>
      <div class="second__items">
        <div class="second__item">
          <div class="second__item-title">
            <svg aria-hidden="true" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">
                <path fill="#DE4422" style="fill: var(--color1, #DE4422)" d="M10.667 14.667v-2.667c0-0.736 0.597-1.333 1.333-1.333s1.333 0.597 1.333 1.333v0 2.667c0 0.736-0.597 1.333-1.333 1.333s-1.333-0.597-1.333-1.333v0zM20 16c0.736 0 1.333-0.597 1.333-1.333v0-2.667c0-0.736-0.597-1.333-1.333-1.333s-1.333 0.597-1.333 1.333v0 2.667c0 0.736 0.597 1.333 1.333 1.333v0zM16 18.667c-2.587 0.008-4.886 1.236-6.353 3.139l-0.014 0.019c-0.187 0.228-0.3 0.522-0.3 0.843 0 0.736 0.597 1.333 1.333 1.333 0.416 0 0.787-0.19 1.031-0.488l0.002-0.002c0.982-1.327 2.542-2.178 4.3-2.178s3.318 0.851 4.29 2.164l0.010 0.014c0.246 0.3 0.618 0.491 1.033 0.491 0.736 0 1.333-0.597 1.333-1.333 0-0.321-0.113-0.615-0.302-0.845l0.002 0.002c-1.481-1.921-3.779-3.149-6.365-3.157h-0.001zM30.667 16c0 8.1-6.567 14.667-14.667 14.667s-14.667-6.566-14.667-14.667c0-8.1 6.566-14.667 14.667-14.667v0c8.096 0.010 14.657 6.57 14.667 14.666v0.001zM28 16c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 6.627 5.373 12 12 12v0c6.624-0.008 11.992-5.376 12-11.999v-0.001z"></path>
            </svg>
            Складні закупівлі
          </div>
          <ul class="second__item-list">
            <li>• Безліч постачальників</li>
            <li>• Багато менеджерів та дзвінків</li>
            <li>• Гори документів від різних компаній</li>
            <li>• Нескінченний потік доставок</li>
          </ul>
        </div>
        <div class="second__item">
          <div class="second__item-title">
            <svg aria-hidden="true" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">
              <path fill="#269447" style="fill: var(--color, #269447)" d="M16 1.333c-8.1 0-14.667 6.566-14.667 14.667s6.566 14.667 14.667 14.667c8.1 0 14.667-6.566 14.667-14.667v0c-0.010-8.096-6.57-14.657-14.666-14.667h-0.001zM16 28c-6.627 0-12-5.373-12-12s5.373-12 12-12c6.627 0 12 5.373 12 12v0c-0.008 6.624-5.376 11.992-11.999 12h-0.001zM24 17.333c0 4.418-3.582 8-8 8s-8-3.582-8-8v0c0-0.736 0.597-1.333 1.333-1.333s1.333 0.597 1.333 1.333v0c0 2.946 2.388 5.333 5.333 5.333s5.333-2.388 5.333-5.333v0c0-0.736 0.597-1.333 1.333-1.333s1.333 0.597 1.333 1.333v0zM10.667 13.333v-1.333c0-0.736 0.597-1.333 1.333-1.333s1.333 0.597 1.333 1.333v0 1.333c0 0.736-0.597 1.333-1.333 1.333s-1.333-0.597-1.333-1.333v0zM18.667 13.333v-1.333c0-0.736 0.597-1.333 1.333-1.333s1.333 0.597 1.333 1.333v0 1.333c0 0.736-0.597 1.333-1.333 1.333s-1.333-0.597-1.333-1.333v0z"></path>
            </svg>
            Спрощені закупівлі
          </div>
          <ul class="second__item-list">
            <li>• Єдинний постачальник SALVI</li>
            <li>• Персональний менеджер</li>
            <li>• Електронний документообіг та один рахунок</li>
            <li>• Все необхідне в одній доставці</li>
          </ul>
        </div>
      </div>
      <div class="second__button-container">
        <a @click="openForm" class="second__button">Спростити закупівлі</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeSecond",
  methods: {
      openForm() {
          document.querySelector('.b24-web-form-popup-btn-1').click();
      }
  }
};
</script>

<style lang="scss" scoped>
.second {
  padding: 80px 0 190px;
  &__items {
    display: flex;
    justify-content: space-between;
  }

  &__title {
    font-weight: 600;
    font-size: 32px;
    color: #222222;
    text-align: center;
  }

  &__button-container {
    padding-top: 48px;
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
    padding-top: 65px;
    display: flex;
    gap: 30px;
  }

  &__item {
    width: 50%;
    padding: 64px;
    background: #fff5f3;
    border-radius: 32px;

    &:last-child {
      background: #eaffee;
    }
  }

  &__item-title {
    display: flex;
    align-items: center;

    svg {
      margin-right: 24px;
      width: 32px;
      height: 32px;
    }

    font-weight: 700;
    font-size: 28px;
    color: #222222;
  }

  &__item-list {
    padding-top: 40px;
    padding-left: 0;

    li {
      list-style: none;
      font-weight: 600;
      font-size: 16px;
      color: #222222;
      &:not(:last-child) {
        padding-bottom: 24px;
      }
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
  .second {
    padding-top: 60px;
    padding-bottom: 90px;
    &__container {
      flex-direction: column;
    }

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
      flex-direction: column;
      padding-top: 40px;
      gap: 25px;
    }

    &__item {
      width: 100%;
      padding: 45px 30px;
    }

    &__item-title {
      font-size: 18px;
    }

    &__list {
      padding-top: 45px;

      li {
        font-size: 14px;
      }
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

  .second {
    &__button {
      max-width: 100%;
      min-width: 100%;
    }
  }
}
</style>
