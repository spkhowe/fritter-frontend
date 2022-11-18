<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <header>
      <h3>
      <a :href="`/#/profiles/${freet.profile}`">@{{ freet.profile }}</a>
      </h3>
      <h4>
          written by @{{ freet.author }}
      </h4> 

    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p
      v-else
      class="content"
    >
      {{ freet.content }}
    </p>
    <h4 class="info">
      Posted at {{ freet.dateModified }}
      <i v-if="freet.edited">(edited)</i>
    </h4>
          <div
        v-if="$store.state.username === freet.author"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deleteFreet">
          🗑️ Delete
        </button>
      </div>
    <button v-if="this.favorited === false" @click="addFavorite">
      + favorite
    </button>
    <button v-if="this.favorited === true" @click="removeFavorite">
      - favorite
    </button>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
export default {
  name: 'FreetComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  mounted () {
    this.checkFavorited();
  },
  data() { // data for this vue instance. invoked separately for each component instance. init w/ default values
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
      favorited: false
    };
  },
  methods: {

    addFavorite() {
        const params = {
            method: 'POST',
            url: `/api/favorites`,
            message: 'Successfully favorited freet', status: "success",
            body: JSON.stringify({freetId: this.freet._id}),
            callback: () => {
                this.$set(this.alerts, params.message, 'success');
                setTimeout(() => this.$delete(this.alerts, params.message), 3000);
            }
        };
        this.favorited = true;
        this.requestFav(params);
    },
    removeFavorite() {
        const params = {
            method: 'DELETE',
            url: `/api/favorites?freetId=${this.freet._id}`,
            message: 'Unfavorited freet', status: "success",
            body: JSON.stringify({freetId: this.freet._id}),
            callback: () => {
                this.$set(this.alerts, params.message, 'success');
                setTimeout(() => this.$delete(this.alerts, params.message), 3000);
            }
        };
        this.favorited = false
        this.requestFav(params);
    },
    async checkFavorited() {
        const url = `/api/favorites?freetId=${this.freet._id}`;
            try {
                const r = await fetch(url);
                const res = await r.json();
                if (!r.ok) {
                    throw new Error(res.error);
                }
                else {
                    const favoritedResult = res.message;
                    this.favorited = favoritedResult
                }
            } catch (e) {}    
        },

    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async requestFav(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.url 
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }
      try {
        const r = await fetch(params.url, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        // params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
header {
  background-color: white;
  padding-left: 1%;
  padding-right: 1%;
  padding-top: 0.1%;
  padding-bottom: 0.1%
}
p {
  font-size: medium;
  color: black;
  background: white;
  padding-left: 1%;
  padding-right: 1%;
  padding-top: 1%;
  padding-bottom: 1%
}

h4 {
  font-size: small;
  color: grey;
  font-weight: normal;
}

a {
  font-size: large;
  font-style:bold ;
}

a:link {
  color: black;
  text-decoration: none;
}

a:visited {
  color: black;
}

/* mouse over link */
a:hover {
  color: yellow;
  text-decoration: underline;
}

/* selected link */
a:active {
  color: black;
  text-decoration: underline;
}

.freet {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
    background-color: lightgrey;
    margin: 4px
}

button {
  background: rgb(0, 119, 255);
  color:white;
  border: 0px;
  margin: .2%;
  padding: 10px
}

button:hover{
  color:yellow;
}
</style>
