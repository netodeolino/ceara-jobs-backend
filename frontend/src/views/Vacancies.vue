<template>
  <div>
    <div class="position-relative">
      <!-- shape Hero -->
      <section class="section-shaped my-0">
        <div class="shape shape-style-1 shape-default shape-skew">
        </div>
        <div style="padding-top: 15rem; padding-bottom: 15rem;" class="container shape-container d-flex">
          <div class="col px-0">
            <div class="row">
              <div class="col-lg-7">
                <h1 class="display-3 text-white">
                  As vagas que você tanto sonhou
                  <span>Em um só lugar
                  <i class="fa fa-heart"></i>
                  </span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <section class="section section-lg pt-0">
      <div v-if="vacancies == null || vacancies.length == 0" class="loading">
        <img v-lazy="'img/images/loading.gif'" class="rounded-circle img-center img-fluid shadow shadow-lg--hover">
      </div>
      <div v-else class="container cont-card">
        <card gradient="primary" no-body shadow-size="lg" class="border-0"
          v-bind:key="vac.id" v-for="vac in vacancies">
          <div class="p-5">
            <div class="row align-items-center">
              <div class="col-lg-9">
                <h3 class="text-white">{{ vac.title }}</h3>
                <p class="lead text-white mt-3">
                  {{ vac.description }}
                </p>
              </div>
              <div class="col-lg-3 ml-lg-auto">
                <img v-if="vac && vac.path_image" v-lazy="`${vac.path_image}`"
                  class="rounded-circle img-center img-fluid shadow shadow-lg--hover" style="margin-bottom: 10px;">
                <img v-else v-lazy="'img/theme/img-1-1200x1000.jpg'" style="margin-bottom: 10px;"
                  class="rounded-circle img-center img-fluid shadow shadow-lg--hover">
                <base-button tag="button" type="white" block size="lg" v-on:click="openVacancy(vac.id)">
                  Ver vaga
                </base-button>
              </div>
            </div>
          </div>
        </card>
        <base-pagination align="end" :total="totalPagination" v-on:input="pageIndex" :value="pageValue">
        </base-pagination>
      </div>
    </section>
  </div>
</template>

<script>
import BasePagination from "../components/BasePagination";
import axios from "axios";
import { BASE_URL, GET_VACANCY_LIST } from "../constants/api";
export default {
  name: "vacancies",
  components: {
    BasePagination
  },
  data() {
    return {
      loading: false,
      vacancies: [],
      totalVacancies: 0,
      paginateIndex: 1,
      BASE_URL
    };
  },
  created() {
    this.getCount();
    this.getVacancies();
  },
  methods: {
    getVacancies: function() {
      this.loading = true;
      axios
        .get(`${BASE_URL}${GET_VACANCY_LIST}${this.paginateIndex}`)
        .then(res => {
          this.loading = false;
          this.vacancies = res.data;
        })
        .catch(err => {
          console.log(err.response);
        });
    },
    getCount: function() {
      this.loading = true;
      axios
        .get(`${BASE_URL}listlength`)
        .then(res => {
          this.loading = false;
          this.totalVacancies = res.data;
        })
        .catch(err => {
          console.log(err.response);
        });
    },
    openVacancy: function(id) {
      this.$router.push({ path: `/vacancy/${id}` });
    },
    pageIndex: function(event) {
      this.paginateIndex = event;
      this.getVacancies();
    }
  },
  computed: {
    totalPagination() {
      return this.totalVacancies;
    },
    pageValue: function() {
      return this.paginateIndex;
    }
  }
};
</script>

<style scoped>
.card {
  margin-bottom: 15px;
}
.cont-card {
  margin-top: -10rem;
  margin-bottom: -2rem;
}
.rounded-circle {
  width: 145px !important;
  height: 140px !important;
}
.loading {
  margin-bottom: 5rem;
}
</style>
