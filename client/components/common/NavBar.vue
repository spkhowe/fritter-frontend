<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div class="left">
       <img src="../../public/logo.svg">
      <!-- <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm5.336 12.105l-1.216.405.421 1.258c.165.509-.105 1.063-.615 1.228-.575.162-1.074-.161-1.232-.613l-.42-1.259-2.506.838.42 1.259c.195.601-.217 1.271-.916 1.271-.44 0-.8-.282-.93-.657l-.421-1.258-1.215.404c-.568.164-1.073-.158-1.232-.614-.164-.509.106-1.064.616-1.228l1.216-.405-.811-2.411-1.216.404c-.677.192-1.279-.295-1.279-.92 0-.408.255-.791.664-.923l1.216-.404-.421-1.258c-.165-.51.106-1.064.616-1.229.51-.164 1.065.105 1.231.615l.421 1.257 2.505-.838-.419-1.259c-.202-.619.242-1.276.921-1.276.41 0 .793.254.925.663l.421 1.258 1.215-.405c.51-.165 1.066.106 1.231.615.166.509-.105 1.063-.615 1.228l-1.217.404.811 2.412 1.217-.405c.621-.2 1.278.242 1.278.919 0 .41-.255.792-.664.924zm-4.496-3.214l-2.505.837.81 2.414 2.505-.837-.81-2.414z"/></svg>      <h1 class="title"> -->
      <h1 style="color:white">  
        Fritter
      </h1>
    </div>
    <div class="right">
      <router-link to="/">
        Home
      </router-link>
      <router-link
        v-if="$store.state.username"
        to="/account"
      >
        Account
      </router-link>
      <router-link
        v-else
        to="/login"
      >
        Login
      </router-link>
      <router-link to="/profiles">
        Profiles
      </router-link>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>

<style scoped>
nav {
    padding: 1vw 2vw;
    background-color: rgb(0, 119, 255);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

.title {
    font-size: 32px;
    margin: 0 5px;
    color: white
}

img {
    height: 32px;
    color: white
}

.left {
	display: flex;
	align-items: center;
}

.right {
    font-size: 20px;
    display: grid;
    gap: 16px;
    grid-auto-flow: column;
    align-items: center;
}

.right a {
    margin-left: 5px;
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
}

/* selected link */
a:active {
  color: white;
  text-decoration: underline;
}

.alerts {
    width: 25%;
}
</style>
