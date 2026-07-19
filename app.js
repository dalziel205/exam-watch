const $ = (s) => document.querySelector(s);
const state = { active:false, startedAt:null, awayAt:null, awayTotal:0, logs:[], timer:null };
const labels = {
  hidden: ['Rời khỏi trang', 'Tab bị ẩn hoặc người dùng đã chuyển ứng dụng / khóa màn hình.'],
  visible: ['Quay lại bài thi', 'Trang đã hiển thị trở lại sau một khoảng gián đoạn.'],
  blur: ['Mất tiêu điểm', 'Cửa sổ bài thi không còn nhận tương tác.'],
  pagehide: ['Phiên bị gián đoạn', 'Trình duyệt đang đóng, điều hướng hoặc đưa trang vào bộ nhớ đệm.'],
  demo: ['Vi phạm mô phỏng', 'Sự kiện mẫu để kiểm tra giao diện nhật ký.']
};

function formatDuration(ms){
  const sec=Math.max(0,Math.floor(ms/1000)), m=Math.floor(sec/60), s=sec%60;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(el.t);el.t=setTimeout(()=>el.classList.remove('show'),2200)}
function persist(){localStorage.setItem('exam-watch-session',JSON.stringify({...state,timer:undefined}))}
function addLog(type, detail=''){
  if(!state.active && type!=='demo') return;
  const [title,desc]=labels[type]||['Sự kiện','Đã ghi nhận một sự kiện.'];
  const event={id:crypto.randomUUID?.()||String(Date.now()),type,title,description:detail||desc,time:new Date().toISOString()};
  state.logs.unshift(event); persist(); renderLogs(); updateScore();
}
function renderLogs(){
  $('#emptyState').style.display=state.logs.length?'none':'grid';
  const list=$('#logList');list.classList.toggle('visible',!!state.logs.length);
  list.innerHTML=state.logs.map(e=>`<div class="log-item"><time class="log-time">${new Date(e.time).toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}</time><div class="log-icon">!</div><div class="log-copy"><strong>${e.title}</strong><p>${e.description}</p></div><span class="severity">CẢNH BÁO</span></div>`).join('');
  $('#totalCount').textContent=state.logs.filter(e=>e.type!=='visible').length;
  $('#exportBtn').disabled=$('#clearBtn').disabled=!state.logs.length;
}
function updateScore(){
  const violations=state.logs.filter(e=>e.type!=='visible').length;
  const score=Math.max(0,100-violations*12);$('#trustScore').textContent=score;$('#scoreMeter').style.width=score+'%';
  $('#scoreMeter').style.background=score<60?'#ee6a32':'#61b77c';
  $('#scoreMessage').textContent=score===100?'Không phát hiện tín hiệu bất thường.':score>=60?'Có tín hiệu cần được xem xét.':'Phiên có nhiều lần gián đoạn.';
}
function start(){
  if(state.active){finish();return} state.active=true;state.startedAt=Date.now();state.awayTotal=0;state.logs=[];
  $('#startBtn span').textContent='Kết thúc giám sát';$('#statusPill').classList.add('active');$('#statusPill b').textContent='Đang giám sát';
  state.timer=setInterval(tick,1000);renderLogs();updateScore();persist();toast('Đã bắt đầu phiên giám sát');
}
function finish(){
  state.active=false;clearInterval(state.timer);if(state.awayAt){state.awayTotal+=Date.now()-state.awayAt;state.awayAt=null}
  $('#startBtn span').textContent='Bắt đầu giám sát';$('#statusPill').classList.remove('active');$('#statusPill b').textContent='Đã kết thúc';persist();toast('Phiên giám sát đã kết thúc');
}
function tick(){
  if(!state.active)return;$('#sessionTime').textContent=formatDuration(Date.now()-state.startedAt);
  $('#awayTime').textContent=formatDuration(state.awayTotal+(state.awayAt?Date.now()-state.awayAt:0));
}
document.addEventListener('visibilitychange',()=>{
  if(!state.active)return;
  if(document.hidden){state.awayAt=Date.now();addLog('hidden')}else{const d=state.awayAt?Date.now()-state.awayAt:0;state.awayTotal+=d;state.awayAt=null;addLog('visible',`Quay lại sau ${formatDuration(d)}.`);tick()}
});
window.addEventListener('blur',()=>{if(state.active&&!document.hidden)addLog('blur')});
window.addEventListener('pagehide',()=>{if(state.active){addLog('pagehide');persist()}});
$('#startBtn').addEventListener('click',start);
$('#demoBtn').addEventListener('click',()=>{addLog('demo');toast('Đã thêm một vi phạm mẫu')});
$('#clearBtn').addEventListener('click',()=>{state.logs=[];renderLogs();updateScore();persist();toast('Đã xóa nhật ký')});
$('#exportBtn').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),session:state},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`exam-watch-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href)});
renderLogs();tick();
