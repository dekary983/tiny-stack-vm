import { readdir,readFile,mkdir,writeFile } from 'node:fs/promises'
import { join } from 'node:path'
const I=process.env.MAKEFUN_INPUT_DIR||'/input',O=process.env.MAKEFUN_OUTPUT_DIR||'/output'
const ids=(await readdir(I,{withFileTypes:true})).filter(x=>x.isDirectory()).map(x=>x.name).sort()
for(const id of ids){
 const d=join(I,id),g=async n=>{try{return await readFile(join(d,n))}catch{return Buffer.alloc(0)}}
 const p=await g('program.bin'),u=await g('input.bin'),m=new Int32Array(256),s=new Int32Array(256),c=new Int32Array(64),o=Buffer.alloc(65536)
 let pc=0,t=0,sp=0,cp=0,ip=0,op=0,e=0
 const b=i=>p[i], w=i=>(b(i)|b(i+1)<<8|b(i+2)<<16|b(i+3)<<24), h=i=>b(i)|b(i+1)<<8
 while(!e){
  if(t>=1e6){e=10;break} if(pc<0||pc>=p.length){e=9;break}
  let x=p[pc],n=x==2?4:x==1?1:x>=0x30&&x<=0x33?2:0
  if(!((x<=7)||(x>=16&&x<=30)||(x>=32&&x<=34)||(x>=0x30&&x<=0x34)||(x>=0x50&&x<=0x53)||(x==64||x==65))){e=5;break}
  if(pc+n>=p.length){e=9;break}
  let q=pc+1+n,a,z,v,need=0,push=0
  if(x==3||x==4||x==0x17||x==0x1b||x==0x31||x==0x32||x==0x40||x==0x50||x==0x51||x==0x53)need=1
  else if(x==5||x==6||x==0x10||x==0x11||x==0x12||x>=0x13&&x<=0x16||x>=0x18&&x<=0x1a||x>=0x1c&&x<=0x1e||x>=0x20&&x<=0x22||x==0x41)need=2
  else if(x==7)need=3
  else if(x==0x40)need=1
  if(x==1||x==2||x==4||x==6||x==0x52)push=1
  if(x>=0x10&&x<=0x16||x>=0x18&&x<=0x1a||x>=0x1c&&x<=0x22)push=-1
  if(sp<need){e=2;break} if(sp+(x==4||x==6?1:push==-1?-1:push>0?1:0)>256){e=3;break} t++
  a=s[sp-1];z=s[sp-2];v=0
  if(x==0){e=0;break}
  if(x==1)v=(b(pc+1)<<24)>>24
  else if(x==2)v=w(pc+1)
  else if(x==3)sp--
  else if(x==4)v=a
  else if(x==5){s[sp-1]=z;s[sp-2]=a}
  else if(x==6)v=z
  else if(x==7){let A=s[sp-3],B=s[sp-2],C=a;s[sp-3]=B;s[sp-2]=C;s[sp-1]=A}
  else if(x==0x10)v=z+a|0
  else if(x==0x11)v=z-a|0
  else if(x==0x12)v=Math.imul(z,a)
  else if(x>=0x13&&x<=0x16){if(!a){e=4;break}v=x==0x13?Math.trunc(z/a)|0:x==0x14?z%a|0:x==0x15?(z>>>0)/(a>>>0)|0:(z>>>0)%(a>>>0)|0}
  else if(x==0x17)v=-a|0
  else if(x==0x18)v=z&a
  else if(x==0x19)v=z|a
  else if(x==0x1a)v=z^a
  else if(x==0x1b)v=~a
  else if(x==0x1c)v=z<<(a&31)
  else if(x==0x1d)v=z>>(a&31)
  else if(x==0x1e)v=z>>>(a&31)
  else if(x==0x20)v=+(z==a)
  else if(x==0x21)v=+(z<a)
  else if(x==0x22)v=+((z>>>0)<(a>>>0))
  else if(x==0x30){pc=q+((h(pc+1)<<16)>>16);continue}
  else if(x==0x31||x==0x32){sp--;if((x==0x31&&!a)||(x==0x32&&a)){pc=q+((h(pc+1)<<16)>>16);continue}}
  else if(x==0x33){if(cp==64){e=7;break}c[cp++]=q;pc=h(pc+1);continue}
  else if(x==0x34){if(!cp){e=8;break}pc=c[--cp];continue}
  else if(x==0x40){if(a<0||a>255){e=6;break}v=m[a]}
  else if(x==0x41){if(a<0||a>255){e=6;break}m[a]=z;sp-=2}
  else if(x==0x50||x==0x51){let r=x==0x50?Buffer.from(String(a)):Buffer.from([a&255]);if(op+r.length>65536){e=11;break}r.copy(o,op);op+=r.length;sp--}
  else if(x==0x52)v=ip<u.length?u[ip++]:-1
  else if(x==0x53){e=a&255;break}
  if(push==-1){sp-=2;s[sp++]=v}else if(x==1||x==2||x==4||x==6||x==0x52)s[sp++]=v;else if(x==0x17||x==0x1b||x==0x40)s[sp-1]=v
  pc=q
 }
 const od=join(O,id);await mkdir(od,{recursive:true});await writeFile(join(od,'stdout.bin'),o.subarray(0,op));await writeFile(join(od,'exit.txt'),String(e)+'\n')
}
