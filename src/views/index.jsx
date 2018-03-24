
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import music from '@/assets/json/music.json';
import '@/utils/base';
import './index.less';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false, // 进入页面音乐正在是否播放 用于控制 needle 动画
            duration: '--', // 歌曲总时间
            currentTime: '--', // 当前播放时间
            progressRate: 0, // 播放进度长度
            isPlay: false, // 是否播放状态
        };
    }

    componentDidMount() {
        this.playMusic();
        this.timeUpdate();
    }

    // 拖拽播放进度
    handleMove(e) {

        const offsetWidth = this.refs.progress.offsetWidth; // 进度条长度
        const barWidth = this.refs.bar.offsetWidth; // 小圆圈长度
        const clientX = this.refs.progress.offsetLeft; // 进度条距离页面左边距离
        const pageX = e.changedTouches[0].pageX; // 手指位置
        let progressRate = (pageX - clientX) / offsetWidth * 100; // 当前播放进度百分比
        const shouldMoveTotalRate = (1 - barWidth / offsetWidth) * 100; // 小圆圈最长可移动百分比

        if(progressRate <= 0) progressRate = 0;
        if(progressRate >= shouldMoveTotalRate) progressRate = shouldMoveTotalRate;

        this.setState({ progressRate });
    }

    // 播放音乐
    playMusic() {
       
        const { isPlay } = this.state;
       
        this.setState({ 
            isPlay: !isPlay, 
            initPage: true
        }, !isPlay ? () => this.refs.audio.play() : () => this.refs.audio.pause() );
    }

    // 获取播放时间 播放进度
    timeUpdate() {

        const _this = this.refs.audio;

        this.refs.audio.addEventListener('timeupdate', () => {
            
            const duration = new Date(parseInt(_this.duration) * 1000).Format('mm:ss');
            const currentTime = new Date(parseInt(_this.currentTime *  1000)).Format('mm:ss');
            const progressRate = _this.currentTime/_this.duration * 100;

            this.setState({ duration, currentTime, progressRate });
        });
    }

    render() {

        const { initPage, duration, currentTime, progressRate, isPlay } = this.state;

        return (
            <div className="index-wrap">
                <audio ref="audio" id="audio" src={ music[0].src } />
                <header>
                    <Link to="">{ '<' }</Link>
                    <div>
                        <p>{ music[0].name }</p>
                        <span>{ music[0].singer }</span>
                    </div>
                </header>
                <div className="play-wrap">
                    <i><span></span></i>
                    <img className={ isPlay ? 'play needle' : initPage ? 'pause needle' : 'needle' } src={ require('@/assets/images/needle.png') } alt="" />
                    <div className={ isPlay ? 'play disc': 'disc' }>
                        <img src={ require('@/assets/images/878431574282626913.jpg') } alt="" />
                    </div>
                </div>
                <div className="progress-wrap">
                    <span>{ currentTime }</span>
                    <div className="time" ref="progress">
                        <div className="current-time" style={ { 'width': `${progressRate}%` } }></div>
                        <i ref="bar" onTouchMove={ e => this.handleMove(e) } style={{ 'left': `${progressRate}%`}}><em></em></i>
                    </div>
                    <span>{ duration }</span>
                </div>
                <div className="play-btn">
                    <a href="javascript: ">
                        <img src={ require("@/assets/images/seq.png") } alt="" />
                    </a>
                    <a href="javascript: ">
                        <img src={ require("@/assets/images/pre_l.png") } alt="" />
                    </a>
                    <a 
                        href="javascript: " 
                        className={ isPlay ? 'play' : 'pause' } 
                        onClick={ () => this.playMusic() } 
                    />
                    <a href="javascript: ">
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