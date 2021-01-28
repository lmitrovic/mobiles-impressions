<template>
  <div class="home">
    <Header />
    <b-container>
      <b-row>
        <b-col cm="6">
          <CommentsList />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header";
import CommentsList from "@/components/CommentsList";

export default {
  name: "home",
  components: {
    Header,
    CommentsList,
  },

  mounted: function () {
    if (!this.$store.getters.isLoggedIn) {
      this.$router.push("/login");
    }
  },
};
</script>