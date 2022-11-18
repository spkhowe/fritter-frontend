<template>
    <article>
    <div>
    <h3>
        @{{ this.profileHandle }}
        <!-- <p v-if="!this.personal">You belong to this group</p> -->
    </h3>
    <div v-if="this.profileUsers.includes($store.state.username) === false">
        <button v-if="this.following === false" @click="followProfile">
            Follow
        </button>
        <button v-else-if="this.following ===true" @click="unfollowProfile">
            Unfollow
        </button>
    </div>
    </div>

    <section v-if="this.profileUsers.includes($store.state.username)">
        <section v-if="this.personal === 'false'">
            <AddUserForm
                ref="AddUserForm"
                value="username"
                placeholder="🔍 Find by username"
                button="Add user to group"
                :profileHandle="this.profileHandle"
            />

            <DeleteUserForm
                ref="DeleteUserForm"
                value="username"
                placeholder="🔍 Find by username"
                button="Remove user from group"
                :profileHandle="this.profileHandle"
            />
            <button @click="getGroupMembers">
                View group members

            </button>
            <h3 v-if="this.members.length">
                <!-- {{ this.members }} -->
                <MemberPreviewComponent
                    v-for="member in this.members"
                    :key="member.id"
                    :profile="member"
                />
            </h3>
        </section>
    </section>
    <section v-else>
        <!-- <button v-if="this.following === false" @click="followProfile">
            Follow
        </button>
        <button v-else-if="this.following ===true" @click="unfollowProfile">
            Unfollow
        </button> -->
    </section>
    <h3> 
        <FreetComponent
          v-for="freet in this.freets[0]"
          :key="freet.id"
          :freet="freet"
        />
    </h3>
    </article>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import AddUserForm from '@/components/Profile/AddUserForm.vue';
import DeleteUserForm from '@/components/Profile/DeleteUserForm.vue';
import MyProfilesPage from '@/components/Profile/MyProfilesPage.vue';
import MemberPreviewComponent from '@/components/Profile/MemberPreviewComponent.vue';

export default {
    name: "SingleProfilePage",
    components: {FreetComponent, AddUserForm, DeleteUserForm, MyProfilesPage, MemberPreviewComponent},
    props: {
        profileHandle: {
            type: String,
            require: true
        }
    },
    mounted() {
        this.fetchProfilesFreets();
        this.getProfileUsers();
        this.checkFollowing();
        this.$refs.MyProfilesPage.loadProfiles();
    },
    data() {
        return {
            freets: [],
            profileUsers: [],
            personal: true,
            members: [],
            following: false
        }
    },
    methods: {
        async fetchProfilesFreets() {

            const url = `/api/freets?username=${this.profileHandle}`;
            try {
                const r = await fetch(url);
                const res = await r.json();
                if (!r.ok) {
                    throw new Error(res.error);
                }
                else {
                    this.freets.push(res);
                }
            } catch (e) {}
        },
        async getProfileUsers() {
            const url = `/api/profiles?username=${this.profileHandle}`;
            try {
                const r = await fetch(url);
                const res = await r.json();
                if (!r.ok) {
                    throw new Error(res.error);
                } else {
                    this.profileUsers = res[0].users; //hm
                    this.personal = res[0].personal;
                }
            } catch (e) {}
        },
        async checkFollowing() {
            const url = `/api/follows?username=${this.profileHandle}`;
            try {
                const r = await fetch(url);
                const res = await r.json();
                if (!r.ok) {
                    throw new Error(res.error);
                }
                else {
                    const followResult = res.message;
                    this.following = followResult
                }
            } catch (e) {}
        },
        async followProfile() {
            const params = {
                method: 'POST',
                message: 'Successfully followed profile',
                body: JSON.stringify({username: this.profileHandle}),
                callback: () => {
                    this.$set(this.alerts, params.message, 'success');
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
            };
            this.following = true;
            this.request(params);
        },
        async unfollowProfile() {
            const params = {
                method: 'DELETE',
                message: 'Successfully unfollowed profile',
                body: JSON.stringify({username: this.profileHandle}),
                callback: () => {
                    this.$set(this.alerts, params.message, 'success');
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
            };
            this.following = false;
            this.request(params);
        },
        async getGroupMembers() {            
            const url = `/api/members?username=${this.profileHandle}`
            try {
                const r = await fetch(url);
                const res = await r.json();
                if (!r.ok) {
                    throw new Error(res.error);
                } else {
                    const usernames = []
                    for (let i of res) {
                        usernames.push(i.username)
                    }
                    this.members = res
                }
            } catch (e) {};
        },
        async request(params) {
            const options = {
                method: params.method, headers: {'Content-Type': 'application/json'}
            };
            if (params.body) {
            options.body = params.body;
            }
            try {
                const url = (params.method === "DELETE") ? `/api/follows?username=${this.profileHandle}` : `/api/follows`
                const r = await fetch(url, options);
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
p {
    color: grey;
    font-size: small
}

section {
    display: inline-flex;
    justify-content: space-between;
}

button {
  color: white;
  background: rgb(0, 119, 255);
  border-width: 0px;
  padding: 10px 15px;
  margin: 5%;
}

button:hover {
    color: yellow;
    background: grey;
}
div {
    display: inline-flex
}
</style>