<template>
  <div class="home__wrap">
    <Header />
    <main>
      <First />
      <Second />
      <Third />
      <Work />
      <Delivery />
      <FAQ />
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from "../components/home/header";
import Footer from "../components/home/footer";

import First from "../components/home/first.vue";
import Second from "../components/home/second.vue";
import Third from "../components/home/third.vue";
import Work from "../components/home/work.vue";
import Delivery from "../components/home/delivery.vue";
import FAQ from "../components/home/faq.vue";

export default {
  name: "Home",
  components: {
    Header,
    Footer,
    First,
    Second,
    Third,
    Work,
    Delivery,
    FAQ,
  },
};
</script>

<style lang="scss">
.home__wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex-grow: 1;
  background: #fff;
}
html {
  scroll-behavior: smooth;
}
</style>
