<template>
  <section class="section section-shaped section-lg my-0">
    <div class="shape shape-style-1 bg-gradient-default">
    </div>
    <div class="container pt-lg-md">
      <div class="row justify-content-center">
        <div class="col-lg-7">
          <card type="secondary" shadow header-classes="bg-white pb-6" body-classes="px-lg-6 py-lg-6" class="border-0">
            <template>
              <form role="form" @submit.prevent="onSubmit()">
                <base-input alternative class="mb-3" placeholder="Título da vaga" addon-left-icon="fa fa-pencil-square-o" required
                  v-model="vacancy.title" :valid="$v.vacancy.title.required && $v.vacancy.title.minLength" :error="errorTitle" v-on:blur="dirtyTitle">
                </base-input>
                <base-input alternative class="mb-3" placeholder="Email para contato" addon-left-icon="fa fa-envelope-o"
                  required v-model="vacancy.email" :valid="$v.vacancy.email.email && $v.vacancy.email.required" :error="errorEmail" v-on:blur="dirtyEmail">
                </base-input>
                <base-input alternative class="mb-3" placeholder="Média salárial" addon-left-icon="ni ni-money-coins" :description="!vacancy.avg_salary && 'O campo vazio implica que o salário será negociado.'"
                  v-model="vacancy.avg_salary">
                </base-input>
                <base-textarea alternative class="mb-3" rows="3" addon-left-icon="fa fa-info-circle"
                  placeholder="Descrição sobre a vaga" v-model="vacancy.description" :valid="$v.vacancy.description.required" :error="errorDescription" v-on:blur="dirtyDescription"/>
                <base-selector v-model="vacancy.type_hiring" :options="typesHiring" placeholder="Modalidade de contratação" alternative class="my-3" addon-left-icon="fa fa-handshake-o" :error="errorTypeHiring" :valid="$v.vacancy.type_hiring.required"/>
                <base-selector v-model="vacancy.level_experience" :options="levelsExperience" placeholder="Experiência" alternative class="my-3" addon-left-icon="fa fa-circle-o-notch" :error="errorLevelExperience" :valid="$v.vacancy.level_experience.required"/>
                <base-selector v-model="vacancy.address.city" :options="cities" placeholder="Cidade" alternative class="my-3" addon-left-icon="fa fa-building-o" :error="errorCity" :valid="$v.vacancy.address.city.required"/>
                <base-input alternative class="mb-3" placeholder="Endereço" addon-left-icon="fa fa-home" required
                  v-model="vacancy.address.street" :error="errorStreet"
                  :valid="$v.vacancy.address.street.required" v-on:blur="dirtyStreet">
                </base-input>
                <file-select v-model="image" title="foto da vaga"></file-select>
                <base-checkbox required v-model="vacancy.remote">
                  <span>Vaga remota ou Home office?</span>
                </base-checkbox>
                <div class="text-center">
                  <button class="btn btn-primary my-4" type="submit">Cadastrar vaga</button>
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
import { cities } from "../assets/json/states.json";
import { typesHiring } from "../assets/json/type-hiring.json";
import { required, minLength, email } from "vuelidate/lib/validators";
import { levelsExperience } from "../assets/json/level-experience.json";
import { BASE_URL, REGISTER_VACANCY_URL } from "../constants/api";

export default {
  name: "registerVacancy",
  components: {},
  data() {
    return {
      cities,
      image: null,
      typesHiring,
      vacancy: {
        address: {}
      },
      loading: false,
      levelsExperience
    };
  },
  methods: {
    dirtyTitle() {
      this.$v.vacancy.title.$touch();
    },
    dirtyEmail() {
      this.$v.vacancy.email.$touch();
    },
    dirtyDescription() {
      this.$v.vacancy.description.$touch();
    },
    dirtyStreet() {
      this.$v.vacancy.address.street.$touch();
    },
    dirtyTypeHiring() {
      this.$v.vacancy.type_hiring.$touch();
    },
    dirtyLevelExperience() {
      this.$v.vacancy.level_experience.$touch();
    },
    dirtyCity() {
      this.$v.vacancy.address.city.$touch();
    },
    onSubmit() {
      this.loading = true;
      if (window.localStorage.getItem("token") != null && this.validForm()) {
        const token = window.localStorage.getItem("token");
        let formData = new FormData();
        formData.append("image", this.image);
        formData.append("data", JSON.stringify(this.vacancy));
        axios
          .post(`${BASE_URL}${REGISTER_VACANCY_URL}`, formData, {
            headers: {
              // eslint-disable-next-line
              "Authorization": `bearer ${token}`,
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
            this.$router.push({ path: "/" });
          })
          .catch(() => {
            this.$notify({
              group: "not-cea-job",
              title: "Erro!",
              text: "Infelizmente algum erro inesperado ocorreu :(",
              position: "top right",
              type: "error"
            });
          });
      } else {
        this.$notify({
          group: "not-cea-job",
          title: "Aviso!",
          // eslint-disable-next-line
          text:
            "Você deve estar logado para poder cadastrar uma vaga e preencher os campos obrigatórios!",
          position: "top right",
          type: "warn"
        });
      }
    },
    validForm() {
      this.dirtyTitle();
      this.dirtyEmail();
      this.dirtyDescription();
      this.dirtyStreet();
      this.dirtyTypeHiring();
      this.dirtyLevelExperience();
      this.dirtyCity();
      return !this.$v.$invalid;
    }
  },
  computed: {
    errorTitle() {
      if (this.$v.vacancy.title.$dirty) {
        if (!this.$v.vacancy.title.required) {
          return "Campo obrigatório.";
        }
        if (!this.$v.vacancy.title.minLength) {
          // eslint-disable-next-line
          return `Deve conter ao menos ${
            this.$v.vacancy.title.$params.minLength.min
          } letras.`;
        }
      }
      return null;
    },
    errorDescription() {
      // eslint-disable-next-line
      if (this.$v.vacancy.description.$dirty && !this.$v.vacancy.description.required)
        return "Campo obrigatório.";
    },
    errorEmail() {
      if (this.$v.vacancy.email.$dirty) {
        if (!this.$v.vacancy.email.required) {
          return "Campo obrigatório.";
        }
        if (!this.$v.vacancy.email.email) {
          return "Email inválido.";
        }
      }
      return null;
    },
    errorStreet() {
      if (
        !this.$v.vacancy.address.street.required &&
        this.$v.vacancy.address.street.$dirty
      ) {
        return "Campo obrigatório.";
      }
      return null;
    },
    errorTypeHiring() {
      if (
        !this.$v.vacancy.type_hiring.required &&
        !this.$v.vacancy.type_hiring.$model &&
        this.$v.vacancy.type_hiring.$dirty
      )
        return "Campo obrigatório.";
    },
    errorCity() {
      if (
        !this.$v.vacancy.address.city.required &&
        !this.$v.vacancy.address.city.$model &&
        this.$v.vacancy.address.city.$dirty
      )
        return "Campo obrigatório.";
    },
    errorLevelExperience() {
      if (
        !this.$v.vacancy.level_experience.required &&
        !this.$v.vacancy.level_experience.$model &&
        this.$v.vacancy.level_experience.$dirty
      )
        return "Campo obrigatório.";
    }
  },
  validations: {
    vacancy: {
      title: {
        required,
        minLength: minLength(5)
      },
      description: {
        required
      },
      email: {
        required,
        email
      },
      type_hiring: {
        required
      },
      level_experience: {
        required
      },
      address: {
        city: {
          required
        },
        street: {
          required
        }
      }
    }
  }
};
</script>
<style>
.form-control-file {
  margin-top: 15px;
  margin-bottom: 10px;
}
</style>
