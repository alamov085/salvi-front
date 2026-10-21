<template>
  <div class="third">
    <div class="third__container l-container">
      <div class="third__left">
        <img src="../../img/home/third.png" alt="" />
      </div>
      <div class="third__right">
        <h2 class="third__title">Контролюйте закупівлі та звітність в особистому кабінеті</h2>
        <ul class="third__list">
          <li class="third__list-item">
            <div class="bold">• Об'єднайте</div>
            <div>ваших внутрішніх замовників в одній системі</div>
          </li>
          <li class="third__list-item">
            <div class="bold">• Додавайте</div>
            <div>співробітників та філіали, коли вам це потрібно</div>
          </li>
          <li class="third__list-item">
            <div class="bold">• Керуйте</div>
            <div>бюджетами вашої компанії</div>
          </li>
          <li class="third__list-item">
            <div class="bold">• Регулюйте</div>
            <div>доступний замовникам асортимент товарів</div>
          </li>
          <li class="third__list-item">
            <div class="bold">• Налаштовуйте</div>
            <div>гнучкий ланцюг підтвердження</div>
          </li>
        </ul>
        <div class="third__button-container">
          <a @click="openForm" class="third__button">Отримати консультацію</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeThird",
  methods: {
      openForm() {
          document.querySelector('.b24-web-form-popup-btn-1').click();
      }
  }
};
</script>

<style lang="scss" scoped>
.third {
  padding: 80px 0 110px;
  background: linear-gradient(175.35deg, #e9ecef 3.76%, #ffffff 96.49%);

  &__container {
    display: flex;
    justify-content: space-between;
  }

  &__left {
    width: 50%;
    min-width: 50%;
    img {
      width: 100%;
      object-fit: contain;
      margin-top: -200px;
    }
  }

  &__title {
    font-weight: 600;
    font-size: 32px;
    color: #222222;
  }

  &__button-container {
    padding-top: 38px;
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

  &__right {
    padding-left: 50px;
  }

  &__list {
    padding-top: 45px;
    padding-left: 0;
  }

  &__list-item {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 30px;
    font-weight: 600;
    font-size: 16px;
    color: #737373;

    .bold {
      font-weight: 700;
      color: #222222;
      padding-right: 10px;
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
  .third {
    padding-top: 60px;
    padding-bottom: 40px;
    &__container {
      flex-direction: column;
    }

    &__left {
      width: 100%;
      margin-top: 100px;
    }

    &__right {
      padding-left: 0;
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

    &__list-item {
      flex-direction: column;
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

  .third {
    &__button {
      max-width: 100%;
      min-width: 100%;
    }
  }
}
</style>
