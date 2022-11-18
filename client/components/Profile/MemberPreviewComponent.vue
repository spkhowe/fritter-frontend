<template>
  <article
    class="profile"
  >
    <header>
        <a :href="`/#/profiles/${profile.username}`">@{{ profile.username }}</a>
    </header>
  </article>
</template>

<script>
export default {
    name: "MemberPreviewComponent",
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