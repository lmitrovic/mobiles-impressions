<template>
  <div class="home">
    <Header />
    <b-container>
      <b-row>
        <b-col cm="6">
          <EditMobile />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import EditMobile from "@/components/EditMobile";
import Header from "@/components/Header";

export default {
  name: "NewMobile",
  components: {
    Header,
    EditMobile,
  },
  mounted: function () {
    if (!this.$store.getters.isLoggedIn) {
      this.$router.push("/login");
    }
  },
};
</script>

<style scoped>
</style>