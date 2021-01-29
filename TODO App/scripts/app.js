let newTaskInput = document.querySelector('#new-task'),
  taskPriority = document.querySelector('#priority'),
  searchTask = document.querySelector('#search-task'),
  todoDiv = document.querySelector('.incomp-forDrag'),
  progDiv = document.querySelector('.inprog-forDrag'),
  doneDiv = document.querySelector('.comp-forDrag'),
  addBtn = document.querySelector('#add'),
  clrBtn = document.querySelector('#clear'),
  todoArr = [],
  inProgArr = [],
  compArr = [];
let Arrr = [];
let fromDrag;
let searchOpt;
let addPriority;
let idMaker = 0;

clrBtn.addEventListener('click', function () {
  newTaskInput.value = '';
});


function addPrior(ev) {
  addPriority = ev.target.value;
  // console.log(addPriority);
}

addBtn.addEventListener('click', addTask);

function addTask() {
  let taskInp = newTaskInput.value;
  // let priorVal = taskPriority.value;
  let priorVal = addPriority;
  const li = document.createElement('div');
  idMaker++;
  li.innerHTML = `<li id=${idMaker} ondrag="drag_handler(event);" ondragstart="dragstart_handler(event);" draggable="true"><h5 id="jen">${taskInp}</h5>
  <span id="prior" style="display:none;">${priorVal}</span>
  <div class="divbrn">
        <button id="delete${idMaker}" style="float:right;">Delete</button>
        <button id="edit" style="float: right;">Edit</button>
    </div><br><br>
  </li>`;

  if (priorVal == 'high') { li.style.backgroundColor = 'yellow'; }
  else if (priorVal == 'medium') { li.style.backgroundColor = 'cyan'; }
  else { li.style.backgroundColor = 'cornsilk'; }

  todoDiv.appendChild(li);
  todoArr.push({ _id: idMaker, task: taskInp, priority: priorVal });
  Arrr = [...todoArr, ...inProgArr, ...compArr];
  localStorage.setItem('todoArr', JSON.stringify(todoArr));
  newTaskInput.value = '';
  delBtnMaker(document.querySelector('#delete' + idMaker));
}

function addTaskfromstorage(task, id, priorVal, status) {
  let taskInpfromStorage = task;
  const li = document.createElement('div');
  // idMaker++;
  li.innerHTML = `<li id=${id} ondrag="drag_handler(event);" ondragstart="dragstart_handler(event);" draggable="true"><h5 id="jen">${taskInpfromStorage}</h5>
                  <span id="prior" style="display:none;">${priorVal}</span>
                  <div class="divbrn">
                        <button id="delete${id}" style="float:right;">Delete</button>
                        <button id="edit" style="float: right;">Edit</button>
                    </div><br><br>
                  </li>`;
  // li.style.backgroundColor = 'yellow';

  if (priorVal == 'high') { li.style.backgroundColor = 'yellow'; }
  else if (priorVal == 'medium') { li.style.backgroundColor = 'cyan'; }
  else { li.style.backgroundColor = 'cornsilk'; }
  if (status === 'todo') {
    todoDiv.appendChild(li);
  } else if (status === 'inprogress') {
    progDiv.appendChild(li);
  } else {
    doneDiv.appendChild(li);
  }
  delBtnMaker(document.querySelector('#delete' + id));

}

function delBtnMaker(deleteBtn) {
  let elToRmv;
  deleteBtn.addEventListener('click', function () {
    elToRmv = this.parentElement.parentElement;
    console.log(elToRmv);
    let classToRmv = elToRmv.parentElement.className;
    const diffClass = elToRmv.parentElement.parentElement.className;
    const idToRmv = elToRmv.id;
    console.log(classToRmv, diffClass);
    if (diffClass === 'col-lg-4') {
      if (classToRmv == 'inprog-forDrag') {
        deleteElementBtn(inProgArr, 'inProgArr', idToRmv);
      } else if (classToRmv == 'incomp-forDrag') {
        deleteElementBtn(todoArr, 'todoArr', idToRmv);
      } else {
        deleteElementBtn(compArr, 'compArr', idToRmv);
      }
    } else {
      if (diffClass == 'inprog-forDrag') {
        deleteElementBtn(inProgArr, 'inProgArr', idToRmv);
      } else if (diffClass == 'incomp-forDrag') {
        deleteElementBtn(todoArr, 'todoArr', idToRmv);
      } else {
        deleteElementBtn(compArr, 'compArr', idToRmv);
      }
    }
    elToRmv.remove();
  });
}

function deleteElementBtn(arr, arrName, id) {
  const index = arr.findIndex((item) => item._id == id);
  arr.splice(index, 1);
  localStorage.setItem(arrName, JSON.stringify(arr));
}

function drag_handler(ev) { }

function dragstart_handler(ev) {
  console.log('dragStart', ev.target.id);
  ev.dataTransfer.setData('text', ev.target.id);
  fromDrag = ev.target.parentElement.className;
  console.log(fromDrag);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData('text');
  const el = document.getElementById(data);

  const elId = el.id;
  console.log(elId);

  Arrr = [...todoArr, ...inProgArr, ...compArr];
  console.log(Arrr);

  const temp = Arrr.find(item => item._id == parseInt(elId));

  if (temp.priority == 'high') { el.style.backgroundColor = 'yellow'; }
  else if (temp.priority == 'medium') { el.style.backgroundColor = 'cyan'; }
  else { el.style.backgroundColor = 'cornsilk'; }
  ev.target.appendChild(el);

  console.log(ev.target);
  const nodeList = ev.target.childNodes;
  const idNeeded = nodeList[nodeList.length - 1].id;
  const neededClass = ev.target.className;

  if (neededClass === 'inprog-forDrag') {
    toggleArrItems(todoArr, inProgArr, 'todoArr', 'inProgArr', idNeeded);
  } else if (neededClass === 'incomp-forDrag') {
    toggleArrItems(inProgArr, todoArr, 'inProgArr', 'todoArr', idNeeded);
  } else if (fromDrag === 'incomp-forDrag' && neededClass === 'comp-forDrag') {
    console.log('worked');
    toggleArrItems(todoArr, compArr, 'todoArr', 'compArr', idNeeded);
  } else {
    toggleArrItems(inProgArr, compArr, 'inProgArr', 'compArr', idNeeded);
  }
  console.log('todo', todoArr, '\ninprog', inProgArr, '\ncomp', compArr);
}

function toggleArrItems(rmArr, addArr, arr1, arr2, id, el) {
  const indexToRm = rmArr.findIndex((item) => item._id == id);
  addArr.push(rmArr[indexToRm]);
  rmArr.splice(indexToRm, 1);
  localStorage.setItem(arr1, JSON.stringify(rmArr));
  localStorage.setItem(arr2, JSON.stringify(addArr));

}

function allowDrop(ev) {
  ev.preventDefault();
}

function dataFromStorage() {
  let fromtodoArr = JSON.parse(localStorage.getItem('todoArr'));
  let frominProgArr = JSON.parse(localStorage.getItem('inProgArr'));
  let fromcompArr = JSON.parse(localStorage.getItem('compArr'));

  if (fromtodoArr) {
    todoArr = fromtodoArr;
    for (let i of todoArr) {
      addTaskfromstorage(i.task, i._id, i.priority, 'todo');
    }
  }
  if (frominProgArr) {
    inProgArr = frominProgArr;
    for (let i of inProgArr) {
      addTaskfromstorage(i.task, i._id, i.priority, 'inprogress');
    }
  }
  if (fromcompArr) {
    compArr = fromcompArr;
    for (let i of compArr) {
      addTaskfromstorage(i.task, i._id, i.priority, 'done');
    }
  }
}

function searchBy(ev) {
  searchOpt = ev.target.value;
}

function keyup(event,div){
  let searchVal = searchTask.value;
  let reg = new RegExp(searchVal);
  // let highReg = /high/;
  let alldiv = div.querySelectorAll('li');
  
 

  if (searchOpt == 'all') {
    for (let i of alldiv) {
      let j = i.querySelector('#prior');
      if (!reg.test(i.textContent) && !reg.test(j.textContent)) {
        i.style.display = 'none';
      }
      else {
        i.style.display = 'block';
      }
    }
  }


  if (searchOpt == 'task') {

    for (let i of alldiv) {
      let j = i.querySelector('#jen');
      if (!reg.test(j.textContent)) {
        i.style.display = 'none';
      }
      else {
        i.style.display = 'block';
      }
    }
  }
  if (searchOpt == 'priority') {
    for (let i of alldiv) {
      let j = i.querySelector('#prior');
      if (!reg.test(j.textContent)) {
        i.style.display = 'none';
      }
      else {
        i.style.display = 'block';
      }
    }

  }

}


searchTask.addEventListener('keyup', (event) => {
  keyup(event,todoDiv);
  keyup(event,progDiv);
  keyup(event,doneDiv);
  
});

dataFromStorage();