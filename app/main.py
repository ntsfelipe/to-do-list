from fastapi import FastAPI, HTTPException
from app.models.task import Task, TaskCreate
from app.repositories.task_repository import delete_task, get_task, create_task, get_tasks, update_task
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok",
            "instance": os.getenv("INSTANCE_ID", "local")} 

@app.get("/tasks")
async def read_tasks():
    tasks = get_tasks()
    return tasks

@app.get("/tasks/{task_id}")
async def read_task(task_id: str):
    task = get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.post("/tasks")
async def create_task_route(task: TaskCreate):
    created_task = create_task(task)

    return created_task

@app.put("/tasks/{task_id}")
async def update_task_route(task_id: str, task: TaskCreate):
    updated_task = update_task(task_id, task)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task

@app.delete("/tasks/{task_id}")
async def delete_task_route(task_id: str):
    deleted_task = delete_task(task_id)
    if not deleted_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}