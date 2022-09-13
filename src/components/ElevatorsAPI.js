export default class ElevatorsAPI {
  static createElevators(count) {
    const elevatorsArray = []
    for (let i = 1; i <= count; i++) {
      elevatorsArray.push({
        id: i,
        isAvailable: true,
        position: 1,
        lastPosition: 0,
        animationTime: 0
      });
    }
    
    return elevatorsArray;
  }
}
