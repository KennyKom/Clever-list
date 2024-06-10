<template>
  <button class="burger-btn" @click="menuIsOpened = true"></button>
  <teleport to="body">
    <div
      v-show="menuIsOpened"
      class="burger-menu"
      @click="menuIsOpened = $event.target.className !== 'burger-menu'"
    >
      <nav class="burger-menu__nav">
        <ul class="burger-menu__nav-list">
          <li class="burger-menu__nav-list-item">
            <a class="burger-menu__link" @click.stop="onLogOutBtnClicked">
              LogOut
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </teleport>
</template>

<script>
import toastMixin from "@/composables/toast.js";
import errorMsgMixin from "@/components/utils/errorMsg.js";
import { mapState } from "vuex";
import { signOutUser } from "@/services/firebase";

export default {
  name: "burger-menu",

  mixins: [toastMixin, errorMsgMixin],

  data() {
    return {
      menuIsOpened: false,
    };
  },

  methods: {
    async onLogOutBtnClicked() {
      try {
        await signOutUser();

        this.menuIsOpened = false;

        this.$router.push("/sign-in");
      } catch (error) {
        const errorMsg = this.getErrorMsg(error);

        this.setErrorToast(
          `An error occurred while trying to log out! ${errorMsg}`
        );
      }
    },
  },

  computed: {
    ...mapState({
      userEmail: (state) => state.userData.userEmail,
    }),
  },
};
</script>

<style scoped lang="scss">
@import "@/styles/global";

.burger-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent url("@/assets/icons/burger-btn.svg") no-repeat center /
    cover;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    transform: scale(1.1);
  }
}
.burger-menu {
  z-index: 1;
  position: fixed;
  top: 45px;
  left: -45px;
  width: 85vw;
  height: 10dvh;
  display: flex;
  justify-content: flex-end;
  .burger-menu__nav-list {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 10px;
    .burger-menu__nav-list-item {
      border: 3px solid $color-yellow;
      background-color: $color-yellow;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.3s;
      &:hover {
        transform: scale(1.2);
        border: 3px solid $color-yellow;
        .burger-menu__link {
          color: $color-white;
        }
      }
      .burger-menu__link {
        @include default-text(18px, 18px, $color-white);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        text-decoration: none;
        transition: 0.29s;
        @media (max-width: $phone-l) {
          padding: 15px;
          font-size: 32px;
          line-height: 32px;
        }
      }
    }
  }
}
</style>
