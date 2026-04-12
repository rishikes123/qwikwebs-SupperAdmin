import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { IStore, IProduct, ICategory, IBanner, IVariant } from "../types";
import { THEMES } from "../config/themes";
import { getThemeFields } from "../config/themeFields";
import { apiGetStore, apiGetStoreProducts, apiGetPublicSettings } from "../config/api";
import axios from "axios";

interface CartItem{product:IProduct;qty:number;variant?:IVariant}
interface Addr{name:string;phone:string;email:string;line1:string;line2:string;city:string;pin:string}

/* ── Icons ── */
const Ic={
  home:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>,
  homeFill:<svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2h-4v-7H9v7H5a2 2 0 01-2-2z"/></svg>,
  grid:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  gridFill:<svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  heart:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  heartFill:<svg width="22" height="22" fill="currentColor" stroke="currentColor" strokeWidth="0.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  cart:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>,
  cartFill:<svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1.5"/><circle cx="20" cy="21" r="1.5"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>,
  user:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  userFill:<svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2h16z"/><circle cx="12" cy="7" r="4"/></svg>,
  search:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  back:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
  close:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  minus:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 12h14"/></svg>,
  plus:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>,
  trash:<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  star:<svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  starHalf:<svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77V2z"/></svg>,
  check:<svg width="44" height="44" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>,
  truck:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  loc:<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  share:<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>,
  shield:<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  tag:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7" cy="7" r="1"/></svg>,
  clock:<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  bolt:<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  order:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>,
  bell:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
  chev:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>,
  gift:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 010-5C9 3 12 8 12 8s3-5 4.5-5a2.5 2.5 0 010 5"/></svg>,
  sparkle:<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z"/></svg>,
};

const Badge:React.FC<{n:number;color:string;children?:React.ReactNode}>=({n,color,children})=>(<div style={{position:"relative",display:"inline-flex"}}>{children}{n>0&&<div style={{position:"absolute",top:-7,right:-7,minWidth:18,height:18,borderRadius:9,background:color,color:"#fff",fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px",border:"2px solid #fff"}}>{n>99?"99+":n}</div>}</div>);

function useIsMobile(bp=768){const[m,s]=useState(typeof window!=="undefined"?window.innerWidth<bp:false);useEffect(()=>{const h=()=>s(window.innerWidth<bp);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[bp]);return m;}

/* ═══ MAIN ═══ */
const StorePreview:React.FC=()=>{
  const{id}=useParams();const nav=useNavigate();const isMob=useIsMobile();
  const[store,setStore]=useState<IStore|null>(null);
  const[products,setProducts]=useState<IProduct[]>([]);
  const[cats,setCats]=useState<ICategory[]>([]);
  const[banners,setBanners]=useState<IBanner[]>([]);
  const[stSettings,setStSettings]=useState<any>({}); // store public settings
  const[loading,setLoading]=useState(true);
  const[view,setView]=useState("home");
  const[prev,setPrev]=useState("home");
  const[selP,setSelP]=useState<IProduct|null>(null);
  const[selC,setSelC]=useState("");
  const[sq,setSq]=useState("");
  const[bi,setBi]=useState(0);
  const[sort,setSort]=useState("default");
  const[cart,setCart]=useState<CartItem[]>([]);
  const[wl,setWl]=useState<string[]>([]);
  const[addr,setAddr]=useState<Addr>({name:"",phone:"",email:"",line1:"",line2:"",city:"",pin:""});
  const[pay,setPay]=useState<"cod"|"online">("cod");
  const[oid,setOid]=useState("");
  const[placing,setPlacing]=useState(false);
  const[cartDrw,setCartDrw]=useState(false);
  const[animate,setAnimate]=useState(false);
  // Variant selection state (for product detail page)
  const[selVariant,setSelVariant]=useState<IVariant|null>(null);
  const[selColor,setSelColor]=useState<string>("");
  const[selSize,setSelSize]=useState<string>("");
  const[selUnit,setSelUnit]=useState<string>(""); // for unit-based variants (grocery/pet)
  // Behavior tracking for recommendations
  const[viewedIds,setViewedIds]=useState<string[]>([]);
  const[cartHistory,setCartHistory]=useState<string[]>([]);

  useEffect(()=>{(async()=>{try{
    const[s,p,ca,b,sett]=await Promise.all([
      apiGetStore(id!),apiGetStoreProducts(id!),
      axios.get(`/api/categories/store/${id}`),
      axios.get(`/api/banners/store/${id}`),
      apiGetPublicSettings(id!).catch(()=>({data:{settings:{}}})),
    ]);
    setStore(s.data.store);setProducts(p.data.products);
    setCats(ca.data.categories);setBanners(b.data.banners);
    setStSettings(sett.data.settings||{});
  }catch{}setLoading(false);setTimeout(()=>setAnimate(true),100);})();},[id]);
  useEffect(()=>{if(banners.length<2)return;const t=setInterval(()=>setBi(i=>(i+1)%banners.length),5000);return()=>clearInterval(t);},[banners.length]);

  const T=store?.theme?THEMES[store.theme]:THEMES.grocery;const c=T.colors;const f=T.fonts;

  const filt=useMemo(()=>{let l=[...products];if(selC)l=l.filter(p=>{const ci=typeof p.category==="object"?p.category._id:p.category;return ci===selC;});if(sq)l=l.filter(p=>p.name.toLowerCase().includes(sq.toLowerCase()));if(sort==="priceLow")l.sort((a,b)=>a.price-b.price);else if(sort==="priceHigh")l.sort((a,b)=>b.price-a.price);else if(sort==="rating")l.sort((a,b)=>b.rating-a.rating);return l;},[products,selC,sq,sort]);

  const cTotal=useMemo(()=>cart.reduce((s,i)=>s+i.product.price*i.qty,0),[cart]);
  const cMrp=useMemo(()=>cart.reduce((s,i)=>s+i.product.mrp*i.qty,0),[cart]);
  const cCount=useMemo(()=>cart.reduce((s,i)=>s+i.qty,0),[cart]);
  // Use admin-configured delivery settings (fallback to defaults)
  const freeDeliveryAbove=stSettings.freeDeliveryAbove??499;
  const deliveryCharge=stSettings.deliveryCharge??40;
  const minOrderAmount=stSettings.minOrderAmount??0;
  const dlv=cTotal>=freeDeliveryAbove?0:deliveryCharge;const grand=cTotal+dlv;

  const addC=useCallback((p:IProduct,variant?:IVariant)=>{
    const effectivePrice=variant?.price??p.price;
    setCart(pv=>{const e=pv.find(i=>i.product._id===p._id&&i.variant?._id===variant?._id);if(e)return pv.map(i=>i.product._id===p._id&&i.variant?._id===variant?._id?{...i,qty:i.qty+1}:i);return[...pv,{product:{...p,price:effectivePrice},qty:1,variant}];});
    // Track cart behavior for recommendations
    setCartHistory(prev=>[...new Set([p._id,...prev])].slice(0,30));
    toast.success(variant?`Added (${variant.color} / ${variant.size})`:"Added to cart!",{icon:"🛒",style:{borderRadius:12,fontWeight:600,background:c.bgCard,color:c.text}});
  },[c]);
  const updQ=useCallback((pid:string,d:number,variantId?:string)=>{setCart(pv=>pv.map(i=>i.product._id===pid&&i.variant?._id===variantId?{...i,qty:Math.max(0,i.qty+d)}:i).filter(i=>i.qty>0));},[]);
  const remC=useCallback((pid:string,variantId?:string)=>{setCart(pv=>pv.filter(i=>!(i.product._id===pid&&i.variant?._id===variantId)));},[]);
  const gQ=useCallback((pid:string,variantId?:string)=>cart.find(i=>i.product._id===pid&&i.variant?._id===variantId)?.qty||0,[cart]);
  const tW=useCallback((pid:string)=>{setWl(pv=>pv.includes(pid)?pv.filter(i=>i!==pid):[...pv,pid]);},[]);
  const iW=useCallback((pid:string)=>wl.includes(pid),[wl]);
  const go=useCallback((v:string)=>{setPrev(view);setView(v);setCartDrw(false);window.scrollTo?.({top:0,behavior:"smooth"});},[view]);
  const openP=useCallback((p:IProduct)=>{
    setSelP(p);setSelVariant(null);setSelColor("");setSelSize("");setSelUnit("");setPrev(view);setView("product");window.scrollTo?.({top:0,behavior:"smooth"});
    // Track viewed products for recommendations
    setViewedIds(prev=>[...new Set([p._id,...prev])].slice(0,20));
  },[view]);

  const placeOrd=async()=>{
    if(!addr.name||!addr.phone||!addr.line1||!addr.city){toast.error("Fill required fields");return;}
    if(!/^\d{10}$/.test(addr.phone)){toast.error("Valid 10-digit phone");return;}
    if(minOrderAmount>0&&cTotal<minOrderAmount){toast.error(`Minimum order amount is ₹${minOrderAmount}`);return;}
    setPlacing(true);
    try{const{data}=await axios.post("/api/orders",{store:store?._id,customer:{name:addr.name,email:addr.email,phone:addr.phone,address:`${addr.line1},${addr.line2},${addr.city}-${addr.pin}`},items:cart.map(i=>({product:i.product._id,name:i.product.name,price:i.product.price,quantity:i.qty,image:i.product.image})),totalAmount:grand,paymentMethod:pay,paymentStatus:pay==="online"?"paid":"pending"});setOid(data.order._id);setCart([]);go("success");toast.success("Order placed! 🎉");}catch{toast.error("Failed");}
    setPlacing(false);
  };

  if(loading)return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:c.bg,flexDirection:"column",gap:20}}><div className="sp-loader"><span style={{fontSize:56}}>{T.icon}</span></div><div style={{fontSize:16,fontWeight:700,color:c.textMuted,letterSpacing:1}}>Loading store...</div></div>;
  if(!store)return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>Store not found</div>;

  const gc=isMob?"repeat(2,1fr)":"repeat(auto-fill,minmax(230px,1fr))";
  const inp:React.CSSProperties={width:"100%",padding:"15px 18px",borderRadius:14,fontSize:14,border:`2px solid ${c.border}`,background:c.bgCard,color:c.text,outline:"none",transition:"all 0.2s",fontWeight:500};

  /* ── Stars Component ── */
  const Stars:React.FC<{r:number;s?:number}>=({r,s=12})=>(
    <div style={{display:"flex",gap:1}}>{[1,2,3,4,5].map(i=><svg key={i} width={s} height={s} fill={i<=Math.floor(r)?"#F59E0B":i-0.5<=r?"#F59E0B":"#E5E7EB"} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}</div>
  );

  /* ── QtyControl ── */
  const QtyBtn:React.FC<{pid:string;compact?:boolean;variantId?:string}>=({pid,compact,variantId})=>{
    const q=gQ(pid,variantId);
    if(q===0)return null;
    const btnSz=compact?28:36;
    return(<div onClick={e=>e.stopPropagation()} style={{display:"inline-flex",alignItems:"center",borderRadius:compact?10:T.btnRadius,overflow:"hidden",border:`2px solid ${c.primary}`,background:c.bgCard,width:"fit-content"}}>
      <button onClick={()=>updQ(pid,-1,variantId)} style={{width:btnSz,height:btnSz,border:"none",background:c.primary,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"opacity 0.15s"}}>{q===1?Ic.trash:Ic.minus}</button>
      <span style={{minWidth:compact?28:36,textAlign:"center",fontWeight:800,fontSize:compact?13:15,color:c.primary,padding:"0 4px"}}>{q}</span>
      <button onClick={()=>updQ(pid,1,variantId)} style={{width:btnSz,height:btnSz,border:"none",background:c.primary,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"opacity 0.15s"}}>{Ic.plus}</button>
    </div>);
  };

  /* ═══ PRODUCT CARD ═══ */
  const PCard:React.FC<{p:IProduct;idx?:number}>=({p,idx=0})=>{
    const q=gQ(p._id);const w=iW(p._id);const disc=Math.round((1-p.price/p.mrp)*100);
    return(
      <div onClick={()=>openP(p)} className="sp-card" style={{background:c.bgCard,borderRadius:T.cardRadius,overflow:"hidden",border:`1px solid ${c.border}`,cursor:"pointer",position:"relative"}}>
        {disc>0&&<div className="sp-badge" style={{position:"absolute",top:10,left:10,zIndex:2,padding:"4px 10px",borderRadius:8,background:`linear-gradient(135deg,${c.danger},${c.secondary})`,color:"#fff",fontSize:11,fontWeight:800,letterSpacing:0.3,boxShadow:`0 2px 8px ${c.danger}40`}}>{disc}% OFF</div>}
        <button onClick={e=>{e.stopPropagation();tW(p._id);}} className="sp-wish-btn" style={{position:"absolute",top:10,right:10,zIndex:2,width:34,height:34,borderRadius:"50%",background:"rgba(255,255,255,0.95)",backdropFilter:"blur(8px)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:w?c.danger:"#CBD5E1",boxShadow:"0 2px 10px rgba(0,0,0,0.08)",transition:"all 0.2s"}}>{w?Ic.heartFill:Ic.heart}</button>
        <div style={{height:isMob?145:200,display:"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(180deg,${c.bg},${c.bgCard})`,overflow:"hidden",position:"relative"}}>
          {p.image?<img src={p.image} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.4s"}} className="sp-card-img" loading="lazy"/>:<span style={{fontSize:isMob?48:64,filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.1))"}}>📦</span>}
        </div>
        <div style={{padding:isMob?"12px":"16px 18px 18px"}}>
          <h4 style={{fontSize:isMob?13:15,fontWeight:700,color:c.text,fontFamily:f.heading,marginBottom:6,lineHeight:1.35,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{p.name}</h4>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
            <Stars r={p.rating} s={11}/>
            <span style={{fontSize:11,fontWeight:600,color:c.textMuted}}>{p.rating}</span>
            {p.unit&&<span style={{fontSize:10,color:c.textMuted,marginLeft:"auto",padding:"2px 8px",borderRadius:6,background:c.bg}}>{p.unit}</span>}
          </div>
          <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:isMob?10:12}}>
            <span style={{fontSize:isMob?17:20,fontWeight:800,color:c.text}}>₹{p.price}</span>
            {disc>0&&<span style={{fontSize:isMob?12:13,color:c.textMuted,textDecoration:"line-through"}}>₹{p.mrp}</span>}
          </div>
          <div onClick={e=>e.stopPropagation()} style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
            {q>0
              ?<QtyBtn pid={p._id} compact={isMob}/>
              :(<button onClick={e=>{e.stopPropagation();e.preventDefault();addC(p);}} className="sp-add-btn" style={{width:"100%",padding:isMob?"8px 0":"10px 0",borderRadius:T.btnRadius,border:`2px solid ${c.primary}`,background:"transparent",color:c.primary,fontWeight:700,fontSize:isMob?12:14,cursor:"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                  {Ic.plus}<span>Add</span>
                </button>
              )
            }
          </div>
        </div>
      </div>
    );
  };

  /* ═══ DESKTOP HEADER ═══ */
  const DHead=()=>(
    <div style={{position:"sticky",top:0,zIndex:100,background:`${c.bgCard}ee`,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:`1px solid ${c.border}`,transition:"all 0.3s"}}>
      <div style={{maxWidth:"100%",margin:"0 auto",display:"flex",alignItems:"center",gap:24,padding:"14px 5%"}}>
        <div onClick={()=>go("home")} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",flexShrink:0}}>
          <span style={{fontSize:32,filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.1))",display:"flex"}}>{stSettings?.logo?<img src={stSettings.logo} alt="Logo" style={{height:32,width:"auto",objectFit:"contain"}}/>:T.icon}</span>
          <div><div style={{fontWeight:800,fontSize:22,fontFamily:f.heading,color:c.text,lineHeight:1.1}}>{store.name}</div><div style={{fontSize:11,color:c.textMuted,fontWeight:500}}>{T.tagline}</div></div>
        </div>
        <div style={{flex:1,maxWidth:680,display:"flex",alignItems:"center",gap:10,padding:"12px 22px",borderRadius:50,background:c.bg,border:`2px solid ${view==="search"?c.primary:c.border}`,transition:"all 0.3s",boxShadow:view==="search"?`0 0 0 4px ${c.primary}15`:"none"}}>
          <span style={{color:c.textMuted}}>{Ic.search}</span>
          <input value={sq} onChange={e=>{setSq(e.target.value);if(view!=="home"&&view!=="categories"&&view!=="search")go("search");}} onFocus={()=>{if(view==="home")go("search");}} placeholder={`Search products in ${store.name}...`} style={{border:"none",background:"none",fontSize:15,flex:1,color:c.text,outline:"none",fontWeight:500,minWidth:0}}/>
          {sq&&<button onClick={()=>setSq("")} style={{background:"none",border:"none",cursor:"pointer",color:c.textMuted,transition:"color 0.2s",flexShrink:0}}>{Ic.close}</button>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          {[{id:"home",label:"Home",icon:Ic.home},{id:"categories",label:"Shop",icon:Ic.grid}].map(it=>(
            <button key={it.id} onClick={()=>go(it.id)} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 18px",borderRadius:12,border:"none",background:view===it.id?`${c.primary}12`:"transparent",color:view===it.id?c.primary:c.textLight,fontWeight:view===it.id?700:500,fontSize:14,cursor:"pointer",transition:"all 0.2s"}}>{it.icon}<span>{it.label}</span></button>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Badge n={wl.length} color={c.danger}><button onClick={()=>go("wishlist")} style={{width:42,height:42,borderRadius:12,background:view==="wishlist"?`${c.danger}10`:"transparent",border:"none",cursor:"pointer",color:view==="wishlist"?c.danger:c.textLight,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}} title="Wishlist">{Ic.heart}</button></Badge>
          <Badge n={cCount} color={c.primary}><button onClick={()=>setCartDrw(!cartDrw)} style={{width:42,height:42,borderRadius:12,background:cartDrw?`${c.primary}10`:"transparent",border:"none",cursor:"pointer",color:cartDrw?c.primary:c.textLight,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}} title="Cart">{Ic.cart}</button></Badge>
          <button onClick={()=>go("account")} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 16px",borderRadius:12,border:`2px solid ${c.border}`,background:c.bgCard,cursor:"pointer",color:c.text,fontSize:13,fontWeight:600,transition:"all 0.2s"}}>
            <div style={{width:30,height:30,borderRadius:10,background:c.gradient,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:13}}>G</div>Account
          </button>
        </div>
      </div>
    </div>
  );

  /* ═══ MOBILE HEADER ═══ */
  const MHead=()=>(
    <div style={{position:"sticky",top:0,zIndex:100,background:`${c.bgCard}f0`,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:`1px solid ${c.border}`}}>
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px"}}>
        {view!=="home"&&view!=="categories"&&view!=="wishlist"&&view!=="cart"&&view!=="account"?(
          <button onClick={()=>go(prev||"home")} style={{background:"none",border:"none",cursor:"pointer",color:c.text,padding:2,transition:"transform 0.2s"}}>{Ic.back}</button>
        ):(
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:24,filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.1))",display:"flex"}}>{stSettings?.logo?<img src={stSettings.logo} alt="Logo" style={{height:24,width:"auto",objectFit:"contain"}}/>:T.icon}</span>
            <div><div style={{fontWeight:800,fontSize:16,fontFamily:f.heading,color:c.text,lineHeight:1.1}}>{store.name}</div><div style={{fontSize:9,color:c.success,display:"flex",alignItems:"center",gap:2,fontWeight:600}}><span style={{width:6,height:6,borderRadius:3,background:c.success,display:"inline-block"}}/>Delivery in 30 min</div></div>
          </div>
        )}
        <div style={{flex:1}}/>
        <button onClick={()=>go("search")} style={{background:"none",border:"none",cursor:"pointer",color:c.textLight,padding:3}}>{Ic.search}</button>
        <Badge n={wl.length} color={c.danger}><button onClick={()=>go("wishlist")} style={{background:"none",border:"none",cursor:"pointer",color:c.textLight,padding:3}}>{Ic.heart}</button></Badge>
        <Badge n={cCount} color={c.primary}><button onClick={()=>go("cart")} style={{background:"none",border:"none",cursor:"pointer",color:c.textLight,padding:3}}>{Ic.cart}</button></Badge>
      </div>
      {(view==="home"||view==="categories")&&(
        <div onClick={()=>go("search")} style={{margin:"0 14px 10px",padding:"10px 16px",borderRadius:14,background:c.bg,border:`1px solid ${c.border}`,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
          <span style={{color:c.textMuted}}>{Ic.search}</span><span style={{color:c.textMuted,fontSize:14,fontWeight:500}}>Search {store.name}...</span>
        </div>
      )}
    </div>
  );

  /* ═══ BOTTOM NAV ═══ */
  const BNav=()=>{if(!isMob||view==="checkout"||view==="success"||view==="product")return null;
    const navItems=[
      {id:"home",l:"Home",i:Ic.home,a:Ic.homeFill},
      {id:"categories",l:"Shop",i:Ic.grid,a:Ic.gridFill},
      {id:"wishlist",l:"Saved",i:Ic.heart,a:Ic.heartFill,b:wl.length},
      {id:"cart",l:"Cart",i:Ic.cart,a:Ic.cartFill,b:cCount},
      {id:"account",l:"Account",i:Ic.user,a:Ic.userFill}
    ];
    return(<div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:200,background:`${c.bgCard}f8`,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderTop:`1.5px solid ${c.border}`,display:"flex",padding:"2px 0 env(safe-area-inset-bottom,4px)"}}>
      {navItems.map(it=>{const ac=view===it.id;return(
        <button key={it.id} onClick={()=>go(it.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,padding:"8px 4px 6px",border:"none",background:"none",cursor:"pointer",color:ac?c.primary:c.textMuted,position:"relative",transition:"all 0.2s",minWidth:0}}>
          {ac&&<div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:32,height:3,borderRadius:"0 0 4px 4px",background:c.primary}}/>}
          <div style={{width:44,height:36,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:12,background:ac?`${c.primary}12`:"transparent",transition:"all 0.2s"}}>
            <Badge n={it.b||0} color={c.primary}>
              <div style={{color:ac?c.primary:c.textMuted,display:"flex",alignItems:"center",justifyContent:"center"}}>{ac?it.a:it.i}</div>
            </Badge>
          </div>
          <span style={{fontSize:10,fontWeight:ac?700:500,letterSpacing:0.1,lineHeight:1}}>{it.l}</span>
        </button>);
      })}
    </div>);
  };

  /* ═══ CART DRAWER (Desktop) ═══ */
  const CDrw=()=>{if(!cartDrw||isMob)return null;return(<>
    <div onClick={()=>setCartDrw(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",zIndex:300,backdropFilter:"blur(4px)"}}/>
    <div className="sp-drawer" style={{position:"fixed",top:0,right:0,width:440,height:"100vh",background:c.bgCard,zIndex:301,boxShadow:"-12px 0 40px rgba(0,0,0,0.12)",display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 24px",borderBottom:`1px solid ${c.border}`}}>
        <h3 style={{fontSize:20,fontWeight:800,color:c.text,fontFamily:f.heading}}>Shopping Cart <span style={{fontSize:14,fontWeight:500,color:c.textMuted}}>({cCount})</span></h3>
        <button onClick={()=>setCartDrw(false)} style={{width:36,height:36,borderRadius:10,background:c.bg,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:c.textMuted}}>{Ic.close}</button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:20}}>
        {cart.length>0?cart.map(it=>(
          <div key={it.product._id} style={{display:"flex",gap:14,padding:14,borderRadius:16,background:c.bg,marginBottom:12,transition:"all 0.2s"}}>
            <div style={{width:72,height:72,borderRadius:14,background:c.bgCard,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>{it.product.image?<img src={it.product.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:28}}>📦</span>}</div>
            <div style={{flex:1}}>
              <h4 style={{fontSize:14,fontWeight:600,color:c.text,marginBottom:4}}>{it.product.name}</h4>
              <div style={{fontSize:17,fontWeight:800,color:c.text,marginBottom:8}}>₹{it.product.price*it.qty}<span style={{fontSize:12,fontWeight:400,color:c.textMuted,marginLeft:4}}>{it.qty>1&&`(₹${it.product.price}×${it.qty})`}</span></div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <QtyBtn pid={it.product._id} compact/>
                <button onClick={()=>remC(it.product._id)} style={{width:32,height:32,borderRadius:8,background:`${c.danger}10`,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:c.danger,transition:"all 0.2s"}}>{Ic.trash}</button>
              </div>
            </div>
          </div>
        )):<div style={{textAlign:"center",padding:"50px 20px"}}><div style={{fontSize:48,marginBottom:12}}>🛒</div><p style={{color:c.textMuted,fontWeight:500}}>Your cart is empty</p></div>}
      </div>
      {cart.length>0&&<div style={{padding:20,borderTop:`1px solid ${c.border}`,background:c.bgCard}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:14}}><span style={{color:c.textMuted}}>Subtotal</span><span style={{textDecoration:"line-through",color:c.textMuted}}>₹{cMrp}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:14}}><span style={{color:c.success,fontWeight:600}}>You Save</span><span style={{color:c.success,fontWeight:700}}>₹{cMrp-cTotal}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:14,fontSize:14}}><span style={{color:c.textMuted}}>Delivery</span><span style={{color:c.success,fontWeight:600}}>{dlv===0?"FREE":"₹"+dlv}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:18,fontSize:20,fontWeight:800,color:c.text,padding:"12px 0",borderTop:`2px dashed ${c.border}`}}><span>Total</span><span>₹{grand}</span></div>
        <button onClick={()=>{setCartDrw(false);go("checkout");}} className="sp-btn-glow" style={{width:"100%",padding:16,borderRadius:T.btnRadius,background:c.gradient,color:"#fff",border:"none",fontWeight:700,fontSize:16,cursor:"pointer",transition:"all 0.2s"}}>Checkout →</button>
      </div>}
    </div>
  </>);};

  /* ═══ HOME ═══ */
  const Home=()=>(<div>
    {/* Hero Banner */}
    {stSettings.showBanners!==false&&banners.length>0&&<div style={{maxWidth:"100%",margin:"0 auto",padding:isMob?0:"20px 5%"}}>
      <div className="sp-banner" style={{background:banners[bi]?.image?`url(${banners[bi].image}) center/cover`:banners[bi]?.bgColor,padding:isMob?"clamp(28px,6vw,48px) 20px":"60px 50px",color:"#fff",borderRadius:isMob?0:24,position:"relative",minHeight:isMob?170:320,overflow:"hidden",transition:"all 0.5s"}}>
        {banners[bi]?.image&&<div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(0,0,0,0.55),rgba(0,0,0,0.2))",borderRadius:isMob?0:24}}/>}
        <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 80% 20%,rgba(255,255,255,0.1),transparent)",borderRadius:isMob?0:24}}/>
        <div style={{position:"relative",zIndex:2,maxWidth:500}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 14px",borderRadius:50,background:"rgba(255,255,255,0.15)",backdropFilter:"blur(10px)",fontSize:12,fontWeight:600,marginBottom:isMob?10:16}}>{Ic.bolt} Limited Time Offer</div>
          <h2 style={{fontSize:isMob?"clamp(1.4rem,5vw,2rem)":"2.8rem",fontWeight:800,fontFamily:f.heading,marginBottom:isMob?8:14,lineHeight:1.15,textShadow:"0 2px 20px rgba(0,0,0,0.2)"}}>{banners[bi]?.title}</h2>
          <p style={{fontSize:isMob?14:18,opacity:0.9,marginBottom:isMob?16:28,fontWeight:400}}>{banners[bi]?.subtitle}</p>
          <button className="sp-btn-glow" style={{padding:isMob?"10px 24px":"14px 36px",borderRadius:T.btnRadius,background:"#fff",color:c.primary,border:"none",fontWeight:700,fontSize:isMob?13:16,cursor:"pointer",boxShadow:"0 4px 20px rgba(0,0,0,0.15)",transition:"all 0.2s"}}>Shop Now →</button>
        </div>
      </div>
      <div style={{display:"flex",gap:8,justifyContent:"center",padding:"12px 0"}}>{banners.map((_,i)=><button key={i} onClick={()=>setBi(i)} style={{width:i===bi?28:10,height:10,borderRadius:5,background:i===bi?c.primary:`${c.primary}30`,border:"none",cursor:"pointer",transition:"all 0.4s"}}/>)}</div>
    </div>}

    {/* Categories */}
    {stSettings.showCategories!==false&&<div style={{maxWidth:"100%",margin:"0 auto",padding:isMob?"4px 14px 16px":"4px 5% 24px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:isMob?12:18}}>
        <h3 style={{fontSize:isMob?18:22,fontWeight:800,fontFamily:f.heading,color:c.text}}>Shop by Category</h3>
        <button onClick={()=>go("categories")} style={{background:"none",border:"none",cursor:"pointer",color:c.primary,fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:4}}>See All {Ic.chev}</button>
      </div>
      <div style={{display:"flex",gap:isMob?12:20,overflowX:"auto",paddingBottom:8}}>
        {cats.map((cat,i)=>(
          <div key={cat._id} onClick={()=>{setSelC(cat._id);go("categories");}} className="sp-cat" style={{minWidth:isMob?78:110,textAlign:"center",cursor:"pointer"}}>
            <div style={{width:isMob?60:80,height:isMob?60:80,borderRadius:isMob?18:24,background:`linear-gradient(135deg,${c.bg},${c.bgCard})`,border:`2px solid ${c.border}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 8px",overflow:"hidden",transition:"all 0.3s",boxShadow:"0 4px 12px rgba(0,0,0,0.04)"}}>{cat.image?<img src={cat.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:isMob?28:36}}>{cat.icon}</span>}</div>
            <span style={{fontSize:isMob?11:13,fontWeight:600,color:c.text,lineHeight:1.3}}>{cat.name}</span>
          </div>
        ))}
      </div>
    </div>}

    {/* Trust Strip — live data from settings */}
    <div style={{maxWidth:"100%",margin:"0 auto",padding:isMob?"0 14px 16px":"0 5% 24px"}}>
      <div style={{display:isMob?"flex":"grid",gridTemplateColumns:"repeat(3,1fr)",gap:isMob?0:16,padding:isMob?"14px 16px":"0",borderRadius:isMob?16:0,background:isMob?`linear-gradient(135deg,${c.success}08,${c.primary}05)`:"transparent",border:isMob?`1px solid ${c.success}20`:"none",justifyContent:"space-around"}}>
        {[
          {icon:Ic.truck,t:"Free Delivery",d:`On orders ₹${freeDeliveryAbove}+`,col:c.success},
          {icon:Ic.shield,t:"100% Genuine",d:"Certified products",col:c.primary},
          {icon:Ic.tag,t:stSettings.enableCOD!==false?"COD Available":"Online Payment",d:stSettings.enableCOD!==false?"Pay on delivery":"Secure & Fast",col:c.secondary}
        ].map((it,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:isMob?8:12,padding:isMob?"6px 0":16,borderRadius:14,background:isMob?"transparent":`${it.col}06`,border:isMob?"none":`1px solid ${it.col}15`,textAlign:isMob?"center":"left",flexDirection:isMob?"column":"row"}}>
            <div style={{width:isMob?28:40,height:isMob?28:40,borderRadius:isMob?8:12,background:`${it.col}12`,display:"flex",alignItems:"center",justifyContent:"center",color:it.col}}>{it.icon}</div>
            <div><div style={{fontSize:isMob?10:14,fontWeight:700,color:c.text}}>{it.t}</div>{!isMob&&<div style={{fontSize:12,color:c.textMuted}}>{it.d}</div>}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Trending Products section */}
    {stSettings.showTrending!==false&&products.some(p=>p.isTrending)&&(
      <div style={{maxWidth:"100%",margin:"0 auto",padding:isMob?"0 14px 16px":"0 5% 24px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:isMob?14:20}}>
          <h3 style={{fontSize:isMob?18:24,fontWeight:800,fontFamily:f.heading,color:c.text}}>🔥 Trending Now</h3>
          <span style={{fontSize:12,color:c.textMuted,fontWeight:500}}>{products.filter(p=>p.isTrending).length} items</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:gc,gap:isMob?10:20}}>{products.filter(p=>p.isTrending).slice(0,isMob?4:8).map((p,i)=><PCard key={p._id} p={p} idx={i}/>)}</div>
      </div>
    )}

    {/* New Arrivals section */}
    {stSettings.showNewArrivals!==false&&products.some(p=>p.isNewArrival&&!p.isTrending)&&(
      <div style={{maxWidth:"100%",margin:"0 auto",padding:isMob?"0 14px 16px":"0 5% 24px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:isMob?14:20}}>
          <h3 style={{fontSize:isMob?18:24,fontWeight:800,fontFamily:f.heading,color:c.text}}>✨ New Arrivals</h3>
          <span style={{fontSize:12,color:c.textMuted,fontWeight:500}}>{products.filter(p=>p.isNewArrival&&!p.isTrending).length} items</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:gc,gap:isMob?10:20}}>{products.filter(p=>p.isNewArrival&&!p.isTrending).slice(0,isMob?4:8).map((p,i)=><PCard key={p._id} p={p} idx={i}/>)}</div>
      </div>
    )}

    {/* All Products */}
    <div style={{maxWidth:"100%",margin:"0 auto",padding:isMob?"0 14px 90px":"0 5% 60px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:isMob?14:20}}>
        <h3 style={{fontSize:isMob?18:24,fontWeight:800,fontFamily:f.heading,color:c.text}}>All Products</h3>
        <span style={{fontSize:12,color:c.textMuted,fontWeight:500}}>{products.length} items</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:gc,gap:isMob?10:20}}>{products.map((p,i)=><PCard key={p._id} p={p} idx={i}/>)}</div>
    </div>
  </div>);

  /* ═══ OTHER VIEWS (simplified for space) ═══ */
  const CatView=()=>(<div style={{maxWidth:"100%",margin:"0 auto",padding:isMob?`0 14px ${90}px`:"0 5% 60px"}}>
    <div style={{display:"flex",gap:8,overflowX:"auto",padding:"12px 0 18px"}}><button onClick={()=>setSelC("")} className="sp-chip" style={{padding:"9px 20px",borderRadius:50,border:!selC?"none":`1px solid ${c.border}`,background:!selC?c.gradient:c.bgCard,color:!selC?"#fff":c.textLight,fontWeight:600,fontSize:13,cursor:"pointer",whiteSpace:"nowrap",boxShadow:!selC?`0 4px 15px ${c.primary}30`:"none"}}>✨ All</button>{cats.map(cat=><button key={cat._id} onClick={()=>setSelC(cat._id===selC?"":cat._id)} className="sp-chip" style={{padding:"9px 20px",borderRadius:50,border:selC===cat._id?"none":`1px solid ${c.border}`,background:selC===cat._id?c.gradient:c.bgCard,color:selC===cat._id?"#fff":c.textLight,fontWeight:600,fontSize:13,cursor:"pointer",whiteSpace:"nowrap",boxShadow:selC===cat._id?`0 4px 15px ${c.primary}30`:"none"}}>{cat.icon} {cat.name}</button>)}</div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><span style={{fontSize:14,fontWeight:700,color:c.text}}>{filt.length} Products</span><select value={sort} onChange={e=>setSort(e.target.value)} style={{padding:"8px 14px",borderRadius:10,border:`1px solid ${c.border}`,fontSize:12,background:c.bgCard,color:c.text,fontWeight:500}}><option value="default">Sort by</option><option value="priceLow">Price: Low → High</option><option value="priceHigh">Price: High → Low</option><option value="rating">Top Rated</option></select></div>
    <div style={{display:"grid",gridTemplateColumns:gc,gap:isMob?10:20}}>{filt.map((p,i)=><PCard key={p._id} p={p} idx={i}/>)}</div>
    {!filt.length&&<div style={{textAlign:"center",padding:60,color:c.textMuted}}><div style={{fontSize:48,marginBottom:12}}>🔍</div><p style={{fontWeight:600}}>No products found</p></div>}
  </div>);

  const SearchV=()=>(<div style={{maxWidth:"100%",margin:"0 auto",padding:isMob?`0 14px ${90}px`:"0 5% 60px"}}>
    {isMob&&<div style={{padding:"12px 0"}}><div style={{display:"flex",alignItems:"center",gap:8,padding:"12px 16px",borderRadius:16,background:c.bg,border:`2px solid ${c.primary}`,boxShadow:`0 0 0 4px ${c.primary}10`}}><span style={{color:c.primary}}>{Ic.search}</span><input value={sq} onChange={e=>setSq(e.target.value)} placeholder="Search products..." autoFocus style={{border:"none",background:"none",fontSize:15,flex:1,color:c.text,outline:"none",fontWeight:500}}/>{sq&&<button onClick={()=>setSq("")} style={{background:"none",border:"none",cursor:"pointer",color:c.textMuted}}>{Ic.close}</button>}</div></div>}
    {sq?<><p style={{fontSize:13,color:c.textMuted,marginBottom:14,marginTop:isMob?0:20,fontWeight:500}}>{filt.length} results for <strong>"{sq}"</strong></p><div style={{display:"grid",gridTemplateColumns:gc,gap:isMob?10:20}}>{filt.map((p,i)=><PCard key={p._id} p={p} idx={i}/>)}</div></>:(<div style={{paddingTop:20}}><h4 style={{fontSize:15,fontWeight:700,color:c.text,marginBottom:14}}>Browse Categories</h4><div style={{display:"flex",flexWrap:"wrap",gap:10}}>{cats.map(cat=><button key={cat._id} onClick={()=>{setSq("");setSelC(cat._id);go("categories");}} className="sp-chip" style={{padding:"10px 20px",borderRadius:50,border:`1px solid ${c.border}`,background:c.bgCard,fontSize:13,cursor:"pointer",color:c.text,fontWeight:500,display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:18}}>{cat.icon}</span>{cat.name}</button>)}</div></div>)}
  </div>);

  const ProdV=()=>{if(!selP)return null;const p=selP;const disc=Math.round((1-p.price/p.mrp)*100);
    // Theme fields for display
    const themeFieldDefs=getThemeFields((store?.theme||"grocery") as import("../types").ThemeType);
    const hasVars=p.hasVariants&&p.variants&&p.variants.length>0;
    const hasUnits=p.hasUnitVariants&&p.unitVariants&&p.unitVariants.length>0;
    // Unit variant computed values
    const selUnitData=hasUnits?p.unitVariants!.find(u=>u.unit===selUnit)||null:null;
    // Unique colors and sizes from variants
    const uniqueColors=[...new Map((p.variants||[]).map(v=>([v.color,v]))).values()];
    const uniqueSizes=[...new Set((p.variants||[]).filter(v=>!selColor||v.color===selColor).map(v=>v.size))];
    // Find matching variant
    const matchedVariant=(p.variants||[]).find(v=>v.color===selColor&&v.size===selSize)||null;
    const effectiveUnitPrice=selUnitData?.price??null;
    const effectivePrice=effectiveUnitPrice??matchedVariant?.price??p.price;
    const effectiveStock=selUnitData?.stock??matchedVariant?.stock??p.stock;
    const q=gQ(p._id,matchedVariant?._id);
    const w=iW(p._id);
    // ── Smart Recommendations ──
    const pCatId=typeof p.category==="object"?p.category._id:p.category;
    // Score products by relevance
    const scored=products.filter(x=>x._id!==p._id).map(x=>{
      let score=0;
      const xCatId=typeof x.category==="object"?x.category._id:x.category;
      if(xCatId===pCatId) score+=10;                        // same category: highest weight
      if(viewedIds.includes(x._id)) score+=5;               // user already viewed it
      if(Math.abs(x.price-p.price)/Math.max(p.price,1)<0.3) score+=3; // similar price range
      if(x.isTrending) score+=2;
      if(x.isNewArrival) score+=1;
      if(x.isFeatured) score+=2;
      return{...x,score};
    }).sort((a,b)=>b.score-a.score);
    const rel=scored.slice(0,isMob?4:6);
    // "Frequently Bought Together" - products that appeared in cart alongside cartHistory items
    const fbt=products.filter(x=>{
      if(x._id===p._id) return false;
      const xCatId=typeof x.category==="object"?x.category._id:x.category;
      // Show products from different categories that are in cart history or trending
      return cartHistory.includes(x._id)||(xCatId!==pCatId&&(x.isTrending||x.isFeatured));
    }).slice(0,4);
    return(<div style={{maxWidth:"100%",margin:"0 auto",paddingBottom:isMob?90:60}}>
      <div style={{display:isMob?"block":"flex",gap:48,padding:isMob?0:"24px 5%"}}>
        <div style={{width:isMob?"100%":"45%",flexShrink:0}}>
          <div style={{height:isMob?340:500,background:`linear-gradient(180deg,${c.bg},${c.bgCard})`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",borderRadius:isMob?0:24,boxShadow:isMob?"none":"0 8px 30px rgba(0,0,0,0.06)"}}>
            {p.image?<img src={p.image} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:80}}>📦</span>}
            {disc>0&&<div style={{position:"absolute",top:16,left:16,padding:"6px 16px",borderRadius:10,background:`linear-gradient(135deg,${c.danger},${c.secondary})`,color:"#fff",fontWeight:800,fontSize:14,boxShadow:`0 4px 15px ${c.danger}40`}}>{disc}% OFF</div>}
            <div style={{position:"absolute",top:16,right:16,display:"flex",gap:8}}>
              <button onClick={()=>tW(p._id)} style={{width:44,height:44,borderRadius:14,background:"rgba(255,255,255,0.95)",backdropFilter:"blur(8px)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:w?c.danger:"#CBD5E1",boxShadow:"0 4px 12px rgba(0,0,0,0.08)",transition:"all 0.2s"}}>{w?Ic.heartFill:Ic.heart}</button>
              <button style={{width:44,height:44,borderRadius:14,background:"rgba(255,255,255,0.95)",backdropFilter:"blur(8px)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#CBD5E1",boxShadow:"0 4px 12px rgba(0,0,0,0.08)"}}>{Ic.share}</button>
            </div>
          </div>
          {/* Extra gallery thumbnails */}
          {p.images&&p.images.length>0&&(
            <div style={{display:"flex",gap:8,padding:isMob?"10px 16px":"12px 0",overflowX:"auto"}}>
              {[p.image,...p.images].filter(Boolean).map((img,i)=>(
                <img key={i} src={img} alt="" onClick={()=>setSelP({...p,image:img})} style={{width:64,height:64,borderRadius:12,objectFit:"cover",border:`2px solid ${p.image===img?c.primary:c.border}`,cursor:"pointer",flexShrink:0,transition:"border-color 0.2s"}}/>
              ))}
            </div>
          )}
        </div>
        <div style={{padding:isMob?"20px 16px":"0",flex:1}}>
          {/* Rating + unit */}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:4,padding:"5px 12px",borderRadius:8,background:`${c.success}10`}}><Stars r={p.rating}/><span style={{fontSize:13,fontWeight:700,color:c.success,marginLeft:2}}>{p.rating}</span></div>
            {p.unit&&<span style={{fontSize:13,color:c.textMuted,padding:"5px 12px",borderRadius:8,background:c.bg,fontWeight:500}}>{p.unit}</span>}
          </div>
          <h1 style={{fontSize:isMob?22:32,fontWeight:800,fontFamily:f.heading,color:c.text,marginBottom:16,lineHeight:1.25}}>{p.name}</h1>

          {/* ── THEME-SPECIFIC FIELDS ── */}
          {p.themeFields&&Object.keys(p.themeFields).length>0&&(
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:18}}>
              {themeFieldDefs.filter(fd=>p.themeFields![fd.key]).map(fd=>(
                <div key={fd.key} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:10,background:`${c.primary}08`,border:`1px solid ${c.primary}20`}}>
                  <span style={{fontSize:13}}>{fd.icon}</span>
                  <span style={{fontSize:12,fontWeight:600,color:c.textMuted}}>{fd.label}:</span>
                  <span style={{fontSize:12,fontWeight:700,color:c.text}}>{String(p.themeFields![fd.key])}</span>
                </div>
              ))}
            </div>
          )}

          {/* Price */}
          <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:20,padding:"16px 0",borderTop:`1px solid ${c.border}`,borderBottom:`1px solid ${c.border}`}}>
            <span style={{fontSize:isMob?28:36,fontWeight:800,color:c.text}}>₹{effectivePrice}</span>
            {disc>0&&<><span style={{fontSize:18,color:c.textMuted,textDecoration:"line-through"}}>₹{p.mrp}</span><div style={{padding:"4px 12px",borderRadius:8,background:`${c.success}10`,color:c.success,fontWeight:700,fontSize:14}}>Save ₹{p.mrp-effectivePrice}</div></>}
            {matchedVariant&&matchedVariant.price&&matchedVariant.price!==p.price&&<span style={{fontSize:12,padding:"3px 8px",borderRadius:6,background:`${c.secondary}15`,color:c.secondary,fontWeight:600}}>Variant price</span>}
          </div>

          {/* ── VARIANT PICKER ── */}
          {hasVars&&(
            <div style={{marginBottom:24}}>
              {/* Color swatches */}
              {uniqueColors.length>0&&(
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:13,fontWeight:700,color:c.text,marginBottom:10}}>Color: <span style={{color:c.primary,fontWeight:800}}>{selColor||"Select color"}</span></div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {uniqueColors.map(v=>(
                      <button key={v.color} onClick={()=>{setSelColor(v.color);setSelSize("");setSelVariant(null);}} title={v.color} style={{width:36,height:36,borderRadius:"50%",background:v.colorHex||"#ccc",border:`3px solid ${selColor===v.color?c.primary:"transparent"}`,cursor:"pointer",outline:`2px solid ${selColor===v.color?c.primary:c.border}`,outlineOffset:2,transition:"all 0.2s",boxShadow:selColor===v.color?`0 0 0 4px ${c.primary}20`:"none"}}/>
                    ))}
                  </div>
                </div>
              )}
              {/* Size buttons */}
              {selColor&&uniqueSizes.length>0&&(
                <div style={{marginBottom:8}}>
                  <div style={{fontSize:13,fontWeight:700,color:c.text,marginBottom:10}}>Size: <span style={{color:c.primary,fontWeight:800}}>{selSize||"Select size"}</span></div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {uniqueSizes.map(sz=>{
                      const variantForSize=(p.variants||[]).find(v=>v.color===selColor&&v.size===sz);
                      const outOfStock=variantForSize&&variantForSize.stock===0;
                      return(
                        <button key={sz} onClick={()=>{if(outOfStock)return;setSelSize(sz);setSelVariant(variantForSize||null);}} disabled={!!outOfStock} style={{minWidth:48,padding:"8px 14px",borderRadius:10,border:`2px solid ${selSize===sz?c.primary:c.border}`,background:selSize===sz?`${c.primary}10`:outOfStock?c.bg:"white",color:selSize===sz?c.primary:outOfStock?c.textMuted:c.text,fontWeight:selSize===sz?700:500,fontSize:13,cursor:outOfStock?"not-allowed":"pointer",opacity:outOfStock?0.5:1,transition:"all 0.2s",textDecoration:outOfStock?"line-through":"none"}}>
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* Stock info for selected variant */}
              {matchedVariant&&(
                <div style={{fontSize:12,color:effectiveStock===0?c.danger:c.success,fontWeight:600,marginTop:6}}>
                  {effectiveStock===0?"⚠️ Out of stock":effectiveStock<=5?`⚡ Only ${effectiveStock} left!`:`✅ In stock (${effectiveStock} available)`}
                </div>
              )}
              {hasVars&&(!selColor||!selSize)&&(
                <div style={{fontSize:12,color:c.textMuted,marginTop:6}}>👆 Please select color and size to add to cart</div>
              )}
            </div>
          )}

          {p.description&&<p style={{fontSize:15,color:c.textLight,lineHeight:1.8,marginBottom:20}}>{p.description}</p>}
          <div style={{display:"grid",gridTemplateColumns:isMob?"1fr":"1fr 1fr",gap:10,marginBottom:24}}>
            {[{icon:Ic.truck,t:"Free Delivery on ₹499+",col:c.success},{icon:Ic.shield,t:"100% Genuine Products",col:c.primary},{icon:Ic.tag,t:"Cash on Delivery",col:c.secondary},{icon:Ic.gift,t:"Gift Wrap Available",col:"#8B5CF6"}].map((it,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderRadius:12,background:`${it.col}06`,border:`1px solid ${it.col}12`}}><span style={{color:it.col}}>{it.icon}</span><span style={{fontSize:13,color:c.textLight,fontWeight:500}}>{it.t}</span></div>))}
          </div>
          <div style={{maxWidth:isMob?"100%":400}}>
            {/* Add to cart / qty control */}
            {hasVars?(
              // Variant mode
              q>0?<QtyBtn pid={p._id} variantId={matchedVariant?._id}/>:(
                <button
                  onClick={()=>{if(!selColor||!selSize){toast.error("Please select color & size");return;}if(effectiveStock===0){toast.error("Out of stock");return;}addC(p,matchedVariant||undefined);}}
                  className="sp-btn-glow"
                  disabled={!selColor||!selSize||effectiveStock===0}
                  style={{width:"100%",padding:16,borderRadius:T.btnRadius,background:(!selColor||!selSize||effectiveStock===0)?c.border:c.gradient,color:"#fff",border:"none",fontWeight:700,fontSize:16,cursor:(!selColor||!selSize||effectiveStock===0)?"not-allowed":"pointer",boxShadow:(!selColor||!selSize||effectiveStock===0)?"none":`0 6px 25px ${c.primary}30`,transition:"all 0.2s"}}>
                  {!selColor?"Select Color First":!selSize?"Select Size":effectiveStock===0?"Out of Stock":"🛒 Add to Cart"}
                </button>
              )
            ):hasUnits?(
              // Unit variant mode
              q>0?<QtyBtn pid={p._id}/>:(
                <button
                  onClick={()=>{if(!selUnit){toast.error("Please select a quantity/size");return;}if(selUnitData&&selUnitData.stock===0){toast.error("Out of stock");return;}addC({...p,price:selUnitData?.price??p.price,unit:selUnit});}}
                  className="sp-btn-glow"
                  disabled={!selUnit||(selUnitData?.stock===0)}
                  style={{width:"100%",padding:16,borderRadius:T.btnRadius,background:(!selUnit||(selUnitData?.stock===0))?c.border:c.gradient,color:"#fff",border:"none",fontWeight:700,fontSize:16,cursor:(!selUnit||(selUnitData?.stock===0))?"not-allowed":"pointer",boxShadow:(!selUnit||(selUnitData?.stock===0))?"none":`0 6px 25px ${c.primary}30`,transition:"all 0.2s"}}>
                  {!selUnit?"Select Quantity First":selUnitData?.stock===0?"Out of Stock":`🛒 Add to Cart — ₹${effectivePrice} (${selUnit})`}
                </button>
              )
            ):(
              // No-variant mode
              q>0?<QtyBtn pid={p._id}/>:<button onClick={()=>addC(p)} className="sp-btn-glow" style={{width:"100%",padding:16,borderRadius:T.btnRadius,background:c.gradient,color:"#fff",border:"none",fontWeight:700,fontSize:16,cursor:"pointer",boxShadow:`0 6px 25px ${c.primary}30`}}>🛒 Add to Cart — ₹{p.price}</button>
            )}
          </div>
        </div>
      </div>
      {/* ── Frequently Bought Together ── */}
      {fbt.length>0&&(
        <div style={{padding:isMob?"24px 14px":"32px 5%",background:`linear-gradient(135deg,${c.primary}05,${c.secondary}05)`,borderTop:`1px solid ${c.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <div style={{width:36,height:36,borderRadius:10,background:c.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🛒</div>
            <div>
              <h3 style={{fontSize:isMob?16:20,fontWeight:800,fontFamily:f.heading,color:c.text,lineHeight:1}}>Frequently Bought Together</h3>
              <p style={{fontSize:12,color:c.textMuted,fontWeight:500,marginTop:2}}>Customers also add these to their cart</p>
            </div>
          </div>
          <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:8}}>
            <div style={{flexShrink:0,background:c.bgCard,borderRadius:16,border:`2px solid ${c.primary}`,padding:12,width:isMob?120:150,textAlign:"center"}}>
              <div style={{width:"100%",height:80,borderRadius:10,overflow:"hidden",marginBottom:8,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {p.image?<img src={p.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:32}}>📦</span>}
              </div>
              <div style={{fontSize:11,fontWeight:700,color:c.primary,background:`${c.primary}12`,borderRadius:6,padding:"2px 8px",marginBottom:4,display:"inline-block"}}>CURRENT</div>
              <div style={{fontSize:11,fontWeight:600,color:c.text,lineHeight:1.3,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{p.name}</div>
              <div style={{fontSize:13,fontWeight:800,color:c.text,marginTop:4}}>₹{p.price}</div>
            </div>
            {fbt.map((fp,i)=>(
              <React.Fragment key={fp._id}>
                <div style={{display:"flex",alignItems:"center",color:c.textMuted,fontSize:22,fontWeight:300,flexShrink:0}}>+</div>
                <div onClick={()=>openP(fp)} style={{flexShrink:0,background:c.bgCard,borderRadius:16,border:`1px solid ${c.border}`,padding:12,width:isMob?120:150,textAlign:"center",cursor:"pointer",transition:"all 0.2s"}}>
                  <div style={{width:"100%",height:80,borderRadius:10,overflow:"hidden",marginBottom:8,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {fp.image?<img src={fp.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:32}}>📦</span>}
                  </div>
                  {cartHistory.includes(fp._id)&&<div style={{fontSize:11,fontWeight:700,color:c.success,background:`${c.success}12`,borderRadius:6,padding:"2px 8px",marginBottom:4,display:"inline-block"}}>IN CART</div>}
                  <div style={{fontSize:11,fontWeight:600,color:c.text,lineHeight:1.3,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{fp.name}</div>
                  <div style={{fontSize:13,fontWeight:800,color:c.text,marginTop:4}}>₹{fp.price}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
          <div style={{marginTop:16,padding:"14px 18px",borderRadius:14,background:c.bgCard,border:`1px solid ${c.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
            <div>
              <div style={{fontSize:12,color:c.textMuted,fontWeight:500}}>Bundle Total ({1+fbt.slice(0,3).length} items)</div>
              <div style={{fontSize:20,fontWeight:800,color:c.text}}>₹{p.price+fbt.slice(0,3).reduce((s,x)=>s+x.price,0)}</div>
            </div>
            <button onClick={()=>{addC(p);fbt.slice(0,3).forEach(fp=>addC(fp));}} className="sp-btn-glow" style={{padding:"12px 24px",borderRadius:T.btnRadius,background:c.gradient,color:"#fff",border:"none",fontWeight:700,fontSize:14,cursor:"pointer",boxShadow:`0 4px 20px ${c.primary}30`}}>🛒 Add All to Cart</button>
          </div>
        </div>
      )}

      {/* ── You May Also Like ── */}
      {rel.length>0&&(
        <div style={{padding:isMob?"24px 14px":"32px 5%"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,borderRadius:10,background:`${c.secondary}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>✨</div>
              <div>
                <h3 style={{fontSize:isMob?16:20,fontWeight:800,fontFamily:f.heading,color:c.text,lineHeight:1}}>You May Also Like</h3>
                <p style={{fontSize:12,color:c.textMuted,fontWeight:500,marginTop:2}}>Based on your browsing</p>
              </div>
            </div>
            <button onClick={()=>{setSelC(pCatId);go("categories");}} style={{background:"none",border:`1px solid ${c.border}`,borderRadius:10,padding:"6px 14px",fontSize:12,fontWeight:600,color:c.primary,cursor:"pointer"}}>See All →</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:gc,gap:isMob?10:20}}>
            {rel.map((rp,i)=>(
              <div key={rp._id} style={{position:"relative"}}>
                {viewedIds.includes(rp._id)&&(
                  <div style={{position:"absolute",top:8,left:8,zIndex:3,background:c.secondary,color:"#fff",fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:6,pointerEvents:"none"}}>VIEWED</div>
                )}
                <PCard p={rp} idx={i}/>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>);
  };

  const WishV=()=>{const wp=products.filter(p=>wl.includes(p._id));return(<div style={{maxWidth:"100%",margin:"0 auto",padding:isMob?`14px 14px ${90}px`:"24px 5% 60px"}}>
    <h2 style={{fontSize:isMob?18:26,fontWeight:800,color:c.text,marginBottom:18,fontFamily:f.heading}}>My Wishlist <span style={{fontSize:14,fontWeight:500,color:c.textMuted}}>({wl.length} items)</span></h2>
    {wp.length>0?<div style={{display:"grid",gridTemplateColumns:gc,gap:isMob?10:20}}>{wp.map((p,i)=><PCard key={p._id} p={p} idx={i}/>)}</div>:(
      <div style={{textAlign:"center",padding:"70px 20px"}}><div style={{fontSize:64,marginBottom:16}}>💝</div><h3 style={{fontSize:20,fontWeight:800,color:c.text,marginBottom:8}}>Your wishlist is empty</h3><p style={{color:c.textMuted,fontSize:14,marginBottom:24,fontWeight:500}}>Save items you love to buy them later</p><button onClick={()=>go("home")} className="sp-btn-glow" style={{padding:"14px 36px",borderRadius:T.btnRadius,background:c.gradient,color:"#fff",border:"none",fontWeight:700,fontSize:14,cursor:"pointer"}}>Explore Products</button></div>
    )}</div>);};

  const CartV=()=>(<div style={{maxWidth:900,margin:"0 auto",padding:isMob?`14px 14px ${cart.length?"155px":"90px"}`:"24px 5% 60px"}}>
    <h2 style={{fontSize:isMob?18:26,fontWeight:800,color:c.text,marginBottom:18,fontFamily:f.heading}}>Shopping Cart <span style={{fontSize:14,fontWeight:500,color:c.textMuted}}>({cCount} items)</span></h2>
    {cart.length>0?<div style={{display:isMob?"block":"grid",gridTemplateColumns:"1fr 360px",gap:28}}>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {cart.map(it=><div key={it.product._id} style={{display:"flex",gap:14,padding:16,borderRadius:18,background:c.bgCard,border:`1px solid ${c.border}`,transition:"all 0.2s"}}>
          <div style={{width:isMob?76:96,height:isMob?76:96,borderRadius:14,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}>{it.product.image?<img src={it.product.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:32}}>📦</span>}</div>
          <div style={{flex:1,minWidth:0}}>
            <h4 style={{fontSize:15,fontWeight:600,color:c.text,marginBottom:4}}>{it.product.name}</h4>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}><span style={{fontSize:18,fontWeight:800,color:c.text}}>₹{it.product.price*it.qty}</span>{it.qty>1&&<span style={{fontSize:12,color:c.textMuted,fontWeight:500}}>₹{it.product.price} × {it.qty}</span>}</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><QtyBtn pid={it.product._id} compact/><button onClick={()=>remC(it.product._id)} style={{width:32,height:32,borderRadius:8,background:`${c.danger}08`,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:c.danger}}>{Ic.trash}</button></div>
          </div>
        </div>)}
      </div>
      {/* Bill */}
      <div style={{position:isMob?"relative":"sticky",top:100,marginTop:isMob?16:0}}>
        <div style={{background:c.bgCard,borderRadius:20,padding:isMob?18:24,border:`1px solid ${c.border}`,boxShadow:"0 4px 20px rgba(0,0,0,0.04)"}}>
          <h4 style={{fontSize:16,fontWeight:700,color:c.text,marginBottom:16}}>Price Details</h4>
          <div style={{display:"flex",flexDirection:"column",gap:10,fontSize:14}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:c.textMuted}}>Item Total ({cCount})</span><span style={{textDecoration:"line-through",color:c.textMuted}}>₹{cMrp}</span></div>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:c.success,fontWeight:600}}>Discount</span><span style={{color:c.success,fontWeight:700}}>-₹{cMrp-cTotal}</span></div>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:c.textMuted}}>Delivery Fee</span><span style={{color:c.success,fontWeight:600}}>{dlv===0?"FREE":"₹"+dlv}</span></div>
            <div style={{borderTop:`2px dashed ${c.border}`,paddingTop:12,marginTop:4,display:"flex",justifyContent:"space-between",fontWeight:800,fontSize:18}}><span style={{color:c.text}}>Total</span><span style={{color:c.text}}>₹{grand}</span></div>
            {cMrp>cTotal&&<div style={{padding:"8px 14px",borderRadius:10,background:`${c.success}08`,border:`1px solid ${c.success}20`,textAlign:"center",fontSize:13,color:c.success,fontWeight:600}}>🎉 You're saving ₹{cMrp-cTotal} on this order!</div>}
          </div>
          {!isMob&&<button onClick={()=>go("checkout")} className="sp-btn-glow" style={{width:"100%",padding:16,borderRadius:T.btnRadius,background:c.gradient,color:"#fff",border:"none",fontWeight:700,fontSize:16,marginTop:20,cursor:"pointer"}}>Proceed to Checkout →</button>}
        </div>
      </div>
    </div>:(<div style={{textAlign:"center",padding:"70px 20px"}}><div style={{fontSize:64,marginBottom:16}}>🛒</div><h3 style={{fontSize:20,fontWeight:800,color:c.text,marginBottom:8}}>Your cart is empty</h3><p style={{color:c.textMuted,fontSize:14,marginBottom:24,fontWeight:500}}>Looks like you haven't added anything yet</p><button onClick={()=>go("home")} className="sp-btn-glow" style={{padding:"14px 36px",borderRadius:T.btnRadius,background:c.gradient,color:"#fff",border:"none",fontWeight:700,fontSize:14,cursor:"pointer"}}>Start Shopping</button></div>)}
    {isMob&&cart.length>0&&<div style={{position:"fixed",bottom:52,left:0,right:0,padding:"12px 14px",background:`${c.bgCard}f5`,backdropFilter:"blur(20px)",borderTop:`1px solid ${c.border}`,zIndex:150}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}><div><span style={{fontSize:11,color:c.textMuted,fontWeight:500}}>Total</span><div style={{fontSize:20,fontWeight:800,color:c.text}}>₹{grand}</div></div><button onClick={()=>go("checkout")} className="sp-btn-glow" style={{padding:"14px 32px",borderRadius:T.btnRadius,background:c.gradient,color:"#fff",border:"none",fontWeight:700,fontSize:14,cursor:"pointer"}}>Checkout →</button></div></div>}
  </div>);

  const CheckV=()=>(<div style={{maxWidth:900,margin:"0 auto",padding:isMob?"14px 14px 90px":"30px 5% 60px"}}>
    <h2 style={{fontSize:isMob?18:26,fontWeight:800,color:c.text,marginBottom:24,fontFamily:f.heading}}>Checkout</h2>
    <div style={{display:isMob?"block":"grid",gridTemplateColumns:"1fr 360px",gap:28}}>
      <div>
        <div style={{background:c.bgCard,borderRadius:20,padding:isMob?20:28,border:`1px solid ${c.border}`,marginBottom:16,boxShadow:"0 2px 12px rgba(0,0,0,0.03)"}}>
          <h3 style={{fontSize:17,fontWeight:700,color:c.text,marginBottom:18,display:"flex",alignItems:"center",gap:8}}><span style={{width:28,height:28,borderRadius:8,background:`${c.primary}10`,display:"inline-flex",alignItems:"center",justifyContent:"center",color:c.primary}}>{Ic.loc}</span>Delivery Address</h3>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:isMob?"flex":"grid",gridTemplateColumns:"1fr 1fr",gap:12,flexDirection:"column"}}><input style={inp} placeholder="Full Name *" value={addr.name} onChange={e=>setAddr(p=>({...p,name:e.target.value}))}/><input style={inp} placeholder="Phone Number *" type="tel" value={addr.phone} onChange={e=>setAddr(p=>({...p,phone:e.target.value}))}/></div>
            <input style={inp} placeholder="Email Address" type="email" value={addr.email} onChange={e=>setAddr(p=>({...p,email:e.target.value}))}/>
            <input style={inp} placeholder="Address Line 1 *" value={addr.line1} onChange={e=>setAddr(p=>({...p,line1:e.target.value}))}/>
            <input style={inp} placeholder="Address Line 2 (Optional)" value={addr.line2} onChange={e=>setAddr(p=>({...p,line2:e.target.value}))}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><input style={inp} placeholder="City *" value={addr.city} onChange={e=>setAddr(p=>({...p,city:e.target.value}))}/><input style={inp} placeholder="PIN Code" value={addr.pin} onChange={e=>setAddr(p=>({...p,pin:e.target.value}))}/></div>
          </div>
        </div>
        <div style={{background:c.bgCard,borderRadius:20,padding:isMob?20:28,border:`1px solid ${c.border}`,marginBottom:isMob?16:0,boxShadow:"0 2px 12px rgba(0,0,0,0.03)"}}>
          <h3 style={{fontSize:17,fontWeight:700,color:c.text,marginBottom:16}}>Payment Method</h3>
          {/* Free delivery info */}
          {dlv===0?<div style={{marginBottom:12,padding:"10px 14px",borderRadius:12,background:`${c.success}10`,border:`1px solid ${c.success}20`,fontSize:13,color:c.success,fontWeight:600}}>🎉 Free Delivery on this order!</div>:<div style={{marginBottom:12,padding:"10px 14px",borderRadius:12,background:`${c.primary}06`,border:`1px solid ${c.primary}15`,fontSize:13,color:c.textMuted}}>Add ₹{freeDeliveryAbove-cTotal} more for Free Delivery</div>}
          {([
            ...(stSettings.enableCOD!==false?[{id:"cod" as const,l:"Cash on Delivery",d:"Pay when you receive your order",i:"💵"}]:[]),
            ...(stSettings.enableOnlinePayment===true?[{id:"online" as const,l:"Online Payment",d:"UPI, Credit/Debit Card, Net Banking",i:"💳"}]:[]),
          ]).map(pm=>(
            <div key={pm.id} onClick={()=>setPay(pm.id)} style={{display:"flex",alignItems:"center",gap:16,padding:"16px 18px",borderRadius:16,border:`2px solid ${pay===pm.id?c.primary:c.border}`,marginBottom:10,cursor:"pointer",background:pay===pm.id?`${c.primary}05`:"transparent",transition:"all 0.2s",boxShadow:pay===pm.id?`0 0 0 4px ${c.primary}08`:"none"}}>
              <div style={{width:24,height:24,borderRadius:"50%",border:`2px solid ${pay===pm.id?c.primary:c.border}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>{pay===pm.id&&<div style={{width:13,height:13,borderRadius:"50%",background:c.primary}}/>}</div>
              <span style={{fontSize:28}}>{pm.i}</span><div><div style={{fontWeight:600,fontSize:15,color:c.text}}>{pm.l}</div><div style={{fontSize:12,color:c.textMuted}}>{pm.d}</div></div>
            </div>
          ))}
          {stSettings.enableCOD===false&&stSettings.enableOnlinePayment!==true&&<div style={{padding:14,borderRadius:12,background:`${c.danger}10`,color:c.danger,fontSize:13,fontWeight:600}}>⚠️ No payment methods enabled. Please contact store owner.</div>}
        </div>
      </div>
      <div>
        <div style={{background:c.bgCard,borderRadius:20,padding:isMob?20:28,border:`1px solid ${c.border}`,position:isMob?"relative":"sticky",top:100,boxShadow:"0 2px 12px rgba(0,0,0,0.03)"}}>
          <h3 style={{fontSize:17,fontWeight:700,color:c.text,marginBottom:14}}>Order Summary</h3>
          <div style={{maxHeight:200,overflowY:"auto",marginBottom:12}}>{cart.map(it=><div key={it.product._id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${c.bg}`,fontSize:13,gap:8}}><span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:c.textLight}}>{it.qty}× {it.product.name}</span><span style={{fontWeight:700,flexShrink:0,color:c.text}}>₹{it.product.price*it.qty}</span></div>)}</div>
          <div style={{borderTop:`2px dashed ${c.border}`,paddingTop:14,display:"flex",flexDirection:"column",gap:6}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:14}}><span style={{color:c.textMuted}}>Subtotal</span><span style={{color:c.text,fontWeight:600}}>₹{cTotal}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:14}}><span style={{color:c.textMuted}}>Delivery</span><span style={{color:c.success,fontWeight:600}}>{dlv===0?"FREE":"₹"+dlv}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:20,fontWeight:800,color:c.text,paddingTop:10,borderTop:`1px solid ${c.border}`,marginTop:4}}><span>Total</span><span>₹{grand}</span></div>
          </div>
          <button onClick={placeOrd} disabled={placing} className="sp-btn-glow" style={{width:"100%",padding:16,borderRadius:T.btnRadius,background:c.gradient,color:"#fff",border:"none",fontWeight:700,fontSize:16,marginTop:20,cursor:"pointer",opacity:placing?0.6:1}}>{placing?"Placing Order...":"Place Order — ₹"+grand}</button>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:12,color:c.textMuted,fontSize:12}}>{Ic.shield}<span>Secure & Encrypted Checkout</span></div>
        </div>
      </div>
    </div>
  </div>);

  const SuccV=()=>(<div style={{textAlign:"center",padding:"70px 20px 90px",minHeight:"70vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
    <div className="sp-success-icon" style={{width:90,height:90,borderRadius:"50%",background:`${c.success}12`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24,color:c.success,boxShadow:`0 0 0 12px ${c.success}06`}}>{Ic.check}</div>
    <h2 style={{fontSize:28,fontWeight:800,color:c.text,marginBottom:8,fontFamily:f.heading}}>Order Confirmed! 🎉</h2>
    <p style={{color:c.textMuted,fontSize:15,marginBottom:10,fontWeight:500}}>Thank you for shopping with us</p>
    {oid&&<p style={{fontSize:12,color:c.textMuted,marginBottom:28,padding:"6px 18px",borderRadius:10,background:c.bg,fontWeight:500,fontFamily:"monospace"}}>Order ID: {oid}</p>}
    <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",maxWidth:360,marginBottom:28}}>
      {[{icon:Ic.truck,t:pay==="cod"?`Pay ₹${grand} on delivery`:"Payment confirmed",col:c.primary},{icon:Ic.clock,t:"Estimated delivery: 30-45 minutes",col:c.success}].map((it,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",borderRadius:14,background:c.bgCard,border:`1px solid ${c.border}`,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}><span style={{color:it.col}}>{it.icon}</span><span style={{fontSize:14,color:c.text,fontWeight:500}}>{it.t}</span></div>))}
    </div>
    <button onClick={()=>go("home")} className="sp-btn-glow" style={{width:"100%",maxWidth:360,padding:16,borderRadius:T.btnRadius,background:c.gradient,color:"#fff",border:"none",fontWeight:700,fontSize:16,cursor:"pointer"}}>Continue Shopping</button>
  </div>);

  const AccV=()=>{
    const menuItems=[{icon:Ic.order,l:"My Orders",d:"Track & manage orders",a:()=>{}},{icon:Ic.heart,l:"Wishlist",d:`${wl.length} saved items`,a:()=>go("wishlist")},{icon:Ic.cart,l:"Cart",d:`${cCount} items in cart`,a:()=>isMob?go("cart"):setCartDrw(true)},{icon:Ic.loc,l:"Saved Addresses",d:"Manage delivery addresses",a:()=>{}},{icon:Ic.bell,l:"Notifications",d:"Offers & order updates",a:()=>{}},{icon:Ic.shield,l:"Help & Support",d:"FAQ, Contact us",a:()=>{}}];
    if(!isMob)return(
      <div style={{maxWidth:"100%",margin:"0 auto",padding:"40px 5% 80px"}}>
        <h2 style={{fontSize:28,fontWeight:800,color:c.text,marginBottom:28,fontFamily:f.heading}}>My Account</h2>
        <div style={{display:"grid",gridTemplateColumns:"340px 1fr",gap:32,alignItems:"start"}}>
          {/* Left Column - Profile */}
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <div style={{background:c.gradient,borderRadius:24,padding:"36px 28px",color:"#fff",position:"relative",overflow:"hidden",boxShadow:`0 8px 30px ${c.primary}30`}}>
              <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 80% 10%,rgba(255,255,255,0.15),transparent)"}}/>
              <div style={{position:"absolute",bottom:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
              <div style={{position:"relative",zIndex:2,textAlign:"center"}}>
                <div style={{width:80,height:80,borderRadius:24,background:"rgba(255,255,255,0.22)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,fontWeight:800,margin:"0 auto 16px",boxShadow:"0 4px 20px rgba(0,0,0,0.1)"}}>G</div>
                <h3 style={{fontSize:22,fontWeight:800,marginBottom:4}}>Guest User</h3>
                <p style={{fontSize:13,opacity:0.8,fontWeight:500}}>Welcome to {store.name}</p>
                <div style={{display:"flex",justifyContent:"center",gap:24,marginTop:20,paddingTop:20,borderTop:"1px solid rgba(255,255,255,0.2)"}}>
                  <div style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:800}}>{cCount}</div><div style={{fontSize:11,opacity:0.8}}>In Cart</div></div>
                  <div style={{width:1,background:"rgba(255,255,255,0.2)"}}/>
                  <div style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:800}}>{wl.length}</div><div style={{fontSize:11,opacity:0.8}}>Wishlist</div></div>
                  <div style={{width:1,background:"rgba(255,255,255,0.2)"}}/>
                  <div style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:800}}>0</div><div style={{fontSize:11,opacity:0.8}}>Orders</div></div>
                </div>
              </div>
            </div>
            {/* Quick Action Buttons */}
            <div style={{background:c.bgCard,borderRadius:20,padding:24,border:`1px solid ${c.border}`,boxShadow:"0 2px 12px rgba(0,0,0,0.03)"}}>
              <h4 style={{fontSize:14,fontWeight:700,color:c.textMuted,marginBottom:16,textTransform:"uppercase",letterSpacing:0.5}}>Quick Actions</h4>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <button onClick={()=>setCartDrw(true)} className="sp-btn-glow" style={{padding:"12px 16px",borderRadius:12,background:c.gradient,color:"#fff",border:"none",fontWeight:600,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>{Ic.cart} View Cart ({cCount})</button>
                <button onClick={()=>go("wishlist")} style={{padding:"12px 16px",borderRadius:12,background:`${c.danger}10`,border:`1px solid ${c.danger}20`,color:c.danger,fontWeight:600,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>{Ic.heart} Wishlist ({wl.length})</button>
                <button onClick={()=>nav("/admin")} style={{padding:"12px 16px",borderRadius:12,border:`2px solid ${c.primary}`,background:"transparent",color:c.primary,fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>⚙️ Admin Panel</button>
              </div>
            </div>
          </div>
          {/* Right Column - Menu */}
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <div style={{background:c.bgCard,borderRadius:20,border:`1px solid ${c.border}`,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,0.03)"}}>
              <div style={{padding:"18px 24px",borderBottom:`1px solid ${c.border}`}}><h4 style={{fontSize:16,fontWeight:700,color:c.text}}>Account Settings</h4></div>
              {menuItems.map((it,i)=>(
                <div key={i} onClick={it.a} className="sp-acc-row" style={{display:"flex",alignItems:"center",gap:16,padding:"20px 24px",cursor:"pointer",borderBottom:i<menuItems.length-1?`1px solid ${c.bg}`:"none",transition:"background 0.2s"}}>
                  <div style={{width:48,height:48,borderRadius:16,background:`${c.primary}10`,display:"flex",alignItems:"center",justifyContent:"center",color:c.primary,flexShrink:0}}>{it.icon}</div>
                  <div style={{flex:1}}><div style={{fontSize:16,fontWeight:600,color:c.text,marginBottom:2}}>{it.l}</div><div style={{fontSize:13,color:c.textMuted,fontWeight:500}}>{it.d}</div></div>
                  <span style={{color:c.border}}>{Ic.chev}</span>
                </div>
              ))}
            </div>
            {/* Recent Activity / Info Card */}
            <div style={{background:c.bgCard,borderRadius:20,border:`1px solid ${c.border}`,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,0.03)"}}>
              <h4 style={{fontSize:16,fontWeight:700,color:c.text,marginBottom:16}}>Store Info</h4>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[{icon:Ic.truck,t:"Free Delivery",d:"On orders ₹499+",col:c.success},{icon:Ic.shield,t:"Secure Shopping",d:"100% safe & genuine",col:c.primary},{icon:Ic.tag,t:"Best Prices",d:"Lowest guaranteed",col:c.secondary},{icon:Ic.gift,t:"Easy Returns",d:"7-day return policy",col:"#8B5CF6"}].map((s,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderRadius:14,background:`${s.col}06`,border:`1px solid ${s.col}12`}}>
                    <div style={{color:s.col,flexShrink:0}}>{s.icon}</div>
                    <div><div style={{fontSize:13,fontWeight:700,color:c.text}}>{s.t}</div><div style={{fontSize:11,color:c.textMuted}}>{s.d}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    return(<div style={{maxWidth:600,margin:"0 auto",padding:`14px 14px ${90}px`}}>
      <div style={{background:c.gradient,borderRadius:24,padding:24,color:"#fff",marginBottom:16,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 80% 20%,rgba(255,255,255,0.12),transparent)"}}/>
        <div style={{display:"flex",alignItems:"center",gap:16,position:"relative",zIndex:2}}>
          <div style={{width:60,height:60,borderRadius:20,background:"rgba(255,255,255,0.2)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:800}}>G</div>
          <div><h3 style={{fontSize:20,fontWeight:800}}>Guest User</h3><p style={{fontSize:13,opacity:0.8,fontWeight:500}}>Welcome to {store.name}</p></div>
        </div>
        <div style={{display:"flex",gap:20,marginTop:16,paddingTop:16,borderTop:"1px solid rgba(255,255,255,0.2)",position:"relative",zIndex:2}}>
          <div style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:800}}>{cCount}</div><div style={{fontSize:10,opacity:0.8}}>Cart</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:800}}>{wl.length}</div><div style={{fontSize:10,opacity:0.8}}>Wishlist</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:800}}>0</div><div style={{fontSize:10,opacity:0.8}}>Orders</div></div>
        </div>
      </div>
      <div style={{background:c.bgCard,borderRadius:20,border:`1px solid ${c.border}`,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,0.03)",marginBottom:16}}>
        {menuItems.map((it,i)=>(
          <div key={i} onClick={it.a} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 18px",cursor:"pointer",borderBottom:i<menuItems.length-1?`1px solid ${c.bg}`:"none",transition:"background 0.2s"}}>
            <div style={{width:44,height:44,borderRadius:14,background:`${c.primary}08`,display:"flex",alignItems:"center",justifyContent:"center",color:c.primary}}>{it.icon}</div>
            <div style={{flex:1}}><div style={{fontSize:15,fontWeight:600,color:c.text}}>{it.l}</div><div style={{fontSize:12,color:c.textMuted,fontWeight:500}}>{it.d}</div></div>
            <span style={{color:c.textMuted}}>{Ic.chev}</span>
          </div>
        ))}
      </div>
      <button onClick={()=>nav("/admin")} style={{width:"100%",padding:16,borderRadius:T.btnRadius,border:`2px solid ${c.primary}`,background:"transparent",color:c.primary,fontWeight:700,fontSize:14,cursor:"pointer",transition:"all 0.2s"}}>⚙️ Go to Admin Panel</button>
    </div>);
  };

  /* ═══ Footer ═══ */
  const Foot=()=>isMob?null:(<footer style={{background:c.bgDark,color:"rgba(255,255,255,0.7)",padding:"60px 5% 40px",marginTop:40}}>
    <div style={{maxWidth:"100%",margin:"0 auto",display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:48}}>
      <div><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}><span style={{fontSize:36,display:"flex"}}>{stSettings?.logo?<img src={stSettings.logo} alt="Logo" style={{height:36,width:"auto",objectFit:"contain"}}/>:T.icon}</span><span style={{fontWeight:800,fontSize:24,color:"#fff",fontFamily:f.heading}}>{store.name}</span></div><p style={{fontSize:14,lineHeight:1.8,maxWidth:300}}>{T.tagline}. Your one-stop shop for all your needs, delivered right to your doorstep.</p></div>
      <div><h4 style={{fontWeight:700,color:"#fff",marginBottom:14,fontSize:16}}>Quick Links</h4>{["Home","Shop","Categories","My Account","Track Order"].map(l=><p key={l} style={{fontSize:14,marginBottom:10,cursor:"pointer",transition:"color 0.2s"}}>{l}</p>)}</div>
      <div><h4 style={{fontWeight:700,color:"#fff",marginBottom:14,fontSize:16}}>Help</h4>{["Contact Us","FAQ","Shipping Policy","Return & Refund","Privacy Policy"].map(l=><p key={l} style={{fontSize:14,marginBottom:10,cursor:"pointer"}}>{l}</p>)}</div>
      <div><h4 style={{fontWeight:700,color:"#fff",marginBottom:14,fontSize:16}}>Get in Touch</h4><p style={{fontSize:14,marginBottom:10}}>📧 support@{store.name.toLowerCase().replace(/\s/g,"")}.com</p><p style={{fontSize:14,marginBottom:10}}>📞 +91 9876543210</p><p style={{fontSize:14}}>📍 {store.city || "India"}</p></div>
    </div>
    <div style={{textAlign:"center",marginTop:48,paddingTop:24,borderTop:"1px solid rgba(255,255,255,0.08)",fontSize:13,opacity:0.5}}>© 2026 {store.name}. All rights reserved. Built with StoreBuilder.</div>
  </footer>);

  return(
    <div style={{minHeight:"100vh",fontFamily:f.body,background:c.bg}}>
      <style>{`
        .sp-card:hover .sp-card-img{transform:scale(1.06)}
        .sp-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,0.1)}
        .sp-wish-btn:hover{transform:scale(1.15)}
        .sp-add-btn:hover{background:${c.primary}!important;color:#fff!important;transform:translateY(-1px);box-shadow:0 4px 15px ${c.primary}30}
        .sp-btn-glow:hover{transform:translateY(-2px);filter:brightness(1.1)}
        .sp-btn-glow:active{transform:translateY(0);filter:brightness(0.95)}
        .sp-chip{transition:all 0.2s}.sp-chip:hover{transform:translateY(-2px)}
        .sp-cat:hover div:first-child{transform:scale(1.08);border-color:${c.primary}}
        .sp-banner{transition:all 0.6s}
        input:focus{border-color:${c.primary}!important;box-shadow:0 0 0 4px ${c.primary}10!important}
        *::-webkit-scrollbar{width:6px;height:6px}*::-webkit-scrollbar-thumb{background:${c.border};border-radius:3px}*::-webkit-scrollbar-thumb:hover{background:${c.textMuted}}
        *{-webkit-tap-highlight-color:transparent;scroll-behavior:smooth}
        @media(max-width:768px){.desktop-only{display:none!important}}
        @media(min-width:769px){.mobile-only{display:none!important}}
        .sp-acc-row:hover{background:${c.bg}!important}
      `}</style>
      {isMob?<MHead/>:<DHead/>}
      {view==="home"&&<Home/>}{view==="categories"&&<CatView/>}{view==="search"&&<SearchV/>}{view==="product"&&<ProdV/>}{view==="wishlist"&&<WishV/>}{view==="cart"&&<CartV/>}{view==="checkout"&&<CheckV/>}{view==="success"&&<SuccV/>}{view==="account"&&<AccV/>}
      <CDrw/><BNav/>{view==="home"&&<Foot/>}
    </div>
  );
};

export default StorePreview;
