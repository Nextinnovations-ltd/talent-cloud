/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import { Button } from "@/components/ui/button";
import TalentCloudLogoImg from "@/assets/JobPortal/Vector (3).svg";
import cloud1 from "@/assets/JobPortal/cloud1.png";
import cloud2 from "@/assets/JobPortal/cloud2.png";
import cloud3 from "@/assets/JobPortal/cloud3.png";
import cloud4 from "@/assets/JobPortal/cloud4.png";
import cloud5 from "@/assets/JobPortal/cloud5.png";
import Matter from 'matter-js';
 //@ts-expect-error
import p5 from 'p5';
import CheckCircle from '@/assets/check-circle.svg'
import './HeroSection.css'
import CommonButton from "../commonBtn/button";
import { useLocation } from 'react-router-dom';
import { motion } from "framer-motion";


const HeroSection = () => {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const navigate = useNavigate();
  const wordsToDisplay = [
    'Frontend Developer', 'Python Developer', 'UI/UX Designer', 
    'DevOps Engineers', 'Backend  Developer', 'Full-Stack Developers', 'React Developer','QA Engineers'
  ];

  const containerRef = useRef(null);
  const matterContainerRef = useRef<HTMLDivElement | null>(null);

  const p5Ref = useRef(null);
  const initializedRef = useRef(false);



  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // scrolling down → hide
        setShowNavbar(false);
      } else {
        // scrolling up → show
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    if (!containerRef.current || !matterContainerRef.current) return;

    let engine: Matter.Engine, runner: Matter.Runner, mouseConstraint: Matter.Composite | Matter.Body | Matter.Constraint | Matter.MouseConstraint | (Matter.Composite | Matter.Body | Matter.Constraint | Matter.MouseConstraint)[];
    let words: any[] = [];
    let isTabActive = true;
    const width = window.innerWidth <= 768 ? window.innerWidth - 60 : 413;

    const height = 312;
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
      matterContainerRef.current?.classList.remove('grab', 'grabbing');
    };

    const handleMouseEnter = () => {
      if (!isDragging) {
        matterContainerRef.current?.classList.add('grab');
        matterContainerRef.current?.classList.remove('grabbing');
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

      const sketch = (p: { setup: () => void; createCanvas: (arg0: number, arg1: number) => any; random: (arg0: number, arg1: number) => any; push: () => void; translate: (arg0: any, arg1: any) => void; rotate: (arg0: any) => void; rectMode: (arg0: any) => void; CENTER: any; noStroke: () => void; fill: (arg0: string) => void; rect: (arg0: number, arg1: number, arg2: any, arg3: any, arg4: number) => void; noFill: () => void; stroke: (arg0: string) => void; strokeWeight: (arg0: number) => void; textSize: (arg0: number) => void; textAlign: (arg0: any, arg1: any) => void; text: (arg0: string, arg1: number, arg2: number) => void; pop: () => void; draw: () => void; clear: () => void; background: (arg0: string) => void; textStyle: (arg0: any) => void; NORMAL: any; textFont: (arg0: string) => void; LEFT: any; TOP: any; }) => {
        p.setup = () => {
          const canvas = p.createCanvas(width, height);
          canvas.parent(matterContainerRef.current);
          canvas.canvas.style.boxShadow = '0px 1px 3px 0px rgba(166, 175, 195, 0.40)';
          canvas.canvas.style.borderRadius = '12px';
          canvas.canvas.style.backgroundColor = '#FAFAFA';
          matterContainerRef.current?.classList.add('matter-cursor', 'grab');

          initPhysics();
          createWords();
        };

        function initPhysics() {
          engine = Matter.Engine.create({
             //@ts-expect-error
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
            Matter.Bodies.rectangle(width / 2, height + thickness / 2, width + thickness * 2, thickness, {
              ...boundaryOptions,
              collisionFilter: { group: boundaryGroup }
            }),
            Matter.Bodies.rectangle(width / 2, -thickness / 2, width + thickness * 2, thickness, {
              ...boundaryOptions,
              collisionFilter: { group: boundaryGroup }
            }),
            Matter.Bodies.rectangle(-thickness / 2, height / 2, thickness, height + thickness * 2, {
              ...boundaryOptions,
              collisionFilter: { group: boundaryGroup }
            }),
            Matter.Bodies.rectangle(width + thickness / 2, height / 2, thickness, height + thickness * 2, {
              ...boundaryOptions,
              collisionFilter: { group: boundaryGroup }
            })
          ]);
          //@ts-expect-error
          const mouse = Matter.Mouse.create(matterContainerRef.current);
          mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse,
            constraint: {
              stiffness: 0.7,
              damping: 0.6,
               //@ts-expect-error
              angularStiffness: 0.8,
              render: { visible: false }
            }
          });

          Matter.Events.on(mouseConstraint, "mousedown", function (event) {
            if (event.source.body) {
              isDragging = true;
              matterContainerRef.current?.classList.remove('grab');
              matterContainerRef.current?.classList.add('grabbing');
            }
          });

          Matter.Events.on(mouseConstraint, "mouseup", function () {
            isDragging = false;
            matterContainerRef.current?.classList.remove('grabbing');
            matterContainerRef.current?.classList.add('grab');
          });

          Matter.Events.on(mouseConstraint, "enddrag", function () {
            isDragging = false;
            if (matterContainerRef.current) {
              matterContainerRef.current?.classList.remove('grabbing');
            }
           
            if (matterContainerRef.current) {
              matterContainerRef.current?.classList.add('grab');
            }
            
          });

          Matter.Events.on(mouseConstraint, "afterUpdate", function () {
             //@ts-expect-error
            if (mouseConstraint.body) {
               //@ts-expect-error
              const body = mouseConstraint.body;
              const halfWidth = body.bounds.max.x - body.bounds.min.x;
              const halfHeight = body.bounds.max.y - body.bounds.min.y;

              const newX = Math.max(halfWidth / 2, Math.min(width - halfWidth / 2, body.position.x));
              const newY = Math.max(halfHeight / 2, Math.min(height - halfHeight / 2, body.position.y));

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

          Matter.Events.on(engine, 'beforeUpdate', function () {
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

          matterContainerRef.current?.addEventListener('mouseleave', handleMouseLeave);
          matterContainerRef.current?.addEventListener('mouseenter', handleMouseEnter);
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
          constructor(x: number, y: number, txt: string) {
            const w = 142;
            const h = 30;

             //@ts-expect-error
            this.txt = txt;
             //@ts-expect-error
            this.w = w;
             //@ts-expect-error
            this.h = h;

             //@ts-expect-error
            this.isSpecial = [
              'Frontend Developer',
              'Python Developer',
              'UI UX Designer'
            ].includes(txt);

             //@ts-expect-error
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
             //@ts-expect-error
            Matter.World.add(engine.world, this.body);
          }

          show() {
             //@ts-expect-error
            const { x, y } = this.body.position;
            p.push();
            p.translate(x, y);
             //@ts-expect-error
            p.rotate(this.body.angle);
            p.rectMode(p.CENTER);

             //@ts-expect-error
            if (this.isSpecial) {
              p.noStroke();
              p.fill('#000000');
               //@ts-expect-error
              p.rect(0, 0, this.w, this.h, 16);
              p.fill('#ffffff');
            } else {
              p.noFill();
              p.stroke('#037DE8');
              p.strokeWeight(1.5);
               //@ts-expect-error
              p.rect(0, 0, this.w, this.h, 16);
              p.noStroke();
              p.fill('#000000');
            }

            p.textSize(12);
            p.textAlign(p.CENTER, p.CENTER);
             //@ts-expect-error
            p.text(this.txt, 0, 0);
            p.pop();
          }
        }

        p.draw = () => {
          if (!isTabActive) return;

          p.clear();
          p.background('#FAFAFA ');

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
         //@ts-expect-error
        Matter.World.clear(engine.world);
        Matter.Engine.clear(engine);
      }
       //@ts-expect-error
      p5Ref.current?.remove();
      document.head.removeChild(styleElement);
      observer.disconnect();
    };
  }, []);



  const location = useLocation();

  const linkClass = (hash: string) =>
    `transition-colors duration-300 hover:text-[#0389FF] ${
      location.hash === hash ? "text-[#0389FF]" : ""
    }`;

  return (
    <div onClick={() => setNavIsOpen(!navIsOpen)}>
      <div className="md:h-[600px] h-[auto] relative bg-[linear-gradient(to_bottom,_#75d1ff_90%,_#fff_100%)]">
           <div
            className={`fixed top-0 left-0 right-0 m-auto z-[10000] bg-white shadow-[0_1px_3px_0_#A6AFC366] max-w-[1240px] mx-auto md:rounded-[25px] mt-0 md:mt-[22px]
            transition-transform duration-500 ${showNavbar ? "translate-y-0" : "-translate-y-[120%]"}`}
          >
          <nav className="max-w-[1240px] mx-auto flex justify-between items-center relative z-10 md:px-5 md:py-6 py-[15px] px-[27px]">
            {/* logo SVG here */}
            <img src={TalentCloudLogoImg} alt="" className="w-[185px] md:w-[214px] h-[40px] md:h-[60px] object-cover" />
            <ul className=" gap-[48px] hidden md:flex">
              <li> <HashLink smooth to="#why-us"  className={linkClass("#why-us")}>Why us</HashLink></li>
              <li> <HashLink smooth to="#about-us" className={linkClass("#about-us")}>About us</HashLink></li>
              <li><HashLink smooth to="#faq" className={linkClass("#faq")}>FAQ</HashLink></li>
            </ul>
            <Button onClick={() => navigate('/auth/login')} className="hidden md:flex relative bg-[#0481EF] text-white rounded-[30px] p-[10px] w-[120px] h-[45px] border-2 border-[#0481EF] overflow-hidden group">
              <span className="block text-[16px] text-white font-[400] leading-[18px] relative z-10 translate-y-0 group-hover:-translate-y-[38px] transition-transform duration-300">
                Sign up
              </span>
              <span className="block text-[16px] text-[#fff] font-[400] leading-[18px] absolute top-full left-0 w-full z-0 group-hover:-translate-y-[32px] transition-transform duration-300">
                Sign up
              </span>
            </Button>
            {/* responsive toggle */}
            <div
              className="flex md:hidden flex-col gap-[3px] justify-center items-center cursor-pointer w-[25px] h-[25px]"
              onClick={() => setNavIsOpen(!navIsOpen)}
            >
              {/* Top bar */}
              <div
                className={`w-[25px] h-[3px] rounded-[2px] bg-black transition-all duration-300 ${navIsOpen ? "rotate-45 translate-y-[4px]" : ""
                  }`}
              ></div>

              {/* Middle bar */}
              <div
                className={`w-[25px] h-[3px] rounded-[2px] bg-black transition-all duration-300 ${navIsOpen ? "opacity-0" : ""
                  }`}
              ></div>

              {/* Bottom bar */}
              <div
                className={`w-[25px] h-[3px] rounded-[2px] bg-black transition-all duration-300 ${navIsOpen ? "-rotate-45 -translate-y-[8px]" : ""
                  }`}
              ></div>
            </div>
          </nav>
        </div>



        <div className="max-w-[1240px] mx-auto ">
          <div className="">

            {/* responsive menu */}


            <div className={`flex md:hidden flex-col items-center shadow-[0_1px_3px_0_#A6AFC366] bg-white rounded-bl-[20px] fixed z-[100] w-[60%] right-0 top-0 py-[24px] gap-6 overflow-hidden
                                transition-all duration-500 
                                ${navIsOpen ? "max-h-screen mt-[70px] animate-bouncy-drop " : "max-h-0 mt-0 animate-bouncy-close "}
                              `}>


              <ul className="flex flex-col gap-[24px] transition-opacity duration-300 delay-200">
                <li >  <HashLink smooth to="#why-us" className={linkClass("#why-us")}>Why us</HashLink></li>
                <li>  <HashLink smooth to="#about-us" className={linkClass("#about-us")}>About us</HashLink></li>
                <li><HashLink smooth to="#faq" className={linkClass("#faq")}>FAQ</HashLink></li>
              </ul>

              <Button onClick={() => navigate('/auth/login')}  className="relative bg-[#0481EF] text-white rounded-[30px] p-[10px] w-[120px] h-[45px] border-2 border-[#0481EF] overflow-hidden group">
                <span className="block text-[16px] text-white font-[400] leading-[18px] relative z-10 translate-y-0 group-hover:-translate-y-[38px] transition-transform duration-300">
                  Sign up
                </span>
                <span className="block text-[16px] text-[#fff] font-[400] leading-[18px] absolute top-full left-0 w-full z-0 group-hover:-translate-y-[32px] transition-transform duration-300">
                  Sign up
                </span>
                </Button>
          
            </div>
            <div className="pt-[90px] md:pt-[66px] pb-[40px] relative z-10 pl-[20px] pr-[20px]">
              <h1 className="uppercase text-center text-black mt-[50px] md:mt-[100px] text-[32px] md:text-[46px] lg:text-[64px] font-[700] leading-[46px] md:leading-[60px] lg:leading-[87px]">
                Global Possibilities for 
                <br className="hidden md:block" /> Myanmar Professionals
              </h1>
              <p className="text-center mx-auto md:mt-[35px] mt-[11px] text-[#575757] md:max-w-[783px] w-[100%] ">
                Talent Cloud by Next Innovations handles hiring talents, HR & admin, payroll, management and compliance—making global hiring easy for employers and fully supported for employees.
              </p>
              <div className="flex justify-center md:mt-[80px] mt-[40px]">

                <CommonButton login />








              </div>
            </div>
            <div className="cloud ">
              <img src={cloud1} alt="" style={{ ["--i" as any]: 1 }} />
              <img src={cloud2} alt="" style={{ ["--i" as any]: 2 }} />
              <img src={cloud3} alt="" style={{ ["--i" as any]: 3 }} />
              <img src={cloud4} alt="" style={{ ["--i" as any]: 4 }} />
              <img src={cloud5} alt="" style={{ ["--i" as any]: 5 }} />
            </div>

          </div>

        </div>
      </div>
      <div className="flex md:flex-row flex-col justify-center items-center gap-[25px]  max-w-[1240px]  m-auto md:pt-[86px] pt-[28px] pl-[20px] pr-[20px]  flex-wrap lg:flex-nowrap">
        <section className="canvas-section h-full " ref={containerRef}>
          <div id="matter-container" ref={matterContainerRef} />
        </section>
        <div className="flex flex-row md:flex-col gap-[26px] md:w-[399px] w-[100%]">
          <div className="w-[50%] md:w-[100%] h-[87px] md:h-[143px] bg-[#FAFAFA] rounded-[12px] shadow-[0px_1px_3px_0px_rgba(166,175,195,0.4)] flex flex-col justify-center items-center">
            <h1 className=" text-[#0481EF] text-[20px] md:text-[32px] md:leading-[31px] leading-[21px] font-[500]">200+
            </h1>
            <p className="text-black md:text-[16px] text-[12px] leading-[15px] md:leading-[31px]"> IT Professional</p>
          </div>
          <div className="w-[50%]  md:w-[100%] h-[87px]  md:h-[143px] bg-[#FAFAFA]  rounded-[12px] shadow-[0px_1px_3px_0px_rgba(166,175,195,0.4)] flex flex-col justify-center items-center">
            <h1 className="text-black   text-[20px] md:text-[32px] md:leading-[31px] leading-[21px] font-[500]">100%
            </h1>
            <p className=" text-[#0481EF]  md:text-[16px] text-[12px] leading-[15px] md:leading-[31px] text-center"> The EOR service is already in operation.</p>
          </div>

        </div>
        <div className="md:w-[409px] w-[100%]
                h-[313px]  bg-[#FAFAFA]  rounded-[12px] shadow-[0px_1px_3px_0px_rgba(166,175,195,0.4)] flex flex-col justify-center items-start pl-[38px] pr-[24px] lg:gap-[32px] gap-[24px]
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
            <p className="text-[#0389FF] "> Stable & Productive Work Environment</p>
          </div>


        </div>
      </div>
    </div>
  )
}

export default HeroSection