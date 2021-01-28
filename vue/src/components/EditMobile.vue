<template>
  <b-container fluid>
    <b-form>
      <b-row class="mt-2">
        <b-col sm="3" offset="2">
          <b-input
            class="mb-2 mr-sm-2 mb-sm-0"
            placeholder="Enter new model"
            v-model="$v.form.model.$model"
            :state="validateState('model')"
            aria-describedby="input-1-live-feedback"
          ></b-input>
          <b-form-invalid-feedback id="input-1-live-feedback">
            The model must contain at least 1 and maximum 50 chracters.
          </b-form-invalid-feedback>
        </b-col>
        <b-col sm="3">
          <b-input
            class="mb-2 mr-sm-2 mb-sm-0"
            placeholder="Enter new producer"
            v-model="$v.form.producer.$model"
            :state="validateState('producer')"
            aria-describedby="input-2-live-feedback"
          ></b-input>
          <b-form-invalid-feedback id="input-2-live-feedback">
            The producer must contain at least 3 and maximum 20 chracters.
          </b-form-invalid-feedback>
        </b-col>
        <b-col sm="3">
          <b-input
            class="mb-2 mr-sm-2 mb-sm-0"
            placeholder="Enter new price"
            v-model="$v.form.price.$model"
            :state="validateState('price')"
            aria-describedby="input-3-live-feedback"
          ></b-input>
          <b-form-invalid-feedback id="input-3-live-feedback">
            You must enter a price.
          </b-form-invalid-feedback>
        </b-col>
        <b-col sm="1">
          <b-button variant="primary" size="lg" @click="addNew">Save</b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-container>
</template>


<script>
import { mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";

export default {
  name: "EditMobile",
  mixins: [validationMixin],
  props: {
    model: {
      type: String,
      default: "",
    },
    producer: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: "",
    },
  },
  data() {
    return {
      id: "",
      form: {
        model: null,
        producer: null,
        price: null,
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
      producer: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(20),
      },
      price: {
        required,
      },
    },
  },
  mounted: function () {
    this.form.model = this.model;
    this.form.producer = this.producer;
    this.form.price = this.price;
  },
  methods: {
    ...mapActions(["new_mobile", "change_mobile"]),

    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },

    addNew: function () {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      const mob = JSON.stringify({
        model: this.form.model,
        producer: this.form.producer,
        price: parseInt(this.form.price),
      });

      if (!this.$route.params.id) this.new_mobile(mob);
      else {
        this.change_mobile({ id: this.$route.params.id, mob: mob });
      }
      this.form.model = "";
      this.form.producer = "";
      this.form.price = "";
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
</style>