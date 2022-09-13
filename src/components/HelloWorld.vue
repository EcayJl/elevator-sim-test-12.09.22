<template>
  <div class="elevator container">
    <div
      class="elevator__line"
      :style="`height: ${shaftLenght}`"
      v-for="i in elevatorsArray"
      :key="i.id"
    >
      <div class="elevator__cabine" :id="i.id" :ref="i.id">
        <div>
          {{ i.isAvailable ? "" : `to: ${i.position}` }}
          <div v-if="!i.isAvailable">
            {{ i.lastPosition > i.position ? "down" : "up" }}
          </div>
        </div>
      </div>
    </div>
    <div class="elevator__line" :style="`height: ${shaftLenght}`">
      <div class="btn-container" v-for="i in floors" :key="i">
        <button
          class="btn"
          v-on:click="moveCab"
          :id="`${i}`"
          :ref="`${i}floor`"
        >
          {{ i }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ElevatorsAPI from "./ElevatorsAPI";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data: function () {
    return {
      floors: 10,
      // elevators: 10,
      elevatorsArray: ElevatorsAPI.createElevators(3),
      elevatorStack: [],
      allCabBusy: false,
      toExecut: false,
      isAuto: false,
    };
  },
  computed: {
    shaftLenght: function () {
      return `${this.floors * 50}px`;
    },
  },
  mounted() {
    // this.createElevators();
    console.log(this.elevatorsArray);
  },
  watch: {
    elevatorStack: function () {
      // const eventObj = {
      //   target: {
      //     id: [this.elevatorStack[0]],
      //   },
      // };
      // while (this.elevatorStack) {
      //   this.moveCab(eventObj);
      // }
      // setTimeout(() => {
      //   this.moveCab(eventObj);
      // }, 3000);
    },
  },
  methods: {
    createElevators: () => {},
    debounce: function (f, ms) {
      let isCooldown = false;

      return function () {
        if (isCooldown) return;

        f.apply(this, arguments);

        isCooldown = true;

        setTimeout(() => (isCooldown = false), ms);
      };
    },

    beaconFloor: function (id) {
      const $element = this.$refs[`${id}floor`];
      $element[0].style.backgroundColor = "orange";
    },
    hideBeacon: function (id) {
      const $element = this.$refs[`${id}floor`];
      $element[0].style.backgroundColor = "aliceblue";
    },
    sleep: function (millis) {
      let t = new Date().getTime();
      let i = 0;
      while (new Date().getTime() - t < millis) {
        /* eslint-disable */
        i++;
        /* eslint-enable */
      }
    },
    getAccessibleElevator: function () {
      const accessElevator = this.elevatorsArray.filter((item) => {
        return item.isAvailable === true;
      });
      return accessElevator;
    },
    autoMove: function () {
      // const eventObj = {
      //   target: {
      //     id: [this.elevatorStack[0]],
      //   },
      // };
      // this.elevatorStack.splice(0, 1);
      let freeCab = [];
      const interval = setInterval(() => {
        if (freeCab.length !== 0) {
          clearInterval(interval);
          const eventObj = {
            target: {
              id: [this.elevatorStack[0]],
            },
          };
          this.elevatorStack.splice(0, 1);
          this.moveCab(eventObj);
        } else {
          freeCab = this.getAccessibleElevator();
        }
      }, 1000);
      // while (freeCab.length === 0) {
      //   this.sleep(1000);
      //   freeCab = this.getAccessibleElevator();
      //   console.log(freeCab);
      // }
    },
    chosingBest: function (cab, floor) {
      const result = [];

      cab.map((el) => {
        result.push({
          id: el.id,
          position: el.position,
          diff: Math.abs(floor - el.position),
        });
      });

      const diffArray = result.map((el) => {
        return el.diff;
      });
      diffArray.sort((a, b) => b - a).reverse();
      const bestCab = result.find((el) => {
        return el.diff === diffArray[0];
      });
      return bestCab;
    },
    moveCab: function (e) {
      // console.log(this.$refs);
      const floorBeacon = +e.target.id;
      console.log(floorBeacon);

      if (
        this.elevatorsArray.find((el) => {
          return el.position === floorBeacon;
        })
      ) {
        return;
      }
      this.beaconFloor(floorBeacon);
      const cab = this.getAccessibleElevator();

      // const cabID = cab[0].id;
      // this.elevatorStack.push({
      //   cab: cabID,
      //   position: bestCab.position,
      // });

      // const savePosition = cab[0].position;

      if (cab.length) {
        this.toExecut = true;
        console.log(this.toExecut);
        const bestCab = this.chosingBest(cab, floorBeacon);
        const cabID = bestCab.id;
        const savePosition = bestCab.position;

        const $element = this.$refs[`${cabID}`][0];
        this.elevatorsArray.map((el) => {
          if (el.id === cabID) {
            el.position = floorBeacon;
            el.lastPosition = savePosition;
            el.isAvailable = false;
          }
        });

        let diff = [savePosition, floorBeacon];
        diff.sort((a, b) => b - a);
        diff = diff[0] - diff[1];
        console.log(diff);

        $element.style.transition = `${diff}s`;
        $element.style.bottom = `${50 * floorBeacon - 50}px`;
        setTimeout(() => {
          $element.style.transition = `1s`;
          $element.style.backgroundColor = "orange";
          setTimeout(() => {
            $element.style.backgroundColor = "#42b983";
            this.toExecut = false;
            console.log(this.toExecut);

            this.hideBeacon(floorBeacon);
            this.elevatorsArray.map((el) => {
              if (el.id === cabID) {
                el.isAvailable = true;
              }
            });
          }, 3000);
        }, diff * 1000);
        console.log(this.elevatorsArray);
      } else {
        if (this.elevatorStack.indexOf(floorBeacon) != -1) {
          return;
        } else {
          this.elevatorStack.push(floorBeacon);
          this.autoMove();
        }

        // const eventObj = {
        //   target: {
        //     id: [this.elevatorStack[0]],
        //   },
        // };
        // const f = this.debounce(this.moveCab(eventObj), 1000);
        // while (this.allCabBusy) {
        //   f();
        // }
        // const intervalAutoCab = setTimeout(() => {
        //   this.moveCab(eventObj);
        // }, 3000);
        // console.log(intervalAutoCab);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.btn-container {
  width: 50px;
  height: 50px;
  background-color: #1ec479;
  border: 0;
  color: aliceblue;
  font-size: bold;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  .btn {
    background-color: rgb(255, 255, 255);
    border: 0;
    cursor: pointer;
    color: black;
  }
}
.elevator {
  display: flex;
  flex-shrink: 0;
  &__line {
    width: 50px;
    height: 450px;
    margin-right: 10px;
    background-color: rgb(71, 71, 69);
    position: relative;
    display: flex;
    flex-shrink: 0;
    flex-direction: column-reverse;
  }
  &__cabine {
    width: 50px;
    height: 50px;
    background-color: #42b983;
    position: absolute;
    bottom: 0;
  }
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
