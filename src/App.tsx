import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const images = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=2070',
    title: 'Digital Innovation',
    description: 'Transforming ideas into digital experiences'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=2064',
    title: 'Creative Design',
    description: 'Crafting unique visual identities'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070',
    title: 'Future Tech',
    description: "Building tomorrow's solutions today"
  }
];

const SplitText = ({ children }: { children: string }) => {
  return (
    <span className="inline-block whitespace-nowrap">
      {children.split('').map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          initial={{ y: 0 }}
          whileInView={{
            y: [0, -20, 0],
            transition: {
              duration: 1.5,
              delay: index * 0.1,
              repeat: Infinity,
              repeatDelay: 5
            }
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

function App() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  const { scrollYProgress } = useScroll();
  const titleX = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const subtitleX = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x - rect.width / 2);
    mouseY.set(y - rect.height / 2);
  };

  return (
    <div className="min-h-[200vh] bg-black text-white overflow-hidden">
      <div className="h-screen flex items-center relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="flex flex-col gap-4"
            style={{ x: titleX, opacity }}
          >
            <motion.h1 
              className="text-8xl font-bold tracking-tighter"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <SplitText>We Create Digital</SplitText>
            </motion.h1>
            <motion.h1 
              className="text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
              style={{ x: subtitleX }}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <SplitText>Experiences</SplitText>
            </motion.h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              className="relative h-[500px] rounded-2xl overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onMouseMove={handleMouseMove}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  x: hoveredIndex === index ? springX : 0,
                  y: hoveredIndex === index ? springY : 0,
                }}
              >
                <motion.img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                  style={{
                    filter: hoveredIndex !== null && hoveredIndex !== index 
                      ? 'grayscale(100%) contrast(200%) brightness(50%)' 
                      : 'none',
                    scale: hoveredIndex === index ? 1.05 : 1,
                    transition: 'all 0.5s ease'
                  }}
                />
              </motion.div>
              
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h3 
                  className="text-2xl font-bold mb-2"
                  whileHover={{ x: 10 }}
                >
                  {image.title}
                  <ArrowUpRight className="inline ml-2" />
                </motion.h3>
                <p className="text-gray-300">{image.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;