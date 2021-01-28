<template>
  <div>
    <Header />
    <b-container>
      <b-row>
        <b-col cm="6">
          <div v-if="edit">
            <EditMobile
              :model="mobile.model"
              :producer="mobile.producer"
              :price="mobile.price"
            />
          </div>
          <div v-else>
            <ShowMobile v-if="mobiles.length" :mobile="mobile" />
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col cm="2" style="margin-top: 10px">
          <b-button
            variant="primary"
            size="lg"
            @click="toggleEdit"
            v-html="edit ? 'Cancel' : 'Edit'"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import EditMobile from "@/components/EditMobile";
import Header from "@/components/Header";
import ShowMobile from "@/components/ShowMobile";
import { mapState, mapActions } from "vuex";

export default {
  name: "Mobile",
  components: {
    Header,
    EditMobile,
    ShowMobile,
  },
  data() {
    return {
      edit: false,
    };
  },
  computed: {
    ...mapState(["mobiles"]),

    mobile: function () {
      for (let i = 0; i < this.mobiles.length; i++)
        if (this.mobiles[i].id === parseInt(this.$route.params.id))
          return this.mobiles[i];
    },
  },
  methods: {
    ...mapActions(["load_mobiles"]),

    toggleEdit: function () {
      this.edit = !this.edit;
    },
  },
};
</script>

<style scoped>
</style>