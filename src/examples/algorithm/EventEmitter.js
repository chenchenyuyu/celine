// 1. 观察者模式， 事件监听lisener
class EventEmitter {
    constructor(){
        this.events = {}; // {'click': [], 'move': []}
        this.maxLisener = 10;
    }

    // type事件类型 lisener事件 prepend为true表示向队列头部添加事件
    addLisener(type, lisener, prepend){
        if(!this.events) {
            this.events = {};
        }
        if(this.events[type]) {
            if(prepend) {
                this.events[type].unshift(lisener);
            } else {
                this.events[type].push(lisener);
            }
        } else {
            this.events[type] = [lisener]; // 第一次添加事件
        }
    }

    removeLisener(type, lisener){
        if(Array.isArray(this.events[type])){
            if(!lisener) {
                delete this.events[type]; //删除整个事件
            } else {
                // 删除特定事件
                this.events[type] = this.events[type].filter((i) => (i!== lisener));
            }
        }
    }
    //向事件队列添加事件，只执行一次
    once(type, lisener) {
        //事件只执行一次
        const only = (...args) => {
            lisener.apply(this, args);
            this.removeLisener(type, lisener);
        }
        only.origin = lisener;
        this.addLisener(type, only); 
    }
    // 执行某类所有事件， 执行所有click事件
    emit(type, args){
        if(this.events[type]){
            this.events[type].forEach(e => {
                e.apply(this, args);
            });
        }
    }
}