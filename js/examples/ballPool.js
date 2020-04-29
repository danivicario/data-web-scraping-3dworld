var Example = Example || {};

Example.ballPool = function() {
  function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
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
  }

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

  var body = Bodies.rectangle(w2, 300, 500, 20, {
    angle: Math.PI / 2,
    friction: 0,
    render: {
      fillStyle: colors.red
    }
  });
  World.add(world, body);

  var constraint = Constraint.create({
      pointA: { x: w2, y: 300 },
      bodyB: body
  });
  World.add(world, constraint);

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
      y: -1000
    },
    max: {
      x: w,
      y: h - 100
    }
  });

  // wrapping using matter-wrap plugin
  var allBodies = Composite.allBodies(world);

  for (var i = 0; i < allBodies.length; i += 1) {
    allBodies[i].plugin.wrap = {
      min: {
        x: render.bounds.min.x - 1000,
        y: render.bounds.min.y
      },
      max: {
        x: render.bounds.max.x + 1000,
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
  module.exports = Example[Object.keys(Example)[0]];
}
