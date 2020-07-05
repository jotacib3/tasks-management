import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ){}
    
    async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto);
    }

    getTaskById(id: number): Promise<Task> {
        const found = this.taskRepository.findOne(id);

        if(!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return found;
    }

    async createTask(createTasksDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTasksDto);
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;    
    }

    async deleteTask(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);
        
        if(result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }
}
