function fountain(x, y, total = 35) {
    let hits = 0;
    let intervalID;

    intervalID = setInterval(() => {
      World.add(
        world,
        Bodies.circle(x, y, randomInt(6, 12), { friction: 10, restitution: 0 })
      );

      if (hits++ > total) clearInterval(intervalID);
    }, 10);
  }