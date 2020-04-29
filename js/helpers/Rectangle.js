class Rectangle extends Bodies.rectangle {
  constructor(x, y, w, h, isStatic = false, angle, c = "black") {
    super(x + w / 2, y + h / 2, w, h, {
      isStatic: isStatic,
      render: {
        fillStyle: c
      }
    });

    Body.rotate(this, rads(angle));
  }
}
