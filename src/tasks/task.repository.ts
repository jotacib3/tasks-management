import { EntityRepository, Repository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{
    async getTasks(
        filterDto: GetTaskFilterDto,
        user: User,
        ): Promise<Task[]> {
        const { status, search } = filterDto;   
        const query = this.createQueryBuilder('task');
        
        query.where('task.userId =:userId', { userId: user.id});

        if(status){
            query.andWhere('task.status = :status', { status });
        }

        if(status){
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
        }

        const tasks = await query.getMany();
        return tasks;
    }
    
    async createTask(
        createTasksDto: CreateTaskDto,
        user: User,
        ): Promise<Task> {
        const { title, description } = createTasksDto;

        const task: Task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;                    
        await task.save();
        
        delete task.user;

        return task;
    }
}