<template>
  <form @submit.prevent="submit">
    <input
      v-model="value"
      type="text"
      :placeholder="placeholder"
    >
    <button
      type="submit"
    >
      {{ button }}
    </button>
    <section class='alerts'>
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
  <!-- <h3>testing</h3> -->
</template>

<script>
export default {
  name: 'AddUserForm',
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    button: {
      type: String,
      default: 'Submit'
    },
    profileHandle: {
      type: String,
      default: ''
    }
  },
  // mounted() { // automatically loads profiles into the component when user visits page
  //   this.addUserToGroup();
  // },
  data() {
    return {value: '', alerts: {}};
  },
  methods: {
    async submit() {
      const params = {
        method: 'PUT',
        message: 'Successfully added user to group.',
        // body: JSON.stringify(this.value),
        body: JSON.stringify({added_user: this.value, username: this.profileHandle}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * sends request to profile endpoint 
       */
        const options = {
          method: params.method, headers: {'Content-Type': 'application/json'}
        };
        if (params.body) {
          options.body = params.body;
        }
        try {
          const r = await fetch(`/api/profiles?username=${this.profileHandle}`, options);
          // const r = await fetch('/api/profiles', {method: 'PUT', body: JSON.stringify(params.body), headers: {'Content-Type': 'application/json'}})
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }
  
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000)
        }
    }
  }
  };
</script>

<style scoped>
form {
    display: flex;
    position: relative;
    color: blue
}

input {
    padding: 0 5px;
    min-width: 200px;
    margin-top: 1%
}

button {
  border: 0px;
  background: rgb(0, 119, 255);
  padding: 0.5%;
  margin-top: 1%;
  margin-right: 5%;
  color:white
}
button:hover{
  color:yellow;
}

</style>
