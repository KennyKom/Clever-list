import { createStore } from "vuex";
import { userDataModule } from "@/store/modules/userDataModule";
import { datesAndTasksModule } from "@/store/modules/datesAndTasksModule";
import { toastModule } from "@/store/modules/toastModule";

export default createStore({
  modules: {
    userData: userDataModule,
    datesAndTasks: datesAndTasksModule,
    toast: toastModule,
  },
});
