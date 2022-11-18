import Vue from 'vue';
import VueRouter from 'vue-router';
import FreetsPage from './components/Freet/FreetsPage.vue';
import BeyondPage from './components/Freet/BeyondPage.vue';
import AccountPage from './components/Account/AccountPage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import MyProfilesPage from './components/Profile/MyProfilesPage.vue';
import SingleProfilePage from './components/Profile/SingleProfilePage.vue'
import FreetComponent from './components/Freet/FreetComponent.vue'
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: FreetsPage},
  {path: '/beyond', name: 'Beyond', component: BeyondPage},
  {path: '/account', name: 'Account', component: AccountPage},
  {path: '/follows/:username', name: 'Follow', component: SingleProfilePage, props:true},
  {path: '/login', name: 'Login', component: LoginPage},
  {path: '*', name: 'Not Found', component: NotFound},
  {path: '/profiles', name: 'Profiles', component: MyProfilesPage, props:true},
  {path: '/favorites', name: 'Favorites', component: FreetComponent},
  {path: '/favorites/:freetId', name: 'Favorites', component: FreetComponent},
  {path: '/profiles/:username', name:"Profiles", component: MyProfilesPage, props:true},
  {path: '/members/:username', name:"Members", component: SingleProfilePage, props:true}

];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name === 'Login' && router.app.$store.state.username) {
      next({name: 'Account'}); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (to.name === 'Account' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Account and are not signed in
      return;
    }
  }

  next();
});

export default router;
