<template>
  <label class="form-group">
      <div class="btn btn-info my-4">
        <span>{{title}}</span>
      </div>
      <span class="file-name" v-if="value">{{value.name}}</span>
    <input type="file" @change="handleFileChange"/>
  </label>
</template>
<script>
export default {
  name: "file-select",
  props: {
    // Using value here allows us to be v-model compatible.
    value: File,
    title: {
      type: String,
      default: "imagem"
    }
  },

  methods: {
    handleFileChange(e) {
      // Whenever the file changes, emit the 'input' event with the file data.
      this.$emit("input", e.target.files[0]);
    }
  }
};
</script>

<style>
.file-name {
  font-size: 16px;
  text-align: end;
  align-self: flex-end;
  margin-left: 20px;
  justify-content: flex-end;
}

/* Don't forget to hide the original file input! */
.form-group > input[type="file"] {
  display: none;
}
</style>
