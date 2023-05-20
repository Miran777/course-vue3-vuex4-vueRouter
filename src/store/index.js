import { createStore } from "vuex";
import { postModule } from "./postModul";


export default createStore({

    modules: {
        post: postModule
    }
})