<!-- Page for viewing profiles user is a part of -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header v-if="this.username"></header>
      <header v-else>
        <div>
          <h1>
            Viewing your profiles
          </h1>
        </div>
      </header>
      <section v-if="this.username">
        <SingleProfilePage
            :profileHandle="this.username"
        />
      </section>       
      <section class='centered'
        v-else-if="$store.state.profiles.length"
        >
        <ProfilePreviewComponent
            v-for="profile in $store.state.profiles"
            :key="profile.id"
            :profile="profile"
        />
      </section>

        <article v-else>
            <h3>No Profiles found.</h3>
        </article>
    </section>

  </main>
</template>

<script>
import ProfilePreviewComponent from '@/components/Profile/ProfilePreviewComponent.vue';
import SingleProfilePage from '@/components/Profile/SingleProfilePage.vue';
import GetProfilesForm from '@/components/Profile/GetProfilesForm.vue';

export default {
  name: 'MyProfilesPage',
  props: {
      username: { required: false, type: String}
  },
  components: {ProfilePreviewComponent, SingleProfilePage, GetProfilesForm},
  mounted() { // automatically loads profiles into the component when user visits page
    // this.$refs.getProfilesForm.submit();
    this.loadProfiles();
  },
  methods: {
      async loadProfiles() {
        if (this.username === undefined) {

        }
        const url = this.username ? `api/profiles?username=${this.username}` : `api/profiles`
        try {
          const r = await fetch(url);
          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          }
          this.$store.commit('updateFilter', this.value);
          this.$store.commit('updateProfiles', res);
        } catch (e) {
          if (this.value === this.$store.state.filter) {
            // This section triggers if you filter to a user but they
            // change their username when you refresh
            this.$store.commit('updateFilter', null);
            this.value = ''; // Clear filter to show all users' freets
          } else {
            // Otherwise reset to previous fitler
            this.value = this.$store.state.filter;
          }
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.centered {
  align-items: center;
}

section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    /* display: flex; */
    justify-content: space-between;
    align-items: center;
    text-align: center;
    margin-top: 20px;
    margin-bottom: 20px;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}

/* .profilepreview {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
} */
</style>
