from app.models import task
from app.redis_client import redis_client
from fastapi import HTTPException
import json
from app.models.task import Task, TaskCreate, TaskUpdate

def get_task(task_id: str):
    task_data = redis_client.get("task:" + task_id)
    if task_data:
        return json.loads(task_data)
    else:
        return None

def get_tasks():
    tasks = []
    for key in redis_client.scan_iter(match="task:*"):
        task_data = redis_client.get(key)
        if task_data:
            tasks.append(json.loads(task_data))
    return tasks


def create_task(task_data: TaskCreate):

    task_data = Task(id=int(redis_client.incr("task_id_counter")), title=task_data.title, description=task_data.description, completed=task_data.completed)
    redis_client.set("task:" + str(task_data.id), task_data.model_dump_json())
    
    return task_data


def update_task(task_id: str, task_data: TaskUpdate):
    existing_task = get_task(task_id)

    if not existing_task:
       return None

    task = Task(**existing_task) 

    updates = task_data.model_dump(exclude_unset=True)
    updated_task = task.model_copy(update=updates)
    redis_client.set("task:" + str(updated_task.id), updated_task.model_dump_json())

    return updated_task

def delete_task(task_id: str):
    existing_task = get_task(task_id)

    if not existing_task:
        return None

    redis_client.delete("task:" + task_id)
    return existing_task