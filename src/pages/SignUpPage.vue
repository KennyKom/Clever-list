<template>
  <div class="sign-up-page">
    <form action="#" class="sign-up-page__form">
      <h2 class="sign-up-page__headline">Sign Up</h2>
      <input
        v-model="email"
        type="email"
        name="email"
        class="sign-up-page__email-input"
        id="emailInput"
        placeholder="Email"
        required
      />
      <input
        v-model="password"
        type="password"
        name="password"
        class="sign-up-page__password-input"
        id="passwordInput"
        placeholder="Password"
        required
      />
      <input
        v-model="repeatPassword"
        type="password"
        name="repeat-password"
        class="sign-up-page__repeat-password-input"
        id="repeatPasswordInput"
        placeholder="Repeat password"
        required
      />
      <button
        class="sign-up-page__confirm-btn"
        @click.prevent="onConfirmBtnClicked"
        :disabled="isLoading"
      >
        Confirm
      </button>
    </form>
    <div class="sign-up-page__sign-in-container">
      <h3 class="sign-up-page__sign-in-suggestion-headline">
        Already have an account?
      </h3>
      <a
        class="sign-up-page__sign-in-link"
        @click="this.$router.push('/sign-in')"
        :class="{ 'disabled-link': isLoading }"
      >
        Sign In
      </a>
    </div>
  </div>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import errorMsgMixin from "@/mixins/errorMsgMixin.js";
import { signUpUser } from "@/services/firebase";

export default {
  name: "sign-up-page",

  mixins: [toastMixin, errorMsgMixin],

  data() {
    return {
      isLoading: false,
      email: "",
      password: "",
      repeatPassword: "",
    };
  },

  methods: {
    getValidationError() {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!this.email) {
        return "Email can not be empty!";
      } else if (!emailRegex.test(this.email)) {
        return "Email you have entered is invalid!";
      }

      if (this.password.length < 8) {
        return "Password can not be shorter than 8 characters!";
      } else if (this.password.length > 28) {
        return "Password can not be longer than 28 characters!";
      } else if (this.password !== this.repeatPassword) {
        return "The entered passwords do not match!";
      }

      return null;
    },
    async onConfirmBtnClicked() {
      const errorMsg = this.getValidationError();

      if (errorMsg) {
        this.setErrorToast(`Error! ${errorMsg}`);
        return;
      }

      this.isLoading = true;
      this.setLoadingToast("Registering an account...");
      try {
        await signUpUser(this.email, this.password);

        this.setSuccessToast("Your account has been successfully registered!");

        this.email = "";
        this.password = "";
        this.repeatPassword = "";

        this.$router.push("/");
      } catch (error) {
        const errorMsg = this.getErrorMsg(error);

        this.setErrorToast(
          `An error occurred while trying to register an account! ${errorMsg}`
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

.sign-up-page {
  flex-grow: 1;
  @extend %default-wrapper;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__form {
    display: flex;
    flex-direction: column;

    .sign-up-page__headline {
      @include default-headline(42px, 42px, $color-black);
      margin-bottom: 30px;
      text-align: center;
    }

    .sign-up-page__email-input {
      @extend %default-input;
      background-color: $color-gr;
      border: none;
      outline: none;
      margin-bottom: 20px;
    }

    .sign-up-page__password-input {
      @extend %default-input;
      background-color: $color-gr;
      border: none;
      outline: none;
      margin-bottom: 20px;
    }

    .sign-up-page__repeat-password-input {
      @extend %default-input;
      background-color: $color-gr;
      border: none;
      outline: none;
      margin-bottom: 40px;
    }

    .sign-up-page__confirm-btn {
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

  &__sign-in-container {
    display: flex;
    align-items: center;
    margin-top: 20px;

    .sign-up-page__sign-in-suggestion-headline {
      @include default-text(20px, 20px, $color-gray);
      margin-right: 10px;
    }

    .sign-up-page__sign-in-link {
      @include default-text(20px, 20px, $color-green);
      color: $color-green;
      cursor: pointer;
      text-decoration: none;
      transition: color 0.3s, transform 0.3s;

      &:hover {
        color: darken($color-green, 10%);
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
