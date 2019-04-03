<template>
  <div>
    <div class="position-relative">
      <!-- shape Hero -->
      <section class="section-shaped my-0">
        <div class="shape shape-style-1 shape-default shape-skew">
        </div>
        <div style="padding-top: 15rem; padding-bottom: 10rem;" class="container shape-container d-flex"></div>
      </section>
    </div>
    <section class="section section-lg section-vacancy">
      <div class="container">
        <card shadow class="card-profile">
          <div v-if="vacancy == null || vacancy.id == null" class="loading">
            <img v-lazy="'img/images/loading.gif'" class="rounded-circle img-center img-fluid shadow shadow-lg--hover">
          </div>
          <div v-else class="row row-grid align-items-center">
            <div class="col-md-3">
              <div class="card bg-default shadow border-0">
                <img v-if="user && user.path_image" v-lazy="`${user.path_image}`" class="card-img-top">
                <img v-else v-lazy="'img/theme/img-1-1200x1000.jpg'" class="card-img-top">
                <blockquote class="card-blockquote">
                  <svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 583 95" class="svg-bg">
                    <polygon points="0,52 583,95 0,95" class="fill-default"></polygon>
                    <polygon points="0,42 583,95 683,0 0,95" opacity=".2" class="fill-default"></polygon>
                  </svg>
                  <h4 class="display-3 font-weight-bold text-white">{{ user ? user.name : '' }}</h4>
                  <p class="text-italic text-white">{{ user && user.description ? user.description : 'Sem descrição sobre o divulgador da vaga!' }}</p>
                  <base-button tag="button" type="white" block size="sm" v-on:click="viewProfile(user.id)">
                    Perfil
                  </base-button>
                </blockquote>
              </div>
            </div>
            <div class="col-md-9">
              <div class="pl-md-5">
                <h3>{{ vacancy.title }}</h3>
                <p class="lead">
                  {{ vacancy.description }}
                </p>
                <div class="mb-3">
                  <b>{{ vacancy.remote ? 'Vaga remota' : 'Vaga presencial' }}</b>
                </div>
                <base-button v-if="vacancy.type_hiring" size="sm" type="primary" class="btn-tooltip">
                  {{ vacancy.type_hiring }}
                </base-button>
                <base-button v-if="vacancy.level_experience" size="sm" type="primary" class="btn-tooltip">
                  {{ vacancy.level_experience }}
                </base-button>
                <base-button v-if="vacancy.avg_salary" size="sm" type="primary" class="btn-tooltip">
                  R$ {{ vacancy.avg_salary.toLocaleString('pt-BR') }}
                </base-button>
                <base-button v-if="vacancy.visits" size="sm" type="default" class="btn-tooltip">
                  {{ vacancy.visits }} visualizações
                </base-button>
                <div class="row vacancy-footer">
                  <div class="col-md-6">
                    <a class="font-weight-bold text-warning mt-5">
                      Disponível até o dia {{ vacancy.end_date | moment("DD/MM/YYYY") }}
                    </a>
                  </div>
                  <div class="col-md-6">
                    <div class="text-right">
                      <base-button v-if="vacancy && vacancy.path_image" tag="button"
                          type="white" class="mb-3" size="sm" @click="modal1 = true">
                        Ver imagem descritiva anexada
                      </base-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </card>
      </div>
    </section>
    <modal :show.sync="modal1" modal-classes="modal-lg">
      <h6 slot="header" class="modal-title" id="modal-title-default">
        Imagem descritiva da vaga
      </h6>
      <img v-lazy="`${vacancy.path_image}`" class="card-img-top">
      <template slot="footer">
        <base-button type="link" class="ml-auto" @click="modal1 = false">
          Fechar
        </base-button>
      </template>
    </modal>
  </div>
</template>

<script>
import Modal from "../components/Modal";
import axios from "axios";
import { BASE_URL, GET_VACANCY } from "../constants/api";
export default {
  name: "vacancy",
  components: {
    Modal
  },
  data() {
    return {
      modal1: false,
      loading: false,
      vacancy: {},
      user: {},
      BASE_URL
    };
  },
  created() {
    this.loading = true;
    axios
      .get(`${BASE_URL}${GET_VACANCY}${this.$route.params.id}`)
      .then(res => {
        this.loading = false;
        this.vacancy = res.data;
        this.user = res.data.user;
      })
      .catch(err => {
        console.log(err.response);
      });
  },
  methods: {
    viewProfile: function(id) {
      this.$router.push({ path: `/profile/${id}` });
    }
  }
};
</script>

<style scoped>
.section-vacancy {
  margin-top: -20rem;
  margin-bottom: -3rem;
}
.vacancy-footer {
  margin-top: 1rem;
  margin-bottom: -5rem;
}
</style>
