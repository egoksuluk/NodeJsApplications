import {LotteryViewModel} from "./model.js";

window.onload = () => {
  ko.applyBindings(new LotteryViewModel())
};

// Client Side MVC --> MVVM ( Vue.js / Angular.js ) --> Reactive Programming