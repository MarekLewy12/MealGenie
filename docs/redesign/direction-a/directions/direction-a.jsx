/* ============== DIRECTION A: Cozy Polish home kitchen ==============
   Warm, comforting, familiar, practical.
   Aesthetic: hand-written kicker, paper-textured cream, terracotta + basil,
   serif headlines like a recipe book, polish folk pattern accents,
   decorative line dividers, "babcia's notebook" feel.
*/

const A_TOKENS = {
  bg: "#f6efe2",          // warm parchment
  surface: "#fdf8ec",     // cream paper
  ink: "#3a2818",         // brown ink
  inkSoft: "#7a5d44",
  muted: "#a89580",
  accent: "#c25728",      // terracotta
  accentDeep: "#9a4220",
  basil: "#5a8a4a",
  border: "#e3d6bf",
  borderStrong: "#d0bd9e",
};

/* Folk pattern - small divider */
const FolkDivider = ({width=120, color}) => (
  <svg width={width} height={12} viewBox="0 0 120 12" style={{display:"block"}}>
    <path d="M0 6 L20 6 M100 6 L120 6" stroke={color||A_TOKENS.accent} strokeWidth="1"/>
    <circle cx="30" cy="6" r="1.5" fill={color||A_TOKENS.accent}/>
    <path d="M40 6 Q50 0 60 6 T80 6" stroke={color||A_TOKENS.accent} strokeWidth="1.2" fill="none"/>
    <circle cx="90" cy="6" r="1.5" fill={color||A_TOKENS.accent}/>
  </svg>
);

const A_LandingHero = () => (
  <div style={{
    background:`
      radial-gradient(ellipse at 80% 0%, rgba(194,87,40,0.06), transparent 50%),
      radial-gradient(ellipse at 0% 100%, rgba(90,138,74,0.05), transparent 50%),
      ${A_TOKENS.bg}`,
    width:"100%",height:"100%",padding:"40px 56px",
    color:A_TOKENS.ink,
    fontFamily:"Inter,sans-serif",
    position:"relative", overflow:"hidden"
  }}>
    {/* paper texture */}
    <div style={{position:"absolute",inset:0,opacity:0.4,backgroundImage:`url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><circle cx='10' cy='10' r='0.6' fill='%23c25728' opacity='0.3'/><circle cx='40' cy='25' r='0.4' fill='%23c25728' opacity='0.3'/><circle cx='25' cy='45' r='0.5' fill='%23c25728' opacity='0.3'/></svg>")`,pointerEvents:"none"}}></div>
    {/* nav */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative",marginBottom:48}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <GenieMark color={A_TOKENS.accent} size={36}/>
        <div style={{fontFamily:"Fraunces,serif",fontSize:22,fontWeight:600,letterSpacing:"-0.01em"}}>MealGenie</div>
      </div>
      <div style={{display:"flex",gap:28,fontSize:13,color:A_TOKENS.inkSoft}}>
        <span>Przepisy</span><span>Plan tygodnia</span><span>Lista zakupów</span><span>Cennik</span>
      </div>
      <button style={{background:A_TOKENS.ink,color:A_TOKENS.surface,border:"none",padding:"10px 20px",borderRadius:999,fontSize:13,fontWeight:600,fontFamily:"Inter"}}>Zaloguj się</button>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"1.1fr 1fr",gap:40,alignItems:"center",position:"relative"}}>
      <div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18,fontFamily:"Caveat, 'Fraunces', cursive",fontSize:22,color:A_TOKENS.accent,fontStyle:"italic"}}>
          <span>~ jak u babci, ale w telefonie ~</span>
        </div>
        <h1 style={{fontFamily:"Fraunces,serif",fontSize:84,fontWeight:400,lineHeight:1.0,letterSpacing:"-0.03em",margin:"0 0 14px",color:A_TOKENS.ink}}>
          Co dzisiaj <em style={{fontStyle:"italic",color:A_TOKENS.accent,fontWeight:500}}>ugotujemy?</em>
        </h1>
        <FolkDivider width={140}/>
        <p style={{fontSize:17,lineHeight:1.6,color:A_TOKENS.inkSoft,margin:"18px 0 28px",maxWidth:480}}>
          Powiedz, co masz w lodówce. MealGenie podpowie sprawdzony przepis, dopasowany do Twojego czasu i smaku. Jak dobry sąsiad z notesem przepisów.
        </p>
        <div style={{display:"flex",gap:12,marginBottom:22}}>
          <button style={{background:A_TOKENS.accent,color:"#fff",border:"none",padding:"14px 26px",borderRadius:14,fontSize:15,fontWeight:600,fontFamily:"Inter",boxShadow:`0 8px 20px -6px ${A_TOKENS.accent}66`}}>Zacznij gotować →</button>
          <button style={{background:"transparent",color:A_TOKENS.ink,border:`1px solid ${A_TOKENS.borderStrong}`,padding:"14px 24px",borderRadius:14,fontSize:15,fontWeight:600,fontFamily:"Inter"}}>Zobacz przepisy</button>
        </div>
        <div style={{display:"flex",gap:24,fontSize:12,color:A_TOKENS.muted}}>
          <span>★★★★★ <span style={{color:A_TOKENS.inkSoft,marginLeft:4}}>4.8 · 12 400 ocen</span></span>
          <span>· bez reklam · po polsku</span>
        </div>
      </div>
      <div style={{position:"relative"}}>
        {/* recipe card mockup, like a page from cookbook */}
        <div style={{
          background:A_TOKENS.surface,
          borderRadius:8,
          padding:"28px 32px",
          boxShadow:"0 30px 60px -20px rgba(58,40,24,0.25), 0 0 0 1px rgba(208,189,158,0.5)",
          transform:"rotate(2deg)",
          position:"relative"
        }}>
          {/* tape */}
          <div style={{position:"absolute",top:-12,left:"30%",width:60,height:22,background:"rgba(232,179,57,0.5)",border:"1px solid rgba(212,150,34,0.4)",transform:"rotate(-3deg)"}}></div>
          <div style={{fontFamily:"Caveat, cursive",fontSize:18,color:A_TOKENS.accentDeep,marginBottom:6,fontStyle:"italic"}}>z notesu Genie</div>
          <h3 style={{fontFamily:"Fraunces,serif",fontSize:26,fontWeight:500,letterSpacing:"-0.01em",margin:"0 0 6px",color:A_TOKENS.ink}}>Pierogi ruskie z koperkiem</h3>
          <div style={{fontSize:12,color:A_TOKENS.muted,marginBottom:14,fontFamily:"Inter"}}>na 4 osoby · 45 min · łatwe</div>
          <FoodImg label="[ pierogi · zdjęcie ]" h={150} tone="paprika" style={{borderRadius:6}}/>
          <div style={{marginTop:16,fontSize:13,lineHeight:1.7,color:A_TOKENS.inkSoft,fontFamily:"Fraunces,serif"}}>
            <div style={{fontFamily:"Inter",fontSize:10,fontWeight:700,letterSpacing:"0.14em",color:A_TOKENS.accent,marginBottom:10}}>SKŁADNIKI</div>
            <div style={{display:"flex",justifyContent:"space-between",borderBottom:"1px dotted "+A_TOKENS.borderStrong,padding:"3px 0"}}><span>· mąka pszenna</span><span style={{color:A_TOKENS.muted,fontFamily:"Inter",fontSize:12}}>500 g</span></div>
            <div style={{display:"flex",justifyContent:"space-between",borderBottom:"1px dotted "+A_TOKENS.borderStrong,padding:"3px 0"}}><span>· twaróg półtłusty</span><span style={{color:A_TOKENS.muted,fontFamily:"Inter",fontSize:12}}>400 g</span></div>
            <div style={{display:"flex",justifyContent:"space-between",borderBottom:"1px dotted "+A_TOKENS.borderStrong,padding:"3px 0"}}><span>· ziemniaki</span><span style={{color:A_TOKENS.muted,fontFamily:"Inter",fontSize:12}}>3 sztuki</span></div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"3px 0"}}><span>· cebula</span><span style={{color:A_TOKENS.muted,fontFamily:"Inter",fontSize:12}}>2 sztuki</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const A_Dashboard = () => (
  <div style={{background:A_TOKENS.bg,width:"100%",height:"100%",padding:"32px 40px",fontFamily:"Inter,sans-serif",color:A_TOKENS.ink,overflow:"hidden"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
      <div>
        <div style={{fontFamily:"Caveat,cursive",fontSize:20,color:A_TOKENS.accent,fontStyle:"italic"}}>Cześć, Marek!</div>
        <h2 style={{fontFamily:"Fraunces,serif",fontSize:36,fontWeight:500,margin:"2px 0 0",letterSpacing:"-0.02em"}}>Co podać dziś na <em style={{color:A_TOKENS.accent}}>obiad?</em></h2>
      </div>
      <div style={{display:"flex",gap:8}}>
        <div style={{width:38,height:38,borderRadius:"50%",background:A_TOKENS.surface,border:`1px solid ${A_TOKENS.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>🔍</div>
        <div style={{width:38,height:38,borderRadius:"50%",background:A_TOKENS.surface,border:`1px solid ${A_TOKENS.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>🛒</div>
      </div>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
      {/* big plan card */}
      <div style={{background:A_TOKENS.surface,borderRadius:18,border:`1px solid ${A_TOKENS.border}`,padding:"24px 28px",position:"relative",overflow:"hidden"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.14em",color:A_TOKENS.accent,textTransform:"uppercase"}}>Plan tygodnia · 12-18 maja</div>
          <div style={{fontSize:12,color:A_TOKENS.inkSoft}}>4 z 7 dni</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:8}}>
          {["Pn","Wt","Śr","Cz","Pt","Sb","Nd"].map((d,i)=>(
            <div key={d} style={{textAlign:"center"}}>
              <div style={{fontSize:10,color:A_TOKENS.muted,marginBottom:6,fontWeight:600}}>{d}</div>
              <div style={{
                aspectRatio:"1",borderRadius:10,
                background: i<4 ? `repeating-linear-gradient(135deg, rgba(217,107,58,0.14) 0 6px, rgba(217,107,58,0.05) 6px 12px), #fbe1d0` : A_TOKENS.bg,
                border: i===4 ? `2px solid ${A_TOKENS.accent}` : `1px dashed ${A_TOKENS.borderStrong}`,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:18,
              }}>{i<4?"🍲":i===4?"+":""}</div>
              <div style={{fontSize:9,color:A_TOKENS.muted,marginTop:4}}>{["pierogi","gulasz","ryba","placki","?","?","?"][i]}</div>
            </div>
          ))}
        </div>
        <FolkDivider width={120}/>
        <div style={{marginTop:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:13,color:A_TOKENS.inkSoft,fontFamily:"Fraunces,serif",fontStyle:"italic"}}>„Brakuje 3 obiadów. Zaplanować razem?"</div>
          <button style={{background:A_TOKENS.accent,color:"#fff",border:"none",padding:"8px 14px",borderRadius:10,fontSize:12,fontWeight:600}}>Tak, pomóż</button>
        </div>
      </div>
      {/* shopping */}
      <div style={{background:A_TOKENS.ink,color:A_TOKENS.surface,borderRadius:18,padding:"22px 24px"}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.14em",color:A_TOKENS.accent,textTransform:"uppercase",marginBottom:12}}>Lista zakupów</div>
        <div style={{fontFamily:"Fraunces,serif",fontSize:42,fontWeight:500,letterSpacing:"-0.02em",lineHeight:1}}>12</div>
        <div style={{fontSize:12,opacity:0.7,marginBottom:14}}>składników, ~84 zł</div>
        <div style={{height:5,background:"rgba(255,255,255,0.12)",borderRadius:3,marginBottom:14}}>
          <div style={{width:"33%",height:"100%",background:A_TOKENS.accent,borderRadius:3}}></div>
        </div>
        <div style={{fontSize:11,opacity:0.7}}>4 odhaczone. Najbliższy sklep — Biedronka, 4 min.</div>
      </div>
    </div>

    <div style={{marginTop:18,fontSize:11,fontWeight:700,letterSpacing:"0.14em",color:A_TOKENS.accent,textTransform:"uppercase",marginBottom:10}}>Z Twojej lodówki — szybkie pomysły</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
      {[
        {n:"Placki ziemniaczane",t:"25 min",d:"po krakowsku"},
        {n:"Sałatka z buraków",t:"10 min",d:"z fetą i orzechami"},
        {n:"Zupa krem z dyni",t:"30 min",d:"z imbirem"},
      ].map((m,i)=>(
        <div key={i} style={{background:A_TOKENS.surface,borderRadius:14,border:`1px solid ${A_TOKENS.border}`,overflow:"hidden"}}>
          <FoodImg label={`[ ${m.n.toLowerCase()} ]`} h={90} tone={["paprika","basil","saffron"][i]}/>
          <div style={{padding:"12px 14px"}}>
            <div style={{fontFamily:"Fraunces,serif",fontSize:16,fontWeight:500,letterSpacing:"-0.01em"}}>{m.n}</div>
            <div style={{fontSize:11,color:A_TOKENS.muted,marginTop:2}}>{m.d} · {m.t}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const A_Generator = () => (
  <div style={{background:A_TOKENS.bg,width:"100%",height:"100%",padding:"32px 40px",fontFamily:"Inter,sans-serif",color:A_TOKENS.ink,overflow:"hidden"}}>
    <div style={{maxWidth:680,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:24}}>
        <div style={{fontFamily:"Caveat,cursive",fontSize:20,color:A_TOKENS.accent,fontStyle:"italic",marginBottom:4}}>~ powiedz, co masz pod ręką ~</div>
        <h2 style={{fontFamily:"Fraunces,serif",fontSize:44,fontWeight:500,margin:0,letterSpacing:"-0.02em"}}>Wymyślmy <em style={{color:A_TOKENS.accent}}>coś dobrego</em></h2>
      </div>

      <div style={{background:A_TOKENS.surface,borderRadius:18,border:`1px solid ${A_TOKENS.border}`,padding:"24px 28px"}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.14em",color:A_TOKENS.accent,textTransform:"uppercase",marginBottom:10}}>1. Składniki w lodówce</div>
        <div style={{background:A_TOKENS.bg,borderRadius:12,padding:"12px 14px",border:`1px dashed ${A_TOKENS.borderStrong}`,marginBottom:18,display:"flex",flexWrap:"wrap",gap:6,minHeight:48,alignItems:"center"}}>
          {["cukinia","kurczak","pomidory","czosnek","oliwa"].map(t=>(
            <span key={t} style={{background:A_TOKENS.surface,border:`1px solid ${A_TOKENS.border}`,padding:"5px 12px",borderRadius:999,fontSize:13,display:"inline-flex",gap:6}}>
              {t}<span style={{color:A_TOKENS.muted}}>×</span>
            </span>
          ))}
          <span style={{fontSize:13,color:A_TOKENS.muted,padding:"5px 6px"}}>+ dopisz...</span>
        </div>

        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.14em",color:A_TOKENS.accent,textTransform:"uppercase",marginBottom:10}}>2. Ile masz czasu?</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:18}}>
          {["15 min","30 min","45 min","60+"].map((t,i)=>(
            <button key={t} style={{
              background: i===1 ? A_TOKENS.accent : A_TOKENS.surface,
              color: i===1 ? "#fff" : A_TOKENS.ink,
              border: i===1 ? "none" : `1px solid ${A_TOKENS.border}`,
              padding:"10px 0",borderRadius:10,fontSize:13,fontWeight:600,fontFamily:"Inter"
            }}>{t}</button>
          ))}
        </div>

        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.14em",color:A_TOKENS.accent,textTransform:"uppercase",marginBottom:10}}>3. Dla kogo</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>
          {[["1 osoba",false],["2 osoby",true],["4 osoby",false],["dla dzieci",false],["wege",false]].map(([t,a])=>(
            <span key={t} style={{
              background: a ? A_TOKENS.ink : "transparent",
              color: a ? A_TOKENS.surface : A_TOKENS.inkSoft,
              border:`1px solid ${a?A_TOKENS.ink:A_TOKENS.borderStrong}`,
              padding:"6px 14px",borderRadius:999,fontSize:13,fontWeight:500
            }}>{t}</span>
          ))}
        </div>

        <FolkDivider width={120} color={A_TOKENS.borderStrong}/>

        <button style={{
          width:"100%",marginTop:16,
          background:A_TOKENS.accent,color:"#fff",border:"none",
          padding:"16px",borderRadius:14,fontSize:16,fontWeight:600,
          fontFamily:"Inter",
          boxShadow:`0 12px 24px -8px ${A_TOKENS.accent}66`,
          display:"flex",alignItems:"center",justifyContent:"center",gap:10
        }}>
          <span>🍲</span> Wymyśl mi obiad <span style={{opacity:0.7}}>→</span>
        </button>
        <div style={{textAlign:"center",fontSize:12,color:A_TOKENS.muted,marginTop:10,fontStyle:"italic",fontFamily:"Fraunces,serif"}}>Zwykle zajmuje 3 sekundy. Bez logowania.</div>
      </div>
    </div>
  </div>
);

const A_Suggestions = () => (
  <div style={{background:A_TOKENS.bg,width:"100%",height:"100%",padding:"28px 40px",fontFamily:"Inter,sans-serif",color:A_TOKENS.ink,overflow:"hidden"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
      <div>
        <div style={{fontFamily:"Caveat,cursive",fontSize:18,color:A_TOKENS.accent,fontStyle:"italic"}}>~ z Twojej lodówki ~</div>
        <h2 style={{fontFamily:"Fraunces,serif",fontSize:32,fontWeight:500,margin:"2px 0 0",letterSpacing:"-0.02em"}}>5 pomysłów na <em style={{color:A_TOKENS.accent}}>dziś</em></h2>
      </div>
      <button style={{background:"transparent",color:A_TOKENS.inkSoft,border:`1px solid ${A_TOKENS.borderStrong}`,padding:"8px 14px",borderRadius:999,fontSize:12,fontWeight:600}}>↻ Pokaż inne</button>
    </div>
    <FolkDivider width={140}/>

    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginTop:18}}>
      {[
        {n:"Kurczak po krakowsku",d:"z marchewką i koperkiem",t:"35 min",cal:"480",lvl:"łatwe",tag:"klasyka",tone:"paprika"},
        {n:"Cukiniowe placuszki",d:"z jogurtem mietowym",t:"20 min",cal:"320",lvl:"łatwe",tag:"szybkie",tone:"basil"},
        {n:"Sałatka pomidorowa",d:"z bazylia i serem feta",t:"10 min",cal:"260",lvl:"banalne",tag:"lekkie",tone:"saffron"},
        {n:"Kremowa zupa pomidorowa",d:"z grzankami czosnkowymi",t:"30 min",cal:"310",lvl:"łatwe",tag:"comfort",tone:"paprika"},
        {n:"Risotto z cukinii",d:"z parmezanem i pieprzem",t:"40 min",cal:"540",lvl:"średnie",tag:"romantyczne",tone:"saffron"},
        {n:"Pieczony kurczak",d:"z ziemniakami i czosnkiem",t:"55 min",cal:"620",lvl:"łatwe",tag:"niedzielne",tone:"paprika"},
      ].map((m,i)=>(
        <div key={i} style={{background:A_TOKENS.surface,borderRadius:14,border:`1px solid ${A_TOKENS.border}`,overflow:"hidden",position:"relative"}}>
          {i===0 && <div style={{position:"absolute",top:10,left:10,background:A_TOKENS.accent,color:"#fff",fontSize:9,fontWeight:700,letterSpacing:"0.12em",padding:"3px 8px",borderRadius:4,textTransform:"uppercase",zIndex:2}}>Polecane</div>}
          <FoodImg label={`[ ${m.n.toLowerCase()} ]`} h={110} tone={m.tone}/>
          <div style={{padding:"14px 16px"}}>
            <div style={{fontSize:10,color:A_TOKENS.accent,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>{m.tag}</div>
            <div style={{fontFamily:"Fraunces,serif",fontSize:18,fontWeight:500,letterSpacing:"-0.01em",lineHeight:1.15}}>{m.n}</div>
            <div style={{fontSize:12,color:A_TOKENS.muted,marginTop:4,fontStyle:"italic",fontFamily:"Fraunces,serif"}}>{m.d}</div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:10,paddingTop:10,borderTop:`1px dotted ${A_TOKENS.borderStrong}`,fontSize:11,color:A_TOKENS.inkSoft}}>
              <span>⏱ {m.t}</span><span>🔥 {m.cal} kcal</span><span>{m.lvl}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const A_Recipe = () => (
  <div style={{background:A_TOKENS.bg,width:"100%",height:"100%",fontFamily:"Inter,sans-serif",color:A_TOKENS.ink,overflow:"hidden"}}>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1.1fr",height:"100%"}}>
      <FoodImg label="[ pierogi ruskie · zdjęcie pełne ]" h="100%" tone="paprika"/>
      <div style={{padding:"32px 40px",overflow:"auto"}}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.14em",color:A_TOKENS.accent,textTransform:"uppercase",marginBottom:8}}>Klasyka polska · obiad</div>
        <h1 style={{fontFamily:"Fraunces,serif",fontSize:46,fontWeight:500,margin:"0 0 6px",letterSpacing:"-0.025em",lineHeight:1}}>Pierogi ruskie <em style={{color:A_TOKENS.accent}}>z koperkiem</em></h1>
        <div style={{fontFamily:"Fraunces,serif",fontStyle:"italic",fontSize:15,color:A_TOKENS.inkSoft,marginBottom:14}}>„Babcia Krysia mówiła: kluczem jest twaróg, nie ser." — Genie</div>
        <FolkDivider width={140}/>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,margin:"16px 0"}}>
          {[["⏱","45 min","Czas"],["🍽","4 os","Porcje"],["🔥","420","kcal"],["★","łatwe","Poziom"]].map(([i,v,l])=>(
            <div key={l} style={{background:A_TOKENS.surface,borderRadius:10,border:`1px solid ${A_TOKENS.border}`,padding:"10px",textAlign:"center"}}>
              <div style={{fontSize:14}}>{i}</div>
              <div style={{fontFamily:"Fraunces,serif",fontSize:18,fontWeight:500}}>{v}</div>
              <div style={{fontSize:9,color:A_TOKENS.muted,letterSpacing:"0.1em",textTransform:"uppercase"}}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:18,marginTop:8}}>
          <div>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.14em",color:A_TOKENS.accent,textTransform:"uppercase",marginBottom:10}}>Składniki</div>
            {[["mąka pszenna","500 g"],["twaróg półtłusty","400 g"],["ziemniaki","3 szt"],["cebula","2 szt"],["masło","60 g"],["sól, pieprz","do smaku"]].map(([s,a])=>(
              <div key={s} style={{display:"flex",justifyContent:"space-between",borderBottom:`1px dotted ${A_TOKENS.borderStrong}`,padding:"6px 0",fontSize:13,fontFamily:"Fraunces,serif"}}>
                <span>· {s}</span><span style={{color:A_TOKENS.muted,fontFamily:"Inter",fontSize:12}}>{a}</span>
              </div>
            ))}
            <button style={{marginTop:12,background:A_TOKENS.ink,color:A_TOKENS.surface,border:"none",padding:"10px 14px",borderRadius:10,fontSize:12,fontWeight:600,width:"100%"}}>+ Dodaj do listy zakupów</button>
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.14em",color:A_TOKENS.accent,textTransform:"uppercase",marginBottom:10}}>Jak zrobić</div>
            {[
              "Zagnieć ciasto z mąki, jajka, soli i ciepłej wody. Odstaw na 30 minut, niech odpocznie.",
              "Ziemniaki ugotuj w mundurkach, obierz, rozgnieć. Połącz z twarogiem, doprawiaj solą i pieprzem.",
              "Cebulę pokrój w drobną kostkę i zeszklij na maśle — będzie polewką.",
              "Z ciasta wykrawaj koła, nakładaj farsz, zlepiaj brzegi i gotuj w osolonej wodzie do wypłynięcia.",
            ].map((s,i)=>(
              <div key={i} style={{display:"flex",gap:12,marginBottom:14}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:A_TOKENS.accent,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Fraunces,serif",fontWeight:600,fontSize:13,flexShrink:0}}>{i+1}</div>
                <div style={{fontSize:13,lineHeight:1.55,color:A_TOKENS.inkSoft,fontFamily:"Fraunces,serif"}}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const A_Chat = () => (
  <div style={{background:A_TOKENS.bg,width:"100%",height:"100%",position:"relative",overflow:"hidden",fontFamily:"Inter,sans-serif",color:A_TOKENS.ink}}>
    {/* dim background */}
    <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg, ${A_TOKENS.bg}, ${A_TOKENS.surface})`,opacity:0.7}}></div>
    <div style={{position:"absolute",top:24,left:32,fontSize:11,color:A_TOKENS.muted}}>← w tle: ekran przepisu</div>

    {/* drawer */}
    <div style={{
      position:"absolute",right:0,top:0,bottom:0,width:"55%",
      background:A_TOKENS.surface,
      borderLeft:`1px solid ${A_TOKENS.border}`,
      boxShadow:"-30px 0 60px -20px rgba(58,40,24,0.2)",
      display:"flex",flexDirection:"column"
    }}>
      <div style={{padding:"22px 26px",borderBottom:`1px solid ${A_TOKENS.border}`,display:"flex",alignItems:"center",gap:12}}>
        <GenieMark color={A_TOKENS.accent} size={42}/>
        <div style={{flex:1}}>
          <div style={{fontFamily:"Fraunces,serif",fontSize:20,fontWeight:500}}>Genie</div>
          <div style={{fontSize:11,color:A_TOKENS.basil,display:"flex",alignItems:"center",gap:5}}><span style={{width:6,height:6,borderRadius:"50%",background:A_TOKENS.basil}}></span> w kuchni, gotowy</div>
        </div>
        <div style={{fontSize:18,color:A_TOKENS.muted}}>×</div>
      </div>

      <div style={{flex:1,padding:"22px 26px",display:"flex",flexDirection:"column",gap:14,overflow:"auto"}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
          <GenieMark color={A_TOKENS.accent} size={28}/>
          <div style={{maxWidth:340}}>
            <div style={{background:A_TOKENS.bg,padding:"12px 16px",borderRadius:"14px 14px 14px 4px",fontSize:14,lineHeight:1.55,fontFamily:"Fraunces,serif"}}>
              Cześć Marek! Robisz pierogi — jeśli ciasto jest za twarde, dodaj 2 łyżki ciepłej wody.
            </div>
            <div style={{fontSize:10,color:A_TOKENS.muted,marginTop:4,marginLeft:8,fontStyle:"italic"}}>14:32</div>
          </div>
        </div>
        <div style={{alignSelf:"flex-end",maxWidth:340}}>
          <div style={{background:A_TOKENS.accent,color:"#fff",padding:"12px 16px",borderRadius:"14px 14px 4px 14px",fontSize:14,lineHeight:1.55}}>
            A jak farsz, mogę dodać czosnek?
          </div>
          <div style={{fontSize:10,color:A_TOKENS.muted,marginTop:4,marginRight:8,fontStyle:"italic",textAlign:"right"}}>14:33 · Ty</div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
          <GenieMark color={A_TOKENS.accent} size={28}/>
          <div style={{maxWidth:340}}>
            <div style={{background:A_TOKENS.bg,padding:"12px 16px",borderRadius:"14px 14px 14px 4px",fontSize:14,lineHeight:1.55,fontFamily:"Fraunces,serif"}}>
              Możesz, ale w ruskich tradycyjnie się nie dodaje. Daj <em style={{color:A_TOKENS.accent,fontStyle:"normal",fontWeight:600}}>1 ząbek przeciśnięty</em> — będzie subtelnie. Lepiej skuś się na świeży koperek.
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
          <GenieMark color={A_TOKENS.accent} size={28}/>
          <div style={{background:A_TOKENS.bg,padding:"10px 16px",borderRadius:"14px 14px 14px 4px",display:"flex",gap:5,alignItems:"center"}}>
            {[0,1,2].map(i=><span key={i} style={{width:5,height:5,borderRadius:"50%",background:A_TOKENS.accent,opacity:0.5}}></span>)}
            <span style={{fontSize:11,color:A_TOKENS.muted,marginLeft:6,fontStyle:"italic"}}>pisze...</span>
          </div>
        </div>

        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
          {["Pokaż wideo","Czym zastąpić twaróg?","Ile gotować?"].map(t=>(
            <span key={t} style={{background:"transparent",border:`1px solid ${A_TOKENS.borderStrong}`,padding:"6px 12px",borderRadius:999,fontSize:12,color:A_TOKENS.inkSoft}}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{padding:"16px 22px",borderTop:`1px solid ${A_TOKENS.border}`,display:"flex",gap:10,alignItems:"center"}}>
        <input placeholder="Zapytaj Genie..." style={{flex:1,background:A_TOKENS.bg,border:`1px solid ${A_TOKENS.border}`,borderRadius:999,padding:"10px 16px",fontSize:13,fontFamily:"Inter",outline:"none"}}/>
        <button style={{width:38,height:38,borderRadius:"50%",background:A_TOKENS.accent,color:"#fff",border:"none",fontSize:14}}>↑</button>
      </div>
    </div>
  </div>
);

const A_Mobile = () => (
  <div style={{background:A_TOKENS.bg,width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",gap:16}}>
    <Phone>
      <div style={{padding:"14px 18px",height:"100%",overflow:"hidden",color:A_TOKENS.ink}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div>
            <div style={{fontFamily:"Caveat,cursive",fontSize:14,color:A_TOKENS.accent,fontStyle:"italic"}}>cześć Marek</div>
            <div style={{fontFamily:"Fraunces,serif",fontSize:22,fontWeight:500,letterSpacing:"-0.01em",lineHeight:1.1}}>Co dziś<br/><em style={{color:A_TOKENS.accent}}>ugotujemy?</em></div>
          </div>
          <div style={{width:32,height:32,borderRadius:"50%",background:A_TOKENS.surface,border:`1px solid ${A_TOKENS.border}`}}></div>
        </div>
        <div style={{background:A_TOKENS.surface,borderRadius:14,border:`1px solid ${A_TOKENS.border}`,padding:"12px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
          <span style={{color:A_TOKENS.muted,fontSize:14}}>🔍</span>
          <span style={{fontSize:12,color:A_TOKENS.muted}}>co masz w lodówce?</span>
        </div>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.14em",color:A_TOKENS.accent,textTransform:"uppercase",marginBottom:8}}>Polecane na dziś</div>
        {[
          {n:"Kurczak po krakowsku",t:"35 min · 480 kcal",tone:"paprika"},
          {n:"Cukiniowe placuszki",t:"20 min · 320 kcal",tone:"basil"},
          {n:"Zupa pomidorowa",t:"30 min · 280 kcal",tone:"saffron"},
        ].map(m=>(
          <div key={m.n} style={{background:A_TOKENS.surface,borderRadius:12,border:`1px solid ${A_TOKENS.border}`,padding:8,display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
            <FoodImg label="" h={50} tone={m.tone} style={{width:50,borderRadius:8,flexShrink:0}}/>
            <div style={{flex:1}}>
              <div style={{fontFamily:"Fraunces,serif",fontSize:14,fontWeight:500,letterSpacing:"-0.005em"}}>{m.n}</div>
              <div style={{fontSize:10,color:A_TOKENS.muted}}>{m.t}</div>
            </div>
          </div>
        ))}
        <div style={{position:"absolute",left:18,right:18,bottom:14,background:A_TOKENS.ink,borderRadius:18,padding:"10px 14px",display:"flex",justifyContent:"space-around",alignItems:"center"}}>
          {["🏠","🍲","💬","👤"].map((i,idx)=>(
            <span key={idx} style={{fontSize:16,opacity:idx===1?1:0.5,color:idx===1?A_TOKENS.accent:A_TOKENS.surface}}>{i}</span>
          ))}
        </div>
      </div>
    </Phone>
    <Phone>
      <div style={{padding:"14px 18px",color:A_TOKENS.ink}}>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.14em",color:A_TOKENS.accent,textTransform:"uppercase",marginBottom:6}}>Przepis · obiad</div>
        <div style={{fontFamily:"Fraunces,serif",fontSize:22,fontWeight:500,letterSpacing:"-0.015em",lineHeight:1.05,marginBottom:8}}>Pierogi ruskie <em style={{color:A_TOKENS.accent}}>z koperkiem</em></div>
        <FoodImg label="[ pierogi ]" h={120} tone="paprika" style={{borderRadius:12}}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,margin:"10px 0"}}>
          {[["⏱","45 min"],["🔥","420 kcal"],["★","łatwe"]].map(([i,v])=>(
            <div key={v} style={{background:A_TOKENS.surface,borderRadius:8,border:`1px solid ${A_TOKENS.border}`,padding:"6px",textAlign:"center"}}>
              <div style={{fontSize:11}}>{i}</div>
              <div style={{fontFamily:"Fraunces,serif",fontSize:12,fontWeight:500}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.14em",color:A_TOKENS.accent,textTransform:"uppercase",marginBottom:6}}>Składniki</div>
        {[["mąka","500g"],["twaróg","400g"],["ziemniaki","3 szt"],["cebula","2 szt"]].map(([s,a])=>(
          <div key={s} style={{display:"flex",justifyContent:"space-between",borderBottom:`1px dotted ${A_TOKENS.borderStrong}`,padding:"5px 0",fontSize:12,fontFamily:"Fraunces,serif"}}>
            <span>· {s}</span><span style={{color:A_TOKENS.muted,fontFamily:"Inter",fontSize:11}}>{a}</span>
          </div>
        ))}
        <button style={{position:"absolute",left:18,right:18,bottom:14,background:A_TOKENS.accent,color:"#fff",border:"none",padding:"12px",borderRadius:12,fontSize:13,fontWeight:600}}>Zacznij gotować →</button>
      </div>
    </Phone>
  </div>
);

window.A_LandingHero = A_LandingHero;
window.A_Dashboard = A_Dashboard;
window.A_Generator = A_Generator;
window.A_Suggestions = A_Suggestions;
window.A_Recipe = A_Recipe;
window.A_Chat = A_Chat;
window.A_Mobile = A_Mobile;
