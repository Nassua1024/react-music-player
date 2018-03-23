
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
            music,
            duration: '--', // 歌曲总时间
            currentTime: '--', // 当前播放时间
            progressWidth: 0, // 播放进度长度
            isPlay: false, // 是否播放状态
        };
    }

    componentDidMount() {
        // this.playMusic();
        this.timeUpdate();
    }

    // 拖拽播放进度
    handleMove(e) {

        const offsetWidth = this.refs.progress.offsetWidth;
        const clientX = this.refs.progress.offsetLeft; 
        const pageX = e.changedTouches[0].pageX;
        let currentTime = pageX - clientX;

        if(currentTime <= 0) currentTime = 0;
        if(currentTime >= offsetWidth) currentTime = offsetWidth;

        this.setState({ currentTime });
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
            const progressWidth = _this.currentTime/_this.duration * 100;

            this.setState({ duration, currentTime, progressWidth });
        });
    }

    render() {

        const { initPage, music, duration, currentTime, progressWidth, isPlay } = this.state;

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
                        <div className="current-time" style={ { 'width': `${progressWidth}%` } }></div>
                        <i ref="bar" onTouchMove={ e => this.handleMove(e) } style={{ 'left': `${progressWidth}%`}}><em></em></i>
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