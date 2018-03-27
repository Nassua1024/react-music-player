
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import music from '@/assets/music/music';
import '@/utils/base';
import './index.less';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false, // 进入页面音乐正在是否播放 用于控制 needle 动画
            duration: 0, // 歌曲总时间
            currentTime: 0, // 当前播放时间
            isPlay: false, // 是否播放状态
            isDrag: false, // 是否拖拽进度条
            iNow: 0 // 当前播放歌曲的时间
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
            isPlaying: true
        }, !isPlay ? () => this.refs.audio.play() : () => this.refs.audio.pause() );
    }

    // 上一首
    prev() {

        let { iNow } = this.state;

        if(iNow < 0) iNow = music.length - 1;

        iNow --;
        this.setState({ iNow });
    }

    // 获取播放时间 播放进度
    timeUpdate() {
        
        const _this = this.refs.audio;

        this.refs.audio.addEventListener('timeupdate', () => {

            if(!this.state.isDrag) {
               
                const duration = parseInt(_this.duration) * 1000;
                const progressRate = _this.currentTime/_this.duration * 100;
                const currentTime = parseInt(_this.currentTime *  1000);
                   
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

        const { isPlaying, duration, currentTime, progressRate, isPlay, iNow } = this.state;

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
                <div className="play-wrap">
                    <i><span></span></i>
                    <img 
                        className={ isPlay ? 'play needle' : isPlaying ? 'pause needle' : 'needle' } 
                        src={ require('@/assets/images/needle.png') } 
                        alt="" 
                    />
                    <div className={ isPlay ? 'play disc': 'disc' }>
                        <img src={ music[iNow].img } alt="" />
                    </div>
                </div>
                <div className="progress-wrap">
                    <span>{ new Date(currentTime).Format('mm:ss') }</span>
                    <div className="time" ref="progress">
                        <div className="current-time" style={ { 'width': `${progressRate}%` } }></div>
                        <i 
                            ref="bar" 
                            style={{ 'left': `${progressRate}%`}}
                            onTouchMove={ e => this.handleMove(e) } 
                            onTouchEnd={ () => this.handleEnd() }                            
                        >
                            <em></em>
                        </i>
                    </div>
                    <span>{ new Date(duration).Format('mm:ss') }</span>
                </div>
                <div className="play-btn">
                    <a href="javascript: ">
                        <img src={ require("@/assets/images/seq.png") } alt="" />
                    </a>
                    <a 
                        href="javascript: " 
                        onClick={ () => this.prev() }
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
                        onClick={ () => this.next() }
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