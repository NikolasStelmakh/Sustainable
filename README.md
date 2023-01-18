# Sustainable

1) Download repo
2) Open `/client`, create `.env` file and paste envs from `.env.example`
3) Open `/server`, create `.env` file and paste envs from `.env.example`
4) Install docker-compose on your pc
5) Open terminal in root directory and run: `docker-compose build`
6) Open terminal in root directory and run: `docker-compose up`
7) Open `/server` in terminal, run `npm run build` then `npm run migrate:prod` then `npm run seed` then `npm run server:prod` (need to research how to fix prisma issue in docker, to avoid this step)
8) Open browser and go to `localhost:3010`
