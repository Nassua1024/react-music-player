
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import music from '@/assets/music/music';
import '@/utils/base';
import './index.less';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            duration: 0, // 歌曲总时间
            currentTime: 0, // 当前播放时间
            isPlay: false, // 是否播放状态
            isDrag: false, // 是否拖拽进度条
            iNow: 0, // 当前播放歌曲的下标
            clentX: 0, // 背景头像水平偏移量
            needleClazz: 'needle' // 用于控制 needle 动画 
        };
    }

    componentDidMount() {
        this.playMusic();
        this.timeUpdate();
    }

    // 播放音乐
    playMusic() {
        
        const { isPlay } = this.state;
        
        this.setState({ 
            isPlay: !isPlay, 
            needleClazz: !isPlay ? 'play needle': 'pause needle'
        }, !isPlay ? () => this.refs.audio.play() : () => this.refs.audio.pause() );
    }

    // 上一首
    prevMusic() {

        let { iNow, clentX } = this.state;

        iNow --;
        clentX += 560 / 100;
        
        if(iNow < 0) 
            iNow = music.length - 1;
        
        this.setState({ 
            iNow, 
            clentX,
            isPlay: true,
            needleClazz: isPlay ? 'cut needle' : 'play needle'
        }, () => setClazz() );
    }

    // 下一首
    nextMusic() {

        let { iNow, clentX } = this.state;
        const { isPlay } = this.state; 
        
        iNow ++;
        clentX -= 560 / 100;
        
        if(iNow > music.length - 1)
            iNow = 0;

        this.setState({ 
            iNow, 
            clentX,
            isPlay: true,
            needleClazz: isPlay ? 'cut needle' : 'play needle'
        }, () => this.setClazz() );
    }

    // needle 动画完成后重新 needle 的样式
    // 为了解决在连续播放状态下切歌 needle 动画不生效的问题
    setClazz() {
        setTimeout(() => {
            this.setState({ needleClazz: 'play needle'}, () => this.refs.audio.play() )
        }, 400)
    }
    
    // 获取播放时间 播放进度
    timeUpdate() {
        
        const _this = this.refs.audio;

        this.refs.audio.addEventListener('timeupdate', () => {

            if(!this.state.isDrag) {
               
                const duration = Number.isNaN(_this.duration) ? 0 : parseInt(_this.duration) * 1000;
                const progressRate = _this.currentTime/_this.duration * 100;
                const currentTime = parseInt(_this.currentTime *  1000);

                if(duration != 0 && currentTime >= duration)
                    this.nextMusic();

                this.setState({ duration, currentTime, progressRate });
            }
        });
    }

    // 拖拽播放进度
    handleMove(e) {

        const { duration } = this.state;
        const offsetWidth = this.refs.progress.offsetWidth; // 进度条长度
        const clientX = this.refs.progress.offsetLeft; // 进度条距离页面左边距离
        const pageX = e.changedTouches[0].pageX; // 手指位置
        let progressRate = (pageX - clientX) / offsetWidth * 100; // 当前播放进度百分比

        if(progressRate <= 0) progressRate = 0;
        if(progressRate >= 100) progressRate = 100;

        const currentTime = parseInt(progressRate / 100 * duration);

        this.setState({ 
            progressRate, 
            currentTime,
            isDrag: true
        });
    }

    // 拖拽播放进度结束
    handleEnd() {

        const { currentTime } = this.state;
        
        this.refs.audio.currentTime = currentTime / 1000;
        this.setState({ isDrag: false });
    }

    render() {

        const { duration, currentTime, progressRate, isPlay, iNow, clentX, needleClazz } = this.state;

        return (
            <div className="index-wrap">
                <audio ref="audio" id="audio" src={ music[iNow].src } />
                <header>
                    <Link to="">{ '<' }</Link>
                    <div>
                        <p>{ music[iNow].name }</p>
                        <span>{ music[iNow].singer }</span>
                    </div>
                </header>

                {/* 音乐背景 */}
                <div className="play-wrap">
                    <i />
                    <img 
                        className={ needleClazz }
                        src={ require('@/assets/images/needle.png') } 
                        alt="" 
                    />
                    <div className="disc-wrap">
                        <div className="avator-wrap" style={{ 'transform': `translateX(${clentX}rem)` }}>
                            {
                                music.map((item, index) => (
                                    <div key={ index } className={ (isPlay && iNow == index) ? 'play disc': 'disc' }>
                                        <img src={ item.img } alt="" />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>

                {/* 进度条 */}
                <div className="progress-wrap">
                    <span>{ new Date(currentTime).Format('mm:ss') }</span>
                    <div className="time" ref="progress">
                        <div className="current-time" style={ { 'width': `${progressRate}%` } }></div>
                        <i 
                            ref="bar" 
                            style={{ 'left': `${progressRate}%`}}
                            onTouchMove={ e => this.handleMove(e) } 
                            onTouchEnd={ () => this.handleEnd() }                            
                        />
                    </div>
                    <span>{ new Date(duration).Format('mm:ss') }</span>
                </div>

                {/* 底部按钮 */}
                <div className="play-btn">
                    <a href="javascript: ">
                        <img src={ require("@/assets/images/seq.png") } alt="" />
                    </a>
                    <a 
                        href="javascript: " 
                        onClick={ () => this.prevMusic() }
                    >
                        <img src={ require("@/assets/images/pre_l.png") } alt="" />
                    </a>
                    <a 
                        href="javascript: " 
                        className={ isPlay ? 'play' : 'pause' } 
                        onClick={ () => this.playMusic() } 
                    />
                    <a 
                        href="javascript: " 
                        onClick={ () => this.nextMusic() }
                    >
                        <img src={ require("@/assets/images/pre_r.png") } alt="" />
                    </a>
                    <a href="javascript: ">
                        <img src={ require("@/assets/images/list.png") } alt="" />
                    </a>
                </div>
            </div>
        )
    }
}

export default Index;