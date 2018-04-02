import React,{Component} from 'react'
import SeekBar from './SeekBar'
import imgSource from './imgs/exchange'
import puzzle_cover from './imgs/puzzle_inset.png'
import puzzle_block from './imgs/puzzle_outset.png'
import puzzle_block_c from './imgs/puzzle_outset_block.png'
import './index.css'

export default class ImgIdentify extends Component{
    constructor(props){
        super(props)
        this.state={radX:0,radY:0,urlBg:'',rotate:0}
        this.thOffset=0
        this.deviation=3//判定的偏移量
        this.seekMove=this.seekMove.bind(this)
        this.seekStop=this.seekStop.bind(this)
        this.setCoverAndBg=this.setCoverAndBg.bind(this)
    }

    componentDidMount(){
        this.setCoverAndBg()
    }

    componentDidUpdate(){
        this.drawBlock(this.cav)
    }

    componentWillUnmount(){

    }

    drawBlock(cav){
        let maxWidth=cav.clientWidth
        let maxHeight=cav.clientHeight
        cav.width=maxWidth
        cav.height=maxHeight
        let ctx=cav.getContext('2d')
        this.drawImg(ctx,maxWidth,maxHeight)
    }

    async drawImg(ctx,width,height){
        try{
            let pw=this.port.clientWidth,ph=this.port.clientHeight
            let rx=this.state.radX,ry=this.state.radY
            ctx.clearRect(0,0,width,height)
            let [imgBg,imgBlock]= await this.loadImgAll([this.state.urlBg,puzzle_block])
            let bgArgs=[Math.ceil(rx*imgBg.width/pw),Math.ceil(ry*imgBg.height/ph),Math.ceil(width*imgBg.width/pw),Math.ceil(height*imgBg.height/ph),0,0,width,height]
            ctx.drawImage(imgBg,...bgArgs)
            ctx.save()
            ctx.globalCompositeOperation='destination-in'
            ctx.translate(width/2,height/2)
            ctx.rotate(this.state.rotate*Math.PI/180)
            let blockArgs=[0,0,imgBlock.width,imgBlock.height,-width/2,-height/2,width,height]
            ctx.drawImage(imgBlock,...blockArgs)
            ctx.restore()
        }catch (e){
            console.log(e)
        }
    }

    loadImgAll(urls){
        let ps=[]
        urls.map(e=>{
            ps.push(this.loadImg(e))
        })
        return Promise.all(ps)
    }

    loadImg(url){
        return new Promise((resolve,reject) => {
            let i=new Image()
            i.src=url
            i.onload=()=>{
                resolve(i)
            }
            i.onerror=()=>{
                reject('image load error')
            }
        })

    }

    seekMove(d){
        let dc=d
        if(d>this.port.clientWidth-this.boc.clientWidth){
            dc=this.port.clientWidth-this.boc.clientWidth
        }
        this.thOffset=dc
        this.boc.style.left=`${this.thOffset}px`
        this.cav.style.left=`${this.thOffset}px`
    }

    seekStop(){
        if(this.thOffset>=this.state.radX-this.deviation&&this.thOffset<=this.state.radX+this.deviation){
            // console.log('匹配')
            this.seek.thumbOk()
        }else {
            this.seek.thumbFail()
            let t=this
            window.setTimeout(()=>t.setCoverAndBg(),500)
            // console.log('不匹配')
        }
    }

    setCoverAndBg(){
        let maxWidth=this.port.clientWidth,maxHeight=this.port.clientHeight
        let imgWidth=this.cov.clientWidth,imgHeight=this.cov.clientHeight
        let radY=Math.floor(Math.random()*(maxHeight-imgHeight*2-4)+imgHeight+2),radX=Math.floor(Math.random()*(maxWidth-imgWidth*2-4)+imgWidth+2)
            ,urlBg=imgSource[Math.floor(Math.random()*imgSource.length)]
            ,rotate=Math.ceil(Math.random()*3)*90
        this.thOffset=0
        this.boc.style.left=0
        this.cav.style.left=0
        this.seek.thumbReset()
        this.setState({radX,radY,urlBg,rotate})
    }

    render(){
        return(
            <div>
                <div className='imgBg' ref={e=>this.port=e} style={{width:'400px',height:'250px',backgroundImage:`url(${this.state.urlBg})`}}>
                    <img ref={e=>this.cov=e} src={puzzle_cover} alt="cover" style={{top:this.state.radY,left:this.state.radX,transform:`rotate(${this.state.rotate}deg)`}}/>
                    <canvas ref={e=>this.cav=e} style={{top:this.state.radY,left:this.thOffset,zIndex:5,transition:'.1s'}}/>
                    <img ref={e=>this.boc=e} src={puzzle_block_c} alt="boc" style={{top:this.state.radY,left:this.thOffset,zIndex:8,transition:'.1s',transform:`rotate(${this.state.rotate}deg)`}}/>
                    <a onClick={this.setCoverAndBg} className='refresh'/>
                </div>
                <SeekBar ref={e=>this.seek=e} onSeekMove={this.seekMove} onSeekStop={this.seekStop}/>
            </div>
        )
    }
}