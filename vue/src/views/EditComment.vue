<template>
  <div>
    <Header />
    <b-container fluid>
      <b-form>
        <b-row class="mt-2">
          <b-col sm="4" offset="4">
            <b-form-textarea
              class="mb-2 mr-sm-2 mb-sm-0"
              placeholder="Change your comment here"
               v-model="$v.form.content.$model"
            :state="validateState('content')"
            aria-describedby="input-1-live-feedback"
            ></b-form-textarea>
            <b-form-invalid-feedback id="input-1-live-feedback">
            The comment must contain at least 3 and maximum 1000 chracters.
          </b-form-invalid-feedback>
          </b-col>
        </b-row>
      </b-form>

      <b-row class="mt-2">
        <b-col sm="4" offset="4">
          <b-button variant="primary" size="lg" @click="saveChange"
            >Save</b-button
          >
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import router from "@/router";
import Header from "@/components/Header";
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";

export default {
  name: "EditComment",
  mixins: [validationMixin],
  props: {
    comment: {
      type: String,
      default: "",
    },
  },
  components: {
    Header,
  },
  data() {
    return {
      edit: false,
      form: {
        content: null,
      },
    };
  },
  validations: {
    form: {
      content: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(1000),
      },
    },
  },
  mounted: function () {
    this.form.content = this.comment;
  },
  methods: {
    ...mapActions(["change_comment"]),

    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },

    saveChange: function () {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      let com = {};

      for (let i = 0; i < this.$store.state.comments.length; i++)
        if (
          this.$store.state.comments[i].id === parseInt(this.$route.params.id)
        ) {
          com = this.$store.state.comments[i];
          break;
        }

      const comment = JSON.stringify({ comment: this.form.content });
      this.change_comment({
        id: com.id,
        user_id: this.$store.state.user,
        comment: comment,
      });

      router.push({ path: `/comments` });
    },
  },
};
</script>

<style scoped>
</style>