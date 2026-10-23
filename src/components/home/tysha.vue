<template>
  <section class="tysha" id="tysha">
    <div class="ty-wrap">
      <!-- Hero блок: 2 колонки -->
      <div class="ty-hero">
        <div class="ty-hero-l">
          <h2 class="ty-hero-t">
            Формат для компаній, у&nbsp;яких конфіденційність&nbsp;— <span>частина&nbsp;безпеки</span>
          </h2>
          <p class="ty-lead">
            Ваші адреси знають лише люди, <b>яких ваша служба безпеки знає поіменно.</b>
          </p>
        </div>
        <div class="ty-hero-r">
          <!-- Декоративна стопка карток -->
          <div class="ty-doc" role="img" aria-label="Картка локації: замість адреси — код, дані приховані">
            <div class="ty-doc-card ty-d3" aria-hidden="true"></div>
            <div class="ty-doc-card ty-d2" aria-hidden="true"></div>
            <div class="ty-doc-card">
              <span class="ty-doc-ic">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#4A9550" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M12 21s-6-5.3-6-11a6 6 0 0 1 9.6-4.8M18 9.5c0 5.6-6 11.5-6 11.5M10.3 8.6a2 2 0 0 1 3.1 2.5M4 4l16 16"/>
                </svg>
              </span>
              <span class="ty-doc-txt">
                <b>Локація-07</b>
                <span class="ty-bars">
                  <i style="width:96px"></i>
                  <i style="width:50px"></i>
                  <i style="width:22px"></i>
                </span>
              </span>
              <span class="ty-doc-eye">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#A3A7AD" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M3 3l18 18M10.6 5.1A9.8 9.8 0 0 1 12 5c5 0 8.5 4.5 9.5 7a13 13 0 0 1-2.6 3.8M6.3 6.3C4.4 7.6 3.1 9.6 2.5 12c1 2.5 4.5 7 9.5 7 1.7 0 3.2-.5 4.5-1.3M9.9 9.9a3 3 0 0 0 4.2 4.2"/>
                </svg>
              </span>
            </div>
          </div>

          <!-- Кнопка заявки в Bitrix24 та підпис під нею -->
          <button
            ref="btnB24"
            class="ty-btn"
            type="button"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 11h14v10H5zM8 11V8a4 4 0 0 1 8 0v3"/>
            </svg>
            Обговорити умови конфіденційно
          </button>
          <small class="ty-note">Адреси ми не запитуємо до підписання NDA</small>
        </div>
      </div>

      <!-- Сітка з 4 карток-кнопок (2х2), що відкривають відповідні модальні вікна -->
      <div class="ty-accs">
        <button
          ref="btnWho"
          class="ty-acc-h"
          type="button"
          aria-haspopup="dialog"
          aria-controls="tysha-p-who"
          @click="openModal('who', $refs.btnWho)"
        >
          <span class="ty-acc-ic">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#4A9550" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19M10 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM20 19v-1.5a3.5 3.5 0 0 0-2.5-3.35M15.5 3.65a3.5 3.5 0 0 1 0 6.7"/>
            </svg>
          </span>
          <span class="ty-acc-t">
            <b>Для кого цей формат</b>
            <small>5 ознак, що цей формат для вас</small>
          </span>
          <span class="ty-acc-chev">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#4A9550" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </span>
        </button>

        <button
          ref="btnProt"
          class="ty-acc-h"
          type="button"
          aria-haspopup="dialog"
          aria-controls="tysha-p-prot"
          @click="openModal('prot', $refs.btnProt)"
        >
          <span class="ty-acc-ic">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#4A9550" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5"/>
            </svg>
          </span>
          <span class="ty-acc-t">
            <b>Що входить у цей формат</b>
            <small>8 умов для кожного замовлення</small>
          </span>
          <span class="ty-acc-chev">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#4A9550" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </span>
        </button>

        <button
          ref="btnSteps"
          class="ty-acc-h"
          type="button"
          aria-haspopup="dialog"
          aria-controls="tysha-p-steps"
          @click="openModal('steps', $refs.btnSteps)"
        >
          <span class="ty-acc-ic">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#4A9550" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M6 4v16M6 6h9l-2 3 2 3H6"/>
            </svg>
          </span>
          <span class="ty-acc-t">
            <b>Як ми починаємо у такому форматі</b>
            <small>5 кроків до першої поставки</small>
          </span>
          <span class="ty-acc-chev">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#4A9550" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </span>
        </button>

        <button
          ref="btnFaq"
          class="ty-acc-h"
          type="button"
          aria-haspopup="dialog"
          aria-controls="tysha-p-faq"
          @click="openModal('faq', $refs.btnFaq)"
        >
          <span class="ty-acc-ic">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#4A9550" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9.2a2.6 2.6 0 0 1 5 .8c0 1.7-2.5 2.3-2.5 3.8M12 17h.01"/>
            </svg>
          </span>
          <span class="ty-acc-t">
            <b>Питання, які нам ще ставлять</b>
            <small>6 відповідей і прямий контакт</small>
          </span>
          <span class="ty-acc-chev">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#4A9550" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </span>
        </button>
      </div>

      <!-- Блок «Що ми постачаємо» (в точності як у Protokol-Tysha.html) -->
      <div class="ty-supply">
        <div class="ty-sh">
          <h3>Що ми постачаємо</h3>
        </div>
        <ul class="ty-tiles">
          <!-- 1. Напої та продукти -->
          <li class="ty-tile">
            <span class="ty-tile-ic">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#4A9550" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 9h12v5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5zM17 10h1.5a2.5 2.5 0 0 1 0 5H17M9 3v3M13 3v3"/>
              </svg>
            </span>
            <b>Напої та продукти</b>
            <p>Вода, кава, чай і їжа для ваших людей — і в денну, і в нічну зміну.</p>
          </li>
          <!-- 2. Господарчі товари -->
          <li class="ty-tile">
            <span class="ty-tile-ic">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#4A9550" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M9 3h5v4H9zM8 7h7l1 4v10H7V11zM14 3h3"/>
              </svg>
            </span>
            <b>Господарчі товари</b>
            <p>Засоби для прибирання й гігієни на всіх ваших локаціях.</p>
          </li>
          <!-- 3. Витратні матеріали -->
          <li class="ty-tile">
            <span class="ty-tile-ic">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#4A9550" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M3 8l9-4 9 4v8l-9 4-9-4zM3 8l9 4 9-4M12 12v8"/>
              </svg>
            </span>
            <b>Витратні матеріали</b>
            <p>Рукавички, скотч, плівка й коробки для виробничих зон.</p>
          </li>
          <!-- 4. Канцелярія -->
          <li class="ty-tile">
            <span class="ty-tile-ic">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#4A9550" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5"/>
              </svg>
            </span>
            <b>Канцелярія</b>
            <p>Папір, ручки, теки та все потрібне для офісу, складу й бухгалтерії.</p>
          </li>
          <!-- 5. Під запит -->
          <li class="ty-tile">
            <span class="ty-tile-ic">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#4A9550" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4"/>
              </svg>
            </span>
            <b>Під запит</b>
            <p>Знайдемо й привеземо будь-який товар, навіть поза каталогом.</p>
          </li>
        </ul>
      </div>
    </div>

    <!-- ==================== МОДАЛЬНІ ВІКНА ==================== -->

    <!-- Модалка 1: Для кого цей формат -->
    <div
      id="tysha-p-who"
      class="ty-mdl"
      :data-open="activeModal === 'who' ? '1' : '0'"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tysha-t-who"
      tabindex="-1"
      @click.self="closeModal"
      @keydown="handleModalKeydown"
    >
      <div class="ty-mdl-box" ref="modalBoxWho">
        <div class="ty-mdl-h">
          <span class="ty-mdl-t" id="tysha-t-who">
            <b>Для кого цей формат</b>
            <small>5 ознак, що цей формат для вас</small>
          </span>
          <button class="ty-mdl-x" type="button" aria-label="Закрити" @click="closeModal" ref="closeBtnWho">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18"/>
            </svg>
          </button>
        </div>
        <div class="ty-mdl-b">
          <ul class="ty-tiles">
            <li class="ty-tile">
              <span class="ty-tile-ic">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#4A9550" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M8 21s-5-4.6-5-9a5 5 0 0 1 10 0c0 4.4-5 9-5 9zM17 15s-3.2-2.9-3.2-5.6a3.2 3.2 0 0 1 6.4 0C20.2 12.1 17 15 17 15z"/>
                </svg>
              </span>
              <p>У вас декілька локацій, <b>адреси яких ви не публікуєте</b></p>
            </li>
            <li class="ty-tile">
              <span class="ty-tile-ic">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#4A9550" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6zM8.8 12l2.2 2.2 4.2-4.4"/>
                </svg>
              </span>
              <p>Ваша <b>служба безпеки</b> перевіряє кожного підрядника</p>
            </li>
            <li class="ty-tile">
              <span class="ty-tile-ic">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#4A9550" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM12 7.5V12l3 2"/>
                </svg>
              </span>
              <p>Команда працює <b>24/7</b>, і&nbsp;постачання не може зупинятися</p>
            </li>
            <li class="ty-tile">
              <span class="ty-tile-ic">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#4A9550" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M4 8h12l-3-3M20 16H8l3 3"/>
                </svg>
              </span>
              <p>Нові локації <b>відкриваються часто</b> і стартують за добу</p>
            </li>
            <li class="ty-tile">
              <span class="ty-tile-ic">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#4A9550" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M3 3l18 18M10.6 5.1A9.8 9.8 0 0 1 12 5c5 0 8.5 4.5 9.5 7a13 13 0 0 1-2.6 3.8M6.3 6.3C4.4 7.6 3.1 9.6 2.5 12c1 2.5 4.5 7 9.5 7 1.7 0 3.2-.5 4.5-1.3M9.9 9.9a3 3 0 0 0 4.2 4.2"/>
                </svg>
              </span>
              <p>Ви не хочете, щоб хтось, крім вас, знав <b>«що», «де» і «як»</b></p>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Модалка 2: Що входить у цей формат -->
    <div
      id="tysha-p-prot"
      class="ty-mdl"
      :data-open="activeModal === 'prot' ? '1' : '0'"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tysha-t-prot"
      tabindex="-1"
      @click.self="closeModal"
      @keydown="handleModalKeydown"
    >
      <div class="ty-mdl-box" ref="modalBoxProt">
        <div class="ty-mdl-h">
          <span class="ty-mdl-t" id="tysha-t-prot">
            <b>Що входить у цей формат</b>
            <small>8 умов для кожного замовлення</small>
          </span>
          <button class="ty-mdl-x" type="button" aria-label="Закрити" @click="closeModal" ref="closeBtnProt">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18"/>
            </svg>
          </button>
        </div>
        <div class="ty-mdl-b">
          <div class="ty-prot">
            <ul>
              <li>
                <span class="ty-pn">§ 1</span>
                <div>
                  <b>NDA до першого кроку</b>
                  <p>Договір про нерозголошення ми підписуємо ще до того, як ви назвете хоч одну адресу.</p>
                </div>
              </li>
              <li>
                <span class="ty-pn">§ 2</span>
                <div>
                  <b>Кодові назви замість адрес</b>
                  <p>Компанія й локації значаться під кодами «Клієнт&#8209;№» і «Локація&#8209;№». Повну адресу бачать лише закріплені люди.</p>
                </div>
              </li>
              <li>
                <span class="ty-pn">§ 3</span>
                <div>
                  <b>Закріплені водії</b>
                  <p>До вас щоразу приїжджають ті самі люди, без сторонніх служб доставки.</p>
                </div>
              </li>
              <li>
                <span class="ty-pn">§ 4</span>
                <div>
                  <b>Перевірений персонал</b>
                  <p>Кожен, хто працює з вашим замовленням, підписує окреме NDA і проходить регулярні інструктажі.</p>
                </div>
              </li>
              <li>
                <span class="ty-pn">§ 5</span>
                <div>
                  <b>Документи — в головний офіс</b>
                  <p>Усі закривальні документи одним пакетом на юридичну адресу, а не на кожну локацію.</p>
                </div>
              </li>
              <li>
                <span class="ty-pn">§ 6</span>
                <div>
                  <b>Ви не є нашим кейсом</b>
                  <p>Не згадуємо вас у рекламі, презентаціях і списках клієнтів&nbsp;— ні в публічних, ні в закритих.</p>
                </div>
              </li>
              <li>
                <span class="ty-pn">§ 7</span>
                <div>
                  <b>Відкриті для вашої СБ</b>
                  <p>Ваша служба безпеки може перевірити наші процеси, доступи та співробітників.</p>
                </div>
              </li>
              <li>
                <span class="ty-pn">§ 8</span>
                <div>
                  <b>Один канал зв'язку</b>
                  <p>Усі питання — через закріпленого менеджера в Signal або WhatsApp. Без дзвінків від незнайомців і розсилок.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка 3: Як ми починаємо у такому форматі -->
    <div
      id="tysha-p-steps"
      class="ty-mdl"
      :data-open="activeModal === 'steps' ? '1' : '0'"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tysha-t-steps"
      tabindex="-1"
      @click.self="closeModal"
      @keydown="handleModalKeydown"
    >
      <div class="ty-mdl-box" ref="modalBoxSteps">
        <div class="ty-mdl-h">
          <span class="ty-mdl-t" id="tysha-t-steps">
            <b>Як ми починаємо у такому форматі</b>
            <small>5 кроків до першої поставки</small>
          </span>
          <button class="ty-mdl-x" type="button" aria-label="Закрити" @click="closeModal" ref="closeBtnSteps">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18"/>
            </svg>
          </button>
        </div>
        <div class="ty-mdl-b">
          <ol class="ty-steps">
            <li>
              <span class="ty-sn">1</span>
              <b>Знайомство</b>
              <p>Обговорюємо обсяги й формат — без адрес.</p>
            </li>
            <li>
              <span class="ty-sn">2</span>
              <b>NDA</b>
              <p>Підписуємо за вашою або нашою формою.</p>
            </li>
            <li>
              <span class="ty-sn">3</span>
              <b>Протокол</b>
              <p>Узгоджуємо кодові назви локацій і вікна доставки.</p>
            </li>
            <li>
              <span class="ty-sn">4</span>
              <b>Перевірка</b>
              <p>Ваша СБ перевіряє наших людей, доступи та процеси.</p>
            </li>
            <li>
              <span class="ty-sn">5</span>
              <b>Старт</b>
              <p>Перша поставка — за 48&nbsp;годин після узгодження.</p>
            </li>
          </ol>
        </div>
      </div>
    </div>

    <!-- Модалка 4: Питання, які нам ще ставлять -->
    <div
      id="tysha-p-faq"
      class="ty-mdl"
      :data-open="activeModal === 'faq' ? '1' : '0'"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tysha-t-faq"
      tabindex="-1"
      @click.self="closeModal"
      @keydown="handleModalKeydown"
    >
      <div class="ty-mdl-box" ref="modalBoxFaq">
        <div class="ty-mdl-h">
          <span class="ty-mdl-t" id="tysha-t-faq">
            <b>Питання, які нам ще ставлять</b>
            <small>6 відповідей і прямий контакт</small>
          </span>
          <button class="ty-mdl-x" type="button" aria-label="Закрити" @click="closeModal" ref="closeBtnFaq">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18"/>
            </svg>
          </button>
        </div>
        <div class="ty-mdl-b">
          <ul class="ty-faq">
            <!-- FAQ 1 -->
            <li>
              <button
                class="ty-faq-q"
                type="button"
                :aria-expanded="faqOpen[0] ? 'true' : 'false'"
                @click="toggleFaq(0)"
              >
                <span class="ty-q">Хто саме знатиме адреси наших локацій?</span>
                <span class="ty-a">Закріплений менеджер, основний і резервний водії. Ви отримаєте їхні дані й зможете перевірити кожного.</span>
                <span class="ty-more">
                  <i>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#4A9550" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </i>
                  <span class="ty-lbl">{{ faqOpen[0] ? 'Згорнути' : 'Відповідь' }}</span>
                </span>
              </button>
            </li>
            <!-- FAQ 2 -->
            <li>
              <button
                class="ty-faq-q"
                type="button"
                :aria-expanded="faqOpen[1] ? 'true' : 'false'"
                @click="toggleFaq(1)"
              >
                <span class="ty-q">Ми часто переїжджаємо. Це проблема?</span>
                <span class="ty-a">Ні. Нова локація отримує новий код, а стара виключається з маршрутів і замовлень.</span>
                <span class="ty-more">
                  <i>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#4A9550" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </i>
                  <span class="ty-lbl">{{ faqOpen[1] ? 'Згорнути' : 'Відповідь' }}</span>
                </span>
              </button>
            </li>
            <!-- FAQ 3 -->
            <li>
              <button
                class="ty-faq-q"
                type="button"
                :aria-expanded="faqOpen[2] ? 'true' : 'false'"
                @click="toggleFaq(2)"
              >
                <span class="ty-q">Чи можна не вказувати адресу в документах?</span>
                <span class="ty-a">Первинні документи ми надсилаємо на юридичну адресу. Як відображати пункт розвантаження, узгоджуємо з вами особисто.</span>
                <span class="ty-more">
                  <i>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#4A9550" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </i>
                  <span class="ty-lbl">{{ faqOpen[2] ? 'Згорнути' : 'Відповідь' }}</span>
                </span>
              </button>
            </li>
            <!-- FAQ 4 -->
            <li>
              <button
                class="ty-faq-q"
                type="button"
                :aria-expanded="faqOpen[3] ? 'true' : 'false'"
                @click="toggleFaq(3)"
              >
                <span class="ty-q">Чи можна доставити в узгоджену точку передачі?</span>
                <span class="ty-a">Так. Точку, час і порядок передачі узгоджуємо заздалегідь — вона не обов'язково збігається з локацією.</span>
                <span class="ty-more">
                  <i>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#4A9550" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </i>
                  <span class="ty-lbl">{{ faqOpen[3] ? 'Згорнути' : 'Відповідь' }}</span>
                </span>
              </button>
            </li>
            <!-- FAQ 5 -->
            <li>
              <button
                class="ty-faq-q"
                type="button"
                :aria-expanded="faqOpen[4] ? 'true' : 'false'"
                @click="toggleFaq(4)"
              >
                <span class="ty-q">Скільки локацій ви зможете обслуговувати?</span>
                <span class="ty-a">Від однієї до кількох десятків. Звітність і графік поставок ведемо окремо по кожній локації.</span>
                <span class="ty-more">
                  <i>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#4A9550" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </i>
                  <span class="ty-lbl">{{ faqOpen[4] ? 'Згорнути' : 'Відповідь' }}</span>
                </span>
              </button>
            </li>
            <!-- Картка прямого контакту (завжди відкрита) -->
            <li>
              <div class="ty-faq-ct" id="tysha-contact">
                <span class="ty-q">Чи можна з вами зв'язатися самостійно?</span>
                <span class="ty-ct-a">Так. Відповідає одна людина — без кол&#8209;центру й переадресацій.</span>
                <a class="ty-ct-phone" href="tel:+380630362723">+380&nbsp;63&nbsp;036&nbsp;27&nbsp;23</a>
                <span class="ty-ct-btns">
                  <a class="ty-pill" href="https://signal.me/#p/+380630362723" target="_blank" rel="noopener">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.6-5.2A8.5 8.5 0 1 1 21 11.5z"/>
                    </svg>
                    Signal
                  </a>
                  <a class="ty-pill ty-pill-o" href="https://wa.me/380630362723" target="_blank" rel="noopener">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#4A9550" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M3 20.5l1.4-4.6A8.5 8.5 0 1 1 8 19.3zM9 9.5c0 3 2.5 5.5 5.5 5.5l1.5-1.5-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2z"/>
                    </svg>
                    WhatsApp
                  </a>
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ProtokolTysha",
  data() {
    return {
      activeModal: null, // 'who' | 'prot' | 'steps' | 'faq' | null
      lastTriggerBtn: null,
      faqOpen: {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
      },
    };
  },
  mounted() {
    window.addEventListener("keydown", this.handleGlobalKeydown);
    this.initB24Form();
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.handleGlobalKeydown);
    this.unlockScroll();
  },
  methods: {
    openModal(id, triggerBtn) {
      this.activeModal = id;
      this.lastTriggerBtn = triggerBtn || null;
      this.lockScroll();

      this.$nextTick(() => {
        let closeBtn = null;
        if (id === "who") closeBtn = this.$refs.closeBtnWho;
        else if (id === "prot") closeBtn = this.$refs.closeBtnProt;
        else if (id === "steps") closeBtn = this.$refs.closeBtnSteps;
        else if (id === "faq") closeBtn = this.$refs.closeBtnFaq;

        if (closeBtn && typeof closeBtn.focus === "function") {
          closeBtn.focus();
        }
      });
    },
    closeModal() {
      if (!this.activeModal) return;
      this.activeModal = null;
      this.unlockScroll();

      if (this.lastTriggerBtn && typeof this.lastTriggerBtn.focus === "function") {
        this.$nextTick(() => {
          this.lastTriggerBtn.focus();
        });
      }
    },
    toggleFaq(index) {
      this.$set(this.faqOpen, index, !this.faqOpen[index]);
    },
    lockScroll() {
      if (typeof document !== "undefined") {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
      }
    },
    unlockScroll() {
      if (typeof document !== "undefined") {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      }
    },
    handleGlobalKeydown(e) {
      if (e.key === "Escape" && this.activeModal) {
        this.closeModal();
      }
    },
    handleModalKeydown(e) {
      if (e.key !== "Tab") return;

      // Trap focus inside current modal dialog
      const modalEl = e.currentTarget;
      if (!modalEl) return;

      const focusableElements = modalEl.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements.length) return;

      const firstEl = focusableElements[0];
      const lastEl = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    },
    initB24Form() {
      if (typeof document === "undefined") return;
      const btn = this.$refs.btnB24;
      if (!btn) return;

      if (
        btn.previousElementSibling &&
        btn.previousElementSibling.getAttribute &&
        btn.previousElementSibling.getAttribute("data-b24-form") === "click/37/xxzc5h"
      ) {
        return;
      }

      const script = document.createElement("script");
      script.setAttribute("data-b24-form", "click/37/xxzc5h");
      script.setAttribute(
        "data-b24-form-telemetry-sign",
        "v1:37:site.c5b25bd668fd8db6010213613f246698bf2236c1acec08912e0edfce5ee1ac60"
      );
      script.setAttribute("data-skip-moving", "true");
      script.innerHTML = `(function(w,d,u){
  var s=d.createElement('script');
  s.async=true;
  s.src=u+'?'+(Date.now()/180000|0);
  var h=d.getElementsByTagName('script')[0];
  h.parentNode.insertBefore(s,h);
})(window,document,'https://cdn.bitrix24.eu/b7849145/crm/form/loader_37.js');`;

      btn.parentNode.insertBefore(script, btn);
    },
  },
};
</script>

<style lang="scss">
.tysha {
  --g: #4A9550;
  --gd: #3D7F43;
  --gs: #EEF6EF;
  --ink: #222326;
  --txt: #55585E;
  --mut: #8A8D93;
  --line: #E7E9ED;
  --tile: #F7F8FA;

  font-family: inherit;
  color: var(--ink);
  margin-top: -1px;
  background: linear-gradient(180deg, #E9ECEF 0%, #E9ECEF 80px, #FFFFFF 100%);
  padding: 80px 20px 96px;

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  ul, ol {
    list-style: none;
  }

  h2, h3 {
    font-family: inherit;
    color: var(--ink);
  }

  h3, b {
    font-weight: 700;
  }

  a {
    color: inherit;
  }

  .ty-wrap {
    max-width: 1200px;
    margin: 0 auto;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 1px 2px rgba(20, 24, 30, 0.04), 0 12px 32px rgba(20, 24, 30, 0.06);
    padding: 56px 64px;
  }

  /* hero */
  .ty-hero {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 48px;
    align-items: stretch;
  }

  .ty-hero-l {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .ty-hero .ty-hero-t {
    font-size: 42px;
    line-height: 1.2;
    font-weight: 700;
    letter-spacing: -0.4px;
    margin-top: -6px;

    span {
      color: var(--g);
    }
  }

  .ty-lead {
    font-size: 21px;
    line-height: 1.55;
    color: var(--txt);
    max-width: 500px;
    margin: 20px 0 -4px;

    b {
      color: #6B6E74;
    }
  }

  .ty-hero-r {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .ty-btn {
    margin-top: auto;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 18px 32px;
    border-radius: 8px;
    background: var(--g);
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    text-decoration: none;
    white-space: nowrap;
    transition: background 0.2s, transform 0.2s;
    border: none;
    cursor: pointer;
    font-family: inherit;

    &:hover {
      background: var(--gd);
    }
  }

  .ty-note {
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    margin-top: 12px;
    text-align: center;
    font-size: 13px;
    color: var(--mut);
  }

  /* confidential card stack */
  .ty-doc {
    position: relative;
    width: 340px;
    height: 104px;
    margin: 6px auto 0;
  }

  .ty-doc-card {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 0 22px;
    border: 1px solid var(--line);
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 10px 28px rgba(20, 24, 30, 0.08);
  }

  .ty-d2 {
    transform: translateY(16px) scale(0.94);
    opacity: 0.7;
    box-shadow: none;
  }

  .ty-d3 {
    transform: translateY(30px) scale(0.88);
    opacity: 0.45;
    box-shadow: none;
  }

  .ty-doc-ic {
    flex: none;
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--gs);
  }

  .ty-doc-txt {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;

    b {
      font-size: 18px;
      line-height: 1.2;
    }
  }

  .ty-bars {
    display: flex;
    gap: 6px;

    i {
      display: block;
      height: 8px;
      border-radius: 4px;
      background: #E6E8EC;
    }
  }

  .ty-doc-eye {
    flex: none;
    display: grid;
  }

  /* supply block */
  .ty-supply {
    margin-top: 56px;
    padding: 40px 20px 20px;
    border-radius: 16px;
    background: var(--tile);

    .ty-tiles {
      margin-top: 28px;
      gap: 12px;
    }

    .ty-tile {
      padding: 24px 14px 22px;
      background: #fff;

      &:hover {
        background: var(--gs);
      }
    }
  }

  .ty-sh {
    text-align: center;

    h3 {
      font-size: 26px;
      line-height: 1.3;
    }
  }

  /* tiles (who / supply) */
  .ty-tiles {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    margin-top: 32px;
  }

  .ty-tile {
    padding: 24px 18px 22px;
    border-radius: 12px;
    background: var(--tile);
    text-align: center;
    transition: background 0.2s, transform 0.2s;

    &:hover {
      background: var(--gs);
      transform: translateY(-2px);
    }

    p {
      font-size: 15px;
      line-height: 1.5;
      color: var(--txt);

      b {
        color: var(--ink);
      }
    }

    > b {
      display: block;
      font-size: 16px;
      margin-bottom: 8px;
    }
  }

  .ty-tile-ic {
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    margin: 0 auto 16px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 8px rgba(20, 24, 30, 0.06);
  }

  /* protocol document in modal */
  .ty-prot {
    max-width: 980px;
    margin: 32px auto 0;
    border: 1px solid var(--line);
    border-radius: 12px;
    overflow: hidden;

    ul {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 48px;
      padding: 8px 28px 12px;
    }

    li {
      display: grid;
      grid-template-columns: 44px 1fr;
      gap: 12px;
      padding: 20px 0;
      border-bottom: 1px dashed #DADDE2;

      &:nth-last-child(-n+2) {
        border-bottom: 0;
      }
    }

    b {
      display: block;
      font-size: 17px;
      line-height: 1.35;
      margin-bottom: 6px;
    }

    p {
      font-size: 14px;
      line-height: 1.55;
      color: var(--txt);
    }
  }

  .ty-pn {
    font-size: 15px;
    line-height: 1.5;
    font-weight: 700;
    color: var(--g);
  }

  /* steps */
  .ty-steps {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    margin-top: 40px;

    li {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      text-align: center;
      padding: 0 8px;

      &:not(:last-child)::after {
        content: "";
        position: absolute;
        top: 26px;
        left: calc(50% + 40px);
        right: calc(-50% + 32px);
        border-top: 2px dotted var(--g);
      }

      &:not(:last-child)::before {
        content: "";
        position: absolute;
        top: 21px;
        right: calc(-50% + 30px);
        width: 8px;
        height: 8px;
        border-top: 2px solid var(--g);
        border-right: 2px solid var(--g);
        transform: rotate(45deg);
      }
    }

    b {
      font-size: 17px;
    }

    p {
      font-size: 14px;
      line-height: 1.55;
      color: var(--txt);
      max-width: 190px;
    }
  }

  .ty-sn {
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--g);
    color: #fff;
    font-size: 18px;
    font-weight: 700;
    box-shadow: 0 0 0 6px var(--gs);
    margin-bottom: 6px;
  }

  /* faq grid & accordion */
  .ty-faq {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 32px;
  }

  .ty-faq-q {
    all: unset;
    box-sizing: border-box;
    width: 100%;
    min-height: 252px;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 24px;
    border-radius: 12px;
    background: var(--tile);
    color: var(--ink);
    cursor: pointer;
    font-family: inherit;
    transition: background 0.25s, color 0.25s, transform 0.2s;

    &:hover {
      transform: translateY(-2px);
    }

    &:focus-visible {
      outline: 2px solid var(--g);
      outline-offset: 2px;
    }

    &[aria-expanded="true"] {
      background: var(--gs);
      color: var(--ink);

      .ty-a {
        display: block;
        color: var(--txt);
      }

      .ty-more {
        color: var(--g);

        svg {
          transform: rotate(45deg);
        }
      }
    }
  }

  .ty-q {
    font-size: 18px;
    line-height: 1.4;
    font-weight: 700;
  }

  .ty-a {
    display: none;
    font-size: 15px;
    line-height: 1.6;

    a {
      font-weight: 700;
      white-space: nowrap;
    }
  }

  .ty-more {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: auto;
    font-size: 14px;
    font-weight: 700;
    color: var(--g);

    i {
      display: grid;
      place-items: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #fff;
    }

    svg {
      transition: transform 0.2s;
    }
  }

  /* contact card in faq */
  .ty-faq-ct {
    min-height: 252px;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 24px;
    border-radius: 12px;
    color: var(--ink);
    background: var(--gs);

    .ty-q {
      color: var(--ink);
    }
  }

  .ty-ct-a {
    font-size: 15px;
    line-height: 1.5;
    color: var(--txt);
  }

  .ty-ct-phone {
    margin-top: auto;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: 0.3px;
    color: var(--ink);
    text-decoration: none;
    white-space: nowrap;
    transition: color 0.2s;

    &:hover {
      color: var(--g);
    }
  }

  .ty-ct-btns {
    display: flex;
    gap: 8px;
  }

  .ty-pill {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 10px 12px;
    border-radius: 999px;
    background: var(--g);
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    transition: background 0.2s, color 0.2s;

    &:hover {
      background: var(--gd);
    }
  }

  .ty-pill-o {
    background: #fff;
    color: var(--g);
    box-shadow: inset 0 0 0 1.5px var(--g);

    &:hover {
      background: #fff;
      color: var(--gd);
    }
  }

  /* accordion tiles 2x2 */
  .ty-accs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-top: 64px;
  }

  .ty-acc-h {
    all: unset;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 18px;
    min-height: 104px;
    padding: 22px 24px;
    border: 1px solid var(--line);
    border-radius: 16px;
    background: #fff;
    cursor: pointer;
    font-family: inherit;
    color: var(--ink);
    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s, transform 0.2s;

    &:hover {
      border-color: #CFE3D2;
      transform: translateY(-2px);
      box-shadow: 0 8px 22px rgba(20, 24, 30, 0.05);

      .ty-acc-chev {
        background: var(--g);

        svg {
          stroke: #fff;
        }
      }
    }

    &:focus-visible {
      outline: 2px solid var(--g);
      outline-offset: 2px;
    }
  }

  .ty-acc-ic {
    flex: none;
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--gs);
    transition: background 0.25s;
  }

  .ty-acc-t {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-width: 0;

    b {
      font-size: 20px;
      line-height: 1.3;
    }

    small {
      font-size: 14px;
      color: var(--mut);
    }
  }

  .ty-acc-chev {
    flex: none;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--tile);
    transition: transform 0.3s, background 0.25s;

    svg {
      transition: stroke 0.25s;
    }
  }

  /* Modals */
  .ty-mdl {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 32px;
    background: rgba(28, 32, 30, 0.45);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);

    &[data-open="1"] {
      display: flex;
      animation: tyFade 0.25s ease;
    }

    .ty-prot {
      max-width: none;
      margin: 0;
      border: 0;
      border-radius: 0;

      ul {
        padding: 0 4px;
      }
    }
  }

  .ty-mdl-box {
    position: relative;
    width: 100%;
    max-width: 1040px;
    max-height: calc(100vh - 64px);
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.25);
    animation: tyUp 0.3s ease;
  }

  .ty-mdl-h {
    flex: none;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 22px 24px 18px 32px;
    border-bottom: 1px solid var(--line);
  }

  .ty-mdl-t {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;

    b {
      font-size: 24px;
      line-height: 1.25;
    }

    small {
      font-size: 14px;
      color: var(--mut);
    }
  }

  .ty-mdl-x {
    all: unset;
    flex: none;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--tile);
    color: var(--ink);
    cursor: pointer;
    transition: background 0.2s, color 0.2s;

    &:hover {
      background: var(--gs);
      color: var(--gd);
    }

    &:focus-visible {
      outline: 2px solid var(--g);
      outline-offset: 2px;
    }
  }

  .ty-mdl-b {
    overflow: auto;
    padding: 24px 32px 32px;

    > * {
      margin-top: 0 !important;
    }
  }

  @keyframes tyFade {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes tyUp {
    from {
      opacity: 0;
      transform: translateY(16px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes tyIn {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
}

/* ==================== АДАПТИВ ==================== */

/* Tablet (<=1000px) */
@media (max-width: 1000px) {
  .tysha {
    padding: 40px 16px 48px;
    background: linear-gradient(180deg, #E9ECEF 0%, #E9ECEF 40px, #FFFFFF 100%);

    .ty-wrap {
      padding: 40px 28px;
    }

    .ty-hero {
      grid-template-columns: 1fr;
      gap: 32px;
    }

    .ty-hero-l {
      justify-content: flex-start;
    }

    .ty-hero .ty-hero-t {
      margin-top: 0;
    }

    .ty-hero-r {
      gap: 0;
    }

    .ty-doc {
      margin-bottom: 46px;
    }

    .ty-note {
      position: static;
      margin-top: 12px;
    }

    .ty-tiles {
      grid-template-columns: repeat(2, 1fr);

      li:last-child:nth-child(odd) {
        grid-column: 1 / -1;
      }
    }

    .ty-faq {
      grid-template-columns: repeat(2, 1fr);
    }

    .ty-faq-q, .ty-faq-ct {
      height: 100%;
      min-height: 220px;
    }

    .ty-prot ul {
      grid-template-columns: 1fr;
    }

    .ty-prot li:nth-last-child(2) {
      border-bottom: 1px dashed #DADDE2;
    }

    /* steps -> vertical timeline */
    .ty-steps {
      grid-template-columns: 1fr;
      gap: 0;
      max-width: 560px;
      margin-left: auto;
      margin-right: auto;

      li {
        display: grid;
        grid-template-columns: 52px 1fr;
        column-gap: 18px;
        row-gap: 4px;
        align-items: start;
        text-align: left;
        padding: 0 0 26px;

        &::before {
          display: none;
        }

        &:not(:last-child)::after {
          top: 62px;
          bottom: 6px;
          left: 25px;
          right: auto;
          width: 0;
          border-top: 0;
          border-left: 2px dotted var(--g);
        }
      }

      b {
        padding-top: 6px;
      }

      p {
        max-width: none;
      }
    }

    .ty-sn {
      grid-row: 1 / 3;
      margin: 0;
    }
  }
}

/* Phone (<=640px) */
@media (max-width: 640px) {
  .tysha {
    padding: 0;
    background: #fff;

    .ty-wrap {
      border-radius: 0;
      box-shadow: none;
      padding: 32px 16px 40px;
    }

    .ty-hero {
      gap: 24px;

      .ty-hero-t {
        font-size: 30px;
        line-height: 1.2;
      }
    }

    .ty-lead {
      font-size: 18px;
      margin-top: 14px;
      max-width: none;
    }

    .ty-doc {
      width: 100%;
      max-width: none;
    }

    .ty-doc-card {
      padding: 0 16px;
      gap: 12px;
    }

    .ty-btn {
      width: 100%;
      justify-content: center;
      white-space: normal;
      text-align: center;
      padding: 16px 20px;
      gap: 8px;
      font-size: 15px;

      svg {
        flex: none;
      }
    }

    .ty-sh {
      h3 {
        font-size: 23px;
      }
    }

    .ty-supply {
      margin-top: 40px;
      padding: 28px 12px 16px;

      .ty-sh h3 {
        font-size: 22px;
      }

      .ty-tiles {
        margin-top: 18px;
      }

      .ty-tile:hover {
        background: #fff;
      }
    }

    /* Tiles -> full-width rows: icon left, text right */
    .ty-tiles {
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 22px;
    }

    .ty-tile {
      display: grid;
      grid-template-columns: 44px 1fr;
      column-gap: 14px;
      align-items: center;
      text-align: left;
      padding: 14px 16px;

      &:hover {
        transform: none;
        background: var(--tile);
      }

      > b {
        margin: 0 0 2px;
        font-size: 16px;
        align-self: end;
      }

      > b + p {
        align-self: start;
      }

      p {
        font-size: 14px;
        line-height: 1.45;
      }
    }

    .ty-tile-ic {
      grid-row: 1 / 3;
      margin: 0;
      width: 44px;
      height: 44px;

      svg {
        width: 22px;
        height: 22px;
      }
    }

    .ty-prot {
      margin-top: 22px;

      ul {
        padding: 4px 16px 8px;
      }

      li {
        grid-template-columns: 34px 1fr;
        gap: 8px;
        padding: 16px 0;
      }

      b {
        font-size: 16px;
      }
    }

    .prot-h {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
      padding: 14px 16px;
    }

    .ty-steps {
      margin-top: 28px;

      li {
        grid-template-columns: 44px 1fr;
        padding-bottom: 22px;

        &:not(:last-child)::after {
          top: 56px;
          left: 21px;
        }
      }

      b {
        padding-top: 2px;
        font-size: 16px;
      }
    }

    .ty-sn {
      width: 44px;
      height: 44px;
      font-size: 16px;
      box-shadow: 0 0 0 5px var(--gs);
    }

    .ty-accs {
      grid-template-columns: 1fr;
      margin-top: 40px;
      gap: 10px;
    }

    .ty-acc-h {
      min-height: 0;
      padding: 16px;
      gap: 12px;

      &:hover {
        transform: none;
      }
    }

    .ty-acc-ic {
      width: 42px;
      height: 42px;
    }

    .ty-acc-t {
      b {
        font-size: 17px;
      }

      small {
        font-size: 13px;
      }
    }

    .ty-acc-chev {
      width: 34px;
      height: 34px;

      svg {
        width: 16px;
        height: 16px;
      }
    }

    /* Modal -> full screen / bottom sheet */
    .ty-mdl {
      padding: 0;
      align-items: stretch;
    }

    .ty-mdl-box {
      height: 100vh;
      height: 100dvh;
      max-height: none;
      border-radius: 0;
      animation: tyIn 0.3s ease;
    }

    .ty-mdl-h {
      padding: calc(14px + env(safe-area-inset-top)) 14px 12px 18px;
    }

    .ty-mdl-t b {
      font-size: 19px;
    }

    .ty-mdl-x {
      width: 40px;
      height: 40px;
    }

    .ty-mdl-b {
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      padding: 14px 14px calc(24px + env(safe-area-inset-bottom));
    }

    .ty-faq {
      grid-template-columns: 1fr;
      gap: 10px;
      margin-top: 22px;
    }

    .ty-faq-q, .ty-faq-ct {
      min-height: 0;
      padding: 20px;
    }

    .ty-faq-q {
      gap: 12px;

      &:hover {
        transform: none;
      }
    }

    .ty-q {
      font-size: 17px;
    }

    .ty-more {
      margin-top: 6px;
    }

    .ty-ct-phone {
      margin-top: 8px;
    }
  }
}

/* Narrow Phone (<=400px) */
@media (max-width: 400px) {
  .tysha {
    .ty-hero .ty-hero-t {
      font-size: 27px !important;
    }

    .ty-lead {
      font-size: 17px !important;
    }

    .ty-btn {
      font-size: 14.5px !important;
    }
  }
}
</style>
