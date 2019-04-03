<template>
  <div class="profile-page">
    <section class="section-profile-cover section-shaped my-0">
      <div class="shape shape-style-1 shape-primary shape-skew alpha-4">
      </div>
    </section>
    <section class="section section-skew">
      <div class="container">
        <card shadow class="card-profile mt--300" no-body>
          <div class="px-4">
            <div class="row justify-content-center">
              <div class="col-lg-3 order-lg-2">
                <div class="card-profile-image">
                  <a href="#">
                    <img v-if="user && user.path_image" v-lazy="`${user.path_image}`" class="rounded-circle">
                    <img v-else v-lazy="'img/theme/team-4-800x800.jpg'" class="rounded-circle">
                  </a>
                </div>
              </div>
              <div class="col-lg-4 order-lg-3 text-lg-right align-self-lg-center">
                <div class="card-profile-actions py-4 mt-lg-0">
                  <base-button type="info" size="sm" class="mr-4">{{ user.site ? user.site : 'Nenhum site cadastrado' }}</base-button>
                </div>
              </div>
              <div class="col-lg-4 order-lg-1">
                <div class="card-profile-stats d-flex justify-content-center">
                  <div>
                    <span class="heading">{{ user.total_vacancies }}</span>
                    <span class="description">Vagas</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center mt-5">
              <h3>
                {{ user.name }} {{ user.last_name }}
              </h3>
              <div class="h6 font-weight-300"><i class="ni location_pin mr-2"></i>{{ user.address ? user.address.city : '' }}, CE — Brasil</div>
              <div class="h6 mt-4"><i class="ni business_briefcase-24 mr-2"></i>{{ user.is_company ? user.site : '' }}</div>
              <div><i class="ni education_hat mr-2"></i>{{ user.is_company ? user.email : '' }}</div>
            </div>
            <div v-if="user.description" class="mt-5 py-5 border-top text-center">
              <div class="row justify-content-center">
                <div class="col-lg-9">
                  <p>{{ user.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </card>
      </div>
    </section>
  </div>
</template>
<script>
import axios from "axios";
import { BASE_URL } from "../constants/api";
export default {
  name: "profile",
  data() {
    return {
      user: {},
      BASE_URL
    };
  },
  created() {
    this.loading = true;
    axios
      .get(`${BASE_URL}user/${this.$route.params.id}`)
      .then(res => {
        this.loading = false;
        this.user = res.data;
      })
      .catch(err => {
        console.log(err.response);
      });
  }
};
</script>
<style>
.rounded-circle {
  width: 190px !important;
  height: 180px !important;
}
</style>
