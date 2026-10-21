<template>
  <div class="first">
    <div class="first__container">
      <div class="first__left">
        <h1 class="first__title"><span>Один постачальник</span> <span> замість десяти</span></h1>
        <h2 class="first__desc">Доставка товарів для офісу</h2>
        <div class="first__button-container">
          <a @click="openForm" class="first__button">Отримати консультацію</a>
        </div>
      </div>
      <div class="first__right">
        <img src="../../img/home/first.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeFirst",
    methods: {
      openForm() {
          document.querySelector('.b24-web-form-popup-btn-1').click();
      }
    }
};
</script>

<style lang="scss" scoped>
.first {
  background: linear-gradient(175.35deg, #e9ecef 3.76%, #ffffff 96.49%);
  &__container {
    display: flex;
    justify-content: space-between;
  }

  &__title {
    font-weight: 700;
    font-size: 58px;
    color: #222222;
    text-shadow: 0px 5px 16px rgba(0, 0, 0, 0.03);
    display: flex;
    flex-direction: column;
  }

  &__desc {
    padding-top: 35px;
    font-weight: 600;
    font-size: 32px;
    color: #737373;
  }

  &__button-container {
    padding-top: 48px;
    padding-bottom: 100px;
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
      color: #fff;
      transform: scale(1.1);
      transition: all ease-in-out 0.3s;
    }
  }

  &__right {
    min-width: 40%;
    width: 40%;

    img {
      width: 100%;
      object-fit: contain;
    }
  }

  &__left {
    padding: 0 50px 0 calc(50% - 600px);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

@media (max-width: 1440px) {
  .first {
    &__left {
      padding: 0 50px 0 120px;
    }
  }
}

@media (max-width: 1350px) {
  .first {
    &__left {
      padding: 0 50px 0 80px;
    }
  }
}

@media (max-width: 1100px) {
  .first {
    &__left {
      padding: 0 40px 0 40px;
    }
  }

  @media (max-width: 768px) {
    .first {
      padding-top: 0;
      padding-bottom: 60px;
      &__container {
        flex-direction: column;
      }

      &__right {
        order: -1;
        width: 100%;
      }

      &__title {
        font-size: 24px;
        display: flex;
        flex-direction: column;
      }

      &__desc {
        padding-top: 10px;
        font-size: 18px;
      }

      &__button-container {
        padding-top: 30px;
        padding-bottom: 0;
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
      &__left {
        padding: 0 20px 0 20px;
      }
    }
  }

  @media (max-width: 576px) {
    .first {
      &__left {
        padding: 0 15px 0 15px;
      }

      &__button {
        max-width: 100%;
        min-width: 100%;
      }
    }
  }
}
</style>
