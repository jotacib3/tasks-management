import { Controller, Get, Body, Post, Param, Delete, Patch, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus} from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService){}

    @Get()
    getAllTasks(@Query() filterDto: GetTaskFilterDto): Task[] {
        if(Object.keys(filterDto).length) {
            return this.tasksService.getAllTasks();
        } else {
            return this.tasksService.getTasksWithFilter(filterDto);
        }
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string){
        return this.tasksService.getTaskById(id);
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto): Task {
        return this.tasksService.createTask(createTaskDto);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string){
        this.tasksService.deleteTask(id);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id') id: string,
        @Body('status') status: TaskStatus
    ){
        return this.tasksService.updateTaskStatus(id, status);
    }

}
