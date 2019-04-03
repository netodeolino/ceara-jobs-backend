<template>
  <header class="header-global">
    <base-nav class="navbar-main" transparent type="" effect="light" expand>
      <a slot="brand" class="navbar-brand mr-lg-5" href="/#/">
        <img src="img/brand/logo-branca.png">
      </a>

      <div class="row" slot="content-header" slot-scope="{closeMenu}">
        <div class="col-6 collapse-brand">
          <a href="/#/">
            <img src="img/brand/logo-iic.png">
          </a>
        </div>
        <div class="col-6 collapse-close">
          <close-button @click="closeMenu"></close-button>
        </div>
      </div>

      <ul class="navbar-nav navbar-nav-hover align-items-lg-center ml-lg-auto">
        <base-dropdown tag="li" class="nav-item">
          <a slot="title" href="#" class="nav-link" data-toggle="dropdown" role="button">
            <i class="ni ni-collection d-lg-none"></i>
            <span v-if="!loggedIn"><router-link to="/login" class="btn btn-outline-default btn-sm">Entrar</router-link></span>
            <span v-if="loggedIn && pathImage">
              <img v-lazy="`${BASE_URL}uploads/${pathImage}`" class="user-image rounded-circle img-center img-fluid shadow shadow-lg--hover">
            </span>
          </a>
          <router-link v-if="loggedIn" :to="{ name: 'profile', params: { id: userId } }" class="dropdown-item">Ver Perfil</router-link>
          <router-link v-if="!loggedIn" to="/register" class="dropdown-item">Cadastre-se</router-link>
          <router-link v-if="loggedIn" to="/register-vacancy" class="dropdown-item">Registre uma Vaga</router-link>
          <span v-if="loggedIn" v-on:click="logout()" class="dropdown-item pointer">Sair</span>
        </base-dropdown>
      </ul>
    </base-nav>
  </header>
</template>
<script>
import { BASE_URL } from "../constants/api";
import BaseNav from "@/components/BaseNav";
import BaseDropdown from "@/components/BaseDropdown";
import CloseButton from "@/components/CloseButton";

export default {
  components: {
    BaseNav,
    CloseButton,
    BaseDropdown
  },
  data() {
    return {
      pathImage: null,
      userId: null,
      BASE_URL
    };
  },
  methods: {
    logout() {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("setPathImage");
      window.localStorage.removeItem("setUserId");
      this.$store.commit("setToken", null);
      this.$store.commit("setPathImage", null);
      this.$store.commit("setUserId", null);
    }
  },
  computed: {
    loggedIn() {
      if (this.$store.getters.isLogged) {
        // eslint-disable-next-line
        this.pathImage = this.$store.getters.getPathImage;
        // eslint-disable-next-line
        this.userId = this.$store.getters.getUserId;
        return true;
      }
      return false;
    }
  }
};
</script>
<style>
.user-image {
  width: 50px !important;
  height: 50px !important;
}
</style>
