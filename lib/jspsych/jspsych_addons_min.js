jsPsych.getSubjectID=(function(){function datestr(sdat){function formatstr(num,dignum){dignum=(typeof dignum=='undefined')?2:dignum;var numstr=num.toString();if(numstr.length<dignum){for(var j=0;j<dignum-numstr.length;j++){numstr="0"+numstr;}}
return numstr;}
var sy=sdat.getFullYear();var smo=formatstr(sdat.getMonth()+1);var sda=formatstr(sdat.getDate());var sho=formatstr(sdat.getHours());var smi=formatstr(sdat.getMinutes());var sse=formatstr(sdat.getSeconds());var sms=formatstr(sdat.getMilliseconds(),3);var strdat=sy+smo+sda+"_"+sho+smi+sse+"_"+sms;return strdat;}
return'ID_'+datestr(new Date());});jsPsych.prepareProgressBar=function(expobj){function putProgressBarStr(istep,Nstep){var prop=istep/Nstep;var strpbar="<div id='progressbar-wrap'><p id='progressbar-wrap-txt'>Progression globale</p>"+"<div id='progressbar-container'><div id='progressbar-inner' style='width:"+(prop*100)+"%'><p>Etape "+istep+"/"+Nstep+"</p></div></div></div>";return strpbar;}
var Nbar=0;var ibararr=[];for(var j=0;j<expobj.length;j++){var subobj=expobj[j];if(subobj.progbar!==undefined){if(subobj.progbar==true){Nbar=Nbar+1;ibararr.push(j);}}}
for(var k=0;k<ibararr.length;k++){expobj[ibararr[k]]["progbarstr"]=putProgressBarStr(k+1,Nbar);}
return expobj;};jsPsych.initFullScreen=function(afterfullfunc){function is_not_fullwindow(){if(window.outerWidth<screen.width-100){return true;}else{return false;}}
var dtx="<div class='large' style='display:inline-block; width: 100%; height: 6em; text-align: center; margin: 10% auto 2em auto;'>";var itx=dtx+"<p>Bienvenue sur la fenêtre d'expérience ! </p>";var etx="</div>";var welcome_block={type:'text',text:itx+etx,timing_stim:1000};var noresize_block={timeline:[{type:'text',text:itx+"<p>Veuillez ne pas la redimensionner.</p><p>Cliquez sur la fenêtre pour commencer...</p>"+etx,cont_key:'mouse'}],conditional_function:function(){return(!is_not_fullwindow());}};var resize_block={timeline:[{type:'resize',text:itx+"<p>Pour commencer, merci de mettre cette fenêtre en plein écran (bouton du milieu en haut à droite).</p>"+etx}],conditional_function:function(){return is_not_fullwindow();}};jsPsych.init({timeline:[welcome_block,noresize_block,resize_block],on_finish:function(){jsPsych.data.deleteAllData();afterfullfunc();}});};jsPsych.feedback=(function(){var module={};function concatObjArr(objarr){var prop=Object.keys(objarr[0]);var concobjarr={};for(var i=0;i<objarr.length;i++){for(var j=0;j<prop.length;j++){if(i==0){concobjarr[prop[j]]=[];}
concobjarr[prop[j]][i]=objarr[i][prop[j]];}}
return concobjarr;}
module.getBlocksOfTrials=function(trialtyp_names){trialtyp_names=(typeof trialtyp_names=='string')?[trialtyp_names]:trialtyp_names;var alltrials=[];var Ntt=trialtyp_names.length;for(var i=0;i<Ntt;i++){var trialpart=jsPsych.data.getTrialsOfType(trialtyp_names[i]);if(trialpart.length>0){alltrials=alltrials.concat(trialpart);}}
var trialblocks=[];var tnum=[];if(alltrials.length>0){trialblocks[0]=[alltrials[0]];kb=0;var prevtig=alltrials[0].iG;tnum[0]=prevtig;for(var i=1;i<alltrials.length;i++){var tig=alltrials[i].iG;if(tig==prevtig+1){trialblocks[kb].push(alltrials[i]);}else{kb=kb+1;trialblocks[kb]=[alltrials[i]];tnum[kb]=tig;}
prevtig=tig;}}
if(trialblocks.length>1){var tempblocks=trialblocks.slice(0);var sortnum=tnum.slice(0);sortnum.sort(function(a,b){return a-b;});for(var i=0;i<sortnum.length;i++){var ib=tnum.indexOf(sortnum[i]);trialblocks[i]=tempblocks[ib];}}
return trialblocks;}
module.getBlockSummary=function(trials,rtfield){function str2arr(strdata){strdata=strdata.substring(1,strdata.length-1);var spstr=strdata.split(",");var numArray=[];var k=0;for(var i=0;i<spstr.length;i++){numArray[k]=parseInt(spstr[i]);k++;}
return numArray;};var Nt=trials.length;var rt_all={nb:0,sum:0};var rt_val={nb:0,sum:0};var ntot=0;var nval=0;for(var i=0;i<Nt;i++){var valflag=0;if(typeof trials[i].nvld!='undefined'){nval=nval+trials[i].nvld;}
else if(typeof trials[i].vld!='undefined'){valflag=trials[i].vld;nval=nval+valflag;ntot=ntot+1;}
if(typeof trials[i][rtfield]!=='undefined'){var vectt=str2arr(trials[i][rtfield]);for(var j=0,Nv=vectt.length;j<Nv;j++){if(vectt[j]>0){rt_all.sum=rt_all.sum+vectt[j];rt_all.nb=rt_all.nb+1;if(valflag==1){rt_val.sum=rt_val.sum+vectt[j];rt_val.nb=rt_val.nb+1;}}
if(typeof trials[i].nvld!='undefined'){ntot=ntot+1;}}}}
if(ntot>0){var pval=Math.round(100*nval/ntot);}else{var pval=0;}
var avgrt_val=-1;var avgrt_all=-1;if(rt_val.nb>0){avgrt_val=Math.floor(rt_val.sum/rt_val.nb);}
if(rt_all.nb>0){avgrt_all=Math.floor(rt_all.sum/rt_all.nb);}
return{sum:{all:rt_all.sum,vld:rt_val.sum,p_vld:pval,n_val:nval,n_tot:ntot},avg:{all:avgrt_all,vld:avgrt_val,p_vld:pval,n_val:nval,n_tot:ntot}}};module.getAllBlocksSummary=function(trialtyp_names,rtfield,summtyp){var trialtyp=(typeof trialtyp_names=='string')?[trialtyp_names]:trialtyp_names;var summtyp=(typeof summtyp=='undefined')?'avg':summtyp;var trialblocks=module.getBlocksOfTrials(trialtyp);var blocksummary=[];for(var k=0;k<trialblocks.length;k++){var bsumm=module.getBlockSummary(trialblocks[k],rtfield);blocksummary.push(bsumm[summtyp]);}
var concblocksummary=concatObjArr(blocksummary);return concblocksummary;};module.makeScoreDiv=function(scorearr,colorflag,sortmeth,Nsubpart){if(typeof Nsubpart==='undefined'||Nsubpart===null){var Nsubpart=1;}
var colorflag=(typeof colorflag==='undefined'||colorflag===null)?0:colorflag;var sortmeth=(typeof sortmeth==='undefined'||sortmeth===null)?1:sortmeth;function block_info(iblock,Nsub){iblock=iblock+1;var r=iblock%Nsub;var ipart=Math.ceil(iblock/Nsub);if(r>0){var isub=iblock-(ipart-1)*Nsub;}else{var isub=Nsub;}
var genalpha=String.fromCharCode(ipart+64);if(Nsub>1){var partstr=genalpha+"-"+isub;}else{var partstr=genalpha;}
var blockinfo={general_part:genalpha,current_subpart:isub,idstr:partstr,total_subpart:Nsub};return blockinfo;};function score_class(scorearr,colflag,sortmeth){var Nblocks=scorearr.length;var cnames=[];for(var k=0;k<Nblocks;k++){if((Nblocks==1)&&(colflag)){cnames[k]="best_score";cnames[k]="best_score";}else{cnames[k]="middle_score";cnames[k]="middle_score";}}
if((colflag)&&(Nblocks>1)){var i_max=scorearr.reduce(function(iMax,x,i,a){return x>=a[iMax]?i:iMax;},0);var i_min=scorearr.reduce(function(iMin,x,i,a){return x<=a[iMin]?i:iMin;},0);if(sortmeth==1){ibest=i_max;iworst=i_min;}else{ibest=i_min;iworst=i_max;}
for(var k=0;k<Nblocks;k++){if(scorearr[k]==scorearr[iworst]){cnames[k]="worst_score";}
if(scorearr[k]==scorearr[ibest]){cnames[k]="best_score";}}}
return cnames;};var Nk=scorearr.length;for(var i=0;i<Nk;i++){if(scorearr[i]<0){scorearr[i]=0;}}
var cnames=score_class(scorearr,colorflag,sortmeth);var sdiv="<div class='scorerow'>";for(var k=0;k<Nk-1;k++){var strp=block_info(k,Nsubpart).idstr;var sparty="Partie ["+strp+"] : ";sdiv=sdiv+"<div class='score "+cnames[k]+"'>"+
sparty+
scorearr[k]+"</div>";}
icur=Nk-1;var strp=block_info(icur,Nsubpart).idstr;var sparty="Partie ["+strp+"] : ";sdiv=sdiv+"<div class='score "+cnames[icur]+"'>"+"<b>"+sparty+
scorearr[Nk-1]+"</b></div>";sdiv=sdiv+"</div>";return sdiv;};module.score_div=function(trialtyp_names,param){var trialtyp_names=(typeof trialtyp_names=='string')?[trialtyp_names]:trialtyp_names;var opt={rt_field:(typeof param.rt_field!=="string")?"rt":param.rt_field,score_type:(typeof param.score_type!=="string")?"avg":param.score_type,apply_calc:(typeof param.apply_calc!=="object")?'no':param.apply_calc,show_blocknum:((typeof param.show_blocknum!=="number")&(typeof param.show_blocknum!=="boolean"))?1:param.show_blocknum,nb_subpart:(typeof param.nb_subpart!=="number")?1:param.nb_subpart,color_flag:((typeof param.color_flag!=="number")&(typeof param.color_flag!=="boolean"))?0:param.color_flag,sort_meth:(typeof param.sort_meth!=="number")?1:param.sort_meth}
if(typeof opt.color_flag=="boolean"){opt.color_flag=(opt.color_flag==true)?1:0;}
var concsumm=module.getAllBlocksSummary(trialtyp_names,opt.rt_field,opt.score_type);if(typeof opt.apply_calc==="object"){concsumm=opt.apply_calc.func(concsumm,opt.apply_calc.arg);}
var scoredivs={};if(opt.show_blocknum){for(var typ in concsumm){if(typ=="p_vld"){var smeth=1;}else{var smeth=opt.sort_meth;}
scoredivs[typ]=module.makeScoreDiv(concsumm[typ],opt.color_flag,smeth,opt.nb_subpart);}}
return{fb_div:scoredivs,fb_val:concsumm};};return module;})();