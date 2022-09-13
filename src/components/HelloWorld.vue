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
      floors: 14,
      elevatorsArray: ElevatorsAPI.createElevators(25),
      elevatorStack: [],
      isAuto: false,
    };
  },
  mounted() {
    console.log(123);
  },
  computed: {
    shaftLenght: function () {
      return `${this.floors * 50}px`;
    },
  },
  methods: {
    beaconFloor: function (id) {
      const $element = this.$refs[`${id}floor`];
      $element[0].style.backgroundColor = "orange";
    },
    hideBeacon: function (id) {
      const $element = this.$refs[`${id}floor`];
      $element[0].style.backgroundColor = "aliceblue";
    },
    getAccessibleElevator: function () {
      const accessElevator = this.elevatorsArray.filter((item) => {
        return item.isAvailable === true;
      });
      return accessElevator;
    },
    autoMove: function () {
      let freeCab = [];
      localStorage.setItem("elevatorStackLS", this.elevatorStack);

      const interval = setInterval(() => {
        if (freeCab.length !== 0) {
          clearInterval(interval);

          const eventObj = {
            target: {
              id: [this.elevatorStack[0]],
            },
          };

          this.elevatorStack.splice(0, 1);
          localStorage.setItem("elevatorStackLS", this.elevatorStack);

          this.moveCab(eventObj);
        } else {
          freeCab = this.getAccessibleElevator();
        }
      }, 1000);
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
      const floorBeacon = +e.target.id;

      if (
        this.elevatorsArray.find((el) => {
          return el.position === floorBeacon;
        })
      ) {
        return;
      }
      this.beaconFloor(floorBeacon);

      const cab = this.getAccessibleElevator();

      if (cab.length) {
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
        localStorage.setItem(
          "elevatorsArrayLS",
          JSON.stringify(this.elevatorsArray)
        );

        let diff = [savePosition, floorBeacon];
        diff.sort((a, b) => b - a);
        diff = diff[0] - diff[1];

        $element.style.transition = `${diff}s`;
        $element.style.bottom = `${50 * floorBeacon - 50}px`;
        setTimeout(() => {
          $element.style.transition = `1s`;
          $element.style.backgroundColor = "orange";
          setTimeout(() => {
            localStorage.setItem(
              "elevatorsArrayLS",
              JSON.stringify(this.elevatorsArray)
            );
            $element.style.backgroundColor = "#42b983";

            this.hideBeacon(floorBeacon);
            this.elevatorsArray.map((el) => {
              if (el.id === cabID) {
                el.isAvailable = true;
              }
            });
          }, 3000);
        }, diff * 1000);
      } else {
        if (this.elevatorStack.indexOf(floorBeacon) != -1) {
          return;
        } else {
          this.elevatorStack.push(floorBeacon);
          this.autoMove();
        }
      }
    },
  },
};
</script>

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
