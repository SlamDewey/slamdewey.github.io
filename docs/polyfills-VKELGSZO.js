var ie=globalThis;function Q(t){return(ie.__Zone_symbol_prefix||"__zone_symbol__")+t}function ft(){let t=ie.performance;function r(N){t&&t.mark&&t.mark(N)}function c(N,d){t&&t.measure&&t.measure(N,d)}r("Zone");let n=(()=>{class N{static{this.__symbol__=Q}static assertZonePatched(){if(ie.Promise!==O.ZoneAwarePromise)throw new Error("Zone.js has detected that ZoneAwarePromise `(window|global).Promise` has been overwritten.\nMost likely cause is that a Promise polyfill has been loaded after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. If you must load one, do so before loading zone.js.)")}static get root(){let e=N.current;for(;e.parent;)e=e.parent;return e}static get current(){return v.zone}static get currentTask(){return S}static __load_patch(e,o,p=!1){if(O.hasOwnProperty(e)){let D=ie[Q("forceDuplicateZoneCheck")]===!0;if(!p&&D)throw Error("Already loaded patch: "+e)}else if(!ie["__Zone_disable_"+e]){let D="Zone:"+e;r(D),O[e]=o(ie,N,w),c(D,D)}}get parent(){return this._parent}get name(){return this._name}constructor(e,o){this._parent=e,this._name=o?o.name||"unnamed":"<root>",this._properties=o&&o.properties||{},this._zoneDelegate=new u(this,this._parent&&this._parent._zoneDelegate,o)}get(e){let o=this.getZoneWith(e);if(o)return o._properties[e]}getZoneWith(e){let o=this;for(;o;){if(o._properties.hasOwnProperty(e))return o;o=o._parent}return null}fork(e){if(!e)throw new Error("ZoneSpec required!");return this._zoneDelegate.fork(this,e)}wrap(e,o){if(typeof e!="function")throw new Error("Expecting function got: "+e);let p=this._zoneDelegate.intercept(this,e,o),D=this;return function(){return D.runGuarded(p,this,arguments,o)}}run(e,o,p,D){v={parent:v,zone:this};try{return this._zoneDelegate.invoke(this,e,o,p,D)}finally{v=v.parent}}runGuarded(e,o=null,p,D){v={parent:v,zone:this};try{try{return this._zoneDelegate.invoke(this,e,o,p,D)}catch($){if(this._zoneDelegate.handleError(this,$))throw $}}finally{v=v.parent}}runTask(e,o,p){if(e.zone!=this)throw new Error("A task can only be run in the zone of creation! (Creation: "+(e.zone||te).name+"; Execution: "+this.name+")");if(e.state===X&&(e.type===U||e.type===g))return;let D=e.state!=F;D&&e._transitionTo(F,h),e.runCount++;let $=S;S=e,v={parent:v,zone:this};try{e.type==g&&e.data&&!e.data.isPeriodic&&(e.cancelFn=void 0);try{return this._zoneDelegate.invokeTask(this,e,o,p)}catch(A){if(this._zoneDelegate.handleError(this,A))throw A}}finally{e.state!==X&&e.state!==Y&&(e.type==U||e.data&&e.data.isPeriodic?D&&e._transitionTo(h,F):(e.runCount=0,this._updateTaskCount(e,-1),D&&e._transitionTo(X,F,X))),v=v.parent,S=$}}scheduleTask(e){if(e.zone&&e.zone!==this){let p=this;for(;p;){if(p===e.zone)throw Error(`can not reschedule task to ${this.name} which is descendants of the original zone ${e.zone.name}`);p=p.parent}}e._transitionTo(b,X);let o=[];e._zoneDelegates=o,e._zone=this;try{e=this._zoneDelegate.scheduleTask(this,e)}catch(p){throw e._transitionTo(Y,b,X),this._zoneDelegate.handleError(this,p),p}return e._zoneDelegates===o&&this._updateTaskCount(e,1),e.state==b&&e._transitionTo(h,b),e}scheduleMicroTask(e,o,p,D){return this.scheduleTask(new _(B,e,o,p,D,void 0))}scheduleMacroTask(e,o,p,D,$){return this.scheduleTask(new _(g,e,o,p,D,$))}scheduleEventTask(e,o,p,D,$){return this.scheduleTask(new _(U,e,o,p,D,$))}cancelTask(e){if(e.zone!=this)throw new Error("A task can only be cancelled in the zone of creation! (Creation: "+(e.zone||te).name+"; Execution: "+this.name+")");if(!(e.state!==h&&e.state!==F)){e._transitionTo(q,h,F);try{this._zoneDelegate.cancelTask(this,e)}catch(o){throw e._transitionTo(Y,q),this._zoneDelegate.handleError(this,o),o}return this._updateTaskCount(e,-1),e._transitionTo(X,q),e.runCount=0,e}}_updateTaskCount(e,o){let p=e._zoneDelegates;o==-1&&(e._zoneDelegates=null);for(let D=0;D<p.length;D++)p[D]._updateTaskCount(e.type,o)}}return N})(),i={name:"",onHasTask:(N,d,e,o)=>N.hasTask(e,o),onScheduleTask:(N,d,e,o)=>N.scheduleTask(e,o),onInvokeTask:(N,d,e,o,p,D)=>N.invokeTask(e,o,p,D),onCancelTask:(N,d,e,o)=>N.cancelTask(e,o)};class u{get zone(){return this._zone}constructor(d,e,o){this._taskCounts={microTask:0,macroTask:0,eventTask:0},this._zone=d,this._parentDelegate=e,this._forkZS=o&&(o&&o.onFork?o:e._forkZS),this._forkDlgt=o&&(o.onFork?e:e._forkDlgt),this._forkCurrZone=o&&(o.onFork?this._zone:e._forkCurrZone),this._interceptZS=o&&(o.onIntercept?o:e._interceptZS),this._interceptDlgt=o&&(o.onIntercept?e:e._interceptDlgt),this._interceptCurrZone=o&&(o.onIntercept?this._zone:e._interceptCurrZone),this._invokeZS=o&&(o.onInvoke?o:e._invokeZS),this._invokeDlgt=o&&(o.onInvoke?e:e._invokeDlgt),this._invokeCurrZone=o&&(o.onInvoke?this._zone:e._invokeCurrZone),this._handleErrorZS=o&&(o.onHandleError?o:e._handleErrorZS),this._handleErrorDlgt=o&&(o.onHandleError?e:e._handleErrorDlgt),this._handleErrorCurrZone=o&&(o.onHandleError?this._zone:e._handleErrorCurrZone),this._scheduleTaskZS=o&&(o.onScheduleTask?o:e._scheduleTaskZS),this._scheduleTaskDlgt=o&&(o.onScheduleTask?e:e._scheduleTaskDlgt),this._scheduleTaskCurrZone=o&&(o.onScheduleTask?this._zone:e._scheduleTaskCurrZone),this._invokeTaskZS=o&&(o.onInvokeTask?o:e._invokeTaskZS),this._invokeTaskDlgt=o&&(o.onInvokeTask?e:e._invokeTaskDlgt),this._invokeTaskCurrZone=o&&(o.onInvokeTask?this._zone:e._invokeTaskCurrZone),this._cancelTaskZS=o&&(o.onCancelTask?o:e._cancelTaskZS),this._cancelTaskDlgt=o&&(o.onCancelTask?e:e._cancelTaskDlgt),this._cancelTaskCurrZone=o&&(o.onCancelTask?this._zone:e._cancelTaskCurrZone),this._hasTaskZS=null,this._hasTaskDlgt=null,this._hasTaskDlgtOwner=null,this._hasTaskCurrZone=null;let p=o&&o.onHasTask,D=e&&e._hasTaskZS;(p||D)&&(this._hasTaskZS=p?o:i,this._hasTaskDlgt=e,this._hasTaskDlgtOwner=this,this._hasTaskCurrZone=this._zone,o.onScheduleTask||(this._scheduleTaskZS=i,this._scheduleTaskDlgt=e,this._scheduleTaskCurrZone=this._zone),o.onInvokeTask||(this._invokeTaskZS=i,this._invokeTaskDlgt=e,this._invokeTaskCurrZone=this._zone),o.onCancelTask||(this._cancelTaskZS=i,this._cancelTaskDlgt=e,this._cancelTaskCurrZone=this._zone))}fork(d,e){return this._forkZS?this._forkZS.onFork(this._forkDlgt,this.zone,d,e):new n(d,e)}intercept(d,e,o){return this._interceptZS?this._interceptZS.onIntercept(this._interceptDlgt,this._interceptCurrZone,d,e,o):e}invoke(d,e,o,p,D){return this._invokeZS?this._invokeZS.onInvoke(this._invokeDlgt,this._invokeCurrZone,d,e,o,p,D):e.apply(o,p)}handleError(d,e){return this._handleErrorZS?this._handleErrorZS.onHandleError(this._handleErrorDlgt,this._handleErrorCurrZone,d,e):!0}scheduleTask(d,e){let o=e;if(this._scheduleTaskZS)this._hasTaskZS&&o._zoneDelegates.push(this._hasTaskDlgtOwner),o=this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt,this._scheduleTaskCurrZone,d,e),o||(o=e);else if(e.scheduleFn)e.scheduleFn(e);else if(e.type==B)W(e);else throw new Error("Task is missing scheduleFn.");return o}invokeTask(d,e,o,p){return this._invokeTaskZS?this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt,this._invokeTaskCurrZone,d,e,o,p):e.callback.apply(o,p)}cancelTask(d,e){let o;if(this._cancelTaskZS)o=this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt,this._cancelTaskCurrZone,d,e);else{if(!e.cancelFn)throw Error("Task is not cancelable");o=e.cancelFn(e)}return o}hasTask(d,e){try{this._hasTaskZS&&this._hasTaskZS.onHasTask(this._hasTaskDlgt,this._hasTaskCurrZone,d,e)}catch(o){this.handleError(d,o)}}_updateTaskCount(d,e){let o=this._taskCounts,p=o[d],D=o[d]=p+e;if(D<0)throw new Error("More tasks executed then were scheduled.");if(p==0||D==0){let $={microTask:o.microTask>0,macroTask:o.macroTask>0,eventTask:o.eventTask>0,change:d};this.hasTask(this._zone,$)}}}class _{constructor(d,e,o,p,D,$){if(this._zone=null,this.runCount=0,this._zoneDelegates=null,this._state="notScheduled",this.type=d,this.source=e,this.data=p,this.scheduleFn=D,this.cancelFn=$,!o)throw new Error("callback is not defined");this.callback=o;let A=this;d===U&&p&&p.useG?this.invoke=_.invokeTask:this.invoke=function(){return _.invokeTask.call(ie,A,this,arguments)}}static invokeTask(d,e,o){d||(d=this),K++;try{return d.runCount++,d.zone.runTask(d,e,o)}finally{K==1&&H(),K--}}get zone(){return this._zone}get state(){return this._state}cancelScheduleRequest(){this._transitionTo(X,b)}_transitionTo(d,e,o){if(this._state===e||this._state===o)this._state=d,d==X&&(this._zoneDelegates=null);else throw new Error(`${this.type} '${this.source}': can not transition to '${d}', expecting state '${e}'${o?" or '"+o+"'":""}, was '${this._state}'.`)}toString(){return this.data&&typeof this.data.handleId<"u"?this.data.handleId.toString():Object.prototype.toString.call(this)}toJSON(){return{type:this.type,state:this.state,source:this.source,zone:this.zone.name,runCount:this.runCount}}}let E=Q("setTimeout"),m=Q("Promise"),C=Q("then"),T=[],Z=!1,P;function j(N){if(P||ie[m]&&(P=ie[m].resolve(0)),P){let d=P[C];d||(d=P.then),d.call(P,N)}else ie[E](N,0)}function W(N){K===0&&T.length===0&&j(H),N&&T.push(N)}function H(){if(!Z){for(Z=!0;T.length;){let N=T;T=[];for(let d=0;d<N.length;d++){let e=N[d];try{e.zone.runTask(e,null,null)}catch(o){w.onUnhandledError(o)}}}w.microtaskDrainDone(),Z=!1}}let te={name:"NO ZONE"},X="notScheduled",b="scheduling",h="scheduled",F="running",q="canceling",Y="unknown",B="microTask",g="macroTask",U="eventTask",O={},w={symbol:Q,currentZoneFrame:()=>v,onUnhandledError:z,microtaskDrainDone:z,scheduleMicroTask:W,showUncaughtError:()=>!n[Q("ignoreConsoleErrorUncaughtError")],patchEventTarget:()=>[],patchOnProperties:z,patchMethod:()=>z,bindArguments:()=>[],patchThen:()=>z,patchMacroTask:()=>z,patchEventPrototype:()=>z,isIEOrEdge:()=>!1,getGlobalObjects:()=>{},ObjectDefineProperty:()=>z,ObjectGetOwnPropertyDescriptor:()=>{},ObjectCreate:()=>{},ArraySlice:()=>[],patchClass:()=>z,wrapWithCurrentZone:()=>z,filterProperties:()=>[],attachOriginToPatched:()=>z,_redefineProperty:()=>z,patchCallbacks:()=>z,nativeScheduleMicroTask:j},v={parent:null,zone:new n(null,null)},S=null,K=0;function z(){}return c("Zone","Zone"),n}function ht(){let t=globalThis,r=t[Q("forceDuplicateZoneCheck")]===!0;if(t.Zone&&(r||typeof t.Zone.__symbol__!="function"))throw new Error("Zone already loaded.");return t.Zone??=ft(),t.Zone}var ke=Object.getOwnPropertyDescriptor,Ae=Object.defineProperty,je=Object.getPrototypeOf,dt=Object.create,_t=Array.prototype.slice,He="addEventListener",xe="removeEventListener",Ie=Q(He),Le=Q(xe),ce="true",ae="false",ve=Q("");function Ge(t,r){return Zone.current.wrap(t,r)}function Ve(t,r,c,n,i){return Zone.current.scheduleMacroTask(t,r,c,n,i)}var x=Q,Se=typeof window<"u",ge=Se?window:void 0,J=Se&&ge||globalThis,Et="removeAttribute";function Fe(t,r){for(let c=t.length-1;c>=0;c--)typeof t[c]=="function"&&(t[c]=Ge(t[c],r+"_"+c));return t}function Tt(t,r){let c=t.constructor.name;for(let n=0;n<r.length;n++){let i=r[n],u=t[i];if(u){let _=ke(t,i);if(!Qe(_))continue;t[i]=(E=>{let m=function(){return E.apply(this,Fe(arguments,c+"."+i))};return ue(m,E),m})(u)}}}function Qe(t){return t?t.writable===!1?!1:!(typeof t.get=="function"&&typeof t.set>"u"):!0}var et=typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope,De=!("nw"in J)&&typeof J.process<"u"&&J.process.toString()==="[object process]",Be=!De&&!et&&!!(Se&&ge.HTMLElement),tt=typeof J.process<"u"&&J.process.toString()==="[object process]"&&!et&&!!(Se&&ge.HTMLElement),Ce={},Ye=function(t){if(t=t||J.event,!t)return;let r=Ce[t.type];r||(r=Ce[t.type]=x("ON_PROPERTY"+t.type));let c=this||t.target||J,n=c[r],i;if(Be&&c===ge&&t.type==="error"){let u=t;i=n&&n.call(this,u.message,u.filename,u.lineno,u.colno,u.error),i===!0&&t.preventDefault()}else i=n&&n.apply(this,arguments),i!=null&&!i&&t.preventDefault();return i};function $e(t,r,c){let n=ke(t,r);if(!n&&c&&ke(c,r)&&(n={enumerable:!0,configurable:!0}),!n||!n.configurable)return;let i=x("on"+r+"patched");if(t.hasOwnProperty(i)&&t[i])return;delete n.writable,delete n.value;let u=n.get,_=n.set,E=r.slice(2),m=Ce[E];m||(m=Ce[E]=x("ON_PROPERTY"+E)),n.set=function(C){let T=this;if(!T&&t===J&&(T=J),!T)return;typeof T[m]=="function"&&T.removeEventListener(E,Ye),_&&_.call(T,null),T[m]=C,typeof C=="function"&&T.addEventListener(E,Ye,!1)},n.get=function(){let C=this;if(!C&&t===J&&(C=J),!C)return null;let T=C[m];if(T)return T;if(u){let Z=u.call(this);if(Z)return n.set.call(this,Z),typeof C[Et]=="function"&&C.removeAttribute(r),Z}return null},Ae(t,r,n),t[i]=!0}function nt(t,r,c){if(r)for(let n=0;n<r.length;n++)$e(t,"on"+r[n],c);else{let n=[];for(let i in t)i.slice(0,2)=="on"&&n.push(i);for(let i=0;i<n.length;i++)$e(t,n[i],c)}}var re=x("originalInstance");function pe(t){let r=J[t];if(!r)return;J[x(t)]=r,J[t]=function(){let i=Fe(arguments,t);switch(i.length){case 0:this[re]=new r;break;case 1:this[re]=new r(i[0]);break;case 2:this[re]=new r(i[0],i[1]);break;case 3:this[re]=new r(i[0],i[1],i[2]);break;case 4:this[re]=new r(i[0],i[1],i[2],i[3]);break;default:throw new Error("Arg list too long.")}},ue(J[t],r);let c=new r(function(){}),n;for(n in c)t==="XMLHttpRequest"&&n==="responseBlob"||function(i){typeof c[i]=="function"?J[t].prototype[i]=function(){return this[re][i].apply(this[re],arguments)}:Ae(J[t].prototype,i,{set:function(u){typeof u=="function"?(this[re][i]=Ge(u,t+"."+i),ue(this[re][i],u)):this[re][i]=u},get:function(){return this[re][i]}})}(n);for(n in r)n!=="prototype"&&r.hasOwnProperty(n)&&(J[t][n]=r[n])}function le(t,r,c){let n=t;for(;n&&!n.hasOwnProperty(r);)n=je(n);!n&&t[r]&&(n=t);let i=x(r),u=null;if(n&&(!(u=n[i])||!n.hasOwnProperty(i))){u=n[i]=n[r];let _=n&&ke(n,r);if(Qe(_)){let E=c(u,i,r);n[r]=function(){return E(this,arguments)},ue(n[r],u)}}return u}function gt(t,r,c){let n=null;function i(u){let _=u.data;return _.args[_.cbIdx]=function(){u.invoke.apply(this,arguments)},n.apply(_.target,_.args),u}n=le(t,r,u=>function(_,E){let m=c(_,E);return m.cbIdx>=0&&typeof E[m.cbIdx]=="function"?Ve(m.name,E[m.cbIdx],m,i):u.apply(_,E)})}function ue(t,r){t[x("OriginalDelegate")]=r}var Je=!1,Me=!1;function yt(){try{let t=ge.navigator.userAgent;if(t.indexOf("MSIE ")!==-1||t.indexOf("Trident/")!==-1)return!0}catch{}return!1}function mt(){if(Je)return Me;Je=!0;try{let t=ge.navigator.userAgent;(t.indexOf("MSIE ")!==-1||t.indexOf("Trident/")!==-1||t.indexOf("Edge/")!==-1)&&(Me=!0)}catch{}return Me}var Te=!1;if(typeof window<"u")try{let t=Object.defineProperty({},"passive",{get:function(){Te=!0}});window.addEventListener("test",t,t),window.removeEventListener("test",t,t)}catch{Te=!1}var pt={useG:!0},ee={},rt={},ot=new RegExp("^"+ve+"(\\w+)(true|false)$"),st=x("propagationStopped");function it(t,r){let c=(r?r(t):t)+ae,n=(r?r(t):t)+ce,i=ve+c,u=ve+n;ee[t]={},ee[t][ae]=i,ee[t][ce]=u}function kt(t,r,c,n){let i=n&&n.add||He,u=n&&n.rm||xe,_=n&&n.listeners||"eventListeners",E=n&&n.rmAll||"removeAllListeners",m=x(i),C="."+i+":",T="prependListener",Z="."+T+":",P=function(b,h,F){if(b.isRemoved)return;let q=b.callback;typeof q=="object"&&q.handleEvent&&(b.callback=g=>q.handleEvent(g),b.originalDelegate=q);let Y;try{b.invoke(b,h,[F])}catch(g){Y=g}let B=b.options;if(B&&typeof B=="object"&&B.once){let g=b.originalDelegate?b.originalDelegate:b.callback;h[u].call(h,F.type,g,B)}return Y};function j(b,h,F){if(h=h||t.event,!h)return;let q=b||h.target||t,Y=q[ee[h.type][F?ce:ae]];if(Y){let B=[];if(Y.length===1){let g=P(Y[0],q,h);g&&B.push(g)}else{let g=Y.slice();for(let U=0;U<g.length&&!(h&&h[st]===!0);U++){let O=P(g[U],q,h);O&&B.push(O)}}if(B.length===1)throw B[0];for(let g=0;g<B.length;g++){let U=B[g];r.nativeScheduleMicroTask(()=>{throw U})}}}let W=function(b){return j(this,b,!1)},H=function(b){return j(this,b,!0)};function te(b,h){if(!b)return!1;let F=!0;h&&h.useG!==void 0&&(F=h.useG);let q=h&&h.vh,Y=!0;h&&h.chkDup!==void 0&&(Y=h.chkDup);let B=!1;h&&h.rt!==void 0&&(B=h.rt);let g=b;for(;g&&!g.hasOwnProperty(i);)g=je(g);if(!g&&b[i]&&(g=b),!g||g[m])return!1;let U=h&&h.eventNameToString,O={},w=g[m]=g[i],v=g[x(u)]=g[u],S=g[x(_)]=g[_],K=g[x(E)]=g[E],z;h&&h.prepend&&(z=g[x(h.prepend)]=g[h.prepend]);function N(s,l){return!Te&&typeof s=="object"&&s?!!s.capture:!Te||!l?s:typeof s=="boolean"?{capture:s,passive:!0}:s?typeof s=="object"&&s.passive!==!1?{...s,passive:!0}:s:{passive:!0}}let d=function(s){if(!O.isExisting)return w.call(O.target,O.eventName,O.capture?H:W,O.options)},e=function(s){if(!s.isRemoved){let l=ee[s.eventName],k;l&&(k=l[s.capture?ce:ae]);let R=k&&s.target[k];if(R){for(let y=0;y<R.length;y++)if(R[y]===s){R.splice(y,1),s.isRemoved=!0,s.removeAbortListener&&(s.removeAbortListener(),s.removeAbortListener=null),R.length===0&&(s.allRemoved=!0,s.target[k]=null);break}}}if(s.allRemoved)return v.call(s.target,s.eventName,s.capture?H:W,s.options)},o=function(s){return w.call(O.target,O.eventName,s.invoke,O.options)},p=function(s){return z.call(O.target,O.eventName,s.invoke,O.options)},D=function(s){return v.call(s.target,s.eventName,s.invoke,s.options)},$=F?d:o,A=F?e:D,be=function(s,l){let k=typeof l;return k==="function"&&s.callback===l||k==="object"&&s.originalDelegate===l},ye=h&&h.diff?h.diff:be,he=Zone[x("UNPATCHED_EVENTS")],Pe=t[x("PASSIVE_EVENTS")];function f(s){if(typeof s=="object"&&s!==null){let l={...s};return s.signal&&(l.signal=s.signal),l}return s}let a=function(s,l,k,R,y=!1,I=!1){return function(){let L=this||t,M=arguments[0];h&&h.transferEventName&&(M=h.transferEventName(M));let G=arguments[1];if(!G)return s.apply(this,arguments);if(De&&M==="uncaughtException")return s.apply(this,arguments);let V=!1;if(typeof G!="function"){if(!G.handleEvent)return s.apply(this,arguments);V=!0}if(q&&!q(s,G,L,arguments))return;let fe=Te&&!!Pe&&Pe.indexOf(M)!==-1,oe=f(N(arguments[2],fe)),de=oe?.signal;if(de?.aborted)return;if(he){for(let se=0;se<he.length;se++)if(M===he[se])return fe?s.call(L,M,G,oe):s.apply(this,arguments)}let Oe=oe?typeof oe=="boolean"?!0:oe.capture:!1,Ue=oe&&typeof oe=="object"?oe.once:!1,ut=Zone.current,Ne=ee[M];Ne||(it(M,U),Ne=ee[M]);let We=Ne[Oe?ce:ae],_e=L[We],qe=!1;if(_e){if(qe=!0,Y){for(let se=0;se<_e.length;se++)if(ye(_e[se],G))return}}else _e=L[We]=[];let we,ze=L.constructor.name,Xe=rt[ze];Xe&&(we=Xe[M]),we||(we=ze+l+(U?U(M):M)),O.options=oe,Ue&&(O.options.once=!1),O.target=L,O.capture=Oe,O.eventName=M,O.isExisting=qe;let me=F?pt:void 0;me&&(me.taskData=O),de&&(O.options.signal=void 0);let ne=ut.scheduleEventTask(we,G,me,k,R);if(de){O.options.signal=de;let se=()=>ne.zone.cancelTask(ne);s.call(de,"abort",se,{once:!0}),ne.removeAbortListener=()=>de.removeEventListener("abort",se)}if(O.target=null,me&&(me.taskData=null),Ue&&(O.options.once=!0),!Te&&typeof ne.options=="boolean"||(ne.options=oe),ne.target=L,ne.capture=Oe,ne.eventName=M,V&&(ne.originalDelegate=G),I?_e.unshift(ne):_e.push(ne),y)return L}};return g[i]=a(w,C,$,A,B),z&&(g[T]=a(z,Z,p,A,B,!0)),g[u]=function(){let s=this||t,l=arguments[0];h&&h.transferEventName&&(l=h.transferEventName(l));let k=arguments[2],R=k?typeof k=="boolean"?!0:k.capture:!1,y=arguments[1];if(!y)return v.apply(this,arguments);if(q&&!q(v,y,s,arguments))return;let I=ee[l],L;I&&(L=I[R?ce:ae]);let M=L&&s[L];if(M)for(let G=0;G<M.length;G++){let V=M[G];if(ye(V,y)){if(M.splice(G,1),V.isRemoved=!0,M.length===0&&(V.allRemoved=!0,s[L]=null,!R&&typeof l=="string")){let fe=ve+"ON_PROPERTY"+l;s[fe]=null}return V.zone.cancelTask(V),B?s:void 0}}return v.apply(this,arguments)},g[_]=function(){let s=this||t,l=arguments[0];h&&h.transferEventName&&(l=h.transferEventName(l));let k=[],R=ct(s,U?U(l):l);for(let y=0;y<R.length;y++){let I=R[y],L=I.originalDelegate?I.originalDelegate:I.callback;k.push(L)}return k},g[E]=function(){let s=this||t,l=arguments[0];if(l){h&&h.transferEventName&&(l=h.transferEventName(l));let k=ee[l];if(k){let R=k[ae],y=k[ce],I=s[R],L=s[y];if(I){let M=I.slice();for(let G=0;G<M.length;G++){let V=M[G],fe=V.originalDelegate?V.originalDelegate:V.callback;this[u].call(this,l,fe,V.options)}}if(L){let M=L.slice();for(let G=0;G<M.length;G++){let V=M[G],fe=V.originalDelegate?V.originalDelegate:V.callback;this[u].call(this,l,fe,V.options)}}}}else{let k=Object.keys(s);for(let R=0;R<k.length;R++){let y=k[R],I=ot.exec(y),L=I&&I[1];L&&L!=="removeListener"&&this[E].call(this,L)}this[E].call(this,"removeListener")}if(B)return this},ue(g[i],w),ue(g[u],v),K&&ue(g[E],K),S&&ue(g[_],S),!0}let X=[];for(let b=0;b<c.length;b++)X[b]=te(c[b],n);return X}function ct(t,r){if(!r){let u=[];for(let _ in t){let E=ot.exec(_),m=E&&E[1];if(m&&(!r||m===r)){let C=t[_];if(C)for(let T=0;T<C.length;T++)u.push(C[T])}}return u}let c=ee[r];c||(it(r),c=ee[r]);let n=t[c[ae]],i=t[c[ce]];return n?i?n.concat(i):n.slice():i?i.slice():[]}function vt(t,r){let c=t.Event;c&&c.prototype&&r.patchMethod(c.prototype,"stopImmediatePropagation",n=>function(i,u){i[st]=!0,n&&n.apply(i,u)})}function bt(t,r){r.patchMethod(t,"queueMicrotask",c=>function(n,i){Zone.current.scheduleMicroTask("queueMicrotask",i[0])})}var Re=x("zoneTask");function Ee(t,r,c,n){let i=null,u=null;r+=n,c+=n;let _={};function E(C){let T=C.data;return T.args[0]=function(){return C.invoke.apply(this,arguments)},T.handleId=i.apply(t,T.args),C}function m(C){return u.call(t,C.data.handleId)}i=le(t,r,C=>function(T,Z){if(typeof Z[0]=="function"){let P={isPeriodic:n==="Interval",delay:n==="Timeout"||n==="Interval"?Z[1]||0:void 0,args:Z},j=Z[0];Z[0]=function(){try{return j.apply(this,arguments)}finally{P.isPeriodic||(typeof P.handleId=="number"?delete _[P.handleId]:P.handleId&&(P.handleId[Re]=null))}};let W=Ve(r,Z[0],P,E,m);if(!W)return W;let H=W.data.handleId;return typeof H=="number"?_[H]=W:H&&(H[Re]=W),H&&H.ref&&H.unref&&typeof H.ref=="function"&&typeof H.unref=="function"&&(W.ref=H.ref.bind(H),W.unref=H.unref.bind(H)),typeof H=="number"||H?H:W}else return C.apply(t,Z)}),u=le(t,c,C=>function(T,Z){let P=Z[0],j;typeof P=="number"?j=_[P]:(j=P&&P[Re],j||(j=P)),j&&typeof j.type=="string"?j.state!=="notScheduled"&&(j.cancelFn&&j.data.isPeriodic||j.runCount===0)&&(typeof P=="number"?delete _[P]:P&&(P[Re]=null),j.zone.cancelTask(j)):C.apply(t,Z)})}function Pt(t,r){let{isBrowser:c,isMix:n}=r.getGlobalObjects();if(!c&&!n||!t.customElements||!("customElements"in t))return;let i=["connectedCallback","disconnectedCallback","adoptedCallback","attributeChangedCallback","formAssociatedCallback","formDisabledCallback","formResetCallback","formStateRestoreCallback"];r.patchCallbacks(r,t.customElements,"customElements","define",i)}function wt(t,r){if(Zone[r.symbol("patchEventTarget")])return;let{eventNames:c,zoneSymbolEventNames:n,TRUE_STR:i,FALSE_STR:u,ZONE_SYMBOL_PREFIX:_}=r.getGlobalObjects();for(let m=0;m<c.length;m++){let C=c[m],T=C+u,Z=C+i,P=_+T,j=_+Z;n[C]={},n[C][u]=P,n[C][i]=j}let E=t.EventTarget;if(!(!E||!E.prototype))return r.patchEventTarget(t,r,[E&&E.prototype]),!0}function Rt(t,r){r.patchEventPrototype(t,r)}function at(t,r,c){if(!c||c.length===0)return r;let n=c.filter(u=>u.target===t);if(!n||n.length===0)return r;let i=n[0].ignoreProperties;return r.filter(u=>i.indexOf(u)===-1)}function Ke(t,r,c,n){if(!t)return;let i=at(t,r,c);nt(t,i,n)}function Ze(t){return Object.getOwnPropertyNames(t).filter(r=>r.startsWith("on")&&r.length>2).map(r=>r.substring(2))}function Ct(t,r){if(De&&!tt||Zone[t.symbol("patchEvents")])return;let c=r.__Zone_ignore_on_properties,n=[];if(Be){let i=window;n=n.concat(["Document","SVGElement","Element","HTMLElement","HTMLBodyElement","HTMLMediaElement","HTMLFrameSetElement","HTMLFrameElement","HTMLIFrameElement","HTMLMarqueeElement","Worker"]);let u=yt()?[{target:i,ignoreProperties:["error"]}]:[];Ke(i,Ze(i),c&&c.concat(u),je(i))}n=n.concat(["XMLHttpRequest","XMLHttpRequestEventTarget","IDBIndex","IDBRequest","IDBOpenDBRequest","IDBDatabase","IDBTransaction","IDBCursor","WebSocket"]);for(let i=0;i<n.length;i++){let u=r[n[i]];u&&u.prototype&&Ke(u.prototype,Ze(u.prototype),c)}}function St(t){t.__load_patch("legacy",r=>{let c=r[t.__symbol__("legacyPatch")];c&&c()}),t.__load_patch("timers",r=>{let c="set",n="clear";Ee(r,c,n,"Timeout"),Ee(r,c,n,"Interval"),Ee(r,c,n,"Immediate")}),t.__load_patch("requestAnimationFrame",r=>{Ee(r,"request","cancel","AnimationFrame"),Ee(r,"mozRequest","mozCancel","AnimationFrame"),Ee(r,"webkitRequest","webkitCancel","AnimationFrame")}),t.__load_patch("blocking",(r,c)=>{let n=["alert","prompt","confirm"];for(let i=0;i<n.length;i++){let u=n[i];le(r,u,(_,E,m)=>function(C,T){return c.current.run(_,r,T,m)})}}),t.__load_patch("EventTarget",(r,c,n)=>{Rt(r,n),wt(r,n);let i=r.XMLHttpRequestEventTarget;i&&i.prototype&&n.patchEventTarget(r,n,[i.prototype])}),t.__load_patch("MutationObserver",(r,c,n)=>{pe("MutationObserver"),pe("WebKitMutationObserver")}),t.__load_patch("IntersectionObserver",(r,c,n)=>{pe("IntersectionObserver")}),t.__load_patch("FileReader",(r,c,n)=>{pe("FileReader")}),t.__load_patch("on_property",(r,c,n)=>{Ct(n,r)}),t.__load_patch("customElements",(r,c,n)=>{Pt(r,n)}),t.__load_patch("XHR",(r,c)=>{C(r);let n=x("xhrTask"),i=x("xhrSync"),u=x("xhrListener"),_=x("xhrScheduled"),E=x("xhrURL"),m=x("xhrErrorBeforeScheduled");function C(T){let Z=T.XMLHttpRequest;if(!Z)return;let P=Z.prototype;function j(w){return w[n]}let W=P[Ie],H=P[Le];if(!W){let w=T.XMLHttpRequestEventTarget;if(w){let v=w.prototype;W=v[Ie],H=v[Le]}}let te="readystatechange",X="scheduled";function b(w){let v=w.data,S=v.target;S[_]=!1,S[m]=!1;let K=S[u];W||(W=S[Ie],H=S[Le]),K&&H.call(S,te,K);let z=S[u]=()=>{if(S.readyState===S.DONE)if(!v.aborted&&S[_]&&w.state===X){let d=S[c.__symbol__("loadfalse")];if(S.status!==0&&d&&d.length>0){let e=w.invoke;w.invoke=function(){let o=S[c.__symbol__("loadfalse")];for(let p=0;p<o.length;p++)o[p]===w&&o.splice(p,1);!v.aborted&&w.state===X&&e.call(w)},d.push(w)}else w.invoke()}else!v.aborted&&S[_]===!1&&(S[m]=!0)};return W.call(S,te,z),S[n]||(S[n]=w),U.apply(S,v.args),S[_]=!0,w}function h(){}function F(w){let v=w.data;return v.aborted=!0,O.apply(v.target,v.args)}let q=le(P,"open",()=>function(w,v){return w[i]=v[2]==!1,w[E]=v[1],q.apply(w,v)}),Y="XMLHttpRequest.send",B=x("fetchTaskAborting"),g=x("fetchTaskScheduling"),U=le(P,"send",()=>function(w,v){if(c.current[g]===!0||w[i])return U.apply(w,v);{let S={target:w,url:w[E],isPeriodic:!1,args:v,aborted:!1},K=Ve(Y,h,S,b,F);w&&w[m]===!0&&!S.aborted&&K.state===X&&K.invoke()}}),O=le(P,"abort",()=>function(w,v){let S=j(w);if(S&&typeof S.type=="string"){if(S.cancelFn==null||S.data&&S.data.aborted)return;S.zone.cancelTask(S)}else if(c.current[B]===!0)return O.apply(w,v)})}}),t.__load_patch("geolocation",r=>{r.navigator&&r.navigator.geolocation&&Tt(r.navigator.geolocation,["getCurrentPosition","watchPosition"])}),t.__load_patch("PromiseRejectionEvent",(r,c)=>{function n(i){return function(u){ct(r,i).forEach(E=>{let m=r.PromiseRejectionEvent;if(m){let C=new m(i,{promise:u.promise,reason:u.rejection});E.invoke(C)}})}}r.PromiseRejectionEvent&&(c[x("unhandledPromiseRejectionHandler")]=n("unhandledrejection"),c[x("rejectionHandledHandler")]=n("rejectionhandled"))}),t.__load_patch("queueMicrotask",(r,c,n)=>{bt(r,n)})}function Dt(t){t.__load_patch("ZoneAwarePromise",(r,c,n)=>{let i=Object.getOwnPropertyDescriptor,u=Object.defineProperty;function _(f){if(f&&f.toString===Object.prototype.toString){let a=f.constructor&&f.constructor.name;return(a||"")+": "+JSON.stringify(f)}return f?f.toString():Object.prototype.toString.call(f)}let E=n.symbol,m=[],C=r[E("DISABLE_WRAPPING_UNCAUGHT_PROMISE_REJECTION")]!==!1,T=E("Promise"),Z=E("then"),P="__creationTrace__";n.onUnhandledError=f=>{if(n.showUncaughtError()){let a=f&&f.rejection;a?console.error("Unhandled Promise rejection:",a instanceof Error?a.message:a,"; Zone:",f.zone.name,"; Task:",f.task&&f.task.source,"; Value:",a,a instanceof Error?a.stack:void 0):console.error(f)}},n.microtaskDrainDone=()=>{for(;m.length;){let f=m.shift();try{f.zone.runGuarded(()=>{throw f.throwOriginal?f.rejection:f})}catch(a){W(a)}}};let j=E("unhandledPromiseRejectionHandler");function W(f){n.onUnhandledError(f);try{let a=c[j];typeof a=="function"&&a.call(this,f)}catch{}}function H(f){return f&&f.then}function te(f){return f}function X(f){return A.reject(f)}let b=E("state"),h=E("value"),F=E("finally"),q=E("parentPromiseValue"),Y=E("parentPromiseState"),B="Promise.then",g=null,U=!0,O=!1,w=0;function v(f,a){return s=>{try{N(f,a,s)}catch(l){N(f,!1,l)}}}let S=function(){let f=!1;return function(s){return function(){f||(f=!0,s.apply(null,arguments))}}},K="Promise resolved with itself",z=E("currentTaskTrace");function N(f,a,s){let l=S();if(f===s)throw new TypeError(K);if(f[b]===g){let k=null;try{(typeof s=="object"||typeof s=="function")&&(k=s&&s.then)}catch(R){return l(()=>{N(f,!1,R)})(),f}if(a!==O&&s instanceof A&&s.hasOwnProperty(b)&&s.hasOwnProperty(h)&&s[b]!==g)e(s),N(f,s[b],s[h]);else if(a!==O&&typeof k=="function")try{k.call(s,l(v(f,a)),l(v(f,!1)))}catch(R){l(()=>{N(f,!1,R)})()}else{f[b]=a;let R=f[h];if(f[h]=s,f[F]===F&&a===U&&(f[b]=f[Y],f[h]=f[q]),a===O&&s instanceof Error){let y=c.currentTask&&c.currentTask.data&&c.currentTask.data[P];y&&u(s,z,{configurable:!0,enumerable:!1,writable:!0,value:y})}for(let y=0;y<R.length;)o(f,R[y++],R[y++],R[y++],R[y++]);if(R.length==0&&a==O){f[b]=w;let y=s;try{throw new Error("Uncaught (in promise): "+_(s)+(s&&s.stack?`
`+s.stack:""))}catch(I){y=I}C&&(y.throwOriginal=!0),y.rejection=s,y.promise=f,y.zone=c.current,y.task=c.currentTask,m.push(y),n.scheduleMicroTask()}}}return f}let d=E("rejectionHandledHandler");function e(f){if(f[b]===w){try{let a=c[d];a&&typeof a=="function"&&a.call(this,{rejection:f[h],promise:f})}catch{}f[b]=O;for(let a=0;a<m.length;a++)f===m[a].promise&&m.splice(a,1)}}function o(f,a,s,l,k){e(f);let R=f[b],y=R?typeof l=="function"?l:te:typeof k=="function"?k:X;a.scheduleMicroTask(B,()=>{try{let I=f[h],L=!!s&&F===s[F];L&&(s[q]=I,s[Y]=R);let M=a.run(y,void 0,L&&y!==X&&y!==te?[]:[I]);N(s,!0,M)}catch(I){N(s,!1,I)}},s)}let p="function ZoneAwarePromise() { [native code] }",D=function(){},$=r.AggregateError;class A{static toString(){return p}static resolve(a){return a instanceof A?a:N(new this(null),U,a)}static reject(a){return N(new this(null),O,a)}static withResolvers(){let a={};return a.promise=new A((s,l)=>{a.resolve=s,a.reject=l}),a}static any(a){if(!a||typeof a[Symbol.iterator]!="function")return Promise.reject(new $([],"All promises were rejected"));let s=[],l=0;try{for(let y of a)l++,s.push(A.resolve(y))}catch{return Promise.reject(new $([],"All promises were rejected"))}if(l===0)return Promise.reject(new $([],"All promises were rejected"));let k=!1,R=[];return new A((y,I)=>{for(let L=0;L<s.length;L++)s[L].then(M=>{k||(k=!0,y(M))},M=>{R.push(M),l--,l===0&&(k=!0,I(new $(R,"All promises were rejected")))})})}static race(a){let s,l,k=new this((I,L)=>{s=I,l=L});function R(I){s(I)}function y(I){l(I)}for(let I of a)H(I)||(I=this.resolve(I)),I.then(R,y);return k}static all(a){return A.allWithCallback(a)}static allSettled(a){return(this&&this.prototype instanceof A?this:A).allWithCallback(a,{thenCallback:l=>({status:"fulfilled",value:l}),errorCallback:l=>({status:"rejected",reason:l})})}static allWithCallback(a,s){let l,k,R=new this((M,G)=>{l=M,k=G}),y=2,I=0,L=[];for(let M of a){H(M)||(M=this.resolve(M));let G=I;try{M.then(V=>{L[G]=s?s.thenCallback(V):V,y--,y===0&&l(L)},V=>{s?(L[G]=s.errorCallback(V),y--,y===0&&l(L)):k(V)})}catch(V){k(V)}y++,I++}return y-=2,y===0&&l(L),R}constructor(a){let s=this;if(!(s instanceof A))throw new Error("Must be an instanceof Promise.");s[b]=g,s[h]=[];try{let l=S();a&&a(l(v(s,U)),l(v(s,O)))}catch(l){N(s,!1,l)}}get[Symbol.toStringTag](){return"Promise"}get[Symbol.species](){return A}then(a,s){let l=this.constructor?.[Symbol.species];(!l||typeof l!="function")&&(l=this.constructor||A);let k=new l(D),R=c.current;return this[b]==g?this[h].push(R,k,a,s):o(this,R,k,a,s),k}catch(a){return this.then(null,a)}finally(a){let s=this.constructor?.[Symbol.species];(!s||typeof s!="function")&&(s=A);let l=new s(D);l[F]=F;let k=c.current;return this[b]==g?this[h].push(k,l,a,a):o(this,k,l,a,a),l}}A.resolve=A.resolve,A.reject=A.reject,A.race=A.race,A.all=A.all;let be=r[T]=r.Promise;r.Promise=A;let ye=E("thenPatched");function he(f){let a=f.prototype,s=i(a,"then");if(s&&(s.writable===!1||!s.configurable))return;let l=a.then;a[Z]=l,f.prototype.then=function(k,R){return new A((I,L)=>{l.call(this,I,L)}).then(k,R)},f[ye]=!0}n.patchThen=he;function Pe(f){return function(a,s){let l=f.apply(a,s);if(l instanceof A)return l;let k=l.constructor;return k[ye]||he(k),l}}return be&&(he(be),le(r,"fetch",f=>Pe(f))),Promise[c.__symbol__("uncaughtPromiseErrors")]=m,A})}function Ot(t){t.__load_patch("toString",r=>{let c=Function.prototype.toString,n=x("OriginalDelegate"),i=x("Promise"),u=x("Error"),_=function(){if(typeof this=="function"){let T=this[n];if(T)return typeof T=="function"?c.call(T):Object.prototype.toString.call(T);if(this===Promise){let Z=r[i];if(Z)return c.call(Z)}if(this===Error){let Z=r[u];if(Z)return c.call(Z)}}return c.call(this)};_[n]=c,Function.prototype.toString=_;let E=Object.prototype.toString,m="[object Promise]";Object.prototype.toString=function(){return typeof Promise=="function"&&this instanceof Promise?m:E.call(this)}})}function Nt(t,r,c,n,i){let u=Zone.__symbol__(n);if(r[u])return;let _=r[u]=r[n];r[n]=function(E,m,C){return m&&m.prototype&&i.forEach(function(T){let Z=`${c}.${n}::`+T,P=m.prototype;try{if(P.hasOwnProperty(T)){let j=t.ObjectGetOwnPropertyDescriptor(P,T);j&&j.value?(j.value=t.wrapWithCurrentZone(j.value,Z),t._redefineProperty(m.prototype,T,j)):P[T]&&(P[T]=t.wrapWithCurrentZone(P[T],Z))}else P[T]&&(P[T]=t.wrapWithCurrentZone(P[T],Z))}catch{}}),_.call(r,E,m,C)},t.attachOriginToPatched(r[n],_)}function It(t){t.__load_patch("util",(r,c,n)=>{let i=Ze(r);n.patchOnProperties=nt,n.patchMethod=le,n.bindArguments=Fe,n.patchMacroTask=gt;let u=c.__symbol__("BLACK_LISTED_EVENTS"),_=c.__symbol__("UNPATCHED_EVENTS");r[_]&&(r[u]=r[_]),r[u]&&(c[u]=c[_]=r[u]),n.patchEventPrototype=vt,n.patchEventTarget=kt,n.isIEOrEdge=mt,n.ObjectDefineProperty=Ae,n.ObjectGetOwnPropertyDescriptor=ke,n.ObjectCreate=dt,n.ArraySlice=_t,n.patchClass=pe,n.wrapWithCurrentZone=Ge,n.filterProperties=at,n.attachOriginToPatched=ue,n._redefineProperty=Object.defineProperty,n.patchCallbacks=Nt,n.getGlobalObjects=()=>({globalSources:rt,zoneSymbolEventNames:ee,eventNames:i,isBrowser:Be,isMix:tt,isNode:De,TRUE_STR:ce,FALSE_STR:ae,ZONE_SYMBOL_PREFIX:ve,ADD_EVENT_LISTENER_STR:He,REMOVE_EVENT_LISTENER_STR:xe})})}function Lt(t){Dt(t),Ot(t),It(t)}var lt=ht();Lt(lt);St(lt);