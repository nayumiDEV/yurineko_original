## How to run

# Dev:

```bash
npm run dev
# or
yarn dev
```

# Production:

```bash
#build
docker build . -t client-nextjs
#run
docker run -p 3000:3000 client-nextjs
```
