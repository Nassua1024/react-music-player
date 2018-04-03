
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
            needleClazz: 'needle', // 用于控制 needle 动画 
            lrcList: [], // 歌词
        };
    }

    componentWillMount() {
        this.initLrc();
    }

    componentDidMount() {
        this.playMusic();
        this.timeUpdate();
    }

    // 初始化歌词
    initLrc() {

        const { iNow } = this.state;
        const lrc = music[iNow].lrc.split('[');
        let lrcList = [];

        lrc.shift();

        for(let i=0; i<lrc.length; i++) {
           
            const arr = lrc[i].split(']');
            const dataItem = {};
            
            if(arr[0]) {
                const time = arr[0].split('.');
                const timer = time[0].split(':');
                const sec = timer[0] * 60 + timer[1] * 1;
                dataItem.time = sec;
            }

            dataItem.lrc = arr[1].replace(/[\r\n]/g, '');
            lrcList.push(Object.assign({}, dataItem));
        }

        this.setState({ lrcList });
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

        let { iNow } = this.state;
        const { isPlay } = this.state;

        iNow --;

        if(iNow < 0) {
            
            iNow = music.length - 1;
            document.getElementById('sliders').style.transitionDuration = '0s';
            document.getElementById('sliders').style.transform = `translateX(${-iNow * 7.5}rem)`;

            setTimeout(() => {
                iNow --;
                document.getElementById('sliders').style.transitionDuration = '0.6s'; 
                this.setState({ iNow });
            }, 10);
        }
        
        this.setState({ 
            iNow, 
            isPlay: true,
            needleClazz: isPlay ? 'cut needle' : 'play needle'
        }, () => this.setClazz() );
    }

    // 下一首
    nextMusic() {

        let { iNow } = this.state;
        const { isPlay } = this.state; 
        
        iNow ++;

        if(iNow > music.length - 1) {
            
            iNow = 0;
            document.getElementById('sliders').style.transitionDuration = '0s';
            document.getElementById('sliders').style.transform = 'translateX(0)';
            
            setTimeout(() => {
                iNow ++;
                document.getElementById('sliders').style.transitionDuration = '0.6s'; 
                this.setState({ iNow });
            }, 10);
        }
        
        this.setState({ 
            iNow, 
            isPlay: true,
            needleClazz: isPlay ? 'cut needle' : 'play needle'
        }, () => this.setClazz() );
    }

    // needle 动画完成后重新 needle 的样式
    // 为了解决在连续播放状态下切歌 needle 动画不生效的问题
    setClazz() {
        this.initLrc();
        setTimeout(() => {
            this.setState({ needleClazz: 'play needle'}, () => this.refs.audio.play() )
        }, 300)
    }
    
    // 获取播放时间 播放进度
    timeUpdate() {
        
        const _this = this.refs.audio;

        this.refs.audio.addEventListener('timeupdate', () => {

            if(!this.state.isDrag) {
                
                const { lrcList } = this.state;
                const duration = Number.isNaN(_this.duration) ? 0 : parseInt(_this.duration) * 1000;
                const progressRate = _this.currentTime/_this.duration * 100;
                const currentTime = parseInt(_this.currentTime *  1000);
                const oLi = document.getElementsByTagName('li');

                if(document.getElementById(parseInt(_this.currentTime))) {
                    
                    for(let i=0; i<oLi.length; i++) {
                        oLi[i].style.cssText = 'color:#FFF;font-size:0.26rem';
                        if(parseInt(_this.currentTime) == lrcList[i].time && i > 2) {
                            const y = (2 - i) * 0.52 + 'rem';
                            document.getElementById('lrc').style.transform = `translateY(${y})`;
                            document.getElementById('lrc').style.transitionDuration = '0.8s';
                        }
                    }

                    document.getElementById(parseInt(_this.currentTime)).style.cssText = 'color:red;font-size:0.28rem';
                }                    
                
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

        const { duration, currentTime, progressRate, isPlay, iNow, needleClazz, lrcList } = this.state;

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
                        <div className="avator-wrap" id="sliders" style={{ 'transform': `translateX(${-iNow * 7.5}rem)` }}>
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

                {/* 歌词 */}
                <div className="lrc" >
                    <ul id="lrc">
                        { 
                            lrcList.map((item, index) => (
                                <li id={ String(item.time) } key={ index }>{ item.lrc }</li>
                            ))
                        }
                    </ul>
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