import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { stat } from 'fs';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }
    
    getTasksWithFilter(filterDto: GetTaskFilterDto): Task[] {
        const { status, search } = filterDto;

        let tasks = this.getAllTasks();

        if(status) {
            tasks = tasks.filter(task => task.starus === status);
        }

        if(search) {
            tasks = tasks.filter(task => 
                task.title.includes(search) || 
                task.description.includes(search)
            );
        }

        return this.tasks;
    }

    getTaskById(id: string){
        return this.tasks.find(task => task.id = id);
    }

    //TODO: add uuid library
    createTask(createTasksDto: CreateTaskDto) {
        const { title, description } = createTasksDto;
        const task: Task = {
            id: 'uuid()',
            title,
            description,
            starus: TaskStatus.OPEN,            
        };

        this.tasks.push(task);
        return task;
    }

    updateTaskStatus(id: string, status: TaskStatus){
        const task = this.getTaskById(id);
        task.starus = status;
        return task;    
    }

    deleteTask(id: string){
        this.tasks = this.tasks.filter(task => task.id !== id);
    }
}
