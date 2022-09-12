<template>
  <div class="elevator container">
    <div class="elevator__line" v-for="i in elevatorsArray" :key="i.id">
      <div class="elevator__cabine" :id="i.id" :ref="i.id"></div>
    </div>
    <div class="elevator__line">
      <div class="btn-container" v-for="i in elevatorsArray.length" :key="i">
        <button
          class="btn"
          v-on:click="moveCab"
          :id="`${i}floor`"
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
      // floors: 9,
      // elevators: 10,
      elevatorsArray: ElevatorsAPI.createElevators(9),
    };
  },
  mounted() {
    // this.createElevators();
    console.log(this.elevatorsArray);
  },
  methods: {
    createElevators: () => {},

    beaconFloor: function (id) {
      const $element = this.$refs[`${id}floor`];
      $element[0].style.backgroundColor = "orange";
    },
    getAccessibleElevator: function () {
      const accessElevator = this.elevatorsArray.filter((item) => {
        return item.isAvailable === true;
      });
      return accessElevator;
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
      const floorBeacon = +e.target.id[0];
      this.beaconFloor(floorBeacon);

      const cab = this.getAccessibleElevator();
      const bestCab = this.chosingBest(cab, floorBeacon);

      // const cabID = cab[0].id;
      const cabID = bestCab.id;

      const savePosition = bestCab.position;
      // const savePosition = cab[0].position;

      if (cab.length) {
        const $element = this.$refs[`${cabID}`][0];
        this.elevatorsArray.map((el) => {
          if (el.id === cabID) {
            el.position = floorBeacon;
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
            this.elevatorsArray.map((el) => {
              if (el.id === cabID) {
                el.isAvailable = true;
              }
            });
          }, 3000);
        }, diff * 1000);
        console.log(this.elevatorsArray);
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
  &__line {
    width: 50px;
    height: 450px;
    margin-right: 10px;
    background-color: rgb(71, 71, 69);
    position: relative;
    display: flex;
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
