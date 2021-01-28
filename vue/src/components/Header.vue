<template>
  <div>
    <b-jumbotron
      class="bg-primary text-light shadow mt-0 header"
      header="Mobiles Impressions"
    >
      <!--<img src="header-img.png" alt="" class="mw-100" width="240px" />-->
    </b-jumbotron>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Header",
  computed: {
    ...mapState(["mobiles"]),
  },
};
</script>

<style scoped>
</style>