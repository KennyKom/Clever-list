<template>
  <div class="sign-in-page">
    <form action="#" class="sign-in-page__form">
      <h2 class="sign-in-page__headline">Sign In</h2>
      <div :class="{ 'input-wrapper': true, 'input-error': emailError }">
        <input
          v-model="email"
          type="email"
          name="email"
          class="sign-in-page__email-input"
          id="emailInput"
          placeholder="Email"
          required
        />
        <span v-if="emailError" class="error-message">{{ emailError }}</span>
      </div>
      <div :class="{ 'input-wrapper': true, 'input-error': passwordError }">
        <input
          v-model="password"
          type="password"
          name="password"
          class="sign-in-page__password-input"
          id="passwordInput"
          placeholder="Password"
          required
        />
        <span v-if="passwordError" class="error-message">{{
          passwordError
        }}</span>
      </div>
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
import toastMixin from "@/composables/toast.js";
import errorMsgMixin from "@/components/utils/errorMsg.js";
import { signInUser } from "@/services/firebase";

export default {
  name: "sign-in-page",

  mixins: [toastMixin, errorMsgMixin],

  data() {
    return {
      isLoading: false,
      email: "",
      password: "",
      emailError: "",
      passwordError: "",
    };
  },

  methods: {
    validateInputs() {
      let isValid = true;
      this.emailError = "";
      this.passwordError = "";

      if (!this.email) {
        this.emailError = "Email is required.";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(this.email)) {
        this.emailError = "Email is invalid.";
        isValid = false;
      }

      if (!this.password) {
        this.passwordError = "Password is required.";
        isValid = false;
      } else if (this.password.length < 8) {
        this.passwordError = "Password must be at least 8 characters.";
        isValid = false;
      }

      return isValid;
    },

    async onConfirmBtnClicked() {
      if (!this.validateInputs()) {
        return;
      }

      this.isLoading = true;
      this.setLoadingToast("Logging in...");
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

    .input-wrapper {
      position: relative;
      margin-bottom: 20px;

      .sign-in-page__email-input,
      .sign-in-page__password-input {
        @extend %default-input;
        background-color: $color-gr;
        border: none;
        outline: none;
        width: 100%;
        padding: 10px;
        border-radius: 5px;
      }

      .input-error .sign-in-page__email-input,
      .input-error .sign-in-page__password-input {
        border: 1px solid red;
      }

      .error-message {
        position: absolute;
        bottom: -20px;
        left: 0;
        font-size: 12px;
        color: red;
      }
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
