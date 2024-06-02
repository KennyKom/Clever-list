<template>
  <div class="sign-in-page">
    <form action="#" class="sign-in-page__form">
      <h2 class="sign-in-page__headline">Sign In</h2>
      <input
        v-model="email"
        type="email"
        name="email"
        class="sign-in-page__email-input"
        id="emailInput"
        placeholder="Email"
        required
      />
      <input
        v-model="password"
        type="password"
        name="password"
        class="sign-in-page__password-input"
        id="passwordInput"
        placeholder="Password"
        required
      />
      <button
        class="sign-in-page__confirm-btn"
        @click.prevent="onConfirmBtnClicked"
        :disabled="isLoading"
      >
        Confirm
      </button>
    </form>
    <div class="sign-in-page__sign-up-container">
      <h3 class="sign-in-page__sign-up-suggestion-headline">Not registered?</h3>
      <a
        class="sign-in-page__register-link"
        @click="this.$router.push('/sign-up')"
        :class="{ 'disabled-link': isLoading }"
      >
        Create an account
      </a>
    </div>
  </div>
</template>

<script>
import toastMixin from "@/mixins/toastMixin.js";
import errorMsgMixin from "@/mixins/errorMsgMixin.js";
import { signInUser } from "@/services/firebase";

export default {
  name: "sign-in-page",

  mixins: [toastMixin, errorMsgMixin],

  data() {
    return {
      isLoading: false,
      email: "",
      password: "",
    };
  },

  methods: {
    async onConfirmBtnClicked() {
      this.isLoading = true;
      this.setLoadingToast("Logging...");
      try {
        await signInUser(this.email, this.password);

        this.setSuccessToast("You have successfully logged in!");

        this.email = "";
        this.password = "";

        this.$router.push("/");
      } catch (error) {
        const errorMsg = this.getErrorMsg(error);

        this.setErrorToast(
          `An error occurred while trying to log in to account! ${errorMsg}`
        );
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/global";

.sign-in-page {
  flex-grow: 1;
  @extend %default-wrapper;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__form {
    display: flex;
    flex-direction: column;

    .sign-in-page__headline {
      @include default-headline(42px, 42px, $color-black);
      margin-bottom: 30px;
      text-align: center;
    }

    .sign-in-page__email-input {
      @extend %default-input;
      background-color: $color-gr;
      border: none;
      outline: none;
      margin-bottom: 20px;
    }

    .sign-in-page__password-input {
      @extend %default-input;
      background-color: $color-gr;
      border: none;
      outline: none;
      margin-bottom: 40px;
    }

    .sign-in-page__confirm-btn {
      align-self: center;
      @include default-btn(300px, $color-white, $color-register);
      margin-bottom: 20px;
      transition: background-color 0.3s, transform 0.3s;

      &:hover {
        // background-color: darken($color-register, 10%);
        transform: scale(1.05);
      }
    }
  }

  &__sign-up-container {
    display: flex;
    align-items: center;
    margin-top: 20px;

    .sign-in-page__sign-up-suggestion-headline {
      @include default-text(20px, 20px, $color-gray);
      margin-right: 10px;
    }

    .sign-in-page__register-link {
      @include default-text(20px, 20px, $color-green);
      color: $color-green;
      cursor: pointer;
      text-decoration: none;
      transition: color 0.3s, transform 0.3s;
      // transition: background-color 0.3s, transform 0.3s;

      &:hover {
        color: darken($color-green, 12%);
        transform: scale(1.05);
      }
    }

    .disabled-link {
      pointer-events: none;
      opacity: 0.6;
    }
  }
}
</style>
