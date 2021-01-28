<template>
  <div>
    <Header />
    <b-container fluid>
      <b-form>
        <b-row class="mt-2">
          <b-col sm="4" offset="4">
            <b-input
              class="mb-2 mr-sm-2 mb-sm-0"
              placeholder="Enter your username"
              v-model="$v.form.username.$model"
              :state="validateState('username')"
              aria-describedby="input-1-live-feedback"
            ></b-input>
            <b-form-invalid-feedback id="input-1-live-feedback">
              The username must contain at least 3 and maximum 20 chracters.
            </b-form-invalid-feedback>
          </b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col sm="4" offset="4">
            <b-input
              type="password"
              class="mb-2 mr-sm-2 mb-sm-0"
              placeholder="Enter your password"
              v-model="$v.form.password.$model"
              :state="validateState('password')"
              aria-describedby="input-2-live-feedback"
            ></b-input>
            <b-form-invalid-feedback id="input-2-live-feedback">
              The password must contain at least 3 and maximum 20 chracters.
            </b-form-invalid-feedback>
          </b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col sm="4" offset="4">
            <b-button variant="primary" size="lg" @click="login"
              >Login</b-button
            >
          </b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col sm="4" offset="4">
            <p></p>
            <p>If you don't have account, press register.</p>
          </b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col sm="4" offset="4">
            <b-button variant="secondary" @click="signup">Register</b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Header from "@/components/Header";
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";

export default {
  name: "login",
  mixins: [validationMixin],
  components: {
    Header,
  },
  data() {
    return {
      msg: "",
      form: {
        username: null,
        password: null,
      },
    };
  },
  validations: {
    form: {
      username: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(20),
      },
      password: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(20),
      },
    },
  },
  methods: {
    ...mapActions(["login_user"]),

    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },

    login: function () {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      try {
        const credentials = JSON.stringify({
          username: this.form.username,
          password: this.form.password,
        });
        this.login_user(credentials);
      } catch (error) {
        this.msg = "Oops error! Please try again.";
      }
    },

    signup: function () {
      this.$router.push("/sign-up");
    },
  },
};
</script>
