
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import exploreArrow from "@/assets/JobPortal/Group 2292.svg";
import cloud1 from "@/assets/JobPortal/cloud1.png";
import cloud2 from "@/assets/JobPortal/cloud2.png";
import cloud3 from "@/assets/JobPortal/cloud3.png";
import cloud4 from "@/assets/JobPortal/cloud4.png";
import cloud5 from "@/assets/JobPortal/cloud5.png";
 import Matter from 'matter-js';
import p5 from 'p5'; 
import  CheckCircle from '@/assets/check-circle.svg'


const HeroSection = () => {
  const wordsToDisplay = [
    'Frontend Developer', 'Python Developer', 'UI UX Designer', 
    'DevOps Engineers', 'Backend  Developer', 'Full-Stack Developers', 'React Developer','QA Engineers'
  ];

  const containerRef = useRef(null);
  const matterContainerRef = useRef(null);
  const p5Ref = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || !matterContainerRef.current) return;

    let engine, runner, mouseConstraint;
    let words = [];
    let isTabActive = true;
    let width = window.innerWidth <= 768 ? window.innerWidth - 60 : 413;

    let height = 312;
    let isDragging = false;

    const initializedRefLocal = initializedRef;

    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      .matter-cursor {
        cursor: url("") 12 12, auto;
      }
      .matter-cursor.grab {
        cursor: url("") 12 12, grab;
      }
      .matter-cursor.grabbing {
        cursor: url("") 12 12, grabbing;
      }
    `;
    document.head.appendChild(styleElement);

    const handleMouseLeave = () => {
      matterContainerRef.current.classList.remove('grab', 'grabbing');
    };

    const handleMouseEnter = () => {
      if (!isDragging) {
        matterContainerRef.current.classList.add('grab');
        matterContainerRef.current.classList.remove('grabbing');
      }
    };

    function handleVisibilityChange() {
      isTabActive = !document.hidden;
      if (!isTabActive) {
        Matter.Runner.stop(runner);
      } else {
        Matter.Runner.run(runner, engine);
      }
    }

    function startPhysics() {
      if (initializedRefLocal.current) return;
      initializedRefLocal.current = true;

      const sketch = (p) => {
        p.setup = () => {
          const canvas = p.createCanvas(width, height);
          canvas.parent(matterContainerRef.current);
          canvas.canvas.style.boxShadow = '0px 1px 3px 0px rgba(166, 175, 195, 0.40)';
          canvas.canvas.style.borderRadius = '12px';
          canvas.canvas.style.backgroundColor = '#ffffff';
          matterContainerRef.current.classList.add('matter-cursor', 'grab');

          initPhysics();
          createWords();
        };

        function initPhysics() {
          engine = Matter.Engine.create({ 
            render: { visible: false },
            gravity: { x: 0, y: 0.5 },
            enableSleeping: true,
            positionIterations: 6,
            velocityIterations: 4,
            constraintIterations: 6,
            timing: { timeScale: 1.2 }
          });

          runner = Matter.Runner.create({ delta: 1000 / 60, isFixed: true });
          Matter.Runner.run(runner, engine);

          const boundaryOptions = { 
            isStatic: true, 
            render: { visible: false },
            restitution: 0.7,
            friction: 0.05,
            frictionStatic: 0.1
          };

          const thickness = 25;
          const boundaryGroup = Matter.Body.nextGroup(true);

          Matter.World.add(engine.world, [
            Matter.Bodies.rectangle(width / 2, height + thickness/2, width + thickness*2, thickness, {
              ...boundaryOptions,
              collisionFilter: { group: boundaryGroup }
            }),
            Matter.Bodies.rectangle(width / 2, -thickness/2, width + thickness*2, thickness, {
              ...boundaryOptions,
              collisionFilter: { group: boundaryGroup }
            }),
            Matter.Bodies.rectangle(-thickness/2, height / 2, thickness, height + thickness*2, {
              ...boundaryOptions,
              collisionFilter: { group: boundaryGroup }
            }),
            Matter.Bodies.rectangle(width + thickness/2, height / 2, thickness, height + thickness*2, {
              ...boundaryOptions,
              collisionFilter: { group: boundaryGroup }
            })
          ]);

          const mouse = Matter.Mouse.create(matterContainerRef.current);
          mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse,
            constraint: {
              stiffness: 0.7,
              damping: 0.6,
              angularStiffness: 0.8,
              render: { visible: false }
            }
          });

          Matter.Events.on(mouseConstraint, "mousedown", function(event) {
            if (event.source.body) {
              isDragging = true;
              matterContainerRef.current.classList.remove('grab');
              matterContainerRef.current.classList.add('grabbing');
            }
          });

          Matter.Events.on(mouseConstraint, "mouseup", function() {
            isDragging = false;
            matterContainerRef.current.classList.remove('grabbing');
            matterContainerRef.current.classList.add('grab');
          });

          Matter.Events.on(mouseConstraint, "enddrag", function() {
            isDragging = false;
            matterContainerRef.current.classList.remove('grabbing');
            matterContainerRef.current.classList.add('grab');
          });

          Matter.Events.on(mouseConstraint, "afterUpdate", function() {
            if (mouseConstraint.body) {
              const body = mouseConstraint.body;
              const halfWidth = body.bounds.max.x - body.bounds.min.x;
              const halfHeight = body.bounds.max.y - body.bounds.min.y;

              const newX = Math.max(halfWidth/2, Math.min(width - halfWidth/2, body.position.x));
              const newY = Math.max(halfHeight/2, Math.min(height - halfHeight/2, body.position.y));

              if (newX !== body.position.x || newY !== body.position.y) {
                Matter.Body.setPosition(body, { x: newX, y: newY });
                Matter.Body.setVelocity(body, { 
                  x: body.velocity.x * 0.7, 
                  y: body.velocity.y * 0.7 
                });
              }
            }
          });

          Matter.World.add(engine.world, mouseConstraint);

          Matter.Events.on(engine, 'beforeUpdate', function() {
            const bodies = Matter.Composite.allBodies(engine.world);
            const correctionFactor = 0.3;

            for (let i = 0; i < bodies.length; i++) {
              const body = bodies[i];
              if (body.isStatic || body.isSleeping) continue;

              const halfWidth = (body.bounds.max.x - body.bounds.min.x) / 2;
              const halfHeight = (body.bounds.max.y - body.bounds.min.y) / 2;

              const correction = {
                x: Math.max(0, halfWidth - body.position.x) - 
                   Math.max(0, body.position.x - (width - halfWidth)),
                y: Math.max(0, halfHeight - body.position.y) - 
                   Math.max(0, body.position.y - (height - halfHeight))
              };

              if (correction.x !== 0 || correction.y !== 0) {
                Matter.Body.setPosition(body, {
                  x: body.position.x + correction.x * correctionFactor,
                  y: body.position.y + correction.y * correctionFactor
                });

                if (correction.x !== 0) {
                  Matter.Body.setVelocity(body, {
                    x: body.velocity.x * 0.8,
                    y: body.velocity.y
                  });
                }
                if (correction.y !== 0) {
                  Matter.Body.setVelocity(body, {
                    x: body.velocity.x,
                    y: body.velocity.y * 0.8
                  });
                }
              }
            }
          });

          matterContainerRef.current.addEventListener('mouseleave', handleMouseLeave);
          matterContainerRef.current.addEventListener('mouseenter', handleMouseEnter);
          document.addEventListener("visibilitychange", handleVisibilityChange);
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

            this.isSpecial = [
              'Frontend Developer', 
              'Python Developer', 
              'UI UX Designer'
            ].includes(txt);

            this.body = Matter.Bodies.rectangle(
              x, y, w, h,
              {
                friction: 0.1,
                frictionStatic: 0.2,
                restitution: 0.5,
                density: 0.015,
                chamfer: { radius: 6 },
                collisionFilter: {
                  group: 0,
                  category: 0x0001,
                  mask: 0xFFFFFFFF
                },
                sleepThreshold: 60,
                slop: 0.05
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

            if (this.isSpecial) {
              p.noStroke();
              p.fill('#000000');
              p.rect(0, 0, this.w, this.h, 16);
              p.fill('#ffffff');
            } else {
              p.noFill();
              p.stroke('#037DE8');
              p.strokeWeight(1.5);
              p.rect(0, 0, this.w, this.h, 16);
              p.noStroke();
              p.fill('#000000');
            }

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

          p.push();
          p.fill('#000');
          p.textSize(20);
          p.textStyle(p.NORMAL);
          p.textFont('Poppins');
          p.textAlign(p.LEFT, p.TOP);
          p.text('Popular Positions', 50, 30);
          p.pop();

          Matter.Engine.update(engine);
          for (const w of words) {
            w.show();
          }
        };
      };

      p5Ref.current = new p5(sketch);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startPhysics();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (matterContainerRef.current) {
        matterContainerRef.current.removeEventListener('mouseleave', handleMouseLeave);
        matterContainerRef.current.removeEventListener('mouseenter', handleMouseEnter);
      }
      if (runner) Matter.Runner.stop(runner);
      if (engine && engine.world) {
        Matter.World.clear(engine.world);
        Matter.Engine.clear(engine);
      }
      p5Ref.current?.remove();
      document.head.removeChild(styleElement);
      observer.disconnect();
    };
  }, []);

  return (
      <div>
          <div className="md:h-[600px] h-[auto] relative bg-[linear-gradient(to_bottom,_#75d1ffe3_90%,_#F7F7F7_100%)]">
            <div className="max-w-[1240px] mx-auto ">
            <div className="">
                <nav className="flex justify-between items-center pt-[25px] relative z-10">
                  {/* logo SVG here */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="199" height="52" viewBox="0 0 199 52" fill="none">
                      <path d="M41.8691 0H9.87612C4.42169 0 0 4.42169 0 9.87612V41.8691C0 47.3235 4.42169 51.7452 9.87612 51.7452H41.8691C47.3235 51.7452 51.7452 47.3235 51.7452 41.8691V9.87612C51.7452 4.42169 47.3235 0 41.8691 0Z" fill="#0389FF"/>
                      <path d="M44.596 25.0405C44.5992 26.2525 44.3914 27.4558 43.9818 28.5966C43.5927 29.7018 43.0309 30.7383 42.3173 31.6675C41.5987 32.5934 40.7602 33.4195 39.8237 34.1243C38.8735 34.8533 37.8432 35.4715 36.7528 35.9668C35.6585 36.4579 34.5132 36.8266 33.3379 37.0662C31.6406 37.4025 29.8992 37.4544 28.1849 37.2198C27.4154 37.1202 26.6554 36.9579 25.9124 36.7346C25.8264 36.7346 25.7343 36.6731 25.7281 36.5687C25.722 36.4643 25.7957 36.409 25.851 36.3476C26.3625 35.8259 26.8327 35.2653 27.2575 34.6709C28.1423 33.4588 28.8458 32.1243 29.3457 30.7094C29.5921 30.0073 29.7811 29.2863 29.9108 28.5536C30.0271 27.8201 30.0887 27.079 30.095 26.3364C30.095 26.1951 30.095 26.0539 30.095 25.9126L31.6489 26.6066C31.8776 26.7087 32.1241 26.7646 32.3744 26.7714C32.6247 26.7782 32.8739 26.7356 33.1077 26.646C33.3415 26.5565 33.5554 26.4218 33.7372 26.2495C33.919 26.0773 34.065 25.871 34.1671 25.6424C34.2691 25.4137 34.3251 25.1672 34.3319 24.9169C34.3386 24.6666 34.296 24.4174 34.2065 24.1836C34.1169 23.9497 33.9822 23.7358 33.81 23.5541C33.6378 23.3723 33.4315 23.2262 33.2028 23.1242L31.7656 22.51L28.8666 21.1772C28.415 20.9795 27.9044 20.9641 27.4417 21.1342L22.9582 22.8171C22.5963 22.9535 22.2848 23.1972 22.0653 23.5155C21.8458 23.8338 21.7287 24.2116 21.7298 24.5982C21.7288 24.8271 21.7705 25.0541 21.8526 25.2677C21.94 25.5027 22.073 25.7181 22.244 25.9015C22.4151 26.0848 22.6208 26.2324 22.8492 26.3357C23.0777 26.4391 23.3243 26.4962 23.5749 26.5037C23.8256 26.5112 24.0752 26.4689 24.3094 26.3794L25.7957 25.7959C25.7957 25.7959 25.7957 25.8512 25.7957 25.8819C25.8902 26.8316 25.8613 27.7895 25.7097 28.7317C25.307 31.2122 24.0531 33.475 22.1635 35.1315C20.2738 36.788 17.8664 37.7348 15.3545 37.8094C13.3794 37.7822 11.4789 37.0508 9.9952 35.7469C8.51146 34.4429 7.54197 32.6521 7.26127 30.6969C6.98058 28.7417 7.40712 26.7505 8.46411 25.0818C9.5211 23.4131 11.1391 22.1766 13.0268 21.5949C13.0991 21.5733 13.1624 21.5286 13.2067 21.4675C13.2511 21.4065 13.2742 21.3325 13.2724 21.2571C13.2538 19.4338 13.8223 17.6529 14.8939 16.1777C15.6796 15.1022 16.7044 14.224 17.8875 13.6122C19.0705 13.0004 20.3796 12.6718 21.7114 12.6523H22.0307C23.1983 12.6866 24.3463 12.9612 25.403 13.4589C26.4597 13.9567 27.4026 14.6668 28.1726 15.5451C28.2246 15.6014 28.2936 15.6391 28.369 15.6524C28.4444 15.6657 28.5222 15.6539 28.5903 15.6188C30.231 14.7316 32.0732 14.2836 33.9381 14.3181C35.8031 14.3527 37.6274 14.8687 39.2341 15.8161C40.8409 16.7634 42.1755 18.11 43.1085 19.7251C44.0415 21.3403 44.5412 23.1691 44.5591 25.0343L44.596 25.0405Z" fill="white"/>
                      <path d="M63.3955 33.5499V21.3574H58.5872V18.5239H71.6813V21.3574H66.873V33.5499H63.3955Z" fill="black"/>
                      <path d="M79.813 33.5499V31.296L79.5983 30.8023V26.7667C79.5983 26.0512 79.3765 25.4931 78.9329 25.0924C78.5036 24.6917 77.8381 24.4914 76.9366 24.4914C76.3212 24.4914 75.713 24.5915 75.112 24.7919C74.5253 24.9779 74.0244 25.2355 73.6094 25.5647L72.4073 23.2249C73.0369 22.7813 73.7954 22.4378 74.6827 22.1945C75.5699 21.9512 76.4715 21.8296 77.3874 21.8296C79.1476 21.8296 80.5142 22.2446 81.4873 23.0746C82.4604 23.9046 82.947 25.1997 82.947 26.9599V33.5499H79.813ZM76.2926 33.7217C75.391 33.7217 74.6183 33.5714 73.9743 33.2709C73.3303 32.9561 72.8366 32.5339 72.4931 32.0044C72.1497 31.4749 71.978 30.881 71.978 30.2227C71.978 29.5358 72.1425 28.9348 72.4717 28.4196C72.8151 27.9044 73.3518 27.5037 74.0816 27.2175C74.8115 26.917 75.7631 26.7667 76.9366 26.7667H80.0062V28.7201H77.3015C76.5144 28.7201 75.9706 28.8489 75.6701 29.1065C75.3839 29.3641 75.2408 29.6861 75.2408 30.0725C75.2408 30.5018 75.4053 30.8453 75.7345 31.1028C76.0779 31.3461 76.543 31.4678 77.1298 31.4678C77.6879 31.4678 78.1888 31.339 78.6324 31.0814C79.076 30.8095 79.398 30.4159 79.5983 29.9008L80.1135 31.4463C79.8702 32.1904 79.4266 32.7557 78.7826 33.1421C78.1387 33.5285 77.3087 33.7217 76.2926 33.7217Z" fill="black"/>
                      <path d="M85.9777 33.5499V17.6223H89.3264V33.5499H85.9777Z" fill="black"/>
                      <path d="M98.1656 33.7217C96.849 33.7217 95.6899 33.4641 94.6881 32.9489C93.7007 32.4337 92.9351 31.7325 92.3913 30.8453C91.8475 29.9437 91.5756 28.9205 91.5756 27.7756C91.5756 26.6165 91.8403 25.5933 92.3698 24.706C92.9136 23.8045 93.6506 23.1032 94.5808 22.6024C95.511 22.0872 96.5628 21.8296 97.7363 21.8296C98.8668 21.8296 99.8829 22.0729 100.784 22.5594C101.7 23.0317 102.423 23.7186 102.952 24.6202C103.482 25.5074 103.747 26.5736 103.747 27.8186C103.747 27.9474 103.74 28.0976 103.725 28.2694C103.711 28.4268 103.697 28.577 103.682 28.7201H94.3018V26.7667H101.922L100.634 27.3463C100.634 26.7453 100.513 26.2229 100.269 25.7793C100.026 25.3357 99.6897 24.9922 99.2604 24.749C98.8311 24.4914 98.3302 24.3626 97.7578 24.3626C97.1853 24.3626 96.6773 24.4914 96.2337 24.749C95.8044 24.9922 95.4681 25.3428 95.2248 25.8008C94.9815 26.2444 94.8599 26.7739 94.8599 27.3893V27.9044C94.8599 28.5341 94.9958 29.0922 95.2677 29.5788C95.5539 30.051 95.9475 30.4159 96.4483 30.6735C96.9635 30.9168 97.5646 31.0384 98.2515 31.0384C98.8668 31.0384 99.4035 30.9454 99.8614 30.7594C100.334 30.5734 100.763 30.2943 101.149 29.9222L102.931 31.8541C102.402 32.4552 101.736 32.9203 100.935 33.2494C100.133 33.5643 99.2103 33.7217 98.1656 33.7217Z" fill="black"/>
                      <path d="M112.995 21.8296C113.911 21.8296 114.727 22.0156 115.443 22.3877C116.172 22.7455 116.745 23.3036 117.16 24.0621C117.575 24.8062 117.782 25.765 117.782 26.9385V33.5499H114.434V27.4537C114.434 26.5235 114.226 25.8366 113.811 25.3929C113.41 24.9493 112.838 24.7275 112.094 24.7275C111.564 24.7275 111.085 24.842 110.656 25.0709C110.241 25.2856 109.912 25.6219 109.668 26.0798C109.439 26.5378 109.325 27.1245 109.325 27.84V33.5499H105.976V22.0013H109.175V25.1997L108.574 24.2338C108.989 23.461 109.582 22.8671 110.355 22.4521C111.128 22.0371 112.008 21.8296 112.995 21.8296Z" fill="black"/>
                      <path d="M125.54 33.7217C124.181 33.7217 123.122 33.3782 122.363 32.6913C121.605 31.9901 121.226 30.9526 121.226 29.5788V19.4469H124.574V29.5358C124.574 30.0224 124.703 30.4016 124.961 30.6735C125.218 30.9311 125.569 31.0599 126.012 31.0599C126.542 31.0599 126.993 30.9168 127.365 30.6306L128.266 32.9918C127.923 33.2351 127.508 33.4212 127.021 33.5499C126.549 33.6644 126.055 33.7217 125.54 33.7217ZM119.444 24.8348V22.2589H127.451V24.8348H119.444Z" fill="black"/>
                      <path d="M143.653 33.8075C142.493 33.8075 141.413 33.6215 140.411 33.2494C139.424 32.863 138.565 32.3192 137.835 31.618C137.105 30.9168 136.533 30.094 136.118 29.1495C135.717 28.205 135.517 27.1674 135.517 26.0369C135.517 24.9064 135.717 23.8689 136.118 22.9244C136.533 21.9799 137.105 21.157 137.835 20.4558C138.579 19.7546 139.445 19.2179 140.433 18.8459C141.42 18.4595 142.501 18.2663 143.674 18.2663C144.976 18.2663 146.15 18.4952 147.194 18.9532C148.253 19.3968 149.141 20.0551 149.856 20.928L147.624 22.9888C147.109 22.402 146.536 21.9656 145.906 21.6793C145.277 21.3788 144.59 21.2286 143.846 21.2286C143.145 21.2286 142.501 21.343 141.914 21.572C141.327 21.801 140.819 22.1301 140.39 22.5594C139.96 22.9888 139.624 23.4968 139.381 24.0835C139.152 24.6702 139.037 25.3214 139.037 26.0369C139.037 26.7524 139.152 27.4036 139.381 27.9903C139.624 28.577 139.96 29.0851 140.39 29.5144C140.819 29.9437 141.327 30.2728 141.914 30.5018C142.501 30.7308 143.145 30.8453 143.846 30.8453C144.59 30.8453 145.277 30.7021 145.906 30.4159C146.536 30.1154 147.109 29.6646 147.624 29.0636L149.856 31.1243C149.141 31.9973 148.253 32.6627 147.194 33.1206C146.15 33.5786 144.969 33.8075 143.653 33.8075Z" fill="black"/>
                      <path d="M151.968 33.5499V17.6223H155.317V33.5499H151.968Z" fill="black"/>
                      <path d="M163.92 33.7217C162.689 33.7217 161.595 33.4641 160.636 32.9489C159.691 32.4337 158.94 31.7325 158.382 30.8453C157.838 29.9437 157.566 28.9205 157.566 27.7756C157.566 26.6165 157.838 25.5933 158.382 24.706C158.94 23.8045 159.691 23.1032 160.636 22.6024C161.595 22.0872 162.689 21.8296 163.92 21.8296C165.137 21.8296 166.224 22.0872 167.183 22.6024C168.142 23.1032 168.893 23.7973 169.437 24.6846C169.981 25.5718 170.253 26.6022 170.253 27.7756C170.253 28.9205 169.981 29.9437 169.437 30.8453C168.893 31.7325 168.142 32.4337 167.183 32.9489C166.224 33.4641 165.137 33.7217 163.92 33.7217ZM163.92 30.974C164.478 30.974 164.979 30.8453 165.423 30.5877C165.866 30.3301 166.217 29.9652 166.475 29.4929C166.732 29.0064 166.861 28.4339 166.861 27.7756C166.861 27.103 166.732 26.5306 166.475 26.0584C166.217 25.5861 165.866 25.2212 165.423 24.9636C164.979 24.706 164.478 24.5772 163.92 24.5772C163.362 24.5772 162.861 24.706 162.418 24.9636C161.974 25.2212 161.616 25.5861 161.344 26.0584C161.087 26.5306 160.958 27.103 160.958 27.7756C160.958 28.4339 161.087 29.0064 161.344 29.4929C161.616 29.9652 161.974 30.3301 162.418 30.5877C162.861 30.8453 163.362 30.974 163.92 30.974Z" fill="black"/>
                      <path d="M177.364 33.7217C176.405 33.7217 175.546 33.5356 174.788 33.1636C174.044 32.7915 173.464 32.2262 173.049 31.4678C172.634 30.695 172.426 29.7147 172.426 28.5269V22.0013H175.775V28.0332C175.775 28.992 175.975 29.7004 176.376 30.1583C176.791 30.602 177.371 30.8238 178.115 30.8238C178.63 30.8238 179.088 30.7165 179.489 30.5018C179.889 30.2728 180.204 29.9294 180.433 29.4714C180.662 28.9992 180.777 28.4125 180.777 27.7112V22.0013H184.125V33.5499H180.948V30.373L181.528 31.296C181.142 32.0974 180.569 32.7056 179.811 33.1206C179.067 33.5213 178.251 33.7217 177.364 33.7217Z" fill="black"/>
                      <path d="M192.186 33.7217C191.099 33.7217 190.118 33.4784 189.245 32.9918C188.373 32.491 187.678 31.7969 187.163 30.9097C186.662 30.0224 186.412 28.9777 186.412 27.7756C186.412 26.5592 186.662 25.5074 187.163 24.6202C187.678 23.7329 188.373 23.046 189.245 22.5594C190.118 22.0729 191.099 21.8296 192.186 21.8296C193.159 21.8296 194.011 22.0443 194.741 22.4736C195.471 22.9029 196.036 23.554 196.437 24.427C196.837 25.2999 197.038 26.4161 197.038 27.7756C197.038 29.1208 196.844 30.2371 196.458 31.1243C196.072 31.9973 195.513 32.6484 194.784 33.0777C194.068 33.507 193.202 33.7217 192.186 33.7217ZM192.766 30.974C193.31 30.974 193.803 30.8453 194.247 30.5877C194.691 30.3301 195.041 29.9652 195.299 29.4929C195.571 29.0064 195.707 28.4339 195.707 27.7756C195.707 27.103 195.571 26.5306 195.299 26.0584C195.041 25.5861 194.691 25.2212 194.247 24.9636C193.803 24.706 193.31 24.5772 192.766 24.5772C192.208 24.5772 191.707 24.706 191.263 24.9636C190.82 25.2212 190.462 25.5861 190.19 26.0584C189.932 26.5306 189.804 27.103 189.804 27.7756C189.804 28.4339 189.932 29.0064 190.19 29.4929C190.462 29.9652 190.82 30.3301 191.263 30.5877C191.707 30.8453 192.208 30.974 192.766 30.974ZM195.793 33.5499V31.1887L195.857 27.7542L195.642 24.3411V17.6223H198.991V33.5499H195.793Z" fill="black"/>
                  </svg>
        
                  <ul className="flex gap-[48px]">
                    <li><Link to="">Why us</Link></li>
                    <li><Link to="">About us</Link></li>
                    <li><Link to="">Blog</Link></li>
                  </ul>
                  <Button className="relative bg-[#0481EF] text-white rounded-[12px] p-[10px] w-[110px] h-[38px] border-2 border-[#0481EF] overflow-hidden group">
                    <span className="block text-[16px] text-white font-[600] leading-[18px] relative z-10 translate-y-0 group-hover:-translate-y-[38px] transition-transform duration-300">
                      Sign up
                    </span>
                    <span className="block text-[16px] text-[#fff] font-[600] leading-[18px] absolute top-full left-0 w-full z-0 group-hover:-translate-y-[24px] transition-transform duration-300">
                      Sign up
                    </span>
                  </Button>







                </nav>
                <div className="pt-[66px] relative z-10 pl-[20px] pr-[20px]">
                  <h1 className="text-black text-[32px] md:text-[64px] font-[700] leading-[46px] md:leading-[87px]">
                    Myanmar Talent<br />Global Impact
                  </h1>
                  <p className="md:mt-[35px] mt-[11px] text-[#575757] md:max-w-[783px] w-[100%] ">
                    <span className="text-[#0389FF]">Talent Cloud</span> takes care of hiring, HR, and compliance—creating a smooth experience for <span className="text-[#0389FF]">employers</span> and a supportive environment for <span className="text-[#0389FF]">employees.</span>
                  </p>
                  <div className="flex justify-center md:mt-[80px] mt-[40px]">
                  <Button className="relative bg-[#0389FF] rounded-[26px] p-[10px] md:w-[205px] md:h-[58px] w-[149px] h-[48px] overflow-hidden group hover:border-b-[6px] border-b-[6px] hover:border-l-[6px] border-l-[6px] hover:border-black border-[#0389FF] transition-all duration-300 ease-in-out"> 
                      <span className="block text-white md:text-[20px] text-[14px] font-[600] relative z-10 translate-y-0 group-hover:-translate-y-[60px] transition-transform duration-300">
                        Explore Jobs
                      </span>
                      <span className="block text-white md:text-[20px] text-[14px] font-[600] absolute top-full right-[20px] w-full z-0 md:group-hover:-translate-y-[43px] group-hover:-translate-y-[30px] transition-transform duration-300">
                        Explore Jobs
                      </span>
                      <img
                        src={exploreArrow}
                        alt="→"
                        className="ml-[10px] relative z-10 transition-transform duration-300 group-hover:translate-x-1 w-[24px] h-[24px] md:w-[32px] md:h-[32px]"
                      />
                    </Button>









                  </div>
                </div>
                <div className="cloud hidden md:block">
                  <img src={cloud1} alt="" style={{ "--i": 1 }} />
                  <img src={cloud2} alt="" style={{ "--i": 2 }} />
                  <img src={cloud3} alt="" style={{ "--i": 3 }} />
                  <img src={cloud4} alt="" style={{ "--i": 4 }} />
                  <img src={cloud5} alt="" style={{ "--i": 5 }} />
                </div>
      
              </div>
     
            </div>
           </div>
           <div className="flex md:flex-row flex-col justify-center items-center gap-[25px]  max-w-[1240px] m-auto md:pt-[86px] pt-[28px] pl-[20px] pr-[20px]  flex-wrap lg:flex-nowrap">
              <section className="canvas-section h-full " ref={containerRef}>
              <div id="matter-container" ref={matterContainerRef} />
                </section>
                <div className="flex flex-row md:flex-col gap-[26px] md:w-[399px] w-[100%]">
                <div className="w-[50%] md:w-[100%] h-[87px] md:h-[143px] bg-white rounded-[12px] shadow-[0px_1px_3px_0px_rgba(166,175,195,0.4)] flex flex-col justify-center items-center">
                    <h1 className=" text-[#0481EF] text-[20px] md:text-[32px] md:leading-[31px] leading-[21px] font-[500]">200+
                 </h1>
                  <p className="text-black md:text-[16px] text-[12px] leading-[15px] md:leading-[31px]"> IT Professional</p>
                </div>
                <div className="w-[50%]  md:w-[100%] h-[87px]  md:h-[143px] bg-white rounded-[12px] shadow-[0px_1px_3px_0px_rgba(166,175,195,0.4)] flex flex-col justify-center items-center">
                    <h1 className="text-black   text-[20px] md:text-[32px] md:leading-[31px] leading-[21px] font-[500]">100%
                 </h1>
                  <p className=" text-[#0481EF]  md:text-[16px] text-[12px] leading-[15px] md:leading-[31px] text-center"> The EOR service is already in operation.</p>
                </div>
        
               </div>
                <div className="md:w-[409px] w-[100%]
                h-[313px]  bg-white rounded-[12px] shadow-[0px_1px_3px_0px_rgba(166,175,195,0.4)] flex flex-col justify-center items-start pl-[38px] pr-[24px] lg:gap-[32px] gap-[24px]
        ">
         
                  <div className="flex gap-[24px] items-center">
                   <img src={CheckCircle} alt="" />
                  <p className="text-[#0389FF] ">  Legal Compliance Guarantee</p>
                  </div>
                  <div className="flex gap-[24px] items-center">
                   <img src={CheckCircle} alt="" />
                  <p className="text-[#0389FF] ">  Full HR & Payroll Management</p>
                  </div>
                  <div className="flex gap-[24px] items-center">
                   <img src={CheckCircle} alt="" />
                  <p className="text-[#0389FF] ">  IT Talent Specialization </p>
                  </div>
                  <div className="flex gap-[24px] items-center">
                   <img src={CheckCircle} alt="" />
                  <p className="text-[#0389FF] "> Complete Infrastructure Setup</p>
                  </div>
    

               </div>
          </div>
    </div>
  )
}

export default HeroSection