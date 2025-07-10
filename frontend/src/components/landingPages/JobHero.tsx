import React from 'react'

const JobHero = () => {
  return (
    <div>JobHero</div>
  )
}

export default JobHero
/*   useEffect(() => {
    if (!containerRef.current || !matterContainerRef.current) return;

    let engine, runner, mouseConstraint;
    let words = [];
    let isTabActive = true;

    const sketch = (p) => {
      let width = 413;
      let height = 312;

      p.setup = () => {
        const canvas = p.createCanvas(width, height);
        canvas.parent(matterContainerRef.current);
        canvas.canvas.style.boxShadow = '0px 1px 3px 0px rgba(166, 175, 195, 0.40)';
        canvas.canvas.style.borderRadius = '8px';
        canvas.canvas.style.backgroundColor = '#ffffff';

        initPhysics();
        createWords();
      };

      function initPhysics() {
        engine = Matter.Engine.create({ render: { visible: false } });
        runner = Matter.Runner.create();

        Matter.Runner.run(runner, engine);

        const opts = { isStatic: true, render: { visible: false } };
        Matter.World.add(engine.world, [
          Matter.Bodies.rectangle(width / 2, height - 10, width, 20, opts),
          Matter.Bodies.rectangle(width / 2, 10, width, 20, opts),
          Matter.Bodies.rectangle(0, height / 2, 20, height, opts),
          Matter.Bodies.rectangle(width, height / 2, 20, height, opts),
        ]);

        const mouse = Matter.Mouse.create(matterContainerRef.current);
        mouseConstraint = Matter.MouseConstraint.create(engine, {
          mouse,
          constraint: {
            stiffness: 0.2,
            render: { visible: false },
          },
        });

        Matter.World.add(engine.world, mouseConstraint);

        // Visibility change handler
        document.addEventListener("visibilitychange", handleVisibilityChange);
      }

      function handleVisibilityChange() {
        isTabActive = !document.hidden;

        if (!isTabActive) {
          Matter.Runner.stop(runner);
        } else {
          Matter.Runner.run(runner, engine);
        }
      }

      function createWords() {
        const paddingX = 80;
        const paddingY = 40;

        words = wordsToDisplay.map(w =>
          new Word(
            p.random(paddingX, width - paddingX),
            p.random(paddingY, height / 2),
            w
          )
        );
      }

      class Word {
        constructor(x, y, txt) {
          const w = 142;
          const h = 30;
          this.txt = txt;
          this.w = w;
          this.h = h;
          this.body = Matter.Bodies.rectangle(
            x, y, w, h,
            {
              friction: 0.3,
              restitution: 0.9,
              density: 0.01,
              chamfer: { radius: 6 }
            }
          );
          Matter.World.add(engine.world, this.body);
        }

        show() {
          const { x, y } = this.body.position;
          p.push();
          p.translate(x, y);
          p.rotate(this.body.angle);
          p.rectMode(p.CENTER);
          p.noFill();
          p.stroke('#037DE8');
          p.strokeWeight(1.5);
          p.rect(0, 0, this.w, this.h, 6);
          p.noStroke();
          p.fill('#000000');
          p.textSize(12);
          p.textAlign(p.CENTER, p.CENTER);
          p.text(this.txt, 0, 0);
          p.pop();
        }
      }

      p.draw = () => {
        if (!isTabActive) return;

        p.clear();
        p.background('#ffffff');
        Matter.Engine.update(engine);
        for (const w of words) {
          w.show();
        }
      };
    };

    p5Ref.current = new p5(sketch);

    return () => {
      // Cleanup
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (runner) Matter.Runner.stop(runner);
      if (engine && engine.world) {
        Matter.World.clear(engine.world);
        Matter.Engine.clear(engine);
      }
      p5Ref.current?.remove();
    };
  }, []);
  */