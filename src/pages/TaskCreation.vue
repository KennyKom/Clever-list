<template>
  <form action="#" class="task-creation-page">
    <div class="task-creation-page__back-btn-headline-wrapper">
      <app-left-arrow
        class="task-creation-page__back-btn"
        @click="this.$router.push('/')"
        :disabled="isLoading"
      />
      <h2 class="task-creation-page__headline">Create New Task</h2>
    </div>
    <input
      v-model="title"
      type="text"
      name="title"
      class="task-creation-page__title-input"
      id="titleInput"
      placeholder="Title"
      required
    />
    <textarea
      v-model="description"
      type="text"
      name="description"
      class="task-creation-page__description-textarea"
      id="descriptionTextarea"
      placeholder="Description"
      required
    ></textarea>
    <div class="task-creation-page__date-and-status">
      <input
        v-model="date"
        type="date"
        name="date"
        class="task-creation-page__date-input"
        id="dateInput"
        required
      />
      <select
        v-model="checked"
        name="checked"
        class="task-creation-page__checked-select"
        id="checkedSelect"
        required
      >
        <option value="unchecked">Not completed</option>
        <option value="checked">Completed</option>
      </select>
    </div>
    <button
      class="task-creation-page__confirm-btn"
      @click.prevent="onCreateBtnClicked"
      :disabled="isLoading"
    >
      Save
    </button>
  </form>
</template>

<script>
import { format } from "date-fns";
import toastMixin from "@/composables/toast.js";
import fetchTasksMixin from "@/composables/fetchTasks.js";
import taskValidationMixin from "@/components/utils/taskValid.js";
import { uploadNewTask } from "@/services/firebase";

export default {
  name: "task-creation-page",

  mixins: [toastMixin, fetchTasksMixin, taskValidationMixin],

  data() {
    return {
      isLoading: false,
      title: "",
      description: "",
      date: format(new Date(), "yyyy-MM-dd"),
      checked: "unchecked",
    };
  },

  methods: {
    async onCreateBtnClicked() {
      const errorMsg = this.getTaskValidationError(
        this.title,
        this.description
      );

      if (errorMsg) {
        this.setErrorToast(`Error! ${errorMsg}`);
        return;
      }

      this.isLoading = true;
      this.setLoadingToast("Uploading new task data to DB...");
      try {
        await uploadNewTask({
          title: this.title,
          description: this.description,
          date: this.date,
          checked: this.checked === "checked",
        });

        this.title = "";
        this.description = "";
        this.date = format(new Date(), "yyyy-MM-dd");
        this.checked = "unchecked";

        await this.fetchTasks();

        this.setSuccessToast("You have successfully created new task!");

        this.$router.push("/");
      } catch (error) {
        this.setErrorToast(
          `An error occurred while trying to create new task! ${error.message}`
        );
      } finally {
        this.isLoading = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/global";

.task-creation-page {
  flex-grow: 1;
  @extend %default-wrapper;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__back-btn-headline-wrapper {
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    column-gap: 10px;
    .task-creation-page__back-btn {
      min-width: 30px;
    }
    .task-creation-page__headline {
      @include default-headline(42px, 42px, $color-black);
      @media (max-width: $phone-l) {
        font-size: 24px;
        line-height: 24px;
      }
    }
  }

  &__title-input-label,
  &__description-textarea-label,
  &__date-input-label,
  &__checked-select-label {
    @include default-text(24px, 24px, $color-black);
    max-width: 500px;
    width: 100%;
    @media (max-width: $phone-l) {
      font-size: 20px;
      line-height: 20px;
    }
  }

  &__title-input,
  &__description-textarea,
  &__date-input,
  &__checked-select {
    @include default-text(20px, 20px, $color-black);
    background-color: $color-gr;
    border: none;
    outline: none;
    padding: 10px;
    border-radius: 5px;
    width: 100%;
    max-width: 500px;
    box-shadow: none;
    @media (max-width: $phone-l) {
      font-size: 15px;
      line-height: 20px;
    }

    &:focus {
      box-shadow: none;
    }

    &:hover {
      box-shadow: none;
    }

    &::placeholder {
      color: $color-dark-gray;
    }
  }

  &__title-input {
    margin-bottom: 20px;
  }

  &__description-textarea {
    @extend %default-textarea;
    margin-bottom: 20px;
    height: 310px;
  }

  &__date-and-status {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 500px;
    margin-bottom: 20px;

    & > * {
      flex: 1;
      margin-right: 10px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  &__date-input {
    margin-bottom: 0;
  }

  &__checked-select {
    margin-bottom: 0;
  }

  &__confirm-btn {
    @include default-btn(200px, $color-white, $color-orange);
  }
}
</style>
