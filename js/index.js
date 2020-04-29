var AnimatedGIF = AnimatedGIF || {};

AnimatedGIF.gif = function() {
  function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }
  function rads(degs) {
    return (degs * Math.PI) / 180;
  }

  Matter.use("matter-wrap");
  Matter.use("matter-collision-events");

  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Common = Matter.Common,
    World = Matter.World,
    Bodies = Matter.Bodies;
  Body = Matter.Body;
  Constraint = Matter.Constraint;
  Svg = Matter.Svg;
  Query = Matter.Query;

  // create engine
  var engine = Engine.create(),
    world = engine.world;

  const w = 1200;
  const h = 675;
  const w2 = w / 2;
  const h2 = h / 2;

  let colors = {
    pink: "#d44290",
    yellow: "#ffb35f",
    red: "#ff0000",
    black: "#000",
    white: "#fff"
  };

  // create renderer
  var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: w,
      height: h,
      showAngleIndicator: !true,
      wireframes: false,
      background: colors.pink
    }
  });

  Render.run(render);

  // create runner
  var runner = Runner.create();
  Runner.run(runner, engine);

  class Rectangle extends Bodies.rectangle {
    constructor(x, y, w, h, isStatic = false, angle = 0, c = "black") {
      super(x + w / 2, y + h / 2, w, h, {
        isStatic: isStatic,
        render: {
          fillStyle: c
        }
      });

      Body.rotate(this, rads(angle));
    }
  }

  function fountain(x, y, total = 10) {
    let hits = 0;
    let intervalID;

    intervalID = setInterval(() => {
      let big = randomFloat(0, 10);
      let size;
      if (big > 9) {
        size = 20;

        if (big > 9.95) {
          size = 70;
        }
      } else {
        size = 5;
      }

      World.add(
        world,
        Bodies.circle(x + randomInt(-200, 200), y, size, {
          friction: 0,
          restitution: 0.2,
          render: {
            fillStyle: randomInt(0, 1) ? colors.red : colors.yellow
          }
        })
      );

      if (hits++ > total) clearInterval(intervalID);
    }, 50);
  }

  // World.add(world, new Rectangle(w2, h2 / 2, 20, h2 + 100, true, 45, colors.red));
  // World.add(world, new Rectangle(w2 - w2 / 2, h2 / 2, 20, h2 + 100, true, -45, colors.red));
  // World.add(world, new Rectangle(w2, h2 / 2 + 297, 20, h2 + 100, true, -45, colors.red));
  // World.add(world, new Rectangle(w2 - w2 / 2, h2 / 2 + 297, 20, h2 + 100, true, 45, colors.red));

  // World.add(world, new Rectangle(w/6 * 0 - 20, 0, 20, h, true, 0, colors.red))
  // World.add(world, new Rectangle(w/6 * 1, 0, 20, h, true, 0, colors.red))
  // World.add(world, new Rectangle(w/6 * 2, 0, 20, h, true, 0, colors.red))
  // World.add(world, new Rectangle(w/6 * 3, 0, 20, h, true, 0, colors.red))
  // World.add(world, new Rectangle(w/6 * 4, 0, 20, h, true, 0, colors.red))
  // World.add(world, new Rectangle(w/6 * 5, 0, 20, h, true, 0, colors.red))
  // World.add(world, new Rectangle(w/6 * 6, 0, 20, h, true, 0, colors.red))
  // World.add(world, new Rectangle(0, h, w, 20, true, 0, colors.red))

  World.add(
    world,
    Bodies.circle(w2, h, w2 - 100, {
      isStatic: true,
      friction: 10,
      restitution: 0,
      render: {
        fillStyle: colors.white
      }
    })
  );

  World.add(
    world,
    Bodies.circle(-120, h, 200, {
      isStatic: true,
      friction: 10,
      restitution: 0,
      render: {
        fillStyle: colors.black
      }
    })
  );

  World.add(
    world,
    Bodies.circle(w+120, h, 200, {
      isStatic: true,
      friction: 10,
      restitution: 0,
      render: {
        fillStyle: colors.black
      }
    })
  );

  setTimeout(() => fountain(w2, -100, 500), 0);

  // fountain(w2 + 0, h2 + 180);
  // fountain(w2 + 260, h2 + 00);
  // fountain(w2 - 260, h2 + 00);
  // fountain(w2, h2 - 100, 150);

  // var constraint = Constraint.create({
  //     pointA: { x: w2, y: 300 },
  //     bodyB: body
  // });
  // World.add(world, constraint);

  // // Body.applyForce(body, { x: w2, y: 500 }, { x: -0.3, y: 0 });
  // setTimeout(() => {
  //   Body.applyForce(ball1, { x: w2, y: 500 }, { x: -3, y: 0 });
  //   Body.applyForce(ball2, { x: w2, y: 500 }, { x: 3, y: 0 });
  // }, 500)
  // // Body.applyForce(body, { x: w2, y: 500 }, { x: -0.2, y: 0 });
  // // Body.applyForce(body, { x: w2, y: 500 }, { x: -0.2, y: 0 });
  // // Body.applyForce(ball, { x: ball.position.x, y: ball.position.y }, { x: -0.75, y: 0 });

  // fit the render viewport to the scene
  Render.lookAt(render, {
    min: {
      x: 0,
      y: 0
    },
    max: {
      x: w,
      y: h
    }
  });

  // // wrapping using matter-wrap plugin
  var allBodies = Composite.allBodies(world);

  for (var i = 0; i < allBodies.length; i += 1) {
    allBodies[i].plugin.wrap = {
      min: {
        x: render.bounds.min.x,
        y: render.bounds.min.y
      },
      max: {
        x: render.bounds.max.x,
        y: render.bounds.max.y
      }
    };
  }

  // context for MatterTools.Demo
  return {
    engine: engine,
    runner: runner,
    render: render,
    canvas: render.canvas,
    stop: function() {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    }
  };
};

if (typeof module !== "undefined") {
  module.exports = AnimatedGIF[Object.keys(AnimatedGIF)[0]];
}
