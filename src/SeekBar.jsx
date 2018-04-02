import React,{Component} from 'react'
import './SeekBar.css'
export default class SeekBar extends Component{
    constructor(props){
        super(props)
        this.thumbStart=this.thumbStart.bind(this)
        this.thumbMove=this.thumbMove.bind(this)
        this.thumbEnd=this.thumbEnd.bind(this)
        this.state={inDrag:false,isOk:false,isFail:false}
    }

    componentWillMount(){
        this._mounted=true
        document.addEventListener('mousemove',this.thumbMove)
        document.addEventListener('mouseup',this.thumbEnd)
    }
    componentWillUnmount(){
        this._mounted=false
        document.removeEventListener('mousemove',this.thumbMove)
        document.removeEventListener('mouseup',this.thumbEnd)
    }

    thumbStart(){
        this.setState({inDrag:true})
        // this.inThumb=true
    }

    thumbMove(e){
        if(this.state.inDrag) {
            let dragWidth=this.eleDrag.offsetWidth,moveToX=e.clientX,thumbOffset=this.eleThumb.offsetLeft,maxWidth=this.eleBar.clientWidth
            let onMove=this.props.onSeekMove,offsetLeft=0
            // console.log(dragWidth,moveToX,thumbOffset,maxWidth)
            // console.log(maxWidth+thumbOffset-dragWidth/2,thumbOffset+dragWidth/2)
            if(maxWidth+thumbOffset-dragWidth/2<=moveToX){
                this.eleThumb.style.width=`${maxWidth}px`
                offsetLeft=maxWidth-dragWidth/2
            }else if(moveToX<=thumbOffset+dragWidth/2){
                this.eleThumb.style.width=`${dragWidth+2}px`
                offsetLeft=0
            }else {
                this.eleThumb.style.width=`${moveToX-thumbOffset+dragWidth/2}px`
                offsetLeft=e.clientX-thumbOffset-dragWidth/2
            }
            if(onMove) onMove(offsetLeft)
        }
    }

    thumbEnd(){
        if(this.state.inDrag){
            this.setState({inDrag:false})
            let onStop=this.props.onSeekStop
            if(onStop) onStop()
        }
    }

    thumbReset(){
        this.eleThumb.style.width=`${this.eleDrag.clientWidth+2}px`
        this.setState({inDrag:false,isOk:false,isFail:false})
    }

    thumbOk(){
        this.setState({inDrag:false,isOk:true,isFail:false})
    }

    thumbFail(){
        this.setState({inDrag:false,isOk:false,isFail:true})
    }

    render(){
        return (
            <div ref={e=>this.eleBar=e} className='seek-bar'>
                <div ref={e=>this.eleThumb=e} className={`seek-thumb${this.state.inDrag?' in-drag':''}${this.state.isOk?' in-ok':''}${this.state.isFail?' in-fail':''}`}>
                    <div ref={e=>this.eleDrag=e} className='seek-drag' onMouseDown={this.thumbStart}>
                        <i/>
                    </div>
                </div>
            </div>
        )
    }
}