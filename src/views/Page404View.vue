<template>
  <main>
    <div ref="canvas" class="canvas absolute top-0 left-0"></div>
    <div class="absolute top-0 left-0 flex flex-col w-full h-screen justify-center items-center inter font-[400] text-[#E4E4E7] gap-12">
      <div class="sm:text-6xl text-3xl">
        This Page Doesn't Exist!
      </div>
      <a href="/" class="px-4 py-3 bg-[#FF9046] text-xl rounded-full flex flex-row gap-1 justify-center items-center shadow-[inset_0_2px_5px_rgba(255,255,255,0.5)] hover:shadow-[inset_0_2px_5px_rgba(255,255,255,0.8)] transition-all duration-200">
        <span>Go Home</span>
        <Icon icon="solar:arrow-right-linear" width="25" height="25"/>
      </a>
    </div>
  </main>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Matter from 'matter-js';
import { onMounted, ref } from 'vue';

onMounted(() => {
  const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Composite = Matter.Composite,
      Bodies = Matter.Bodies;

  // create engine
  const engine = Engine.create(),
      world = engine.world;

  // create renderer
  const render = Render.create({
      element: canvas.value,
      engine: engine,
      options: {
          width: window.innerWidth,
          height: window.innerHeight,
          showAngleIndicator: false,
          wireframes: false
      }
  });

  Render.run(render);

  // create runner
  const runner = Runner.create();
  Runner.run(runner, engine);

  // add bodies
  const options = { isStatic: true };

  world.bodies = [];

  // these static walls will not be rendered in this sprites example, see options
  Composite.add(world, [
      Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 1, options),
      Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 1, options),
      Bodies.rectangle(0, window.innerHeight / 2, 1, window.innerHeight, options),
      Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 1, window.innerHeight, options)
  ]);

  engine.gravity.y = 0.5;

  let pieces = [];
  for (let i = 0; i < 20; i++) {
      let scale = (i % 7 === 0 ? 1 : (i % 4 === 0 ? 0.8 : 0.5));

      pieces[i] = Bodies.rectangle(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 300 * scale, 150 * scale, {
          render: {
              strokeStyle: '#ffffff',
              sprite: {
                  texture: './404.png',
                  xScale: scale,
                  yScale: scale
              }
          }
      })
  }

  Composite.add(world, pieces);
})

const canvas = ref();
</script>
