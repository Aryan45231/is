let dis_obj={
    id:0,
    subject:"",
    question:"",
     response:[],
     like:0,
     dislike:0,
     fav:"^",
     time:""
}
const response_obj= {
  id:0,
   res_name:"",
   answer:"",
   like:0,
   dislike:0,
   fav:"^"
}

const convertToRealTime=(time)=>{
  let min, hr,day
   let second=parseInt(time/1000)
     if(second>=60){
      min=parseInt(second/60)
        second= parseInt(second%60)
        if(min>=60){
          hr=parseInt(min/60)
          min=min%60;
         if(hr>=24){
          day=parseInt(hr/24)
          hr=hr%24;
          return `${day} day ago`
         }else{
           return `${hr} hr ${min} m ago`
         }
        }else{
          return `${min} m ${second} s ago`
        }
        
     }else{
       return `${second} second ago `
     }
}
const timer=()=>{
    setInterval(()=>{
         const data= JSON.parse(localStorage.getItem("discussion"))
          data.forEach((ele)=>{
            let time=Date.now()-ele.time
          
             const id=document.getElementById(`t_${ele.id}`)
             
             id.innerHTML=convertToRealTime(time)
          })

    }, 1000)
}
timer()
const date= new Date()
const d=date.getTime.toString()
console.log(d)

let count=JSON.parse(localStorage.getItem("count"))
if(count==null)
{
  localStorage.setItem("count",JSON.stringify("0"))
  count=JSON.parse(localStorage.getItem("count"))
}





const discussion =JSON.parse(localStorage.getItem("discussion"))

if(discussion!=null){

 

    discussion.sort((a,b)=>{
      if(a.fav=="*")
      return -1
      if(b.fav=="*")
      return 1
      else
      return 0
    })


  
 console.log(discussion)

 discussion.forEach((ele,i)=>{
    const q_container=document.getElementById("q_container")
    const q_div=document.createElement("div")
    q_div.id= ele.id
    q_div.innerHTML=`
     <div>
     <h2> ${ele.subject} </h>
     <h4> ${ele.question} </h4> 
     <span id="t_${ele.id}">  ${convertToRealTime(Date.now()-ele.time)}  </span>  
     </div>
       <div class="controls">  
       <span id="l${ele.id}" onclick="like(this.parentNode.parentNode.id)">
       ${ele.like}  like 
       </span>
       <p  id="d${ele.id}" onclick="dis_like(this.parentNode.parentNode.id)">
       ${ele.dislike}  dislike
       </p>
       <span id="f${ele.id}" class="fav"  onclick="fav(this.parentNode.parentNode.id)">
        ${ele.fav}
       </span>
       </div>
       `
    q_div.setAttribute("onclick", `setResPage(this)`)
  q_div.className="question_box"
  q_container.appendChild(q_div)
  


 })
}


const new_ques_form=()=>{
  location.reload()
}



let flag=true;
let flag2=true

const local_data=JSON.parse(localStorage.getItem("discussion"))
const collect_data=(inp)=>{
        if(inp.name=="subject"){
           dis_obj.subject=inp.value
          flag=true;
        }
        else if(inp.name=="question"){
          dis_obj.question=inp.value
          flag2=true
        }
    
}

const submitQuestion=(e)=>{
        e.preventDefault();
      for(i=0;i<dis_obj.subject.length;i++){
         if(dis_obj.subject[i]!=" ")
        {
          flag=false
          break;
        }
      }
       
  for(i=0;i<dis_obj.question.length;i++){
        if(dis_obj.question[i]!=" "){
          flag2=false
          break;
        }
  }

   if(flag || flag2){
     alert("no data is entered")
   }else{
    const q_container=document.getElementById("q_container")
    const q_div=document.createElement("div")
    q_div.id=count
    dis_obj.id=count
    q_div.innerHTML=`
      <div>
      <h2> ${dis_obj.subject} </h>
      <h4> ${dis_obj.question} </h4> 
    
       <span id="t_${dis_obj.id}">  Now  </span>  
      </div>
       <div class="controls"  >  
        <span id="l${dis_obj.id}" onclick="like(this.parentNode.parentNode.id)" >
        ${dis_obj.like}  like
        </span>
        <p  id="d${dis_obj.id}"  onclick="dis_like(this.parentNode.parentNode.id)">
        ${dis_obj.dislike}  dislike
        </p>
        <span id="f${dis_obj.id}" class="fav"  onclick="fav(this.parentNode.parentNode.id)">
         ${dis_obj.fav}
        </span>
         }
       
       </div>
   

          `
    q_div.setAttribute("onclick", `setResPage(this)`)
  q_div.className="question_box"
  q_container.appendChild(q_div)
  dis_obj.time=Date.now();
count++;
localStorage.setItem("count",JSON.stringify(count))
/// storing into localStorgae
storInLocalStorage(dis_obj)

document.getElementById("sub").value=""
document.getElementById("ques").value=""

   }
}
document.getElementById("form").addEventListener("submit",submitQuestion) 
const setResPage=(ind)=>{
    const data=JSON.parse(localStorage.getItem("discussion"))
    const ques_obj=data.find(ele=>ele.id==ind.id)
    const res=ques_obj.response
    for(i=0;i<res.length;i++){
       let  mid=i;
         for(j=i+1;j<res.length;j++){
                if(res[j].like-res[j].dislike>res[mid].like-res[mid].dislike){
                     mid=j
                }  
                let temp=res[i]
                res[i]=res[mid]
                 res[mid]=temp  
         }
    }


    document.getElementById("right").innerHTML= `
    
    <div class="res_question"> 
    <h2>
       Quiestion
    </h2>
    <div class="ques_container">
       <h2>
           ${ques_obj.subject}
       </h2>
       <h3>
          ${ques_obj.question}
       </h3>
       <button onclick="resolve(${ques_obj.id})">
         Resolve
       </button>
    </div>


   </div>
   <div class="res_comment">
   <h2>
       Response
   </h2>
   <div class="responses" id="responses">
        ${
           ques_obj.response.map((ele,i)=>{
                return `
                
                    <div    class="res_person">
                    <div>
                    <h3> ${ele.res_name} </h3>
                    <h4> ${ele.answer} </h4>  
                    </div>
                    <div class="controls">  
                    <span id="r_l${ele.id}" onclick="rlike(${ele.id} , ${ques_obj.id})">
                    ${ele.like}  like
                    </span>
                    <p  id="r_d${ele.id}" onclick="rdis_like(${ele.id} , ${ques_obj.id})">
                    ${ele.dislike}  dislike
                    </p>
                    <span id="r_f${ele.id}" class="fav" onclick="rfav(${ele.id},${ques_obj.id} )">
                     ${ele.fav}
                    </span>
                    </div>
                    </div>
                `
           })
        }
   </div>
   <div class="Add_Responce_contaner">
       <h1>
           Add Response
       </h1>
       <form onsubmit="sub_comment(${ques_obj.id})">
           <input required type="text" name="r_name" placeholder="Enter Name"  id="r_name"  >
        <textarea required id="comment" cols="30" rows="10"  placeholder="Enter Commet" name="comment"></textarea>
        <button>
           Submit
        </button>
       </form>
   </div>
   </div>

    
    
    
    `
}

const storInLocalStorage=(dis)=>{
    let data=JSON.parse(localStorage.getItem("discussion"))
    if(data==null)
        data=[]
    data.push(dis) 
   localStorage.setItem("discussion", JSON.stringify(data))
}
 let flag3=true;
 let flag4=true;

const sub_comment =(id,e)=>{
  event.preventDefault()

  const data=JSON.parse(localStorage.getItem("discussion"))
  const ques_obj=data.find(ele=>ele.id==id)
  console.log(ques_obj)
  const name=document.getElementById("r_name")
  const comment =document.getElementById("comment")
  response_obj.res_name=name.value;
  response_obj.answer=comment.value

    for(i=0;i<name.value.length;i++){
      if(name.value[i]!=" "){
        flag3=false
        break;
      }
    }
    for(i=0;i<comment.value.length;i++){
      if(comment.value[i]!=" "){
        console.log(comment.value)
        flag4=false;
        break;
      }
    }

    if(flag3  || flag4){
      alert("please add response")
    }else{

  response_obj.id= ques_obj.response.length
  ques_obj.response.push(response_obj)
  const i=data.indexOf(ques_obj)
  data[i]=ques_obj;
  localStorage.setItem("discussion", JSON.stringify(data))
  const div=document.createElement("div")
  div.innerHTML=`
  <div>
    <h3> ${response_obj.res_name} </h3>
    <h4> ${response_obj.answer} </h4>  
    </div>
    <div class="controls">  
    <span id="r_l${response_obj.id}" onclick="rlike(${response_obj.id},${ques_obj.id})">
    ${response_obj.like}  like
    </span>
    <p  id="r_d${response_obj.id}" onclick="rdis_like(${response_obj.id},${ques_obj.id} )">
    ${response_obj.dislike}  dislike
    </p>
    <span id="r_f${response_obj.id}" class="fav" onclick="rfav(${response_obj.id},${ques_obj.id} )">
     ${response_obj.fav}
    </span>
    </div>
    
    
    
    `
div.className="res_person"
  document.getElementById("responses").appendChild(div)

name.value=""
comment.value=""


    }
    flag3=true;
    flag4=true;




  return false
}

const rlike=(id,p_id)=>{
  console.log(p_id)
  console.log(id)
  const  data=JSON.parse(localStorage.getItem("discussion"))
  const ques_obj=data.find(ele=> ele.id==p_id)
  const res_obj=ques_obj.response.find(ele=>ele.id==id)
  console.log(res_obj)
  res_obj.like++
  const i=data.indexOf[ques_obj]
  data[i]=ques_obj
  localStorage.setItem("discussion", JSON.stringify(data))
  document.getElementById(`r_l${res_obj.id}`).innerHTML=` ${res_obj.like} likes`
}

const rdis_like=(id,p_id)=>{
  const  data=JSON.parse(localStorage.getItem("discussion"))
  const ques_obj=data.find(ele=> ele.id==p_id)
  const res_obj=ques_obj.response.find(ele=>ele.id==id)
  res_obj.dislike++
  const i=data.indexOf[ques_obj]
  data[i]=ques_obj
  localStorage.setItem("discussion", JSON.stringify(data))
  document.getElementById(`r_d${res_obj.id}`).innerHTML=` ${res_obj.dislike} ldislkes`
}
const rfav=(id ,p_id)=>{
  
  const  data=JSON.parse(localStorage.getItem("discussion"))
  const ques_obj=data.find(ele=> ele.id==p_id)
  const res_obj=ques_obj.response.find(ele=>ele.id==id)
  if(res_obj.fav=="^")
   res_obj.fav="*"
   else
   res_obj.fav="^"
   const i=data.indexOf[ques_obj]
   data[i]=ques_obj
   localStorage.setItem("discussion", JSON.stringify(data))
   document.getElementById(`r_f${id}`).innerHTML=` ${res_obj.fav} `
}



const resolve= (id)=>{
   const  data=JSON.parse(localStorage.getItem("discussion"))
   const ques_obj=data.find(ele=>ele.id==id)
   const i=data.indexOf(ques_obj)
   data.splice(i,1)
   console.log(data)
   localStorage.setItem("discussion", JSON.stringify(data))
   location.reload()
}
const search=(e)=>{
  const data=JSON.parse(localStorage.getItem("discussion"))
   const f_array=    data.filter((ele)=>{
     const a= ele.question.toLowerCase()
     const b= e.value.toLowerCase()
     const c=ele.subject.toLowerCase()
    if(a.includes(b) || c.includes(b))
    return ele
  })
  console.log(f_array)
  if(f_array.length==0){
    document.getElementById("q_container").innerHTML=` No data found `
    
  }

  else
  document.getElementById("q_container").innerHTML=`
       ${
            f_array.map(ele=>{
              return `
        <div class="question_box" id="${ele.id}" onclick="setResPage(this)"  > 
     <div>
     <h2> ${ele.subject} </h>
     <h4> ${ele.question} </h4> 
     <span id="t_${ele.id}">  </span>  
     </div>
       <div class="controls">  
       <span id="l${ele.id}" onclick="like(this.parentNode.parentNode.id)">
       ${ele.like}  like
       </span>
       <p  id="d${ele.id}" onclick="ldis_ike(this.parentNode.parentNode.id)" >
       ${ele.dislike}  dislike
       </p>
       <span id="f${ele.id}" class="fav"  onclick="fav(this.parentNode.parentNode.id)">
        ${ele.fav}
       </span>
       </div>

       </div>
       `  
         
            })
       }
  `
}



const like=(id)=>
{
  console.log(id)
  const data= JSON.parse(localStorage.getItem("discussion"))
  const ques_obj=data.find(ele=>ele.id==id)
    const i= data.indexOf(ques_obj)
  ques_obj.like++;
  data[i]=ques_obj
  localStorage.setItem("discussion",JSON.stringify(data))
  document.getElementById(`l${id}`).innerHTML=`
   ${ques_obj.like} likes
  `
 event.stopPropagation()

 }
  

const dis_like=(id)=>{
 
  const data= JSON.parse(localStorage.getItem("discussion"))
  const ques_obj=data.find(ele=>ele.id==id)
    const i= data.indexOf(ques_obj)
  ques_obj.dislike++;
  data[i]=ques_obj
  localStorage.setItem("discussion",JSON.stringify(data))
  document.getElementById(`d${id}`).innerHTML=`
   ${ques_obj.dislike} dislikde
  `
  event.stopPropagation()
}
const fav=(id)=>{
 
  const data= JSON.parse(localStorage.getItem("discussion"))
  const ques_obj=data.find(ele=>ele.id==id)
    const i= data.indexOf(ques_obj)
    if(ques_obj.fav=="^"){
      ques_obj.fav="*"
      document.getElementById(`f${id}`).innerHTML=` *`
    
   
    }  
      else
      {
        ques_obj.fav="^"
        document.getElementById(`f${id}`).innerHTML=`${ques_obj.fav}`

     

      
      }
      data[i]=ques_obj
     localStorage.setItem("discussion",JSON.stringify(data))

   
    location.reload()
     event.stopPropagation()
}