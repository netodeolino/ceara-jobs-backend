<template>
  <section class="section section-shaped section-lg my-0">
    <div class="shape shape-style-1 bg-gradient-default">
    </div>
    <div class="container pt-lg-md">
      <div class="row justify-content-center">
        <div class="col-lg-5">
          <card type="secondary" shadow
              header-classes="bg-white pb-5"
              body-classes="px-lg-5 py-lg-5"
              class="border-0">
            <template>
              <div class="text-center text-muted mb-4">
                <small>Digite seu email e sua senha</small>
              </div>
              <form role="form" @submit.prevent="onSubmit()">
                <base-input id="email-input" alternative class="mb-3" placeholder="Email" addon-left-icon="fa fa-envelope-o" required v-model="email"
                  :valid="$v.email.required && $v.email.email" :error="errorEmail" v-on:blur="dirtyEmail">
                </base-input>
                <base-input id="password-input" alternative type="password" placeholder="Senha" addon-left-icon="fa fa-unlock-alt" required v-model="password"
                  :valid="$v.password.required && $v.password.minLength" :error="errorPassword" v-on:blur="dirtyPassword">
                </base-input>
                <div class="text-center">
                  <button class="btn btn-primary my-4" type="submit">Entrar</button>
                </div>
              </form>
            </template>
          </card>
          <div class="row mt-3">
            <div class="col-6">
              <a href="#" class="text-light">
                <small>Esqueceu sua senha?</small>
              </a>
            </div>
            <div class="col-6 text-right">
              <router-link to="/register" class="text-light">Criar uma nova conta</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import axios from "axios";
import { required, minLength, email } from "vuelidate/lib/validators";
import { BASE_URL, LOGIN_URL } from "../../constants/api";

export default {
  name: "login",
  components: {},
  data() {
    return {
      email: "",
      password: "",
      loading: false
    };
  },
  methods: {
    dirtyEmail() {
      this.$v.email.$touch();
    },
    dirtyPassword() {
      this.$v.password.$touch();
    },
    onSubmit() {
      this.loading = true;
      if (!this.validForm()) return;
      axios
        .post(`${BASE_URL}${LOGIN_URL}`, {
          email: this.email,
          password: this.password
        })
        .then(res => {
          this.loading = false;
          window.localStorage.setItem("token", res.data.token);
          window.localStorage.setItem("setPathImage", res.data.path_image);
          window.localStorage.setItem("setUserId", res.data.user_id);
          this.$store.commit("setToken", res.data.token);
          this.$store.commit("setPathImage", res.data.path_image);
          this.$store.commit("setUserId", res.data.user_id);
          this.$notify({
            group: "not-cea-job",
            title: "Sucesso!",
            text: "Login realizado com sucesso!",
            position: "top right",
            type: "success"
          });
          this.$router.push({ path: "/" });
        })
        .catch(err => {
          console.log(err.response);
          this.loading = false;
          this.$notify({
            group: "not-cea-job",
            title: "Erro!",
            text: `${err.response.data.message}`,
            position: "top right",
            type: "error"
          });
        });
    },
    validForm() {
      this.dirtyPassword();
      this.dirtyEmail();
      if (this.$v.$invalid) return false;
      return true;
    }
  },
  computed: {
    errorEmail() {
      if (!this.$v.email.required && this.$v.email.$dirty) {
        return "Campo obrigatório.";
      }
      if (!this.$v.email.email && this.$v.email.$dirty) {
        return "Formato de email inválido.";
      }
      return null;
    },
    errorPassword() {
      if (!this.$v.password.required && this.$v.password.$dirty) {
        return "Campo obrigatório.";
      }
      if (!this.$v.password.minLength && this.$v.password.$dirty) {
        return `Deve conter no mínimo ${
          this.$v.password.$params.minLength.min
        } caracteres.`;
      }
      return null;
    }
  },
  validations: {
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(6)
    }
  }
};
</script>
<style>
</style>
