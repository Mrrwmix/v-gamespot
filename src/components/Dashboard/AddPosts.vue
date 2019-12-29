<template>
  <div class="dashboard_form">
    <h1>Add posts</h1>
    <form @submit.prevent="submitHandler">
      <div class="input_field" :class="{ invalid: $v.formdata.title.$error }">
        <label>Title</label>
        <input
          type="text"
          v-model="formdata.title"
          @blur="$v.formdata.title.$touch()"
        />
        <p class="error_label" v-if="$v.formdata.title.$error">
          This input is required
        </p>
      </div>

      <div class="input_field" :class="{ invalid: $v.formdata.desc.$error }">
        <label>Description</label>
        <input
          type="text"
          v-model="formdata.desc"
          @blur="$v.formdata.desc.$touch()"
        />
        <p class="error_label" v-if="$v.formdata.desc.$error">
          This input is required
        </p>
        <p class="error_label" v-if="!$v.formdata.desc.maxLength">
          Must not be greater than
          {{ $v.formdata.desc.$params.maxLength.max }} characters
        </p>
      </div>

      <div class="input_field">
        <wysiwyg v-model="formdata.content" />
      </div>

      <div class="input_field" :class="{ invalid: $v.formdata.rating.$error }">
        <label>Rating</label>
        <select v-model="formdata.rating" @blur="$v.formdata.rating.$touch()">
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </select>
        <p class="error_label" v-if="$v.formdata.rating.$error">
          You need to select a rating
        </p>
      </div>

      <button type="submit">Add post</button>
    </form>

    <md-dialog :md-active="dialog">
      <p>Your post has no content. Are you sure that you want to post this?</p>
      <md-dialog-actions>
        <md-button class="md-primary" @click="dialogOnCancel"
          >No, I'll add content.</md-button
        >
        <md-button class="md-primary" @click="dialogOnConfirm"
          >Yes, I am sure.</md-button
        >
      </md-dialog-actions>
    </md-dialog>

    <div v-if="addpost" class="post_successful">
      Post successfully submitted!
    </div>
  </div>
</template>

<script>
import { required, maxLength } from 'vuelidate/lib/validators';

export default {
  data() {
    return {
      dialog: false,
      formdata: {
        title: '',
        desc: '',
        content: '',
        rating: ''
      }
    };
  },
  validations: {
    formdata: {
      title: {
        required
      },
      desc: {
        required,
        maxLength: maxLength(100)
      },
      rating: {
        required
      }
    }
  },
  methods: {
    submitHandler() {
      if (!this.$v.$invalid) {
        if (this.formdata.content === '') {
          this.dialog = true;
        } else {
          this.addPost();
        }
      } else {
        alert('Something is wrong');
      }
    },
    dialogOnCancel() {
      this.dialog = false;
    },
    dialogOnConfirm() {
      this.dialog = false;
      this.addPost();
    },
    addPost() {
      this.$store.dispatch('admin/addPost', this.formdata);
    },
    clearPost() {
      this.$v.$reset();
      this.formdata = {
        title: '',
        desc: '',
        content: '',
        rating: ''
      };
    }
  },
  computed: {
    addpost() {
      let status = this.$store.getters['admin/addPostStatus'];
      if (status) {
        this.clearPost();
      }

      return status;
    }
  }
};
</script>

<style scoped>
@import '~vue-wysiwyg/dist/vueWysiwyg.css';

.input_field.invalid input,
.input_field.invalid select {
  border: 1px solid red;
}
</style>
