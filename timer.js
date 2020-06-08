
class Timer{
    constructor(div){
        this.div = div;
        this.times = [0, 0, 0]
        this.running = false
        this.print(this.times)

    }
    start() {
        this.time = performance.now();
        this.running = true;
        requestAnimationFrame(this.step.bind(this));
    }

    stop(){
        this.running = false;
    }

    reset(){
        this.running = false;
        this.times = [0, 0, 0]
        this.print()
    }
    left0(value, count) {
        var result = value.toString();
        for (; result.length < count; --count)
            result = '0' + result;
        return result;
    }

    step(timestamp) {
        if (!this.running) return;
        this.calculate(timestamp);
        this.time = timestamp;
        this.print();
        requestAnimationFrame(this.step.bind(this));
    }
    
    calculate(timestamp) {
        var diff = timestamp - this.time;
        this.times[2] += diff / 10;
        if (this.times[2] >= 100) {
            this.times[1] += 1;
            this.times[2] -= 100;
        }
        if (this.times[1] >= 60) {
            this.times[0] += 1;
            this.times[1] -= 60;
        }
    }

    print() {
        this.div.innerText = this.format(this.times);
    }

    format(times) {
        return `${this.left0(times[0], 2)}:${this.left0(times[1], 2)}`;
    }
}

export default Timer;
