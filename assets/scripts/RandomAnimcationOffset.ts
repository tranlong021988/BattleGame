import { _decorator, Component, SkeletalAnimation, math } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RandomAnimOffset')
export class RandomAnimOffset extends Component {

    start() {
        const anim = this.getComponent(SkeletalAnimation);
        if (anim) {
            // Lấy animation đang chạy (ví dụ clip "Idle" hoặc clip đầu tiên)
            const states = anim.getState(anim.defaultClip.name);
            if (states) {
                states.play();
                // Offset ngẫu nhiên từ 0 đến tổng chiều dài clip
                states.setTime(math.randomRange(0, states.duration));console.log(states.duration);
                // Cập nhật ngay lập tức để tránh bị giật frame đầu
               // states.sample(); 
                
            }
        }
    }
}