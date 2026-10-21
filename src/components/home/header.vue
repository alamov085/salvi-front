<template>
  <div class="header">
    <div class="header__top">
      <div class="header__top-container l-container">
        <div class="header__top-nav">
          <ul class="header__nav-container">
            <li class="header__nav-item">
              <a href="#work"> Як ми працюємо </a>
            </li>
            <li class="header__nav-item">
              <a href="#delivery"> Доставка та оплата </a>
            </li>
            <li class="header__nav-item">
              <a href="#faq"> FAQ </a>
            </li>
          </ul>
        </div>
        <div class="header__social">
          <div class="header__social-item">
            <a href="mailto:info@salvigroup.com.ua">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.33366 3.33337H16.667C17.5837 3.33337 18.3337 4.08337 18.3337 5.00004V15C18.3337 15.9167 17.5837 16.6667 16.667 16.6667H3.33366C2.41699 16.6667 1.66699 15.9167 1.66699 15V5.00004C1.66699 4.08337 2.41699 3.33337 3.33366 3.33337Z"
                  stroke="#E3E3E3"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M18.3337 5L10.0003 10.8333L1.66699 5"
                  stroke="#E3E3E3"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              info@salvigroup.com.ua
            </a>
          </div>
          <div class="header__social-item">
            <a href="tel:+380445029205">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5001 12.69V14.94C16.5009 15.1488 16.4581 15.3556 16.3745 15.547C16.2908 15.7383 16.168 15.9101 16.0141 16.0513C15.8602 16.1926 15.6785 16.3001 15.4806 16.367C15.2828 16.4339 15.0731 16.4588 14.8651 16.44C12.5572 16.1892 10.3403 15.4006 8.39257 14.1375C6.58044 12.9859 5.04407 11.4496 3.89257 9.63745C2.62506 7.68085 1.83625 5.4532 1.59007 3.13495C1.57133 2.92755 1.59598 2.71852 1.66245 2.52117C1.72892 2.32382 1.83575 2.14247 1.97615 1.98867C2.11654 1.83487 2.28743 1.71198 2.47792 1.62784C2.6684 1.5437 2.87433 1.50015 3.08257 1.49995H5.33257C5.69655 1.49637 6.04942 1.62526 6.32539 1.8626C6.60137 2.09994 6.78163 2.42954 6.83257 2.78995C6.92754 3.51 7.10366 4.217 7.35757 4.89745C7.45848 5.16589 7.48032 5.45764 7.4205 5.73811C7.36069 6.01858 7.22172 6.27603 7.02007 6.47995L6.06757 7.43245C7.13524 9.31011 8.68991 10.8648 10.5676 11.9325L11.5201 10.98C11.724 10.7783 11.9814 10.6393 12.2619 10.5795C12.5424 10.5197 12.8341 10.5415 13.1026 10.6425C13.783 10.8964 14.49 11.0725 15.2101 11.1675C15.5744 11.2188 15.9071 11.4024 16.145 11.6831C16.3828 11.9638 16.5092 12.3221 16.5001 12.69Z"
                  stroke="#E3E3E3"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              +38 044 502 92 05
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="header__bottom">
      <div class="header__bottom-container l-container">
        <router-link to="/" class="header__logo">
          <svg
            width="111"
            height="26"
            viewBox="0 0 111 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10.8386 26C8.70955 26 6.70955 25.7419 4.70955 25.2258C2.77406 24.7097 1.16116 24 -0.000134524 23.0968L2.06438 18.7097C3.22567 19.4839 4.58051 20.129 6.1289 20.5806C7.67729 21.0323 9.29019 21.2903 10.8386 21.2903C12.5805 21.2903 13.8708 21.0323 14.7095 20.5806C15.5483 20.0645 15.9354 19.4194 15.9354 18.5806C15.9354 18 15.6773 17.4839 15.1612 17.0968C14.7095 16.7097 14.0644 16.3871 13.2902 16.129C12.516 15.871 11.4837 15.6129 10.1934 15.3548C8.19342 14.9032 6.516 14.4516 5.22568 14C3.93536 13.5484 2.83857 12.8387 1.87083 11.8065C0.967605 10.7742 0.515997 9.48387 0.515997 7.80645C0.515997 6.32258 0.903091 5.03226 1.7418 3.87097C2.58051 2.64516 3.80632 1.74193 5.48374 1.03226C7.16116 0.32258 9.22568 -5.64018e-07 11.6773 -4.56855e-07C13.3547 -3.83532e-07 15.0321 0.193548 16.645 0.580645C18.2579 0.967742 19.6773 1.48387 20.9031 2.19355L19.0321 6.58065C16.5805 5.29032 14.1289 4.64516 11.6773 4.64516C9.93536 4.64516 8.70954 4.90323 7.87083 5.41935C7.03212 5.93548 6.64503 6.64516 6.64503 7.48387C6.64503 8.32258 7.09664 8.96774 8.06438 9.41935C9.03213 9.80645 10.4515 10.2581 12.4515 10.6452C14.4515 11.0968 16.1289 11.5484 17.4192 12C18.7095 12.4516 19.8063 13.1613 20.7096 14.129C21.6773 15.0968 22.1289 16.4516 22.1289 18.129C22.1289 19.5484 21.6773 20.9032 20.8386 22.0645C19.9999 23.2258 18.7095 24.1935 17.0321 24.8387C15.2902 25.6774 13.2257 26 10.8386 26Z"
              fill="#269447"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M43.8078 20.1924L31.4853 20.1924L29.1627 25.5472L22.8401 25.5472L34.582 0.450439L40.6465 0.450439L52.582 25.5472L46.1304 25.5472L43.8078 20.1924ZM41.8724 15.7408L37.6788 6.12786L33.4853 15.7408L41.8724 15.7408Z"
              fill="#269447"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M55.356 0.450439L61.485 0.450439L61.485 20.773L74.8398 20.773L74.8398 25.4827L55.356 25.5472L55.356 0.450439Z"
              fill="#269447"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M101.938 0.386963L90.4536 25.4837L84.3891 25.4837L72.9052 0.386962L79.5504 0.386962L87.6149 18.3225L95.8085 0.386963L101.938 0.386963Z"
              fill="#269447"
            />
            <path
              d="M110.339 25.4797L110.308 0.382935L104.179 0.390587L104.21 25.4874L110.339 25.4797Z"
              fill="#269447"
            />
          </svg>
        </router-link>
        <div class="header__login-items">
          <div class="header__login-item">
            <a href="/login">
              <svg
                width="14"
                height="18"
                viewBox="0 0 14 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 17.125C14 17.6082 13.6082 18 13.125 18C12.6418 18 12.25 17.6082 12.25 17.125V16.2857C12.25 15.6037 11.9734 14.9497 11.4812 14.4674C10.9889 13.9852 10.3212 13.7143 9.625 13.7143H4.375C3.67881 13.7143 3.01113 13.9852 2.51884 14.4674C2.02656 14.9497 1.75 15.6037 1.75 16.2857V17.125C1.75 17.6082 1.35825 18 0.875 18C0.391751 18 0 17.6082 0 17.125V16.2857C0 15.1491 0.460936 14.059 1.28141 13.2553C2.10188 12.4515 3.21468 12 4.375 12H9.625C10.7853 12 11.8981 12.4515 12.7186 13.2553C13.5391 14.059 14 15.1491 14 16.2857V17.125ZM7 10.2857C6.31056 10.2857 5.62787 10.1527 4.99091 9.89424C4.35395 9.63578 3.7752 9.25696 3.28769 8.77941C2.80018 8.30185 2.41347 7.7349 2.14963 7.11094C1.8858 6.48698 1.75 5.81823 1.75 5.14286C1.75 4.46749 1.8858 3.79873 2.14963 3.17477C2.41347 2.55081 2.80018 1.98387 3.28769 1.50631C3.7752 1.02875 4.35395 0.649929 4.99091 0.391477C5.62787 0.133024 6.31056 -1.00638e-08 7 0C8.39239 2.03247e-08 9.72775 0.541835 10.7123 1.50631C11.6969 2.47078 12.25 3.77889 12.25 5.14286C12.25 6.50683 11.6969 7.81493 10.7123 8.77941C9.72775 9.74388 8.39239 10.2857 7 10.2857ZM7 8.57143C7.92826 8.57143 8.8185 8.21021 9.47487 7.56722C10.1313 6.92424 10.5 6.05217 10.5 5.14286C10.5 4.23354 10.1313 3.36147 9.47487 2.71849C8.8185 2.07551 7.92826 1.71429 7 1.71429C6.07174 1.71429 5.1815 2.07551 4.52513 2.71849C3.86875 3.36147 3.5 4.23354 3.5 5.14286C3.5 6.05217 3.86875 6.92424 4.52513 7.56722C5.1815 8.21021 6.07174 8.57143 7 8.57143Z"
                  fill="#269447"
                />
              </svg>
              Вхід
            </a>
          </div>
          <div class="header__login-item">
            <a @click="openForm">
              <svg
                width="18"
                height="20"
                viewBox="0 0 18 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 4V1C4 0.734784 4.10536 0.48043 4.29289 0.292893C4.48043 0.105357 4.73478 0 5 0H17C17.2652 0 17.5196 0.105357 17.7071 0.292893C17.8946 0.48043 18 0.734784 18 1V15C18 15.2652 17.8946 15.5196 17.7071 15.7071C17.5196 15.8946 17.2652 16 17 16H14V19C14 19.552 13.55 20 12.993 20H1.007C0.875127 20.0008 0.744397 19.9755 0.622322 19.9256C0.500247 19.8757 0.389233 19.8022 0.295659 19.7093C0.202084 19.6164 0.127793 19.5059 0.0770543 19.3841C0.0263156 19.2624 0.000129374 19.1319 0 19L0.00300002 5C0.00300002 4.448 0.453 4 1.009 4H4ZM1.7 5.7V12V18.3H12.3V5.7H1.7ZM5.7 4H14V14.3H16.3V1.7H5.7V4ZM4 9H10V10.7H4V9ZM4 13.3H10V15H4V13.3Z"
                  fill="#269447"
                />
              </svg>
              Реєстрація
            </a>
          </div>
        </div>
        <div @click="handleOpenMenu" class="header__burger">
          <svg
            width="20"
            height="14"
            viewBox="0 0 20 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="20" height="3" rx="1.5" fill="#269447" />
            <rect y="5.5" width="20" height="3" rx="1.5" fill="#269447" />
            <rect y="11" width="20" height="3" rx="1.5" fill="#269447" />
          </svg>
        </div>
      </div>
    </div>
    <div @click.self="handleCloseMenu" v-if="menu" class="header__menu">
      <div class="header__menu-container">
        <div @click="handleCloseMenu" class="header__menu-close">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="-0.131836"
              y="14.0104"
              width="20"
              height="3"
              rx="1.5"
              transform="rotate(-45 -0.131836 14.0104)"
              fill="#269447"
            />
            <rect
              x="1.98926"
              y="-0.131714"
              width="20"
              height="3"
              rx="1.5"
              transform="rotate(45 1.98926 -0.131714)"
              fill="#269447"
            />
          </svg>
        </div>
        <ul class="header__nav-container">
          <li class="header__nav-item">
            <a @click="handleCloseMenu" href="#work"> Як ми працюємо </a>
          </li>
          <li class="header__nav-item">
            <a @click="handleCloseMenu" href="#delivery"> Доставка та оплата </a>
          </li>
          <li class="header__nav-item">
            <a @click="handleCloseMenu" href="#faq"> FAQ </a>
          </li>
        </ul>
        <div class="header__login-items">
          <div class="header__login-item">
            <a href="/login">
              <svg
                width="14"
                height="18"
                viewBox="0 0 14 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 17.125C14 17.6082 13.6082 18 13.125 18C12.6418 18 12.25 17.6082 12.25 17.125V16.2857C12.25 15.6037 11.9734 14.9497 11.4812 14.4674C10.9889 13.9852 10.3212 13.7143 9.625 13.7143H4.375C3.67881 13.7143 3.01113 13.9852 2.51884 14.4674C2.02656 14.9497 1.75 15.6037 1.75 16.2857V17.125C1.75 17.6082 1.35825 18 0.875 18C0.391751 18 0 17.6082 0 17.125V16.2857C0 15.1491 0.460936 14.059 1.28141 13.2553C2.10188 12.4515 3.21468 12 4.375 12H9.625C10.7853 12 11.8981 12.4515 12.7186 13.2553C13.5391 14.059 14 15.1491 14 16.2857V17.125ZM7 10.2857C6.31056 10.2857 5.62787 10.1527 4.99091 9.89424C4.35395 9.63578 3.7752 9.25696 3.28769 8.77941C2.80018 8.30185 2.41347 7.7349 2.14963 7.11094C1.8858 6.48698 1.75 5.81823 1.75 5.14286C1.75 4.46749 1.8858 3.79873 2.14963 3.17477C2.41347 2.55081 2.80018 1.98387 3.28769 1.50631C3.7752 1.02875 4.35395 0.649929 4.99091 0.391477C5.62787 0.133024 6.31056 -1.00638e-08 7 0C8.39239 2.03247e-08 9.72775 0.541835 10.7123 1.50631C11.6969 2.47078 12.25 3.77889 12.25 5.14286C12.25 6.50683 11.6969 7.81493 10.7123 8.77941C9.72775 9.74388 8.39239 10.2857 7 10.2857ZM7 8.57143C7.92826 8.57143 8.8185 8.21021 9.47487 7.56722C10.1313 6.92424 10.5 6.05217 10.5 5.14286C10.5 4.23354 10.1313 3.36147 9.47487 2.71849C8.8185 2.07551 7.92826 1.71429 7 1.71429C6.07174 1.71429 5.1815 2.07551 4.52513 2.71849C3.86875 3.36147 3.5 4.23354 3.5 5.14286C3.5 6.05217 3.86875 6.92424 4.52513 7.56722C5.1815 8.21021 6.07174 8.57143 7 8.57143Z"
                  fill="#269447"
                />
              </svg>
              Вхід
            </a>
          </div>
          <div class="header__login-item">
            <a @click="openForm">
              <svg
                width="18"
                height="20"
                viewBox="0 0 18 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 4V1C4 0.734784 4.10536 0.48043 4.29289 0.292893C4.48043 0.105357 4.73478 0 5 0H17C17.2652 0 17.5196 0.105357 17.7071 0.292893C17.8946 0.48043 18 0.734784 18 1V15C18 15.2652 17.8946 15.5196 17.7071 15.7071C17.5196 15.8946 17.2652 16 17 16H14V19C14 19.552 13.55 20 12.993 20H1.007C0.875127 20.0008 0.744397 19.9755 0.622322 19.9256C0.500247 19.8757 0.389233 19.8022 0.295659 19.7093C0.202084 19.6164 0.127793 19.5059 0.0770543 19.3841C0.0263156 19.2624 0.000129374 19.1319 0 19L0.00300002 5C0.00300002 4.448 0.453 4 1.009 4H4ZM1.7 5.7V12V18.3H12.3V5.7H1.7ZM5.7 4H14V14.3H16.3V1.7H5.7V4ZM4 9H10V10.7H4V9ZM4 13.3H10V15H4V13.3Z"
                  fill="#269447"
                />
              </svg>
              Реєстрація
            </a>
          </div>
        </div>
        <div class="header__social">
          <div class="header__social-item">
            <a href="mailto:info@salvigroup.com.ua">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.33366 3.33337H16.667C17.5837 3.33337 18.3337 4.08337 18.3337 5.00004V15C18.3337 15.9167 17.5837 16.6667 16.667 16.6667H3.33366C2.41699 16.6667 1.66699 15.9167 1.66699 15V5.00004C1.66699 4.08337 2.41699 3.33337 3.33366 3.33337Z"
                  stroke="#E3E3E3"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M18.3337 5L10.0003 10.8333L1.66699 5"
                  stroke="#E3E3E3"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              info@salvigroup.com.ua
            </a>
          </div>
          <div class="header__social-item">
            <a href="tel:+380445020295">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5001 12.69V14.94C16.5009 15.1488 16.4581 15.3556 16.3745 15.547C16.2908 15.7383 16.168 15.9101 16.0141 16.0513C15.8602 16.1926 15.6785 16.3001 15.4806 16.367C15.2828 16.4339 15.0731 16.4588 14.8651 16.44C12.5572 16.1892 10.3403 15.4006 8.39257 14.1375C6.58044 12.9859 5.04407 11.4496 3.89257 9.63745C2.62506 7.68085 1.83625 5.4532 1.59007 3.13495C1.57133 2.92755 1.59598 2.71852 1.66245 2.52117C1.72892 2.32382 1.83575 2.14247 1.97615 1.98867C2.11654 1.83487 2.28743 1.71198 2.47792 1.62784C2.6684 1.5437 2.87433 1.50015 3.08257 1.49995H5.33257C5.69655 1.49637 6.04942 1.62526 6.32539 1.8626C6.60137 2.09994 6.78163 2.42954 6.83257 2.78995C6.92754 3.51 7.10366 4.217 7.35757 4.89745C7.45848 5.16589 7.48032 5.45764 7.4205 5.73811C7.36069 6.01858 7.22172 6.27603 7.02007 6.47995L6.06757 7.43245C7.13524 9.31011 8.68991 10.8648 10.5676 11.9325L11.5201 10.98C11.724 10.7783 11.9814 10.6393 12.2619 10.5795C12.5424 10.5197 12.8341 10.5415 13.1026 10.6425C13.783 10.8964 14.49 11.0725 15.2101 11.1675C15.5744 11.2188 15.9071 11.4024 16.145 11.6831C16.3828 11.9638 16.5092 12.3221 16.5001 12.69Z"
                  stroke="#E3E3E3"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              +38 044 502 02 95
            </a>
          </div>
        </div>
      </div>
    </div>
    <Blackout />
  </div>
</template>

<script>
  import Blackout from "../blackout.vue"
export default {
  name: "HomeHeader",
  data() {
    return {
      menu: false,
    };
  },
    components: {
        Blackout
    },
  methods: {
    handleOpenMenu() {
      this.menu = true;
    },
    handleCloseMenu() {
      this.menu = false;
    },
    openForm() {
          document.querySelector('.b24-web-form-popup-btn-1').click();
    }
  },
};
</script>

<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;

  &__top {
    padding: 11px 0;
    background: #565656;
  }

  &__top-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__nav-container {
    display: flex;
    padding-left: 0;
  }

  &__nav-item {
    padding-right: 48px;
    list-style: none;

    a {
      font-weight: 500;
      font-size: 14px;
      color: #fff;
      border-bottom: 1px solid transparent;

      &:hover {
        color: #fff;
        border-bottom: 1px solid #fff;
      }
    }
  }

  &__social {
    display: flex;
  }

  &__social-item {
    padding-left: 48px;

    a {
      font-weight: 500;
      font-size: 14px;
      color: #fff;
      display: flex;
      align-items: center;

      &:hover {
        color: #fff;
        text-decoration: underline;
      }

      svg {
        width: 15px;
        height: 15px;
        margin-right: 10px;
      }
    }
  }

  &__bottom {
    padding: 25px 0;
    background: #ffffff;
  }

  &__bottom-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__login-items {
    display: flex;
  }

  &__login-item {
    padding-left: 50px;

    a {
      font-weight: 600;
      font-size: 14px;
      color: #269447;
      display: flex;
      align-items: center;
      cursor: pointer;

      &:hover {
        color: #269447;
        text-decoration: underline;
      }

      svg {
        width: 15px;
        height: 15px;
        margin-right: 10px;
      }
    }
  }

  &__burger {
    display: none;
  }

  &__menu {
    display: none;
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

  .header {
    &__top {
      display: none;
    }

    &__login-items {
      display: none;
    }

    &__burger {
      display: block;
      cursor: pointer;
    }

    &__menu {
      position: fixed;
      display: flex;
      justify-content: flex-end;
      inset: 0;
      background: rgba(13, 13, 13, 0.56);
    }

    &__menu-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 30px 15px 40px 24px;
      background: linear-gradient(175.35deg, #e9ecef 3.76%, #ffffff 96.49%);
    }

    &__nav-container {
      flex-direction: column;
    }

    &__nav-item {
      padding: 40px 0 0;

      a {
        font-weight: 700;
        font-size: 20px;
        color: #222222;
        text-transform: uppercase;

        &:hover {
          color: #269447;
          text-decoration: none;
          border: none;
        }
      }
    }

    &__login-items {
      flex-direction: column;
      .header__menu & {
        display: flex;
      }
    }

    &__login-item {
      padding: 40px 0 0;
    }

    &__social {
      flex-direction: column;
      margin: auto 0 110px;
    }

    &__social-item {
      padding: 20px 0 0;

      a {
        color: #269447;

        svg {
          fill: #269447;
        }
      }
    }

    &__menu-close {
      margin-left: auto;
      cursor: pointer;
    }
  }
}

@media (max-width: 768px) {
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
}
</style>
