<template>
  <section class="section section-shaped section-lg my-0">
    <div class="shape shape-style-1 bg-gradient-default">
    </div>
    <div class="container pt-lg-md">
      <div class="row justify-content-center">
        <div class="col-lg-6">
          <card type="secondary" shadow header-classes="bg-white pb-6" body-classes="px-lg-6 py-lg-6" class="border-0">
            <template>
              <form role="form" @submit.prevent="onSubmit()">
                Você é ou representa uma empresa?
                <div class="custom-control custom-radio mt-3">
                  <input class="custom-control-input" type="radio" id="radio1" v-bind:value="true" v-model="user.is_company">
                  <label class="custom-control-label" for="radio1">Sim</label>
                </div>
                <div class="custom-control custom-radio mb-3">
                  <input class="custom-control-input" type="radio" id="radio2" v-bind:value="false" v-model="user.is_company">
                  <label class="custom-control-label" for="radio2">Não</label>
                </div>
                <base-input alternative class="mb-3" placeholder="Nome" addon-left-icon="fa fa-user-circle-o"
                  required v-model="user.name" :valid="$v.user.name.required && $v.user.name.minLength" :error="errorName" v-on:blur="dirtyName">
                </base-input>
                <base-input v-if="!user.is_company" alternative class="mb-3" placeholder="Sobrenome" addon-left-icon="fa fa-user-circle-o"
                  required v-model="user.last_name" :valid="$v.user.last_name.minLength && $v.user.last_name.required" :error="errorLastName" v-on:blur="dirtyLastName">
                </base-input>
                <base-input v-if="user.is_company" alternative class="mb-3" placeholder="Site" addon-left-icon="fa fa-internet-explorer"
                  required v-model="user.site">
                </base-input>
                <base-input alternative class="mb-3" placeholder="Email" addon-left-icon="fa fa-envelope-o"
                  required v-model="user.email" :valid="$v.user.email.required && $v.user.email.email && $v.user.email.emailExist" :error="errorEmail" v-on:blur="dirtyEmail">
                </base-input>
                <base-textarea alternative class="mb-3" rows="3" addon-left-icon="fa fa-info-circle"
                  placeholder="Descrição sobre você ou sobre a empresa" v-model="user.description"/>
                <base-input alternative type="password" placeholder="Senha" addon-left-icon="fa fa-unlock-alt"
                  required v-model="user.password" :valid="$v.user.password.required && $v.user.password.minLength" :error="errorPassword" v-on:blur="dirtyPassword">
                </base-input>
                <base-input alternative type="password" placeholder="Confirmar Senha" addon-left-icon="fa fa-unlock-alt"
                  v-model="conf_password" :valid="$v.conf_password.$model == $v.user.password.$model" :error="errorConfPassword" v-on:blur="dirtyConfPassword">
                </base-input>
                <base-selector v-model="user.address.city" :options="cities" placeholder="Cidade" alternative class="my-3" addon-left-icon="fa fa-building-o" :error="errorCity" :valid="$v.user.address.city.required"/>
                <file-select v-model="image" title="foto de perfil"></file-select>
                <base-checkbox required v-model="terms">
                  <span>Eu concordo com os <a href="#">Termos de Política</a></span>
                </base-checkbox>
                <div class="text-center">
                  <button class="btn btn-primary my-4" type="submit">Criar uma conta</button>
                </div>
              </form>
            </template>
          </card>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import axios from "axios";
import { cities } from "../../assets/json/states.json";
import { required, minLength, email } from "vuelidate/lib/validators";
import { BASE_URL, REGISTER_URL } from "../../constants/api";

const emailExist = async email => {
  const resp = await axios.post(`${BASE_URL}available-email`, { email });
  return resp.data;
};

export default {
  name: "register",
  components: {},
  data() {
    return {
      cities,
      user: {
        is_company: false,
        address: {}
      },
      conf_password: "",
      image: null,
      terms: false,
      loading: false
    };
  },
  methods: {
    dirtyName() {
      this.$v.user.name.$touch();
    },
    dirtyLastName() {
      this.$v.user.last_name.$touch();
    },
    dirtyEmail() {
      this.$v.user.email.$touch();
    },
    dirtyPassword() {
      this.$v.user.password.$touch();
    },
    dirtyConfPassword() {
      this.$v.conf_password.$touch();
    },
    dirtyCity() {
      this.$v.user.address.city.$touch();
    },
    onSubmit() {
      this.loading = true;
      if (this.terms && this.validForm()) {
        let formData = new FormData();
        formData.append("image", this.image);
        formData.append("data", JSON.stringify(this.user));

        axios
          .post(`${BASE_URL}${REGISTER_URL}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(() => {
            this.loading = false;
            this.$notify({
              group: "not-cea-job",
              title: "Sucesso!",
              text: "Cadastro realizado com sucesso!",
              position: "top right",
              type: "success"
            });
            this.$router.push({ path: "/login" });
          })
          .catch(() => {
            this.loading = false;
            this.$notify({
              group: "not-cea-job",
              title: "Erro!",
              text: "Infelizmente algum erro inesperado ocorreu :(",
              position: "top right",
              type: "error"
            });
          });
      } else if (!this.terms) {
        this.$notify({
          group: "not-cea-job",
          title: "Aviso!",
          text: "Para prosseguir, aceite os Termos de Política!",
          position: "top right",
          type: "warn"
        });
      }
    },
    validForm() {
      this.dirtyName();
      this.dirtyLastName();
      this.dirtyEmail();
      this.dirtyPassword();
      this.dirtyCity();
      this.dirtyConfPassword();
      return !this.$v.$invalid;
    }
  },
  computed: {
    errorName() {
      if (this.$v.user.name.$dirty) {
        if (!this.$v.user.name.required && !this.$v.user.name.minLength) {
          return null;
        }
        if (!this.$v.user.name.required) {
          return "Campo obrigatório.";
        }
        if (!this.$v.user.name.minLength) {
          // eslint-disable-next-line
          return `Deve conter ao menos ${
            this.$v.user.name.$params.minLength.min
          } caracteres.`;
        }
      }
      return null;
    },
    errorLastName() {
      if (this.$v.user.last_name.$dirty) {
        if (!this.$v.user.last_name.required) {
          return "Campo obrigatório.";
        }
        if (!this.$v.user.last_name.minLength) {
          // eslint-disable-next-line
          return `Deve conter ao menos ${
            this.$v.user.last_name.$params.minLength.min
          } caracteres.`;
        }
      }
      return null;
    },
    errorEmail() {
      if (this.$v.user.email.$dirty) {
        if (!this.$v.user.email.required) {
          return "Campo obrigatório.";
        }
        if (!this.$v.user.email.email) {
          return "Formato de email inválido.";
        }
        if (!this.$v.user.email.emailExist)
          return "Este email já está cadastrado.";
      }
      return null;
    },
    errorPassword() {
      if (this.$v.user.password.$dirty) {
        if (!this.$v.user.password.required) {
          return "Campo obrigatório.";
        }
        if (!this.$v.user.password.minLength) {
          return `Campo 'Senha' deve conter no mínimo ${
            this.$v.user.password.$params.minLength.min
          } caracteres.`;
        }
      }
      return null;
    },
    errorConfPassword() {
      // eslint-disable-next-line
      if (this.$v.conf_password.$dirty && (this.$v.conf_password.$model != this.$v.user.password.$model))
        return "As senhas não conferem.";
    },
    errorCity() {
      // eslint-disable-next-line
      if (
        !this.$v.user.address.city.required &&
        !this.$v.user.address.city.$model &&
        this.$v.user.address.city.$dirty
      ) {
        return "Campo obrigatório.";
      }
    }
  },
  validations: {
    conf_password: {
      required
    },
    user: {
      name: {
        required,
        minLength: minLength(2)
      },
      last_name: {
        required,
        minLength: minLength(3)
      },
      email: {
        required,
        email,
        emailExist
      },
      password: {
        required,
        minLength: minLength(6)
      },
      address: {
        city: {
          required
        }
      }
    }
  }
};
</script>
<style scoped>
.button.btn.dropdown-toggle.btn-default {
  padding: 1.25rem !important;
}
</style>
