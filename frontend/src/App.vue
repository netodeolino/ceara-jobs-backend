<template>
    <div id="app">
        <notifications group="not-cea-job" />
        <router-view name="header"></router-view>
        <main>
            <fade-transition origin="center" mode="out-in" :duration="250">
                <router-view/>
            </fade-transition>
        </main>
        <router-view name="footer"></router-view>
    </div>
</template>
<script>
import { FadeTransition } from "vue2-transitions";

export default {
  components: {
    FadeTransition
  }
};
</script>
<style>
.form-control-file {
  margin-top: 15px;
  margin-bottom: 10px;
}
.select {
  margin-top: 15px;
}
.dropdown-toggle {
  margin-top: -0.8rem !important;
  border: 0px !important;
  height: 30px;
}
.vs__actions {
  margin-top: 1rem !important;
}
.open-indicator {
  margin-top: 0.6rem !important;
}
.dropdown-toggle::after {
  border: 0px !important;
}
.pointer {
  cursor: pointer;
}
</style>
