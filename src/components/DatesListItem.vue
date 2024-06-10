<template>
  <div class="dates-list-item" @click="selectDate">
    <div
      class="dates-list-item__date-wrapper"
      :class="{
        'dates-list-item__date-wrapper_active': isCurrentDay,
        'dates-list-item__date-wrapper_selected': isSelectedDay,
      }"
    >
      <h4
        class="dates-list-item__week-day"
        :class="{
          'dates-list-item__week-day_active': isCurrentDay,
          'dates-list-item__week-day_selected': isSelectedDay,
        }"
      >
        {{ weekDay }}
      </h4>
      <h4
        class="dates-list-item__month-day"
        :class="{
          'dates-list-item__month-day_active': isCurrentDay,
          'dates-list-item__month-day_selected': isSelectedDay,
        }"
      >
        {{ getDayOfDate }} {{ getMonthAbbreviation }}
      </h4>
    </div>
    <div class="dates-list-item__dots-wrapper">
      <div
        v-if="uncheckedExist"
        class="dates-list-item__dot dates-list-item__dot_undone"
      ></div>
      <div
        v-if="checkedExist"
        class="dates-list-item__dot dates-list-item__dot_done"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "dates-list-item",

  props: {
    date: {
      type: String,
      required: true,
    },
    weekDay: {
      type: String,
      required: true,
    },
    uncheckedExist: {
      type: Boolean,
      required: true,
    },
    checkedExist: {
      type: Boolean,
      required: true,
    },
    selectedDate: {
      type: String,
      default: null,
    },
  },

  computed: {
    getDayOfDate() {
      const dateParts = this.date.match(/(\d+)([/.-])(\d+)([/.-])(\d+)/);
      const date = new Date(dateParts[5], dateParts[3] - 1, dateParts[1]);
      return date.getDate();
    },
    getMonthAbbreviation() {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const dateParts = this.date.match(/(\d+)([/.-])(\d+)([/.-])(\d+)/);
      const date = new Date(dateParts[5], dateParts[3] - 1, dateParts[1]);
      return monthNames[date.getMonth()];
    },
    isCurrentDay() {
      const today = new Date();
      const dateParts = this.date.match(/(\d+)([/.-])(\d+)([/.-])(\d+)/);
      const date = new Date(dateParts[5], dateParts[3] - 1, dateParts[1]);
      return (
        today.getDate() === date.getDate() &&
        today.getMonth() === date.getMonth() &&
        today.getFullYear() === date.getFullYear()
      );
    },
    isSelectedDay() {
      return this.selectedDate === this.date;
    },
  },

  methods: {
    selectDate() {
      this.$emit("selectDate", this.date);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/styles/global";

.dates-list-item {
  flex: 0 0 75px;
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    transform: scale(1.1);
  }
  &:hover > &__date-wrapper {
    border: 2px solid $color-black;
  }
  &__date-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    border: 2px solid $color-white;
    transition: 0.3s;
    &_active {
      background-color: $color-black;
      border: 2px solid $color-black;
    }
    &_selected {
      border: 2px solid $color-orange;
    }
    .dates-list-item__week-day {
      @include default-headline(14px, 14px, $color-light-gray);
      &_active {
        color: $color-white;
      }
      &_selected {
        color: $color-orange;
      }
    }
    .dates-list-item__month-day {
      @include default-headline(14px, 14px, $color-black);
      &_active {
        color: $color-white;
      }
      &_selected {
        color: $color-orange;
      }
    }
  }
  &__dots-wrapper {
    display: flex;
    justify-content: center;
    column-gap: 5px;
    .dates-list-item__dot {
      height: 5px;
      width: 5px;
      border-radius: 100%;
      &_undone {
        background-color: $color-yellow;
      }
      &_done {
        background-color: $color-light-orange;
      }
    }
  }
}
</style>
