import next from "next";

const PORT = Number(process.env.PORT) || 3000;
// const hostname = 'localhost'

export const nextApp = next({
  dev: process.env.NODE_ENV !== "production",
  port: PORT,
});


// const HOST = process.env.HOSTNAME || '0.0.0.0'; 

// export const nextApp = next({
//   dev: process.env.NODE_ENV !== "production",
//   dir: '../', // Укажите путь к корневой директории вашего приложения
//   conf: { 
//     distDir: 'dist' // Укажите директорию, где будет храниться сборка Next.js
//   },
//   port: PORT,
//   hostname: HOST
// });

export const nextHandler = nextApp.getRequestHandler();
