<template class="boxplacement">
  <article
    class="profilepreview"
  >
    <header >
        <!-- <span class="dot"></span> -->
        <a :href="`/#/profiles/${profile.profileHandle}`">{{ profile.profileHandle }}</a>
    </header>
  </article>
</template>

<script>
export default {
    name: "ProfilePreviewComponent",
    props: {
        profile: {
            type: Object,
            require: true
        }
    },
    methods: {
        goToProfile() {
            /**
             * Navigates user to this profile page 
             */
        }
    }
}
</script>

<style scoped>

.boxplacement {
  align-content: center;
}

.profilepreview {
    border: 1px solid #111;
    padding: 35px;
    position: relative;
    background: rgb(0, 119, 255);
    margin-bottom:10px;
    width:70%;
    vertical-align: middle ;
    position: relative
}
/* 
view {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
} */

.dot {
  height: 40px;
  width: 40px;
  background-color: white;
  border-radius: 50%;
  display: inline-block;
  margin-right:10px;
}

a:link {
  color: white;
  text-decoration: none;
}

a:visited {
  color: white;
}

/* mouse over link */
a:hover {
  color: yellow;
  text-decoration: underline;
}

/* selected link */
a:active {
  color: white;
  text-decoration: underline;
}
</style>