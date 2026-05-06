/* Shared placeholder for food images */
const FoodImg = ({label, h=160, style, dark, tone="paprika"}) => {
  const tones = {
    paprika: dark
      ? "repeating-linear-gradient(135deg, rgba(232,129,74,0.18) 0 8px, rgba(232,129,74,0.08) 8px 16px), linear-gradient(160deg, #3a2a20, #1f1612)"
      : "repeating-linear-gradient(135deg, rgba(217,107,58,0.14) 0 8px, rgba(217,107,58,0.06) 8px 16px), linear-gradient(160deg, #fbe1d0, #f4ede1)",
    cream: "repeating-linear-gradient(135deg, rgba(122,102,87,0.10) 0 8px, rgba(122,102,87,0.04) 8px 16px), linear-gradient(160deg, #f4ede1, #ece2d0)",
    basil: "repeating-linear-gradient(135deg, rgba(90,138,74,0.16) 0 8px, rgba(90,138,74,0.06) 8px 16px), linear-gradient(160deg, #dbe8d3, #c8dbb8)",
    saffron: "repeating-linear-gradient(135deg, rgba(212,150,34,0.18) 0 8px, rgba(212,150,34,0.08) 8px 16px), linear-gradient(160deg, #fbeec9, #f4dba0)",
  };
  return <div style={{
    height:h,width:"100%",
    background:tones[tone],
    color: dark ? "#d8cfc4" : "#7a6657",
    fontFamily:"'JetBrains Mono',monospace",
    fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",
    display:"flex",alignItems:"center",justifyContent:"center",
    ...style
  }}>{label}</div>;
};

/* Genie logo mark — small */
const GenieMark = ({size=36, color="#d96b3a", dark}) => (
  <div style={{
    width:size,height:size,borderRadius:size*0.32,
    background:dark?"#1c1813":color,
    display:"flex",alignItems:"center",justifyContent:"center",
    boxShadow:dark?"none":`0 6px 16px -4px ${color}55`,
    color: dark ? color : "#fff", flexShrink:0
  }}>
    <svg width={size*0.55} height={size*0.55} viewBox="0 0 24 24" fill="none">
      <path d="M6 11c0-3.3 2.7-6 6-6s6 2.7 6 6v3H6v-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M5 17h14M7 20h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  </div>
);

/* iPhone-like mobile frame */
const Phone = ({children, dark}) => (
  <div style={{
    width:300, height:600,
    background: dark ? "#13100D" : "#FAF6F0",
    borderRadius:36,
    border: "10px solid #1a1410",
    boxShadow:"0 24px 56px -16px rgba(42,32,24,0.35)",
    overflow:"hidden",
    position:"relative",
    fontFamily:"Inter,sans-serif"
  }}>
    {/* notch */}
    <div style={{position:"absolute",top:8,left:"50%",transform:"translateX(-50%)",width:90,height:22,background:"#1a1410",borderRadius:14,zIndex:10}}></div>
    {/* status bar */}
    <div style={{position:"absolute",top:14,left:24,fontSize:11,fontWeight:600,color:dark?"#f4ede1":"#1a1410",zIndex:11}}>9:41</div>
    <div style={{position:"absolute",top:14,right:24,fontSize:10,color:dark?"#f4ede1":"#1a1410",zIndex:11,display:"flex",gap:4,alignItems:"center"}}>
      <span>●●●</span><span>5G</span>
    </div>
    <div style={{height:"100%",overflow:"hidden",paddingTop:38}}>{children}</div>
  </div>
);

window.FoodImg = FoodImg;
window.GenieMark = GenieMark;
window.Phone = Phone;
