const Clock = require('./clock');

module.exports = class Scheduler {
    constructor(precision){
        this.tasks = new Clock(precision || 1000);
        this.tasks.start();
        this.scheduled = {};
    }

    static isOutdated(date){
        const now = new Date().getTime();
        return date <= now;
    }

    schedule(task, callback){
        const date = new Date(Date.parse(task.date)).setMilliseconds(0)
        // Remove previous scheduled task
        this.unschedule(task.id);

        if(Scheduler.isOutdated(date)){
            console.log(new Date().toISOString(), 'executing outdated', task.id, 'date', task.date);
            return callback();
        }
        
        // Assigns a function that calls the job with data as param
        this.scheduled[task.id] = {
            run: callback,
            date: task.date // For logging reasons schedule the original form
        }

        console.log(new Date().toISOString(), 'Scheduling', task.id, 'date', task.date);
        return this.tasks.once(date, this.scheduled[task.id]['run']);
    }
    /*
    * TODO: Test when task is not defined
    * TODO: Test if it's removing the event and the task entry
    */
    unschedule(id){
        const task = this.scheduled[id];
        if(task){
            console.log('Unscheduling', id, 'date', task.date);
            const {date, run} = task;
            this.tasks.off(Date.parse(date), run);
            delete this.scheduled[id];
        }
        return false;
    }
}