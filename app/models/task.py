from pydantic import BaseModel

class Task(BaseModel):
    id: int
    title: str 
    description: str 

class TaskCreate(BaseModel):
    title: str
    description: str