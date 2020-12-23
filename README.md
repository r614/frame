# Frame

An image hosting app built with Next.js, Node.js, TensorflowJS and MongoDB.  
An example might be running on [Heroku](https://frame-frontend.herokuapp.com/), give it some time if the first request is slow/fails, the hobby dyno needs some time to spin up 😅

## Getting started

First you'll need a MongoDB instance, either local or cloud. Add this to a .env file in `./backend`, and change `username`, `password` and `url` to your mongodb cluster.
```bash
MONGO_DB=mongodb+srv://<username>:<password>@<url>/frame?retryWrites=true&w=majority
NODE_ENV=local
```

Now you can start both the frontend and server using npm in two different terminal windows: 

```bash
cd frontend
npm i 
npm run dev
```

```bash
cd backend
npm i 
node index.js
```

The frontend will be hosted at [http://localhost:3000](http://localhost:3000) and the server will be running on [http://localhost:4000](http://localhost:4000).
