from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from routes.auth import auth
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    print('Starting...')
    yield
    print('Closing...')

app = FastAPI(lifespan=lifespan)
app.include_router(auth)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://192.168.1.10:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)