export default class ElevatorsAPI {
  static createElevators(count) {
    const elevatorsArray = []
    for (let i = 1; i <= count; i++) {
      elevatorsArray.push({
        id: i,
        isAvailable: true,
        onWay: false,
        isRecreation: false,
        position: 0,
        lastPosition: 0
      });
    }
    
    return elevatorsArray;
  }
}
