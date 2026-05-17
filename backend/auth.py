from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
app = FastAPI()

# Cấu hình CORS để React (port 5173) gọi
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/login")
async def login(data: LoginRequest):
    # Data Test: admin / 123456
    if data.username == "admin" and data.password == "123456":
        return {
            "access_token": "fake-jwt-token",
            "token_type": "bearer"
        }
    raise HTTPException(status_code=401, detail="Sai tài khoản hoặc mật khẩu rồi bạn ơi!")

@app.get("/")
def read_root():
    return {"message": "Backend is running!"}