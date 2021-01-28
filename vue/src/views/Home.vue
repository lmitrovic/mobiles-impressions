<template>
  <div class="home">
    <Header />
    <b-container>
      <b-row>
        <b-col cm="6">
          <MobileList />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header";
import MobileList from "@/components/MobileList";
import { mapActions } from "vuex";

export default {
  name: "home",
  components: {
    Header,
    MobileList,
  },
  methods: {
    ...mapActions(["load_mobiles"]),
  },

  mounted: function () {
    if (!this.$store.getters.isLoggedIn) {
      this.$router.push("/login");
    }

    this.load_mobiles();
  },
};
</script>
