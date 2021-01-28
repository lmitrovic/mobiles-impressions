<template>
  <div>
    <b-container>
      <b-form>
        <b-row class="mt-2">
          <b-col sm="6" offset="2" class="mx-auto">
            <b-input
              class="mb-2 mr-sm-2 mb-sm-0 input"
              placeholder="Enter the phone model"
              v-model="$v.form.model.$model"
              :state="validateState('model')"
              aria-describedby="input-1-live-feedback"
            ></b-input>
            <b-form-invalid-feedback id="input-1-live-feedback">
              The model must contain at least 1 and maximum 50 chracters.
            </b-form-invalid-feedback>
            <b-button variant="primary" size="lg" @click="search"
              >Search comments</b-button
            >
          </b-col>
        </b-row>
      </b-form>
    </b-container>
    <b-table
      sticky-header="800px"
      :items="comments"
      head-variant="light"
      @row-clicked="edit"
    ></b-table>
    <b-form>
      <b-row class="mt-2">
        <b-col lg="6" offset="2" class="text-center mx-auto">
          <!-- <b-input
            v-model="nickname"
            class="mb-2 mr-sm-2 mb-sm-0 mb-2 input"
            placeholder="Enter your nickname"
          ></b-input> -->
          <b-form-textarea
            placeholder="Enter your comment"
            class="input"
            v-model="$v.form.comment.$model"
            :state="validateState('comment')"
            aria-describedby="input-2-live-feedback"
          ></b-form-textarea>
          <b-form-invalid-feedback id="input-2-live-feedback">
            The comment must contain at least 3 and maximum 1000 chracters.
          </b-form-invalid-feedback>
          <b-button variant="primary" size="lg" @click="addNew">Save</b-button>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script>
import router from "@/router";
import { mapState, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";

export default {
  name: "CommentsList",
  mixins: [validationMixin],
  computed: {
    ...mapState(["comments"]),
  },

  data() {
    return {
      form: {
        model: null,
        comment: null,
      },
    };
  },
  validations: {
    form: {
      model: {
        required,
        minLength: minLength(1),
        maxLength: maxLength(50),
      },
      comment: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(1000),
      },
    },
  },
  methods: {
    ...mapActions(["load_comments", "new_comment"]),

    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },

    search: function () {
      this.load_comments(this.form.model);
    },

    addNew: function () {
      const com = JSON.stringify({
        model: this.form.model,
        user_id: this.$store.state.user,
        nickname: this.$store.state.username,
        comment: this.form.comment,
      });
      this.new_comment(com);
      this.form.comment = "";
    },

    edit: function (item, index, event) {
      if (item.username === this.$store.state.username) {
        router.push({ path: `/editComment/${item.id}` });
      }
    },
  },
};
</script>

<style scoped>
.input {
  margin-bottom: 10px !important;
}
</style>